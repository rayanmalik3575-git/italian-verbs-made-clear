/** Browser Italian speech (synthesis + optional recognition). */
let voice: SpeechSynthesisVoice | undefined;
const pick = () => { if (typeof window !== "undefined" && window.speechSynthesis) voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("it")); };
if (typeof window !== "undefined" && window.speechSynthesis) { pick(); window.speechSynthesis.addEventListener?.("voiceschanged", pick); }
export function speakIt(text: string, slow = false) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const ss = window.speechSynthesis; ss.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = "it-IT"; if (voice) u.voice = voice;
  u.rate = slow ? 0.65 : 0.85; u.pitch = text.trim().endsWith("?") ? 1.1 : 1;
  ss.speak(u);
}
type Rec = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void };
export function recognitionSupported() {
  return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
}
export function listenIt(onText: (t: string) => void, onEnd: () => void) {
  const W = window as unknown as Record<string, new () => Rec>;
  const C = W["SpeechRecognition"] ?? W["webkitSpeechRecognition"]; if (!C) return onEnd();
  const r = new C(); r.lang = "it-IT"; r.interimResults = false;
  r.onresult = (e) => onText(e.results[0]?.[0]?.transcript ?? ""); r.onend = onEnd; r.onerror = onEnd; r.start();
}
