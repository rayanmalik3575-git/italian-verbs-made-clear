import { describe, it, expect } from "vitest";
import { Q_TRANSLATE } from "@/content/questions-practice";
import { matches } from "@/content/review-extras";

describe("questions writing practice", () => {
  it("accepts every listed answer", () => {
    for (const t of Q_TRANSLATE) for (const a of t.answers) expect(matches(t, a)).toBe(true);
  });
  it("rejects English-style 'do' helper", () => {
    expect(matches(Q_TRANSLATE[0]!, "Fai parli italiano?")).toBe(false);
  });
  it("accepts dov'è with the apostrophe", () => {
    expect(matches(Q_TRANSLATE.find((t) => t.id === "qt2")!, "dov'è la stazione?")).toBe(true);
  });
});
