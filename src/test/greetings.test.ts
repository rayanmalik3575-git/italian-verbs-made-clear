import { describe, expect, it } from "vitest";
import { SCENARIOS, isCorrectScenario } from "@/data/greetings";

describe("greetings scenarios", () => {
  it("leaving a restaurant at night is buona serata, not buonanotte", () => {
    const s = SCENARIOS.find((x) => x.situation.includes("restaurant at 11pm"))!;
    expect(isCorrectScenario(s, "Buona serata")).toBe(true);
    expect(isCorrectScenario(s, "Buonanotte")).toBe(false);
  });
  it("every answer is one of its options", () => {
    for (const s of SCENARIOS) expect(s.options).toContain(s.answer);
  });
});
