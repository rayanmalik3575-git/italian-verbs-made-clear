import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { contextFor, fill } from "@/data/verb-sentences";
describe("in-context practice", () => {
  it("every verb gets 6 items each with one blank", () => {
    for (const v of VERBS) { const c = contextFor(v); expect(c).toHaveLength(6); c.forEach((x) => expect(x.it.split("_")).toHaveLength(2)); }
  });
  it("fills and capitalises at sentence start", () => {
    expect(fill("_ bene, grazie!", "sto")).toBe("Sto bene, grazie!");
    expect(fill("Come _?", "stai")).toBe("Come stai?");
  });
});
