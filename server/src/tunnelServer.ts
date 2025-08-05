import { Server as HTTPServer } from "http"
import { Request, Response } from "express"
import WebSocket, { WebSocketServer } from "ws"
import chalk from "chalk"

type TunnelId = string

interface TunnelMap {
  [key: string]: WebSocket
}

interface Pending {
  req: Request
  res: Response
  body: Buffer
}

const tunnels: TunnelMap = {}

const queues: Record<TunnelId, Pending[]> = {}
const busy: Record<TunnelId, boolean> = {}

const REQUEST_TIMEOUT_MS = 60_000

function sanitizeHeaders(h: Record<string, any> = {}) {
  const headers = { ...h }
  delete headers["transfer-encoding"]
  delete headers["connection"]
  delete headers["keep-alive"]
  delete headers["proxy-connection"]
  delete headers["upgrade"]
  delete headers["te"]
  delete headers["trailers"]
  return headers
}

function failAllPending(tunnelId: TunnelId, message: string) {
  const q = queues[tunnelId]
  if (q && q.length) {
    q.forEach(({ res }) => {
      if (!res.headersSent) res.status(503).send(message)
    })
    queues[tunnelId] = []
  }
  busy[tunnelId] = false
}

function sendNext(tunnelId: TunnelId, socket: WebSocket) {
  if (busy[tunnelId]) return
  const q = queues[tunnelId]
  if (!q || q.length === 0) return

  const { req, res, body } = q[0]
  const match = req.url.match(/^\/tunnel\/([^\/]+)(\/.*)?$/)
  const targetPath = match?.[2] || "/"

  // Build the message to the tunnel client
  const requestData = {
    method: req.method,
    url: targetPath,
    headers: req.headers,
    // Always send request body as base64 to support binary uploads
    bodyBase64: body.toString("base64"),
    isBase64Request: true
  }

  busy[tunnelId] = true

  // Per-request timeout so callers don’t hang forever
  const timeout = setTimeout(() => {
    try {
      if (!res.headersSent) res.status(504).send("Tunnel request timed out")
    } finally {
      // Drop this item and move on
      q.shift()
      busy[tunnelId] = false
      sendNext(tunnelId, socket)
    }
  }, REQUEST_TIMEOUT_MS)

  const onMessage = (message: WebSocket.RawData) => {
    clearTimeout(timeout)
    try {
      const response = JSON.parse(message.toString())

      const headers = sanitizeHeaders(response.headers || {})

      if (response.isBase64 && response.bodyBase64) {
        const buf = Buffer.from(response.bodyBase64, "base64")
        headers["content-length"] = String(buf.length)
        res.status(response.statusCode).set(headers).send(buf)
      } else {
        const text = response.body ?? ""
        headers["content-length"] = String(Buffer.byteLength(text))
        res.status(response.statusCode).set(headers).send(text)
      }
    } catch (err) {
      if (!res.headersSent) res.status(500).send("Error parsing tunnel response")
    } finally {
      socket.off("message", onMessage)
      q.shift()
      busy[tunnelId] = false
      sendNext(tunnelId, socket)
    }
  }

  socket.once("message", onMessage)

  try {
    socket.send(JSON.stringify(requestData))
  } catch {
    clearTimeout(timeout)
    if (!res.headersSent) res.status(503).send("Tunnel send failed")
    // Drop and continue
    q.shift()
    busy[tunnelId] = false
    sendNext(tunnelId, socket)
  }
}

export const registerTunnelServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server })

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1])
    const tunnelId = (params.get("id") || "default") as TunnelId

    tunnels[tunnelId] = ws
    console.log(chalk.green(`🟢 Tunnel client connected: ${tunnelId}`))

    ws.on("pong", () => {
      console.log(chalk.gray(`💓 Heartbeat pong from: ${tunnelId}`))
    })

    ws.on("close", () => {
      console.log(chalk.yellow(`🔌 Tunnel client disconnected: ${tunnelId}`))
      delete tunnels[tunnelId]
      failAllPending(tunnelId, `Tunnel '${tunnelId}' disconnected`)
    })

    ws.on("error", (err) => {
      console.error(chalk.red(`❌ WebSocket error for '${tunnelId}': ${err.message}`))
      // Don’t flush here — close will handle it
    })
  })
}

export const handleTunnelProxy = (req: Request, res: Response) => {
  const match = req.url.match(/^\/tunnel\/([^\/]+)(\/.*)?$/)
  if (!match) return res.status(400).send("Invalid tunnel path")

  const tunnelId = match[1] as TunnelId
  const socket = tunnels[tunnelId]
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return res.status(503).send(`Tunnel '${tunnelId}' is not connected`)
  }

  const bodyChunks: Buffer[] = []
  req.on("data", (chunk) => bodyChunks.push(chunk))
  req.on("end", () => {
    const body = Buffer.concat(bodyChunks)
    if (!queues[tunnelId]) queues[tunnelId] = []
    queues[tunnelId].push({ req, res, body })
    sendNext(tunnelId, socket)
  })
  req.on("error", () => {
    if (!res.headersSent) res.status(400).send("Error reading request body")
  })
}
