import { describe, it, expect } from "vitest";
import { VERBS } from "@/data/verbs";
import { blocksOf, builderFor } from "@/data/verb-builder";
describe("verb builder", () => {
  it("comprare has 6 real sentences, one per person", () => {
    const v = VERBS.find((x) => x.infinitive === "comprare")!;
    const b = builderFor(v);
    expect(b).toHaveLength(6);
    b.forEach((x) => expect(x.it.toLowerCase()).toContain(v.forms[x.idx]!));
  });
  it("no verb gets an empty or one-word sentence", () => {
    for (const v of VERBS) for (const x of builderFor(v)) expect(blocksOf(x.it).length).toBeGreaterThan(1);
  });
  it("articles stick to their noun", () => {
    expect(blocksOf("Compro il pane ogni mattina.")).toEqual(["Compro", "il pane", "ogni", "mattina"]);
  });
});
