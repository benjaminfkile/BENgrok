import fs from "fs";
import path from "path";
import os from "os";

const BASE_DIR = path.join(os.homedir(), "BENgrokTunnelClient");
const PROFILE_FILE = path.join(BASE_DIR, "profiles.json");
const TUNNEL_FILE = path.join(BASE_DIR, "tunnel_url.txt");

describe("BENgrokTunnelClient Client", () => {
  beforeEach(() => {
    if (!fs.existsSync(BASE_DIR)) {
      fs.mkdirSync(BASE_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(PROFILE_FILE)) fs.unlinkSync(PROFILE_FILE);
    if (fs.existsSync(TUNNEL_FILE)) fs.unlinkSync(TUNNEL_FILE);
  });

  test("should save and load tunnel profiles", () => {
    const profiles = {
      testProfile: [
        {
          FriendlyName: "Test API",
          URL: "http://localhost:3000",
          TunnelId: "abc123",
        },
      ],
    };
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profiles, null, 2));
    const loaded = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf-8"));
    expect(loaded.testProfile).toBeDefined();
    expect(loaded.testProfile[0].URL).toBe("http://localhost:3000");
  });

  test("should write tunnel URL file", () => {
    const tunnelUrl = "http://localhost:8080";
    fs.writeFileSync(TUNNEL_FILE, tunnelUrl);
    const stored = fs.readFileSync(TUNNEL_FILE, "utf-8").trim();
    expect(stored).toBe(tunnelUrl);
  });

  test("should clean and recreate BASE_DIR", () => {
    fs.rmdirSync(BASE_DIR, { recursive: true });
    expect(fs.existsSync(BASE_DIR)).toBe(false);

    fs.mkdirSync(BASE_DIR, { recursive: true });
    fs.writeFileSync(PROFILE_FILE, "{}");
    expect(fs.existsSync(BASE_DIR)).toBe(true);
    expect(fs.existsSync(PROFILE_FILE)).toBe(true);
  });
});
