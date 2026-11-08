import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Check, Hand, RotateCcw, Volume2, X } from "lucide-react";
import { PageHeader, Panel, IconTile, ProgressBar, btn } from "@/components/app-shell";
import { GROUPS, SCENARIOS, isCorrectScenario, type Register } from "@/data/greetings";

export const Route = createFileRoute("/greetings")({
  head: () => ({
    meta: [
      { title: "Italian Greetings & Polite Phrases — Parlami" },
      { name: "description", content: "Hello, goodbye, thank you and how to answer grazie — with the cultural rules natives follow." },
      { property: "og:title", content: "Italian Greetings & Polite Phrases — Parlami" },
      { property: "og:description", content: "Learn when to say buongiorno, buona serata or si figuri, then practise real situations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GreetingsPage,
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

const REG: Record<Register, { label: string; cls: string }> = {
  formal: { label: "Formal", cls: "bg-tile-lavender text-tile-lavender-ink" },
  neutral: { label: "Everyday", cls: "bg-tile-blue text-tile-blue-ink" },
  casual: { label: "Casual", cls: "bg-tile-green text-tile-green-ink" },
};

function GreetingsPage() {
  const [step, setStep] = useState(0);
  const tabs = [...GROUPS.map((g) => g.title), "Practise situations"];
  const last = tabs.length - 1;
  return (
    <div>
      <PageHeader title="Greetings & polite phrases" description="Italian greetings are cultural, not just words. Learn which phrase fits the moment, then test yourself in real situations." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step < last ? <Group index={step} /> : <Situations />}
      {step < last && (
        <div className="mt-6 flex justify-end">
          <button className={btn.primary} onClick={() => setStep(step + 1)}>Next: {tabs[step + 1]} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

function Group({ index }: { index: number }) {
  const g = GROUPS[index]!;
  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex items-start gap-4">
          <IconTile icon={Hand} color="pink" />
          <div>
            <h2 className="text-lg font-bold">{g.title}</h2>
            <p className="mt-1 text-muted-foreground">{g.intro}</p>
          </div>
        </div>
      </Panel>
      {g.phrases.map((p) => (
        <Panel key={p.it}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold">{p.it}</h3>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${REG[p.register].cls}`}>{REG[p.register].label}</span>
              </div>
              <p className="mt-1 text-[17px] font-medium">{p.en}</p>
              <p className="text-sm text-muted-foreground">Sounds like: <span className="font-semibold text-foreground">{p.say}</span>{p.literal && <> · Literally: “{p.literal}”</>}</p>
            </div>
            <button className={btn.outline} onClick={() => speak(p.it)} aria-label={`Listen to ${p.it}`}><Volume2 className="h-4 w-4" /> Listen</button>
          </div>
          <p className="mt-3"><span className="font-semibold">When: </span><span className="text-muted-foreground">{p.when}</span></p>
          {p.watch && (
            <p className="mt-3 flex gap-2 rounded-xl bg-tile-amber p-3 text-sm text-tile-amber-ink">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{p.watch}</span>
            </p>
          )}
        </Panel>
      ))}
    </div>
  );
}

function Situations() {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= SCENARIOS.length;

  if (done) {
    return (
      <Panel className="text-center">
        <h2 className="text-xl font-bold">You got {score} of {SCENARIOS.length}</h2>
        <p className="mt-1 text-muted-foreground">Review any phrase you missed in the earlier steps, then try again.</p>
        <button className={`${btn.primary} mt-5`} onClick={() => { setI(0); setScore(0); setChoice(null); }}><RotateCcw className="h-4 w-4" /> Try again</button>
      </Panel>
    );
  }
  const s = SCENARIOS[i]!;
  const right = choice !== null && isCorrectScenario(s, choice);
  return (
    <Panel>
      <div className="mb-4"><ProgressBar value={(i / SCENARIOS.length) * 100} label="Situations progress" /></div>
      <p className="text-sm font-semibold text-muted-foreground">Situation {i + 1} of {SCENARIOS.length}</p>
      <h2 className="mt-1 text-lg font-bold">{s.situation}</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {s.options.map((o) => {
          const picked = choice === o;
          const isAns = choice !== null && o === s.answer;
          return (
            <button key={o} disabled={choice !== null} onClick={() => { setChoice(o); if (isCorrectScenario(s, o)) setScore((n) => n + 1); speak(o); }}
              className={`min-h-12 rounded-xl border px-4 text-left font-semibold ${isAns ? "border-tile-green-ink bg-tile-green text-tile-green-ink" : picked ? "border-destructive bg-destructive/10 text-destructive" : "bg-card hover:bg-muted"}`}>
              {o}
            </button>
          );
        })}
      </div>
      {choice !== null && (
        <div className={`mt-4 flex gap-2 rounded-xl p-3 ${right ? "bg-tile-green text-tile-green-ink" : "bg-destructive/10 text-destructive"}`}>
          {right ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
          <p><span className="font-semibold">{right ? "Correct. " : `Not quite — you chose “${choice}”. Answer: ${s.answer}. `}</span>{s.why}</p>
        </div>
      )}
      {choice !== null && (
        <div className="mt-4 flex justify-end">
          <button className={btn.primary} onClick={() => { setI(i + 1); setChoice(null); }}>Continue <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </Panel>
  );
}
