import request from "supertest";
import express from "express";
import http from "http";
import WebSocket from "ws";
import app from "./src/app";
import { registerTunnelServer } from "./src/tunnelServer";

describe("BENgrokTunnel Server", () => {
  let server: http.Server;
  let address: string;

  beforeAll((done) => {
    server = http.createServer(app);
    registerTunnelServer(server);
    server.listen(0, () => {
      const addr = server.address();
      if (typeof addr === "object" && addr?.port) {
        address = `http://localhost:${addr.port}`;
        done();
      }
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test("should return OK from root", async () => {
    const res = await request(address).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("BENgrok tunnel server is running...");
  });

  test("should return 400 for invalid tunnel path", async () => {
    const res = await request(address).get("/tunnel/");
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid tunnel path");
  });

  test("should return 503 if tunnel is not connected", async () => {
    const res = await request(address).get("/tunnel/fake-id");
    expect(res.status).toBe(503);
    expect(res.text).toBe("Tunnel 'fake-id' is not connected");
  });

  test("should accept WebSocket connection with tunnel ID", (done) => {
    const ws = new WebSocket(`${address.replace("http", "ws")}?id=test123`);

    ws.on("open", () => {
      ws.close();
    });

    ws.on("close", () => {
      setTimeout(done, 10);
    });

    ws.on("error", (err) => done(err));
  });
});
