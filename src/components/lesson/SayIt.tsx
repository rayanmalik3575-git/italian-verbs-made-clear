import { useState } from "react";
import { Volume2, Snail, X, Sparkles, TrendingUp, Minus, Square } from "lucide-react";

const ACCENTS = ["à", "è", "é", "ì", "ò", "ù", "?"];
const STARTERS: { label: string; it: string; en: string }[] = [
  { label: "Café", it: "Vorrei un caffè, per favore.", en: "I'd like a coffee, please." },
  { label: "Directions", it: "Dov'è la stazione?", en: "Where is the station?" },
  { label: "Shopping", it: "Quanto costa questo?", en: "How much is this?" },
  { label: "Plans", it: "Dove vai stasera?", en: "Where are you going tonight?" },
  { label: "Time", it: "A che ora chiude?", en: "What time does it close?" },
];

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

function Wave({ on }: { on: boolean }) {
  const h = [40, 75, 55, 95, 65, 85, 45, 70, 50, 90, 60, 80, 42, 68];
  return (
    <div aria-hidden className="flex h-10 items-center gap-[3px]">
      {h.map((x, i) => (
        <span key={i} className={`w-[3px] rounded-full bg-primary-foreground/80 ${on ? "animate-pulse" : "opacity-40"}`}
          style={{ height: on ? `${x}%` : "18%", transition: "height 200ms", animationDelay: `${i * 70}ms`, animationDuration: "700ms" }} />
      ))}
    </div>
  );
}

/** Type any Italian sentence and hear it back; questions ending in "?" get a rising tune. */
export function SayIt() {
  const [text, setText] = useState("");
  const [on, setOn] = useState<null | "n" | "s">(null);
  const t = text.trim();
  const isQ = t.endsWith("?");
  const run = (s: string, slow: boolean) => {
    const k = slow ? "s" : "n";
    if (on === k) { window.speechSynthesis.cancel(); setOn(null); return; }
    setOn(k); say(s, slow, () => setOn(null));
  };
  return (
    <section className="mt-12 overflow-hidden rounded-[24px] border border-primary/20 bg-card shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--primary)_45%,transparent)]">
      <div className="bg-[linear-gradient(120deg,var(--primary),color-mix(in_oklab,var(--primary)_55%,#ED2B78))] px-5 py-6 text-primary-foreground sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[14px] font-semibold"><Sparkles className="h-3.5 w-3.5" />Voice lab</span>
            <h3 className="mt-3 text-2xl font-bold sm:text-[28px]">Hear your own sentence</h3>
            <p className="mt-1 max-w-[52ch] text-[15px] text-primary-foreground/90">Type anything in Italian. End it with "?" and the voice lifts at the end, like a real question.</p>
          </div>
          <div className="hidden sm:block"><Wave on={on !== null} /></div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <form onSubmit={(e) => { e.preventDefault(); if (t) run(t, false); }}
          className="rounded-2xl border-2 border-border bg-background p-2 transition-colors focus-within:border-primary">
          <label htmlFor="sayit" className="sr-only">Italian sentence</label>
          <div className="flex items-center gap-2">
            <input id="sayit" value={text} onChange={(e) => setText(e.target.value)} placeholder="Dove abiti?" lang="it"
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-[20px] font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none" />
            {text && <button type="button" onClick={() => setText("")} aria-label="Clear" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border px-1 pt-2">
            <div className="flex flex-wrap gap-1">
              {ACCENTS.map((a) => (
                <button key={a} type="button" onClick={() => setText((x) => x + a)}
                  className="h-9 w-9 rounded-lg border border-border bg-card text-[16px] font-semibold text-foreground shadow-[0_2px_0_var(--border)] active:translate-y-[1px] hover:border-primary hover:text-primary">{a}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" disabled={!t} aria-pressed={on === "n"}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-md transition hover:brightness-110 disabled:opacity-40">
                {on === "n" ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}{on === "n" ? "Stop" : "Listen"}
              </button>
              <button type="button" disabled={!t} onClick={() => run(t, true)} aria-pressed={on === "s"} aria-label="Play slowly"
                className={`inline-flex h-11 items-center gap-1.5 rounded-xl border px-3 text-[15px] font-semibold transition disabled:opacity-40 ${on === "s" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-primary hover:bg-accent"}`}>
                <Snail className="h-4 w-4" />0.7×
              </button>
            </div>
          </div>
        </form>

        <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[14px] font-semibold ${!t ? "bg-muted text-muted-foreground" : isQ ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
          {isQ ? <TrendingUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          {!t ? "Waiting for your sentence" : isQ ? "Question tune: voice rises at the end" : "Statement tune: voice stays level"}
        </div>

        <div className="mt-7">
          <div className="text-[14px] font-bold uppercase tracking-wide text-muted-foreground">Try an everyday line</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {STARTERS.map((s) => (
              <button key={s.it} type="button" onClick={() => { setText(s.it); setOn("n"); say(s.it, false, () => setOn(null)); }}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground"><Volume2 className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-primary">{s.label}</span>
                  <span className="block text-[15px] font-semibold text-foreground">{s.it}</span>
                  <span className="block text-[14px] text-foreground/80">{s.en}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
