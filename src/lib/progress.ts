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
