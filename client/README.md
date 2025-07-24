# BENgrokTunnel client

**BENgrokTunnel client** is a tunnel client that connects your local development APIs to a remote tunnel server. It enables mobile apps or remote clients to securely access services running on `localhost`, making development and testing easy with no network hacks required.

---

## 🚀 Features

- WebSocket tunnel client with `tunnelId` support
- CLI-driven or profile-based connection setup
- Auto-reconnect with heartbeat support
- Forwards HTTP requests to your local machine
- Clean logging and optional clipboard copy
- Compatible with Azure or on-prem tunnel servers

---

## 📦 Installation

```bash
git clone https://elmllcsrepos.visualstudio.com/BENgrokTunnel/_git/BENgrokTunnel
cd BENgrokTunnel
cd client
npm install
```

---

## 🛠️ Usage

### Start the tunnel client:

```bash
npm start
```

You’ll be prompted to enter:

- The local URL to tunnel (e.g. `http://localhost:3001`)
- A friendly name
- Tunnel ID (auto-generated if not provided)

You can also save and reuse tunnel profiles via CLI prompts.

---

## 🗂 Profiles

Profiles are stored in:

```
~/<APP_NAME>/profiles.json
```

Each profile includes:

- Friendly name
- Local URL
- Tunnel ID

You can select from saved profiles at startup.

---

## 📦 Packaging Into Executable

To package this tunnel client as a standalone executable (for Windows, macOS, and Linux):

1. **Install `pkg` globally** (if you haven’t already):
   ```bash
   npm install -g pkg
   ```

2. **Ensure `package.json` has the right entry point and config**:
   Add this to `package.json`:
   ```json
   "bin": "dist/index.js",
   "pkg": {
     "scripts": "dist/**/*.js",
     "targets": ["node18-win-x64", "node18-macos-x64", "node18-linux-x64"]
   }
   ```

3. **Build your TypeScript**:
   ```bash
   npm run build
   ```

4. **Package with `pkg`**:
   ```bash
   npm run package
   ```

   This will generate binaries like:
   - `BENgrokTunnel-win.exe`
   - `BENgrokTunnel-linux`
   - `BENgrokTunnel-macos`

---

## 🌐 Tunnel Server Requirements

The tunnel server must:
- Support WebSocket connections with `tunnelId` query param
- Forward incoming HTTP requests via WebSocket to the correct tunnel
- Be hosted on Azure or on-prem with public access

> See `index.ts` or `registerTunnelServer()` in the server repo for implementation details.

---

## 🧠 Example Use Case

You’re building a React Native app that needs to call `http://localhost:3001/api/...`.  
With `BENgrokTunnel`, you can map that local API to a public URL like:

```
https://BENgroktunnel.launchpointhome.com/tunnel/tunnelId/...
```
---

## 🔁 Updating Main Branch

When pushing updates to the `main` branch:

1. Build the project:
   ```bash
   npm run build
   ```

2. Package new executables:
   ```bash
   pkg .
   ```

3. Commit the updated binaries:
   - `BENgrokTunnel-win.exe`
   - `BENgrokTunnel-linux`
   - `BENgrokTunnel-macos`

4. Push to `main` so others can download the latest version from the repo.

---

## 📄 License

MIT © ELM LLC
