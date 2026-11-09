import { describe, expect, it } from "vitest";
import { regularPlural, PLURAL_TASKS, isCorrectPlural } from "@/data/plurals";

describe("regular plurals", () => {
  it("-o → -i, -a → -e, -e → -i", () => {
    expect(regularPlural("libro")).toBe("libri");
    expect(regularPlural("casa")).toBe("case");
    expect(regularPlural("notte")).toBe("notti");
  });
  it("-ca keeps the hard sound", () => expect(regularPlural("amica")).toBe("amiche"));
  it("-cia after vowel keeps i, after consonant drops it", () => {
    expect(regularPlural("camicia")).toBe("camicie");
    expect(regularPlural("arancia")).toBe("arance");
  });
  it("accented and consonant endings don't change", () => {
    expect(regularPlural("città")).toBe("città");
    expect(regularPlural("bar")).toBe("bar");
  });
});

describe("plural quiz checking", () => {
  const t = PLURAL_TASKS.find((x) => x.sg === "il braccio")!;
  it("accepts with or without article", () => {
    expect(isCorrectPlural(t, "le braccia")).toBe(true);
    expect(isCorrectPlural(t, "braccia")).toBe(true);
  });
  it("rejects the regular-looking wrong form", () => expect(isCorrectPlural(t, "i bracci")).toBe(false));
});

import { explainPlural, mistakeHint } from "@/data/plurals";
describe("smart plural explainer", () => {
  it("handles articles, exceptions and sound rules", () => {
    expect(explainPlural("il libro")?.pl).toBe("libri");
    expect(explainPlural("amico")).toMatchObject({ pl: "amici", rule: "soft" });
    expect(explainPlural("parco")).toMatchObject({ pl: "parchi", rule: "hard" });
    expect(explainPlural("problema")).toMatchObject({ pl: "problemi", rule: "ma" });
    expect(explainPlural("foto")).toMatchObject({ pl: "foto", rule: "same" });
    expect(explainPlural("uomo")?.pl).toBe("uomini");
    expect(explainPlural("figlio")?.pl).toBe("figli");
    expect(explainPlural("123")).toBeNull();
  });
  it("gives a hint for a missing h", () => {
    const t = PLURAL_TASKS.find((x) => x.sg === "l'amica")!;
    expect(mistakeHint(t, "le amice")).toMatch(/h/);
  });
});
