import { describe, expect, it } from "vitest";
import { articleFor, withArticle, isCorrectPluralPhrase, DECK } from "@/data/articles";

describe("definite articles", () => {
  it("core four", () => {
    expect(articleFor("libro", "m")).toBe("il");
    expect(articleFor("libro", "m", true)).toBe("i");
    expect(articleFor("penna", "f")).toBe("la");
    expect(articleFor("penna", "f", true)).toBe("le");
  });
  it("vowel start → l', plural gli/le", () => {
    expect(withArticle("amico", "m")).toBe("l'amico");
    expect(articleFor("amico", "m", true)).toBe("gli");
    expect(withArticle("acqua", "f")).toBe("l'acqua");
    expect(articleFor("arancia", "f", true)).toBe("le");
  });
  it("strong sounds → lo / gli for masculine only", () => {
    for (const w of ["studente", "zaino", "gnomo", "psicologo", "yogurt", "sgabello"]) {
      expect(articleFor(w, "m")).toBe("lo");
      expect(articleFor(w, "m", true)).toBe("gli");
    }
    expect(articleFor("zanzara", "f")).toBe("la");
    expect(articleFor("storia", "f")).toBe("la");
  });
  it("checks plural phrase answers", () => {
    const z = DECK.find((n) => n.it === "zaino")!;
    expect(isCorrectPluralPhrase(z, "gli zaini")).toBe(true);
    expect(isCorrectPluralPhrase(z, "i zaini")).toBe(false);
  });
});
