import { describe, it, expect } from "vitest";
import { STEP1, STEP2, audioPaths, scoreQuiz, allSentences } from "@/content/questions-lesson";
import { stepResult } from "@/lib/progress";

describe("questions lesson", () => {
  it("audio files are named by id", () => {
    expect(audioPaths("parli-inglese-q")).toEqual({ audioNormal: "/audio/questions/parli-inglese-q.mp3", audioSlow: "/audio/questions/parli-inglese-q-slow.mp3" });
  });
  it("step 1 needs real recordings, step 2 may use the browser voice", () => {
    expect(STEP1.pairs.flat().every((s) => s.needsRecording)).toBe(true);
    expect(STEP2.table.some((r) => r.it.needsRecording)).toBe(false);
  });
  it("scores quizzes", () => {
    expect(scoreQuiz(STEP2.quiz, { m1: "Lavori?", m2: "Mangi?", m3: "Arrivano stasera?" })).toBe(2);
  });
  it("done at any score, mastered at 3/4", () => {
    expect(stepResult(0, 4)).toMatchObject({ done: true, mastered: false });
    expect(stepResult(2, 4).mastered).toBe(false);
    expect(stepResult(3, 4).mastered).toBe(true);
    expect(stepResult(1, 4, stepResult(4, 4)).mastered).toBe(true);
  });
  it("step 1 has no quiz and every clip needs a real recording", () => {
    expect("quiz" in STEP1).toBe(false);
    expect([STEP1.tune.statement, STEP1.tune.question, ...STEP1.deck.phrases, ...STEP1.rebuild.rows.map((r) => r.it)].every((s) => s.needsRecording)).toBe(true);
    expect(allSentences().some((s) => s.id.startsWith("hai-fame") || s.id.startsWith("siete-a-casa"))).toBe(false);
  });
  it("ids are unique", () => {
    const ids = allSentences().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
