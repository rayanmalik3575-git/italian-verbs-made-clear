import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw, Volume2, X } from "lucide-react";
import { PageHeader, ProgressBar, btn } from "@/components/app-shell";
import { SWITCHES, SOUND_RULES, REBELS, PLURAL_TASKS, isCorrectPlural, type Noun } from "@/data/plurals";

export const Route = createFileRoute("/plurals")({
  head: () => ({
    meta: [
      { title: "Italian Plurals & Exceptions — Parlami" },
      { name: "description", content: "Make any Italian noun plural: the three vowel switches, sound-saving spelling and the rebels that break the rules." },
      { property: "og:title", content: "Italian Plurals & Exceptions — Parlami" },
      { property: "og:description", content: "libro → libri, città → città, braccio → braccia. Understand why, then practise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PluralsPage,
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

const art = (a: string, w: string) => (a.endsWith("'") ? a + w : `${a} ${w}`);

/** Shows ending highlighted, compared with the singular. */
function Ending({ word, base }: { word: string; base: string }) {
  let i = 0;
  while (i < word.length && i < base.length && word[i] === base[i]) i++;
  return <><span>{word.slice(0, i)}</span><span className="font-bold text-primary">{word.slice(i)}</span></>;
}

function WordRow({ n }: { n: Noun }) {
  const pl = art(n.article[1], n.pl);
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border/70 py-3 last:border-0">
      <span className="w-40 text-[18px] text-muted-foreground">{art(n.article[0], n.sg)}</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="w-44 text-[19px] font-semibold text-foreground">
        {n.article[1]}{n.article[1].endsWith("'") ? "" : " "}<Ending word={n.pl} base={n.sg} />
      </span>
      <span className="text-sm text-muted-foreground">{n.enPl}</span>
      <button type="button" onClick={() => speak(`${art(n.article[0], n.sg)}. ${pl}`)} aria-label={`Listen to ${pl}`}
        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-primary hover:bg-accent">
        <Volume2 className="h-4 w-4" />
      </button>
      {n.note && <p className="basis-full text-sm italic text-muted-foreground">{n.note}</p>}
    </li>
  );
}

function Section({ kicker, title, children }: { kicker?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      {kicker && <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">{kicker}</p>}
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {children}
    </section>
  );
}

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 max-w-2xl text-[18px] leading-relaxed text-muted-foreground">{children}</p>
);

const TABS = ["The vowel switch", "Sound keepers", "The rebels", "Practise"];

function PluralsPage() {
  const [step, setStep] = useState(0);
  return (
    <div className="max-w-3xl">
      <PageHeader title="Plurals" description="English adds an -s. Italian changes the last vowel — and once you hear the pattern, you'll do it without thinking." />
      <div role="tablist" aria-label="Lesson steps" className="mb-8 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step === 0 && <Switches />}
      {step === 1 && <Sounds />}
      {step === 2 && <Rebels />}
      {step === 3 && <Quiz />}
      {step < 3 && (
        <div className="mt-2 flex justify-end">
          <button className={btn.primary} onClick={() => { setStep(step + 1); window.scrollTo({ top: 0 }); }}>Next: {TABS[step + 1]} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

function Switches() {
  return (
    <>
      <Lead>
        Italian words almost always end in a vowel. To make a plural, you <strong className="text-foreground">swap that last vowel</strong>. There are only three swaps to know — and the little word in front (<strong className="text-foreground">il, la</strong>) changes too.
      </Lead>
      {SWITCHES.map((s) => (
        <Section key={s.from} kicker={s.who} title={`-${s.from}  →  -${s.to}`}>
          <p className="mb-2 text-[17px] text-foreground">{s.line}</p>
          <ul>{s.words.map((n) => <WordRow key={n.sg} n={n} />)}</ul>
        </Section>
      ))}
      <p className="mb-10 border-l-4 border-primary pl-4 text-[17px] leading-relaxed text-foreground">
        <strong>Why it matters:</strong> in a café you'll hear <em>"due caffè"</em>, at the market <em>"tre pizze"</em>. The ending tells the listener "more than one" before they even see the number.
      </p>
    </>
  );
}

function Sounds() {
  return (
    <>
      <Lead>
        Italian is written exactly as it sounds. So when a vowel change would <strong className="text-foreground">change the sound</strong>, the spelling adjusts to protect it. Say each pair out loud — your ear will remember better than your eyes.
      </Lead>
      {SOUND_RULES.map((r) => (
        <Section key={r.title} title={r.title}>
          <p className="mb-2 text-[17px] leading-relaxed text-foreground">{r.why}</p>
          <ul>{r.words.map((n) => <WordRow key={n.sg} n={n} />)}</ul>
        </Section>
      ))}
    </>
  );
}

function Rebels() {
  return (
    <>
      <Lead>
        A few words don't play the vowel game. They look scary, but they fall into <strong className="text-foreground">four small families</strong> — spot the family and you know the plural.
      </Lead>
      {REBELS.map((r, i) => (
        <Section key={r.title} kicker={`Rebel family ${i + 1}`} title={r.title}>
          <p className="mb-2 text-[17px] text-foreground">{r.line}</p>
          {r.groups.map((g) => (
            <div key={g.label} className="mt-3">
              <p className="text-sm font-semibold text-muted-foreground">{g.label}</p>
              <ul>{g.words.map((n) => <WordRow key={n.sg} n={n} />)}</ul>
            </div>
          ))}
        </Section>
      ))}
      <p className="mb-10 border-l-4 border-primary pl-4 text-[17px] leading-relaxed text-foreground">
        <strong>Quick check:</strong> if a word ends with an accent, a consonant, or is a shortened word — leave it alone and just change the article.
      </p>
    </>
  );
}

function Quiz() {
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const done = i >= PLURAL_TASKS.length;
  const t = PLURAL_TASKS[i];

  const reset = () => { setI(0); setInput(""); setResult(null); setScore(0); };
  if (done) {
    return (
      <div className="py-8 text-center">
        <p className="text-4xl font-bold text-foreground">{score} / {PLURAL_TASKS.length}</p>
        <p className="mt-2 text-muted-foreground">{score === PLURAL_TASKS.length ? "Perfetto! Every plural right." : "Go back to any step to review, then try again."}</p>
        <button className={`${btn.outline} mt-6`} onClick={reset}><RotateCcw className="h-4 w-4" /> Try again</button>
      </div>
    );
  }
  const check = () => {
    if (!input.trim() || !t) return;
    const ok = isCorrectPlural(t, input);
    setResult(ok);
    if (ok) setScore((s) => s + 1);
    speak(t.answer);
  };
  const next = () => { setI(i + 1); setInput(""); setResult(null); };
  if (!t) return null;
  return (
    <div>
      <ProgressBar value={(i / PLURAL_TASKS.length) * 100} label={`Question ${i + 1} of ${PLURAL_TASKS.length}`} />
      <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-primary">Make it plural</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{t.sg}</p>
      <p className="text-muted-foreground">{t.en}</p>
      <form onSubmit={(e) => { e.preventDefault(); if (result === null) check(); else next(); }} className="mt-6">
        <label htmlFor="pl" className="sr-only">Plural with article</label>
        <input id="pl" value={input} onChange={(e) => setInput(e.target.value)} disabled={result !== null} autoComplete="off" autoFocus
          placeholder="Type the plural, e.g. i libri" className="h-14 w-full rounded-2xl border bg-card px-4 text-[18px] text-foreground outline-none focus:ring-2 focus:ring-ring" />
        <div className="mt-2 flex gap-2">
          {["à", "è", "é", "ì", "ò", "ù"].map((c) => (
            <button key={c} type="button" disabled={result !== null} onClick={() => setInput((v) => v + c)}
              className="h-10 w-10 rounded-xl border bg-card text-foreground hover:bg-accent" aria-label={`Insert ${c}`}>{c}</button>
          ))}
        </div>
        {result !== null && (
          <div className="mt-6 flex gap-3" role="status">
            {result ? <Check className="mt-1 h-5 w-5 text-primary" /> : <X className="mt-1 h-5 w-5 text-destructive" />}
            <div>
              <p className="font-bold text-foreground">{result ? "Correct!" : `Not quite — you wrote "${input}".`} The answer is <span className="text-primary">{t.answer}</span>.</p>
              <p className="mt-1 text-muted-foreground">{t.why}</p>
            </div>
          </div>
        )}
        <div className="mt-6">
          <button type="submit" className={btn.primary} disabled={result === null && !input.trim()}>
            {result === null ? "Check answer" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
