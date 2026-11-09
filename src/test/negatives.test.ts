import { describe, expect, it } from "vitest";
import { negate, checkFlip, checkReply, FLIP_TASKS, REPLY_TASKS, expectedNegative } from "@/data/negatives";

describe("negatives", () => {
  it("non goes right before the verb", () => {
    expect(negate("parlo italiano")).toBe("non parlo italiano");
    expect(negate("sono americano")).toBe("non sono americano");
  });
  it("subject stays before non", () => {
    expect(negate("io parlo italiano")).toBe("io non parlo italiano");
  });
  it("pronoun + verb block is never split", () => {
    expect(negate("ti amo")).toBe("non ti amo");
    expect(negate("mi piace l'Italia")).toBe("non mi piace l'Italia");
  });
  it("compound verbs are never split", () => {
    expect(negate("ho capito")).toBe("non ho capito");
  });
  it("named subject handled", () => {
    const t = FLIP_TASKS.find((x) => x.it.startsWith("Marco"))!;
    expect(expectedNegative(t)).toBe("Marco non lavora oggi");
  });
  it("rejects wrong placements", () => {
    const t = FLIP_TASKS.find((x) => x.it === "ti amo")!;
    expect(checkFlip("ti non amo", t)).toBe(false);
    expect(checkFlip("Non ti amo.", t)).toBe(true);
  });
  it("reply needs both No and non", () => {
    const t = REPLY_TASKS[0]!;
    expect(checkReply("non voglio la pizza", t)).toBe(false);
    expect(checkReply("No, non voglio la pizza!", t)).toBe(true);
  });
});
