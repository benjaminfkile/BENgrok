# BENgrok

[`client`](client/README.md)  
[`server`](server/README.md)


**BENgrok** is a tunnel system (like Ngrok) for exposing local APIs to the internet. It includes:

- 🔒 Supports all HTTP content types (JSON, form-data, file uploads, images, videos, gzip, etc.) via base64 encoding
- 🔄 Queues per-tunnel requests to prevent dropped responses with concurrent traffic


- ✅ `client/` – A CLI tunnel client that connects your local API (e.g. `http://localhost:3001`) to a public tunnel
- ✅ `server/` – A public-facing WebSocket + HTTP tunnel server that routes traffic to connected clients

---

## 🧩 Project Structure

```
BENgrok/
├── client/     # Tunnel client – connects localhost API to public tunnel server
├── server/     # Tunnel server – forwards requests to connected clients
└── README.md   # You're here
```

---

## 🌐 Use Case

You're building a mobile app that needs to call a local API on your machine (e.g. `http://localhost:3001`), but the app is running on a real device.

With BENgrok, you can access that API via:

```
https://your-app.herokuapp.com/tunnel/<tunnelId>/...
```

Which transparently forwards to:

```
http://localhost:3001/...
```

---

## 🚀 Getting Started

### 1️⃣ Clone This Repo

```bash
git clone https://github.com/benjaminfkile/BENgrok.git
cd BENgrok
```

---

## 🛠 Hosting the Tunnel Server on Heroku

> The `server/` folder is the deployable Node.js tunnel server.

### ✅ Step-by-Step Guide

#### 1. Fork This Repo

Go to: https://github.com/benjaminfkile/BENgrok → Click "Fork"

#### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/BENgrok.git
cd BENgrok
```

#### 3️⃣ Create a Heroku Account and Install the CLI

If you don’t already have a [Heroku](https://heroku.com) account, follow these steps:

1. 👉 Sign up at [https://signup.heroku.com](https://signup.heroku.com)
2. Complete the form to create your free account

Then install the **Heroku CLI** (Command Line Interface):

- 📦 Download: [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
- Choose your OS (Windows, macOS, Linux) and follow the instructions

Once installed, verify the CLI is available:

```bash
heroku --version
```

#### 4. Log in to Heroku

```bash
heroku login
```

#### 5. Create a Heroku App

```bash
heroku create your-app-name
```

#### 6. Add Buildpacks for Monorepo Support

```bash
heroku buildpacks:clear -a your-app-name
heroku buildpacks:add -a your-app-name https://github.com/timanovsky/subdir-heroku-buildpack
heroku buildpacks:add -a your-app-name heroku/nodejs
heroku config:set -a your-app-name PROJECT_PATH=server
```

#### 7. Add Heroku Remote

Check existing remotes:

```bash
git remote -v
```

Then add Heroku remote:

```bash
heroku git:remote -a your-app-name
```

#### 8. Deploy to Heroku

```bash
git push heroku main
```

#### 9. Get Your Tunnel Server URL

```bash
heroku info -a your-app-name
```

Use the URL shown under "Web URL".

---

---

## 🔁 Enable GitHub Auto Deploys (Optional)

In the Heroku Dashboard:

1. Go to the `Deploy` tab
2. Connect to GitHub
3. Search and select your forked repo
4. Enable **Automatic Deploys** from the `main` branch

Now your server auto-deploys when you push to GitHub.

---

## 💻 Using the Tunnel Client

See [`client/README.md`](./client/README.md) for full usage.

```bash
cd client
npm install
npm start
```

You'll be prompted for:

- The public tunnel server URL (e.g. `https://your-app.herokuapp.com`)
- Your local API URL (e.g. `http://localhost:3001`)
- A tunnel ID and friendly name

## 🧪 Example Tunnel

```
https://your-app.herokuapp.com/tunnel/abc123/api/users → http://localhost:3001/api/users
```

---

## 📄 License

MIT