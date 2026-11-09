import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight, Check, Ear, Lightbulb, PenLine, Repeat, RotateCcw, Sparkles, Volume2, Wand2, X } from "lucide-react";
import { PageHeader, ProgressBar, btn } from "@/components/app-shell";
import { SWITCHES, SOUND_RULES, REBELS, PLURAL_TASKS, isCorrectPlural, explainPlural, mistakeHint, type Noun } from "@/data/plurals";

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

type Tone = "blue" | "pink" | "lavender" | "green" | "amber";
const TONE: Record<Tone, string> = {
  blue: "bg-tile-blue text-tile-blue-ink",
  pink: "bg-tile-pink text-tile-pink-ink",
  lavender: "bg-tile-lavender text-tile-lavender-ink",
  green: "bg-tile-green text-tile-green-ink",
  amber: "bg-tile-amber text-tile-amber-ink",
};

function split(word: string, base: string) {
  let i = 0;
  while (i < word.length && i < base.length && word[i] === base[i]) i++;
  if (word === base) return [word, ""];
  return [word.slice(0, i), word.slice(i)];
}

/** Visual singular → plural card with the changed letters highlighted. */
function WordCard({ n, tone }: { n: Noun; tone: Tone }) {
  const [stemS, endS] = split(n.sg, n.pl);
  const [stemP, endP] = split(n.pl, n.sg);
  const sp = (a: string) => (a.endsWith("'") ? "" : " ");
  return (
    <button type="button" onClick={() => speak(`${art(n.article[0], n.sg)}. ${art(n.article[1], n.pl)}`)}
      className="group flex flex-col rounded-2xl border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>One</span><Volume2 className="h-4 w-4 text-primary opacity-60 group-hover:opacity-100" />
      </div>
      <p className="mt-1 text-lg text-foreground">
        <span className="text-muted-foreground">{n.article[0]}{sp(n.article[0])}</span>{stemS}<span className="font-bold text-muted-foreground">{endS}</span>
      </p>
      <p className="text-xs text-muted-foreground">{n.en}</p>
      <div className="my-2 flex items-center gap-2"><span className="h-px flex-1 bg-border" /><ArrowDown className="h-4 w-4 text-primary" /><span className="h-px flex-1 bg-border" /></div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Many</p>
      <p className="mt-1 text-xl font-semibold text-foreground">
        <span className="text-primary">{n.article[1]}</span>{sp(n.article[1])}{stemP}
        {endP ? <span className={`rounded px-px font-bold ${TONE[tone]}`}>{endP}</span> : <span className={`ml-2 rounded-md px-1.5 py-0.5 align-middle text-xs font-bold ${TONE[tone]}`}>no change</span>}
      </p>
      <p className="text-xs text-muted-foreground">{n.enPl}</p>
      {n.note && <p className="mt-3 border-t pt-2 text-xs leading-relaxed text-muted-foreground">{n.note}</p>}
    </button>
  );
}

function Formula({ from, to, tone }: { from: string; to: string; tone: Tone }) {
  return (
    <div className="flex items-center gap-2 text-2xl font-bold">
      <span className="rounded-xl border bg-card px-3 py-1 text-muted-foreground">{from}</span>
      <ArrowRight className="h-5 w-5 text-muted-foreground" />
      <span className={`rounded-xl px-3 py-1 ${TONE[tone]}`}>{to}</span>
    </div>
  );
}

function Block({ step, title, formula, tone, text, words, children }: {
  step?: string; title: string; formula?: [string, string]; tone: Tone; text: string; words?: readonly Noun[]; children?: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-3xl border bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {step && <p className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${TONE[tone]}`}>{step}</p>}
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
        </div>
        {formula && <Formula from={formula[0]} to={formula[1]} tone={tone} />}
      </div>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">{text}</p>
      {children}
      {words && <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{words.map((n) => <WordCard key={n.sg} n={n} tone={tone} />)}</div>}
    </section>
  );
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex gap-3 rounded-2xl bg-tile-amber p-4 text-tile-amber-ink">
      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-[15px] leading-relaxed"><strong>{title}</strong> {children}</p>
    </div>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 max-w-2xl text-[17px] leading-relaxed text-foreground">{children}</p>;
}

const TABS = [
  { t: "The vowel switch", icon: Repeat },
  { t: "Sound keepers", icon: Ear },
  { t: "The rebels", icon: Sparkles },
  { t: "Practise", icon: PenLine },
];

function PluralsPage() {
  const [step, setStep] = useState(0);
  const go = (n: number) => { setStep(n); window.scrollTo({ top: 0 }); };
  return (
    <div className="max-w-5xl">
      <PageHeader title="Plurals" description="How to talk about more than one thing in Italian, and why the words change the way they do." />
      <div role="tablist" aria-label="Lesson steps" className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TABS.map(({ t, icon: Icon }, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => go(i)}
            className={`flex min-h-14 items-center gap-3 rounded-2xl border px-3 text-left text-sm font-semibold transition ${step === i ? "border-primary bg-primary text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${step === i ? "bg-primary-foreground/20" : "bg-tile-blue text-tile-blue-ink"}`}><Icon className="h-4 w-4" /></span>
            <span><span className="block text-xs opacity-75">Step {i + 1}</span>{t}</span>
          </button>
        ))}
      </div>
      {step === 0 && <Switches />}
      {step === 1 && <Sounds />}
      {step === 2 && <Rebels />}
      {step === 3 && <Quiz />}
      {step < 3 && (
        <div className="mt-2 flex justify-between">
          {step > 0 ? <button className={btn.outline} onClick={() => go(step - 1)}>Back</button> : <span />}
          <button className={btn.primary} onClick={() => go(step + 1)}>Next: {TABS[step + 1]?.t} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

const SWITCH_TONE: Tone[] = ["blue", "pink", "lavender"];

function Switches() {
  return (
    <>
      <Intro>
        English adds an <strong>-s</strong>: one book, two books. Italian doesn't. Almost every Italian noun ends in a vowel, and to make it plural you <strong className="text-primary">swap that last vowel for another one</strong>. There are just three swaps to learn.
      </Intro>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {SWITCHES.map((s, i) => (
          <div key={s.from} className={`rounded-2xl p-4 ${TONE[(SWITCH_TONE[i] ?? "blue")]}`}>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{s.who}</p>
            <p className="mt-1 text-3xl font-bold">-{s.from} → -{s.to}</p>
            <p className="mt-1 text-sm">{art(s.words[0]!.article[0], s.words[0]!.sg)} → {art(s.words[0]!.article[1], s.words[0]!.pl)}</p>
          </div>
        ))}
      </div>
      {SWITCHES.map((s, i) => (
        <Block key={s.from} step={`Pattern ${i + 1} · ${s.who}`} title={`Words ending in -${s.from}`} formula={[`-${s.from}`, `-${s.to}`]} tone={(SWITCH_TONE[i] ?? "blue")} text={s.line} words={s.words} />
      ))}
      <Tip title="Tip:">Learn every noun with its article — <em>il libro</em>, <em>la casa</em>. The article tells you the gender, and the gender tells you the plural. Tap any card to hear both forms.</Tip>
    </>
  );
}

function Sounds() {
  return (
    <>
      <Intro>
        Italian is written the way it sounds. Sometimes, swapping the vowel would <strong className="text-primary">change the sound</strong> of the letter before it. So the spelling adjusts slightly to keep the word sounding the same.
      </Intro>
      <section className="mb-6 rounded-3xl border bg-card p-5 sm:p-7">
        <h2 className="text-xl font-bold text-foreground">The key to this step: how C and G sound</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-tile-green p-4 text-tile-green-ink">
            <p className="text-xs font-bold uppercase tracking-wider">Hard sound (K / G as in “go”)</p>
            <p className="mt-2 text-2xl font-bold">ca · co · cu · <span className="underline decoration-2">chi · che</span></p>
          </div>
          <div className="rounded-2xl bg-tile-pink p-4 text-tile-pink-ink">
            <p className="text-xs font-bold uppercase tracking-wider">Soft sound (CH as in “cheese”)</p>
            <p className="mt-2 text-2xl font-bold">ci · ce</p>
          </div>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">So the silent <strong className="text-foreground">h</strong> is a shield: it keeps C and G hard in front of e and i.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[["amiche", "with h — hard"], ["amice", "without h — wrong sound"]].map(([w, l]) => (
            <button key={w} onClick={() => speak(w)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-accent">
              <Volume2 className="h-4 w-4 text-primary" /><strong>{w}</strong><span className="text-muted-foreground">{l}</span>
            </button>
          ))}
        </div>
      </section>
      {SOUND_RULES.map((r, i) => (
        <Block key={r.title} step={`Rule ${i + 1}`} title={r.title} tone={((["green", "amber", "lavender"] as Tone[])[i] ?? "green")} text={r.why} words={r.words} />
      ))}
    </>
  );
}

const REBEL_TONE: Tone[] = ["blue", "lavender", "pink", "amber"];

function Rebels() {
  return (
    <>
      <Intro>
        Some words break the three swaps — but not randomly. They fall into <strong className="text-primary">four small families</strong>, each with a reason. Spot the family and you know the plural.
      </Intro>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {REBELS.map((r, i) => (
          <div key={r.title} className={`rounded-2xl p-4 ${TONE[(REBEL_TONE[i] ?? "blue")]}`}>
            <p className="text-xs font-bold opacity-80">Family {i + 1}</p>
            <p className="mt-1 font-bold leading-snug">{r.title}</p>
            <p className="mt-2 text-sm">{art(r.groups[0]!.words[0]!.article[0], r.groups[0]!.words[0]!.sg)} → {art(r.groups[0]!.words[0]!.article[1], r.groups[0]!.words[0]!.pl)}</p>
          </div>
        ))}
      </div>
      {REBELS.map((r, i) => (
        <Block key={r.title} step={`Family ${i + 1}`} title={r.title} tone={(REBEL_TONE[i] ?? "blue")} text={r.line}>
          {r.groups.map((g) => (
            <div key={g.label} className="mt-5">
              <p className="mb-2 text-sm font-semibold text-foreground">{g.label}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{g.words.map((n) => <WordCard key={n.sg} n={n} tone={(REBEL_TONE[i] ?? "blue")} />)}</div>
            </div>
          ))}
        </Block>
      ))}
      <Tip title="Quick check for any new word:">Accented ending, a consonant, or a short form of a longer word? It won't change. Otherwise, use the three swaps from step 1.</Tip>
    </>
  );
}

function PluralMaker() {
  const [w, setW] = useState("");
  const r = w.trim() ? explainPlural(w) : null;
  return (
    <section className="mt-10 rounded-3xl border bg-gradient-feature p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-tile-blue text-tile-blue-ink"><Wand2 className="h-5 w-5" /></span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Plural maker</h2>
          <p className="text-sm text-muted-foreground">Type any Italian noun to see its plural and the rule behind it.</p>
        </div>
      </div>
      <input value={w} onChange={(e) => setW(e.target.value)} placeholder="e.g. il lago, la camicia, il sistema" aria-label="Italian noun"
        className="mt-4 h-12 w-full rounded-2xl border bg-card px-4 text-[17px] text-foreground outline-none focus:ring-2 focus:ring-ring" />
      {w.trim() && (r ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-lg text-muted-foreground">{r.sg}</span><ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold text-primary">{r.pl}</span>
          <button onClick={() => speak(`${r.sg}. ${r.pl}`)} aria-label="Listen" className="grid h-9 w-9 place-items-center rounded-xl text-primary hover:bg-accent"><Volume2 className="h-4 w-4" /></button>
          <p className="basis-full text-sm text-muted-foreground">{r.reason} <span className="italic">Rare words may have their own exceptions.</span></p>
        </div>
      ) : <p className="mt-3 text-sm text-muted-foreground">Type a single Italian noun, letters only.</p>)}
    </section>
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
      <div className="rounded-3xl border bg-card py-10 text-center">
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
  const hint = result === false ? mistakeHint(t, input) : null;
  return (
    <div>
    <div className="rounded-3xl border bg-card p-5 sm:p-8">
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
          <div className={`mt-6 flex gap-3 rounded-2xl p-4 ${result ? "bg-tile-green" : "bg-tile-pink"}`} role="status">
            {result ? <Check className="mt-1 h-5 w-5 text-primary" /> : <X className="mt-1 h-5 w-5 text-destructive" />}
            <div>
              <p className="font-bold text-foreground">{result ? "Correct!" : `Not quite — you wrote "${input}".`} The answer is <span className="text-primary">{t.answer}</span>.</p>
              {hint && <p className="mt-1 font-medium text-foreground">{hint}</p>}
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
    <PluralMaker />
    </div>
  );
}
