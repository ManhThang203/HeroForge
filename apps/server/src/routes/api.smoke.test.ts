import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";
import { loadEnv } from "../config/env.js";

const env = loadEnv();
const app = createApp(env);

describe("GET /api/health", () => {
  it("returns 200 with ok status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
    expect(response.body.data.timestamp).toBeTruthy();
  });
});

describe("POST /api/generate", () => {
  it("returns 400 when image file is missing", async () => {
    const response = await request(app)
      .post("/api/generate")
      .field("name", "Test Hero");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain("Image file is required");
  });
});
