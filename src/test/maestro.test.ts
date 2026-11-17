import { describe, it, expect } from "vitest";
import { DAILY_NOUNS, nounsForDay } from "@/content/daily-nouns";
import { DAILY_VERBS } from "@/content/maestro";
import { VERBS } from "@/data/verbs";
import { gradeSentence, whisper } from "@/lib/maestro-engine";

describe("daily nouns", () => {
  it("has 60 nouns, 10 per day", () => {
    expect(DAILY_NOUNS).toHaveLength(60);
    for (let d = 1; d <= 6; d++) expect(nounsForDay(d)).toHaveLength(10);
  });
  it("builds articles correctly", () => {
    const f = (s: string) => DAILY_NOUNS.find((n) => n.singular === s)!;
    expect(f("albergo").fullSingular).toBe("l'albergo");
    expect(f("zaino").indefinite).toBe("uno zaino");
    expect(f("amica").indefinite).toBe("un'amica");
  });
  it("every daily verb exists", () => {
    Object.values(DAILY_VERBS).flat().forEach((v) => expect(VERBS.some((x) => x.infinitive === v)).toBe(true));
  });
});

describe("maestro engine", () => {
  it("perfect ignores case and punctuation", () => expect(gradeSentence("cerco la stazione", ["Cerco la stazione."]).verdict).toBe("perfect"));
  it("catches cercare per", () => expect(gradeSentence("Cerco per la stazione", ["Cerco la stazione."]).issues.some((i) => i.kind === "per")).toBe(true));
  it("catches wrong ending", () => expect(gradeSentence("Cerchi la stazione", ["Cerco la stazione."]).issues.some((i) => i.kind === "ending")).toBe(true));
  it("catches missing article", () => expect(gradeSentence("Cerco stazione", ["Cerco la stazione."]).issues.some((i) => i.kind === "article")).toBe(true));
  it("catches non after verb", () => expect(gradeSentence("Bevo non il vino", ["Non bevo il vino."]).issues.some((i) => i.kind === "non")).toBe(true));
  it("catches do helper", () => expect(gradeSentence("Fai parli inglese?", ["Parli inglese?"]).issues.some((i) => i.kind === "do")).toBe(true));
  it("whisper fixes bare noun", () => expect(whisper("prendo caffè").tone).toBe("fix"));
});
