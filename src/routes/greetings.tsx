import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, ArrowRight, Check, Lightbulb, MessageCircle, Zap, RotateCcw, Volume2, X } from "lucide-react";
import { PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";
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

function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((t, i) => (i % 2 ? <strong key={i} className="font-semibold text-foreground">{t}</strong> : <span key={i}>{t}</span>))}</>;
}

function Group({ index }: { index: number }) {
  const g = GROUPS[index]!;
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border bg-tile-blue/60 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Step {index + 1} · The big idea</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{g.title}</h2>
        <p className="mt-1 text-muted-foreground">{g.intro}</p>
        <p className="mt-4 flex gap-3 text-[17px] leading-relaxed text-muted-foreground">
          <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span><Rich text={g.bigIdea} /></span>
        </p>
      </section>
      {g.phrases.map((p) => (
        <Panel key={p.it} className="overflow-hidden p-0">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b p-5 sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-bold tracking-tight sm:text-[28px]">{p.it}</h3>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${REG[p.register].cls}`}>{REG[p.register].label}</span>
              </div>
              <p className="mt-1 text-lg font-medium text-muted-foreground">{p.en}{p.literal && <span className="text-sm"> · literally “{p.literal}”</span>}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1" aria-label={`Sounds like ${p.syllables.join("-")}`}>
                {p.syllables.map((syl, i) => (
                  <span key={i} className={`rounded-lg px-2 py-1 font-mono text-sm ${i === p.stress ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"}`}>{syl}</span>
                ))}
                <span className="ml-1 text-xs text-muted-foreground">stress on the blue beat</span>
              </div>
            </div>
            <button className={btn.outline} onClick={() => speak(p.it)} aria-label={`Listen to ${p.it}`}><Volume2 className="h-4 w-4" /> Listen</button>
          </div>
          <div className="space-y-4 p-5 sm:p-6">
            <p className="text-lg font-semibold leading-snug"><Rich text={p.hook} /></p>
            <p className="text-[17px] leading-relaxed text-muted-foreground"><Rich text={p.insight} /></p>
            {p.shortcut && (
              <div className="rounded-2xl border border-accent/30 bg-tile-pink p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Zap className="h-4 w-4 text-tile-pink-ink" aria-hidden />
                  <span className="text-xs font-bold uppercase tracking-wider text-tile-pink-ink">What natives actually say</span>
                  <button onClick={() => speak(p.shortcut!.say)} className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-tile-pink-ink hover:bg-card" aria-label={`Listen to ${p.shortcut.say}`}><Volume2 className="h-4 w-4" /> Listen</button>
                </div>
                <p className="mt-1 text-2xl font-bold text-foreground">{p.shortcut.say}</p>
                <p className="mt-1 leading-relaxed text-muted-foreground"><Rich text={p.shortcut.note} /></p>
              </div>
            )}
            {p.scene && (
              <div className="rounded-2xl border bg-background p-4">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"><MessageCircle className="h-4 w-4" aria-hidden /> In real life</p>
                <div className="space-y-3">
                  {p.scene.map((l, i) => (
                    <div key={i} className={i % 2 ? "sm:pl-10" : ""}>
                      <p className="text-xs font-semibold text-muted-foreground">{l.who}</p>
                      <button onClick={() => speak(l.it)} className="text-left text-lg font-semibold text-foreground hover:text-primary">{l.it}</button>
                      <p className="text-sm text-muted-foreground">{l.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {p.trap && (
              <p className="flex gap-2 rounded-xl bg-tile-amber p-3 text-tile-amber-ink">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> <span><span className="font-bold">Watch out: </span><Rich text={p.trap} /></span>
              </p>
            )}
          </div>
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
