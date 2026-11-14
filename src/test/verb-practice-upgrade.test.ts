import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { roundsFor, continuousOf, spellingNote } from "@/data/verb-reflex";
import { builderFor, trapsFor, tileCase } from "@/data/verb-builder";
const v = (n: string) => VERBS.find((x) => x.infinitive === n)!;
describe("verb practice upgrade", () => {
  it("no reply round uses the old 'Oggi …?' template", () => {
    for (const x of VERBS) for (const r of roundsFor(x)) expect(r.q.startsWith("Oggi ")).toBe(false);
  });
  it("cercare reply asks 'Cerchi lavoro qui?' and expects cerco", () => {
    const r = roundsFor(v("cercare"))[0]!;
    expect(r.q).toBe("Cerchi lavoro qui?");
    expect(v("cercare").forms[r.idx]).toBe("cerco");
  });
  it("drill shows simple and continuous meaning", () => {
    expect(continuousOf(v("cercare"), 1)).toBe("you look for / you are looking for");
    expect(continuousOf(v("essere"), 0)).toBeUndefined();
  });
  it("spelling note only for -care/-gare on tu and noi", () => {
    expect(spellingNote(v("cercare"), 1)).toContain("cerchi / cerchiamo");
    expect(spellingNote(v("cercare"), 0)).toBeUndefined();
    expect(spellingNote(v("parlare"), 1)).toBeUndefined();
  });
  it("every builder sentence gets two traps, one being a wrong form of the verb", () => {
    for (const x of VERBS) for (const item of builderFor(x)) {
      const t = trapsFor(x, item);
      expect(t.length).toBe(2);
      expect(x.forms).toContain(t[0]!.tile);
      expect(t[0]!.tile).not.toBe(x.forms[item.idx]);
    }
  });
  it("cercare traps 'per'", () => {
    const item = builderFor(v("cercare"))[0]!;
    expect(trapsFor(v("cercare"), item).map((t) => t.tile)).toContain("per");
  });
  it("first tile is lowercased except names", () => {
    expect(tileCase("Cerco")).toBe("cerco");
    expect(tileCase("Marco paga")).toBe("Marco paga");
  });
});
