import { Server as HTTPServer } from "http";
import { Request, Response } from "express";
import WebSocket, { WebSocketServer } from "ws";
import chalk from "chalk";

interface TunnelMap {
  [key: string]: WebSocket;
}

const tunnels: TunnelMap = {};

export const registerTunnelServer = (server: HTTPServer) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const tunnelId = params.get("id") || "default";

    tunnels[tunnelId] = ws;
    console.log(chalk.green(`🟢 Tunnel client connected: ${tunnelId}`));

    ws.on("pong", () => {
      console.log(chalk.gray(`💓 Heartbeat pong from: ${tunnelId}`));
    });

    ws.on("close", () => {
      console.log(chalk.yellow(`🔌 Tunnel client disconnected: ${tunnelId}`));
      delete tunnels[tunnelId];
    });

    ws.on("error", (err) => {
      console.error(
        chalk.red(`❌ WebSocket error for tunnel '${tunnelId}': ${err.message}`)
      );
    });
  });
};

export const handleTunnelProxy = (req: Request, res: Response) => {
  const match = req.url.match(/^\/tunnel\/([^\/]+)(\/.*)?$/);
  if (!match) return res.status(400).send("Invalid tunnel path");

  const tunnelId = match[1]; // e.g., port3001
  const targetPath = match[2] || "/";

  const socket = tunnels[tunnelId];
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return res.status(503).send(`Tunnel '${tunnelId}' is not connected`);
  }

  const bodyChunks: Buffer[] = [];
  req.on("data", (chunk) => bodyChunks.push(chunk));
  req.on("end", () => {
    const requestData = {
      method: req.method,
      url: targetPath,
      headers: req.headers,
      //@ts-ignore
      body: Buffer.concat(bodyChunks).toString(),
    };

    socket.once("message", (message) => {
      try {
        const response = JSON.parse(message.toString());
        res
          .status(response.statusCode)
          .set(response.headers)
          .send(response.body);
      } catch (err) {
        res.status(500).send("Error parsing tunnel response");
      }
    });

    socket.send(JSON.stringify(requestData));
  });
};
