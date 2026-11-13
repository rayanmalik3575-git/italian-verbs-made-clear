import { useState } from "react";
import { Volume2, Snail } from "lucide-react";
import { Panel } from "@/components/app-shell";

const ACCENTS = ["à", "è", "é", "ì", "ò", "ù"];
const STARTERS = ["Dove vai stasera?", "Quanto costa questo?", "A che ora chiude?", "Vorrei un caffè, per favore."];

function say(text: string, slow: boolean, onEnd: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return onEnd();
  window.speechSynthesis.cancel();
  const t = text.trim();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = "it-IT";
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("it"));
  if (v) u.voice = v;
  const q = t.endsWith("?");
  u.pitch = q ? 1.35 : 0.95;
  u.rate = slow ? 0.6 : q ? 0.85 : 0.9;
  u.onend = u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

/** Type any Italian sentence and hear it back; questions ending in "?" get a rising tune. */
export function SayIt() {
  const [text, setText] = useState("");
  const [on, setOn] = useState<null | "n" | "s">(null);
  const play = (slow: boolean) => {
    if (!text.trim()) return;
    const k = slow ? "s" : "n";
    if (on === k) { window.speechSynthesis.cancel(); setOn(null); return; }
    setOn(k); say(text, slow, () => setOn(null));
  };
  const btn = (slow: boolean) => {
    const active = on === (slow ? "s" : "n");
    const Icon = slow ? Snail : Volume2;
    return (
      <button type="button" onClick={() => play(slow)} disabled={!text.trim()} aria-pressed={active}
        aria-label={`${active ? "Stop" : "Play"}${slow ? " slowly" : ""}`}
        className={`inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-2 text-sm font-semibold transition-colors disabled:opacity-40 ${active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-primary hover:bg-accent"}`}>
        <Icon className="h-4 w-4" />{slow && <span>0.7×</span>}
      </button>
    );
  };
  return (
    <Panel className="mt-10 p-5 sm:p-6">
      <h3 className="text-xl font-bold text-foreground">Hear your own sentence</h3>
      <p className="mt-1 text-[15px] text-foreground">Type anything in Italian. End it with "?" and you'll hear it as a question.</p>
      <form className="mt-4 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); play(false); }}>
        <label htmlFor="sayit" className="sr-only">Italian sentence</label>
        <input id="sayit" value={text} onChange={(e) => setText(e.target.value)} placeholder="Dove abiti?" lang="it"
          className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-[16px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        {btn(false)}{btn(true)}
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ACCENTS.map((a) => (
          <button key={a} type="button" onClick={() => setText((t) => t + a)} className="h-9 w-9 rounded-lg border bg-card text-[16px] font-semibold text-foreground hover:bg-accent">{a}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button key={s} type="button" onClick={() => { setText(s); setOn("n"); say(s, false, () => setOn(null)); }}
            className="rounded-full border bg-card px-3 py-1.5 text-[14px] font-medium text-foreground hover:bg-accent">{s}</button>
        ))}
      </div>
    </Panel>
  );
}
