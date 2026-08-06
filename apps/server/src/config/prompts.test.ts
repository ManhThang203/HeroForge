import { describe, expect, it } from "vitest";
import { IMAGE_MODEL, SUPERHERO_PROMPT } from "../config/prompts.js";

describe("prompts config", () => {
  it("uses flux kontext pro model", () => {
    expect(IMAGE_MODEL).toBe("bfl/flux-kontext-pro");
  });

  it("includes facial identity constraint", () => {
    expect(SUPERHERO_PROMPT).toContain("exact facial identity");
    expect(SUPERHERO_PROMPT).toContain(
      "Do not alter facial structure or generate a different person",
    );
  });
});
