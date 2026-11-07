import { describe, expect, it } from "vitest";
import { grade } from "@/lib/grading";
import { statusOf } from "@/lib/progress";

describe("answer grading", () => {
  it("exact form is correct", () => expect(grade(" Parlo ", "parlo")).toBe("correct"));
  it("missing accent is partially correct", () => expect(grade("e", "è")).toBe("partial"));
  it("wrong form is incorrect", () => expect(grade("parla", "parlo")).toBe("incorrect"));
});

describe("learning status", () => {
  it("no record means Not started", () => expect(statusOf(undefined)).toBe("not-started"));
  it("6/6 best means mastered", () => expect(statusOf({ best: 6, attempts: 1, last: 0 })).toBe("mastered"));
  it("below 6 means practising", () => expect(statusOf({ best: 5, attempts: 2, last: 0 })).toBe("practising"));
});
