import { describe, it, expect } from "vitest";
import { toYesNoQuestion, ORDER_TASKS, PICK_TASKS, isAcceptedQuestion, isCorrectPick } from "@/data/questions";

describe("questions lesson", () => {
  it("yes/no question keeps the statement's word order", () => {
    expect(toYesNoQuestion("Mangi un panino.")).toBe("Mangi un panino?");
  });
  it("subject goes after the verb with a question word", () => {
    const t = ORDER_TASKS.find((x) => x.en.startsWith("Where does Giulia"))!;
    expect(isAcceptedQuestion(t, ["Dove", "abita", "Giulia"])).toBe(true);
    expect(isAcceptedQuestion(t, ["Dove", "Giulia", "abita"])).toBe(false);
  });
  it("che, not cosa, before a noun", () => {
    const t = PICK_TASKS[0]!;
    expect(isCorrectPick(t, "Che")).toBe(true);
    expect(isCorrectPick(t, "Cosa")).toBe(false);
  });
  it("plural noun takes quali", () => {
    const t = PICK_TASKS.find((x) => x.after.includes("scarpe"))!;
    expect(isCorrectPick(t, "Quali")).toBe(true);
  });
  it("every builder's accepted answer uses exactly its blocks", () => {
    for (const t of ORDER_TASKS) expect(isAcceptedQuestion(t, t.accept[0]!.split(" "))).toBe(true);
  });
});
