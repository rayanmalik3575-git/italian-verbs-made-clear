import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { roundsFor, fillBlank, blueprintOf } from "@/data/verb-reflex";

describe("verb reflex", () => {
  it("every verb gets 6 rounds with a blank and a valid form", () => {
    for (const v of VERBS) {
      const rs = roundsFor(v);
      expect(rs).toHaveLength(6);
      for (const r of rs) {
        expect(r.a).toContain("_");
        expect(v.forms[r.idx]).toBeTruthy();
      }
    }
  });
  it("fare: asked 'Che cosa fai' you answer faccio", () => {
    const fare = VERBS.find((v) => v.infinitive === "fare")!;
    const r = roundsFor(fare)[0]!;
    expect(fare.forms[r.idx]).toBe("faccio");
    expect(fillBlank(r.a, "faccio")).toBe("Stasera faccio una pizza.");
    expect(blueprintOf(fare).stem).toContain("fac-");
  });
});
