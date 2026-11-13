import { useSyncExternalStore } from "react";

/** Per-verb practice record, stored only in this browser. */
export type VerbRecord = { best: number; attempts: number; last: number };
export type ProgressMap = Record<string, VerbRecord>;

const KEY = "parlami.progress.v1";
const EMPTY: ProgressMap = {};
let cache: ProgressMap | null = null;
const listeners = new Set<() => void>();

function read(): ProgressMap {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as ProgressMap;
  } catch {
    cache = {};
  }
  return cache;
}
function write(next: ProgressMap) {
  cache = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  listeners.forEach((l) => l());
}

export function recordAttempt(verb: string, score: number, total = 6, now = Date.now()) {
  const cur = read();
  const prev = cur[verb];
  const best = Math.max(prev?.best ?? 0, Math.round((score / total) * 6));
  write({ ...cur, [verb]: { best, attempts: (prev?.attempts ?? 0) + 1, last: now } });
}
export function resetProgress() { write({}); }

export function useProgress(): ProgressMap {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    () => EMPTY,
  );
}

export type Status = "not-started" | "practising" | "mastered";
export function statusOf(r: VerbRecord | undefined): Status {
  if (!r || r.attempts === 0) return "not-started";
  return r.best >= 6 ? "mastered" : "practising";
}
export const STATUS_LABEL: Record<Status, string> = {
  "not-started": "Not started",
  practising: "Practising",
  mastered: "Mastered",
};

/* ---------- Lesson step progress (Asking questions) ---------- */
export type StepRecord = { done: boolean; mastered: boolean; best: number; total: number };
export type StepProgress = Record<string, StepRecord>;
export const QUESTIONS_KEY = "parlami.questions.progress";
const EMPTY_STEPS: StepProgress = {};
let stepCache: StepProgress | null = null;
const stepListeners = new Set<() => void>();
function readSteps(): StepProgress {
  if (typeof window === "undefined") return EMPTY_STEPS;
  if (stepCache) return stepCache;
  try { stepCache = JSON.parse(window.localStorage.getItem(QUESTIONS_KEY) ?? "{}") as StepProgress; } catch { stepCache = {}; }
  return stepCache;
}
/** Done at any score; mastered at 75% or better (3/4). Keeps the best score. */
export function stepResult(score: number, total: number, prev?: StepRecord): StepRecord {
  const best = Math.max(prev?.best ?? 0, score);
  return { done: true, best, total, mastered: total > 0 && best / total >= 0.75 };
}
export function recordStep(step: string, score: number, total: number) {
  const cur = readSteps();
  stepCache = { ...cur, [step]: stepResult(score, total, cur[step]) };
  try { window.localStorage.setItem(QUESTIONS_KEY, JSON.stringify(stepCache)); } catch { /* unavailable */ }
  stepListeners.forEach((l) => l());
}
export function useStepProgress(): StepProgress {
  return useSyncExternalStore(
    (cb) => { stepListeners.add(cb); return () => stepListeners.delete(cb); },
    readSteps,
    () => EMPTY_STEPS,
  );
}

export type QuestionsPracticeState = { i: number; score: number; missed: string[]; answered: boolean };
const QP_KEY = "parlami.questions.practice";
export function loadQuestionsPractice(): QuestionsPracticeState | null {
  try { const v = JSON.parse(localStorage.getItem(QP_KEY) ?? "null"); return v && typeof v.i === "number" ? v : null; } catch { return null; }
}
export function saveQuestionsPractice(s: QuestionsPracticeState) {
  try { localStorage.setItem(QP_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
