import { useEffect, useState, useSyncExternalStore } from "react";
import type { Sentence } from "@/content/questions-lesson";

/** One shared player: only one clip plays at a time. */
type State = { id: string | null; slow: boolean; duration: number; startedAt: number };
let state: State = { id: null, slow: false, duration: 0, startedAt: 0 };
const subs = new Set<() => void>();
const set = (n: State) => { state = n; subs.forEach((f) => f()); };
let current: HTMLAudioElement | null = null;
const exists = new Map<string, Promise<boolean>>();

/** True only when the server returns a real audio file (not the HTML fallback). */
export function fileExists(url: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!exists.has(url)) {
    exists.set(url, fetch(url, { method: "HEAD" })
      .then((r) => r.ok && (r.headers.get("content-type") ?? "").startsWith("audio"))
      .catch(() => false));
  }
  return exists.get(url)!;
}
export function useFileExists(url: string): boolean | null {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => { let on = true; fileExists(url).then((x) => on && setV(x)); return () => { on = false; }; }, [url]);
  return v;
}

export function stop() {
  current?.pause(); current = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  set({ id: null, slow: false, duration: 0, startedAt: 0 });
}

function speakFallback(s: Sentence, slow: boolean) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(s.italian);
  u.lang = "it-IT"; u.rate = slow ? 0.6 : 0.9;
  u.onend = () => { if (state.id === s.id) stop(); };
  window.speechSynthesis.speak(u);
  set({ id: s.id, slow, duration: (slow ? 2.6 : 1.8), startedAt: performance.now() });
}

/** Plays a sentence. Returns false when a required recording is missing. */
export async function play(s: Sentence, slow = false): Promise<boolean> {
  stop();
  const hasNormal = await fileExists(s.audioNormal);
  if (!hasNormal) {
    if (s.needsRecording) return false;
    speakFallback(s, slow);
    return true;
  }
  const useSlowFile = slow && (await fileExists(s.audioSlow));
  const a = new Audio(useSlowFile ? s.audioSlow : s.audioNormal);
  if (slow && !useSlowFile) { a.preservesPitch = true; a.playbackRate = 0.7; }
  current = a;
  a.onended = () => { if (current === a) stop(); };
  a.onloadedmetadata = () => {
    if (current === a && Number.isFinite(a.duration)) set({ ...state, duration: a.duration / a.playbackRate });
  };
  set({ id: s.id, slow, duration: 1.8, startedAt: performance.now() });
  try { await a.play(); } catch { stop(); }
  return true;
}

export function usePlayer(): State {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => state, () => state);
}
