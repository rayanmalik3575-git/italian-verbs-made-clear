import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { roundsFor, continuousOf, spellingNote, hardSoundTip } from "@/data/verb-reflex";
import { momentsFor, trapTip, isMomentForm } from "@/data/verb-moments";
const v = (n: string) => VERBS.find((x) => x.infinitive === n)!;
describe("verb practice upgrade", () => {
  it("every verb has tu→io, voi→noi and lui/lei reply rounds with one blank", () => {
    for (const x of VERBS) {
      const r = roundsFor(x);
      for (const i of [0, 3, 2]) expect(r.some((y) => y.idx === i), x.infinitive).toBe(true);
      for (const y of r) expect(y.a.split("_").length, x.infinitive).toBe(2);
    }
  });
  it("cercare reply asks 'Cerchi lavoro a Milano?' and expects cerco", () => {
    const r = roundsFor(v("cercare"))[0]!;
    expect(r.q).toBe("Cerchi lavoro a Milano?");
    expect(v("cercare").forms[r.idx]).toBe("cerco");
  });
  it("avere and dire use the requested lines", () => {
    expect(roundsFor(v("avere"))[0]!.q).toBe("Hai un minuto?");
    expect(roundsFor(v("dire"))[0]!.q).toBe("Dici davvero?");
  });
  it("every verb has 4 real-life moments covering io, tu, lui/lei, noi", () => {
    for (const x of VERBS) {
      const m = momentsFor(x);
      expect(m.map((y) => y.idx), x.infinitive).toEqual([0, 1, 2, 3]);
      for (const y of m) { expect(y.it.split("_").length, x.infinitive).toBe(2); expect(y.situation && y.en && y.whisper).toBeTruthy(); }
    }
  });
  it("cercare: 'cerco per' triggers the tip, 'cerco' is accepted", () => {
    const m = momentsFor(v("cercare"))[0]!;
    expect(trapTip(v("cercare"), m, "cerco per")).toContain("already includes 'for'");
    expect(trapTip(v("cercare"), m, "sono cerco")).toBeDefined();
    expect(trapTip(v("cercare"), m, "cerco")).toBeUndefined();
    expect(isMomentForm(v("cercare"), m, "Cerco")).toBe(true);
  });
  it("hard-sound reminder only for -care/-gare", () => {
    expect(hardSoundTip(v("cercare"))).toContain("tu cerchi");
    expect(hardSoundTip(v("pagare"))).toContain("hard G");
    expect(hardSoundTip(v("parlare"))).toBeUndefined();
  });
  it("drill shows simple and continuous meaning", () => {
    expect(continuousOf(v("cercare"), 1)).toBe("you look for / you are looking for");
    expect(continuousOf(v("essere"), 0)).toBeUndefined();
  });
  it("spelling note only for -care/-gare on tu and noi", () => {
    expect(spellingNote(v("cercare"), 1)).toContain("cerchi / cerchiamo");
    expect(spellingNote(v("parlare"), 1)).toBeUndefined();
  });
});
