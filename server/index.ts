import dotenv from "dotenv";
import { createServer } from "http";
import { registerTunnelServer } from "./src/tunnelServer";
import app from "./src/app";

dotenv.config();

const PORT = process.env.PORT || 3003;
const server = createServer(app);

registerTunnelServer(server);

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

process.on("SIGINT", () => {
  server?.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server?.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(
    `⚡️[server]: BENgrok tunnel server running on http://localhost:${PORT}`
  );
});
