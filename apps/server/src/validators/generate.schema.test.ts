import { describe, expect, it } from "vitest";
import {
  generateBodySchema,
  listLogsQuerySchema,
} from "../validators/generate.schema.js";

describe("generateBodySchema", () => {
  it("accepts valid name", () => {
    const result = generateBodySchema.safeParse({ name: "Iron Man" });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = generateBodySchema.safeParse({ name: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    const result = generateBodySchema.safeParse({ name: "a".repeat(101) });
    expect(result.success).toBe(false);
  });
});

describe("listLogsQuerySchema", () => {
  it("defaults limit to 50", () => {
    const result = listLogsQuerySchema.parse({});
    expect(result.limit).toBe(50);
  });

  it("coerces limit from string", () => {
    const result = listLogsQuerySchema.parse({ limit: "10" });
    expect(result.limit).toBe(10);
  });
});
