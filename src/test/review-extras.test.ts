import { describe, it, expect } from "vitest";
import { TRANSLATE, READINGS, matches } from "@/content/review-extras";
describe("translation grading", () => {
  const t = TRANSLATE.find((x) => x.id === "t2")!;
  it("ignores case and punctuation", () => expect(matches(t, "dove sono gli studenti")).toBe(true));
  it("rejects wrong article", () => expect(matches(t, "Dove sono i studenti?")).toBe(false));
  it("does not forgive missing accents", () => expect(matches(TRANSLATE.find((x) => x.id === "t6")!, "Perche non vieni?")).toBe(false));
  it("every reading answer is an option", () => READINGS.forEach((r) => r.questions.forEach((q) => expect(q.options).toContain(q.answer))));
});
