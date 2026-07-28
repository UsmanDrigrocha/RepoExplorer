import { describe, expect, it } from "vitest";
import { languageColor } from "./language-colors";

describe("languageColor", () => {
  it("returns the known color for a mapped language", () => {
    expect(languageColor("TypeScript")).toBe("#3178c6");
  });

  it("falls back to a neutral color for unmapped languages", () => {
    expect(languageColor("Brainfuck")).toBe("#8b949e");
  });

  it("falls back to a neutral color for null/undefined", () => {
    expect(languageColor(null)).toBe("#8b949e");
    expect(languageColor(undefined)).toBe("#8b949e");
  });
});
