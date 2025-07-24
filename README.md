# BENgrok Tunnel System

**BENgrok** is a complete tunnel solution (like Ngrok) that allows external clients to access local APIs during development, without exposing ports directly or deploying early. It includes:

- ✅ `client/` – Connects your local API (e.g., `http://localhost:3001`) to the tunnel server
- ✅ `server/` – Hosts public WebSocket and HTTP endpoints and forwards traffic to connected clients

---

## 🧩 Project Structure

```
BENgrok/
├── client/     # Tunnel client CLI – connects local API to public URL
├── server/     # Tunnel server – routes incoming traffic to local machines
├── README.md   # You're here
```

---

## 🌐 Use Case

Let’s say you’re developing an API on `http://localhost:3001`, but your mobile app or another system needs to call it remotely.

With BENgrok, you can create a tunnel that maps:

```
https://your-tunnel.herokuapp.com/tunnel/my-api-id/...
```

→

```
http://localhost:3001/...
```

Perfect for mobile app development, external integrations, or sharing work-in-progress APIs.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:benjaminfkile/BENgrok.git
cd BENgrok
```

---

## 🔧 Hosting the Tunnel Server on Heroku

> The `server/` folder contains an Express + WebSocket tunnel server ready for deployment.

### Step-by-step Heroku setup:

#### ✅ Step 1: Log in to Heroku

```bash
heroku login
```

---

#### ✅ Step 2: Create a new Heroku app

```bash
cd server
heroku create <your-app-name>
```

#### ✅ Step 3: Deploy the server

```bash
git push heroku main
```

---

#### ✅ Step 4: Confirm it's running

Visit:

```
https://<your-app-name>.herokuapp.com/
```

You should see: `BENgrok Tunnel Server is running`

---

## 💻 Using the Tunnel Client

See [`client/README.md`](./client/README.md) for full usage, or follow the steps below:

---

### Step 1: Install dependencies

```bash
cd client
npm install
```

---

### Step 2: Start the tunnel client

```bash
npm start
```

You’ll be prompted to enter:

- The public tunnel server URL (e.g., `https://your-app.herokuapp.com`)
- The local API URL (e.g., `http://localhost:3001`)
- A friendly name
- (Optional) Save it as a profile

This will establish a WebSocket connection and create a tunnel from:

```
https://your-app.herokuapp.com/tunnel/<tunnelId>/
```

→

```
http://localhost:3001/
```

---

## 🧪 Example

If your local server serves `/api/users`, and your `tunnelId` is `abc123`, then this public URL:

```
https://your-app.herokuapp.com/tunnel/abc123/api/users
```

...will forward to:

```
http://localhost:3001/api/users
```

---

## 📂 Profiles

Saved tunnels live in:

```
~/<APP_NAME>/profiles.json
```

These can be reused and managed via CLI.

---

## 📄 License

MIT
