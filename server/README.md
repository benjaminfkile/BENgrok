[`<<<`](../README.md)

# BENgrok server

**BENgrok server** is the backend component of the BENgrokTunnel system. It acts as a central WebSocket relay and HTTP proxy that allows remote clients and mobile apps to access APIs running on a developer’s local machine. This is ideal for scenarios where apps need to talk to `localhost` during development.

---

## Features

- WebSocket server with dynamic tunnel registration
- Forwards HTTP requests to connected tunnel clients
- Routes based on unique `tunnelId`
- Supports all HTTP content types (JSON, form-data, file uploads, images, videos, gzip, etc.) via base64 encoding
- Queues requests per tunnel to prevent dropped responses with concurrent traffic
- Works in both Cloud and on-prem environments
- Includes logging, error handling, and express middleware

---

## nstallation

```bash
git git@github.com:benjaminfkile/BENgrok.git
cd BENgrok
cd client
npm install
```

---

## Usage

Start the tunnel server locally:

```bash
npm run build
npm start
```

The server will start on the port defined in `.env` or default to port:8000.

---

## Project Structure

- `src/app.ts` – Sets up the Express app, routes, and middleware
- `src/tunnelServer.ts` – Manages WebSocket tunnel connections and HTTP request forwarding
- `index.ts` – Entry point that creates and starts the HTTP + WebSocket server

---

## Tunnel Endpoints

- **WebSocket Connection**
  - `ws://<host>:<port>/?id=<tunnelId>`
  - Tunnel clients connect here and register using a tunnel ID.

- **HTTP Request Proxy**
  - `POST/GET/PUT/DELETE /tunnel/<tunnelId>/<path>`
  - The server forwards these to the client connected under `<tunnelId>`.

---

## Example Use Case

If an app needs to talk to `http://localhost:3001/api/...`, and the dev machine is running BENgrokTunnel Client:


The server will forward that to the client, which makes the real request to `localhost:3001`.

---

## Deployment

- Ensure `PORT` is open and accessible to both client and remote users
- WebSockets must be enabled on the hosting platform

---