import { describe, it, expect } from "vitest";
import { gradeWithPronoun } from "@/lib/grading";
describe("reply reflex accepts optional pronoun", () => {
  it("accepts verb alone", () => expect(gradeWithPronoun("torno", "torno", "io")).toBe("correct"));
  it("accepts pronoun + verb, any case", () => expect(gradeWithPronoun("Io Torno", "torno", "io")).toBe("correct"));
  it("rejects wrong form with pronoun", () => expect(gradeWithPronoun("io torni", "torno", "io")).toBe("incorrect"));
  it("accepts lei for lui/lei", () => expect(gradeWithPronoun("lei torna", "torna", "lui/lei")).toBe("correct"));
});
