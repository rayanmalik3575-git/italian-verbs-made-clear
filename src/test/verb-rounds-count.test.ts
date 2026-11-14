import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { roundsFor, fillBlank } from "@/data/verb-reflex";
import { momentsFor } from "@/data/verb-moments";

describe("practice round counts", () => {
  it("Reply reflex has 4 rounds per verb", () => {
    for (const v of VERBS) expect(roundsFor(v).length, v.infinitive).toBe(4);
  });
  it("Real-life trigger has 6 moments covering all six persons", () => {
    for (const v of VERBS) expect(momentsFor(v).map((m) => m.idx), v.infinitive).toEqual([0, 1, 2, 3, 4, 5]);
  });
  it("every blank has exactly one slot", () => {
    for (const v of VERBS) {
      for (const r of roundsFor(v)) expect(r.a.split("_").length, v.infinitive + r.a).toBe(2);
      for (const m of momentsFor(v)) expect(m.it.split("_").length, v.infinitive + m.it).toBe(2);
    }
  });
  it("costare's 'no' round answers with costa", () => {
    const r = roundsFor(VERBS.find((v) => v.infinitive === "costare")!)[3]!;
    expect(fillBlank(r.a, VERBS.find((v) => v.infinitive === "costare")!.forms[r.idx]!)).toBe("No, non costa molto, è in saldo.");
  });
});
