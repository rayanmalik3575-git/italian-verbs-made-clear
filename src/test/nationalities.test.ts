import { describe, expect, it } from "vitest";
import { NATIONALITIES, formsOf, AGREE_TASKS, isCorrectAgreement } from "@/data/nationalities";

const get = (w: string) => NATIONALITIES.find((n) => n.it === w)!;

describe("nationality forms", () => {
  it("-o words have four forms", () => {
    expect(formsOf(get("italiano"))).toEqual(["italiano", "italiana", "italiani", "italiane"]);
  });
  it("-ese words don't change for gender", () => {
    expect(formsOf(get("inglese"))).toEqual(["inglese", "inglese", "inglesi", "inglesi"]);
  });
  it("tedesco keeps the hard sound in the plural", () => {
    expect(formsOf(get("tedesco"))).toEqual(["tedesco", "tedesca", "tedeschi", "tedesche"]);
  });
  it("all nationalities are lowercase", () => {
    for (const n of NATIONALITIES) expect(n.it).toBe(n.it.toLowerCase());
  });
  it("mixed group takes masculine plural", () => {
    const t = AGREE_TASKS.find((x) => x.person.name === "Paolo e Chiara" && x.nat.it === "brasiliano")!;
    expect(isCorrectAgreement(t, "brasiliani")).toBe(true);
    expect(isCorrectAgreement(t, "brasiliane")).toBe(false);
  });
});
