# BENgrok

[`client`](client/README.md)  
[`server`](server/README.md)


**BENgrok** is a tunnel system (like Ngrok) for exposing local APIs to the internet. It includes:

- Supports all HTTP content types (JSON, form-data, file uploads, images, videos, gzip, etc.) via base64 encoding
- Queues per-tunnel requests to prevent dropped responses with concurrent traffic


- `client/` – A CLI tunnel client that connects your local API (e.g. `http://localhost:3001`) to a public tunnel
- `server/` – A public-facing WebSocket + HTTP tunnel server that routes traffic to connected clients

---

## Project Structure

```
BENgrok/
├── client/     # Tunnel client – connects localhost API to public tunnel server
├── server/     # Tunnel server – forwards requests to connected clients
└── README.md   # You're here
```

---

## Use Case

You're building a mobile app that needs to call a local API on your machine (e.g. `http://localhost:3001`), but the app is running on a real device.

With BENgrok, you can access that API via:

```
https://your-app.com/tunnel/<tunnelId>/...
```

Which transparently forwards to:

```
http://localhost:3001/...
```

---