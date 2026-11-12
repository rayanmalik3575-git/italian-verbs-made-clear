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
  if (!("speechSynthesis" in window)) { stop(); return; }
  const u = new SpeechSynthesisUtterance(s.italian);
  u.lang = "it-IT";
  const it = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("it"));
  if (it) u.voice = it;
  if (s.type === "question") {
    u.text = s.italian.replace(/[.!]?\s*$/, "").replace(/\?$/, "") + "?";
    u.pitch = 1.35; u.rate = slow ? 0.6 : 0.85;
  } else {
    u.text = s.italian.replace(/\?$/, "").replace(/\.?\s*$/, ".");
    u.pitch = 0.95; u.rate = slow ? 0.6 : 0.9;
  }
  // Rough estimate: ~13 chars per second at rate 1.
  const est = Math.max(0.8, u.text.length / 13 / u.rate);
  u.onstart = () => { if (state.id === s.id) set({ ...state, duration: est, startedAt: performance.now() }); };
  u.onend = () => { if (state.id === s.id) stop(); };
  window.speechSynthesis.speak(u);
}

const cache = new Map<string, HTMLAudioElement>();
function getAudio(url: string): HTMLAudioElement {
  let a = cache.get(url);
  if (!a) { a = new Audio(url); a.preload = "auto"; cache.set(url, a); }
  return a;
}
/** Warm the browser cache so the first click starts instantly. */
export function preload(s: Sentence) {
  if (typeof window === "undefined") return;
  getAudio(s.audioNormal); getAudio(s.audioSlow);
}

/** Plays a sentence immediately. The curve starts only when sound actually starts. */
export function play(s: Sentence, slow = false): Promise<boolean> {
  stop();
  const a = getAudio(slow ? s.audioSlow : s.audioNormal);
  a.onplaying = a.onended = a.onerror = null;
  a.currentTime = 0;
  current = a;
  // startedAt 0 = waiting for sound; curve stays at the start.
  set({ id: s.id, slow, duration: 0, startedAt: 0 });
  a.onplaying = () => {
    if (current !== a) return;
    const d = Number.isFinite(a.duration) && a.duration > 0 ? a.duration / a.playbackRate : 1.5;
    set({ ...state, duration: d, startedAt: performance.now() - (a.currentTime / a.playbackRate) * 1000 });
  };
  a.onended = () => { if (current === a) stop(); };
  a.onerror = () => { if (current === a) { current = null; speakFallback(s, slow); } };
  return a.play().then(() => true).catch(() => {
    if (current === a) { current = null; speakFallback(s, slow); }
    return true;
  });
}

export function usePlayer(): State {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => state, () => state);
}
