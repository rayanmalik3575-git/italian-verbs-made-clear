import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, Lightbulb, RotateCcw, Volume2, X } from "lucide-react";
import { PageHeader, Panel, ProgressBar, btn, Chip } from "@/components/app-shell";
import { AGREE_TASKS, NATIONALITIES, formsOf, isCorrectAgreement, patternOf, type Pattern } from "@/data/nationalities";

export const Route = createFileRoute("/nationalities")({
  head: () => ({
    meta: [
      { title: "Italian Nationalities — Parlami" },
      { name: "description", content: "Say where you're from in Italian: 20 nationalities, the two ending patterns and real conversation practice." },
      { property: "og:title", content: "Italian Nationalities — Parlami" },
      { property: "og:description", content: "italiano, italiana, inglese, inglesi — learn why some words change and some don't." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NationalitiesPage,
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function Listen({ text }: { text: string }) {
  return (
    <button type="button" onClick={() => speak(text)} aria-label={`Listen to ${text}`}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-card text-primary hover:bg-accent">
      <Volume2 className="h-4 w-4" />
    </button>
  );
}

function BigIdea({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex gap-3 rounded-2xl border border-primary/20 bg-tile-blue p-5">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div className="text-[17px] leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

const TABS = ["Three golden rules", "The 20 words", "Where are you from?", "Practise"];

function NationalitiesPage() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <PageHeader title="Nationalities" description="In English, 'Italian' never changes. In Italian, it changes with the person — and that's exactly what makes you sound natural." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step === 0 && <Rules />}
      {step === 1 && <WordList />}
      {step === 2 && <Origins />}
      {step === 3 && <Quiz />}
      {step < 3 && (
        <div className="mt-6 flex justify-end">
          <button className={btn.primary} onClick={() => setStep(step + 1)}>Next: {TABS[step + 1]} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

function Rules() {
  return (
    <div>
      <BigIdea>A nationality in Italian is a <strong>describing word</strong>, like "tall" or "happy". So it follows the person: <strong>Marco è italiano, Giulia è italiana.</strong></BigIdea>
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Rule 1</p>
          <h3 className="mt-1 text-lg font-bold">No capital letters</h3>
          <p className="mt-2 text-muted-foreground">English writes <strong className="text-foreground">I am American</strong>. Italian writes <strong className="text-foreground">sono americano</strong>. Same for languages: <em>parlo inglese</em>.</p>
          <p className="mt-3 rounded-xl bg-tile-pink p-3 text-sm text-tile-pink-ink"><strong>Most common mistake:</strong> writing "Italiano" mid-sentence. It looks like an English habit to Italians.</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Rule 2</p>
          <h3 className="mt-1 text-lg font-bold">Ends in -o? Four forms</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {formsOf(NATIONALITIES[0]!).map((f, i) => (
              <div key={f} className="rounded-xl border bg-background p-2">
                <span className="font-bold">{f.slice(0, -1)}<span className="text-primary">{f.slice(-1)}</span></span>
                <span className="block text-xs text-muted-foreground">{["one man", "one woman", "men / mixed", "women"][i]}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Rule 3</p>
          <h3 className="mt-1 text-lg font-bold">Ends in -e? Only two</h3>
          <p className="mt-2 text-muted-foreground">Words like <strong className="text-foreground">inglese</strong> don't care if you're a man or a woman. Only the number changes:</p>
          <p className="mt-3 text-[17px]"><strong>inglese</strong> → one person<br /><strong>ingles<span className="text-primary">i</span></strong> → more people</p>
          <p className="mt-3 text-sm text-muted-foreground">Good news: <strong className="text-foreground">all -ese words</strong> work this way — francese, cinese, giapponese…</p>
        </Panel>
      </div>
    </div>
  );
}

function WordList() {
  const [filter, setFilter] = useState<"all" | Pattern>("all");
  const list = NATIONALITIES.filter((n) => filter === "all" || patternOf(n) === filter);
  return (
    <div>
      <BigIdea>Look at the ending first. It tells you instantly whether the word will have <strong>four forms</strong> or <strong>two</strong>.</BigIdea>
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={filter === "all"} onClick={() => setFilter("all")}>All ({NATIONALITIES.length})</Chip>
        <Chip active={filter === "four"} onClick={() => setFilter("four")}>-o · four forms ({NATIONALITIES.filter((n) => patternOf(n) === "four").length})</Chip>
        <Chip active={filter === "two"} onClick={() => setFilter("two")}>-e · two forms ({NATIONALITIES.filter((n) => patternOf(n) === "two").length})</Chip>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((n) => {
          const f = formsOf(n);
          return (
            <Panel key={n.it} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xl font-bold">{n.it}</p>
                  <p className="text-sm text-muted-foreground">{n.en}</p>
                </div>
                <Listen text={n.it} />
              </div>
              <p className="mt-3 text-sm"><span className="text-muted-foreground">Forms: </span><strong>{[...new Set(f)].join(" · ")}</strong></p>
              {n.note && <p className="mt-2 text-sm text-muted-foreground">{n.note}</p>}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

const DIALOG = [
  { it: "Di dove sei?", en: "Where are you from? (to a friend)" },
  { it: "Sono americana, di Chicago.", en: "I'm American, from Chicago." },
  { it: "Di dov'è Lei?", en: "Where are you from? (polite)" },
  { it: "Sono inglese, vengo da Londra.", en: "I'm English, I come from London." },
];

function Origins() {
  return (
    <div>
      <BigIdea>Italians ask <strong>"di dove?"</strong> — literally "of where?". You can answer three ways, and natives often combine them.</BigIdea>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "sono + nationality", ex: "Sono canadese.", en: "I'm Canadian." },
          { t: "sono di + city", ex: "Sono di Roma.", en: "I'm from Rome." },
          { t: "vengo da + country", ex: "Vengo dal Canada.", en: "I come from Canada." },
        ].map((r) => (
          <Panel key={r.t} className="p-5">
            <p className="text-sm font-bold text-primary">{r.t}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="text-lg font-bold">{r.ex}</p><Listen text={r.ex} />
            </div>
            <p className="text-sm text-muted-foreground">{r.en}</p>
          </Panel>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-tile-amber p-4 text-sm text-tile-amber-ink"><strong>Watch out:</strong> use <strong>di</strong> with cities (sono di Milano) but <strong>da</strong> with countries, and da joins the article: <em>dal Brasile, dalla Francia, dall'Italia, dagli Stati Uniti</em>.</p>
      <Panel className="mt-6 p-5">
        <h3 className="mb-3 font-bold">In action</h3>
        <ul className="space-y-2">
          {DIALOG.map((d) => (
            <li key={d.it}>
              <button onClick={() => speak(d.it)} className="w-full rounded-xl border bg-background p-3 text-left hover:bg-accent">
                <span className="block text-[17px] font-semibold">{d.it}</span>
                <span className="text-sm text-muted-foreground">{d.en}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Quiz() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const total = AGREE_TASKS.length;
  if (i >= total)
    return (
      <Panel className="p-8 text-center">
        <h3 className="text-2xl font-bold">{score} / {total}</h3>
        <p className="mt-2 text-muted-foreground">{score === total ? "Perfect — you match every nationality to the person." : "Look at who you're describing first, then the ending."}</p>
        <button className={`${btn.primary} mt-5`} onClick={() => { setI(0); setScore(0); setPick(null); }}><RotateCcw className="h-4 w-4" /> Try again</button>
      </Panel>
    );
  const t = AGREE_TASKS[i]!;
  const sentence = `${t.person.name} ${t.person.verb} ${t.answer}.`;
  const choose = (o: string) => {
    if (pick) return;
    setPick(o);
    if (isCorrectAgreement(t, o)) setScore((s) => s + 1);
    speak(sentence);
  };
  const ok = pick && isCorrectAgreement(t, pick);
  return (
    <Panel className="p-6">
      <ProgressBar value={(i / total) * 100} label={`Question ${i + 1} of ${total}`} />
      <p className="mt-5 text-sm text-muted-foreground">Complete the sentence · <strong>{t.nat.en}</strong> · {t.person.hint}</p>
      <p className="mt-2 text-2xl font-bold">{t.person.name} {t.person.verb} <span className="text-primary">…</span></p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {t.options.map((o) => {
          const state = !pick ? "" : o === t.answer ? "border-success bg-tile-green" : o === pick ? "border-destructive bg-tile-pink" : "opacity-60";
          return (
            <button key={o} onClick={() => choose(o)} disabled={!!pick}
              className={`min-h-12 rounded-xl border bg-card px-4 text-left text-[17px] font-semibold ${state}`}>{o}</button>
          );
        })}
      </div>
      {pick && (
        <div className={`mt-5 rounded-xl p-4 ${ok ? "bg-tile-green text-tile-green-ink" : "bg-tile-pink text-tile-pink-ink"}`}>
          <p className="flex items-center gap-2 font-bold">{ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}{ok ? "Correct" : `Not quite — you chose ${pick}`}</p>
          <p className="mt-1">{sentence}</p>
          <p className="mt-1 text-sm">{patternOf(t.nat) === "two" ? `${t.nat.it} ends in -e, so only singular/plural changes.` : `${t.nat.it} ends in -o, so it matches ${t.person.hint}.`}</p>
          <button className={`${btn.primary} mt-3`} onClick={() => { setI(i + 1); setPick(null); }}>Continue <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </Panel>
  );
}
