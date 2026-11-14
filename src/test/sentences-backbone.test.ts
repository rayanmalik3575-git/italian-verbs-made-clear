import { describe, it, expect } from "vitest";
import { checkTiles } from "@/content/sentences-backbone";
describe("backbone tile check", () => {
  it("accepts non bevo il caffè", () => expect(checkTiles(["non", "bevo", "il", "caffè"]).ok).toBe(true));
  it("rejects bevi with a tip", () => { const r = checkTiles(["non", "bevi", "il", "caffè"]); expect(r.ok).toBe(false); expect(r.tip).toMatch(/bevo/); });
  it("rejects non after the verb", () => expect(checkTiles(["bevo", "non", "il", "caffè"]).ok).toBe(false));
});
