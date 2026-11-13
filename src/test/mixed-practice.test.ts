import { describe, it, expect } from "vitest";
import { ITEMS, buildSession, isCorrect } from "@/content/mixed-practice";

describe("all-in-one practice", () => {
  it("covers every skill learned so far", () => {
    for (const s of ["articles", "plurals", "negatives", "questions", "sentences"])
      expect(ITEMS.some((i) => i.skills.includes(s as never))).toBe(true);
  });
  it("choice answers are always among options, build answers use exactly the tiles", () => {
    for (const i of ITEMS) {
      if (i.kind === "choice") expect(i.options).toContain(i.answer);
      else expect(i.tiles.join(" ")).toBe(i.answer);
    }
  });
  it("mixed session has 15 unique items; skill session only that skill", () => {
    const s = buildSession("all");
    expect(new Set(s.map((i) => i.id)).size).toBe(15);
    expect(buildSession("negatives").every((i) => i.skills.includes("negatives"))).toBe(true);
  });
  it("grades build answers ignoring case and final period", () => {
    const n = ITEMS.find((i) => i.id === "n1")!;
    expect(isCorrect(n, "non capisco.")).toBe(true);
    expect(isCorrect(n, "capisco non")).toBe(false);
  });
});
