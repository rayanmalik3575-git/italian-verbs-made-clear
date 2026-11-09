import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowLeft, Check, RotateCcw, Volume2, X, BookOpen, IceCream, Baby, Coffee, PenLine, UtensilsCrossed,
  Droplets, Users, Palette, Backpack, GraduationCap, Brain, AlertTriangle, Wind, Mars, Venus,
} from "lucide-react";
import { PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";
import { DECK, STRONG_SOUNDS, articleFor, isCorrectPluralPhrase, reasonFor, withArticle, type Gender, type Opening } from "@/data/articles";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Italian Definite Articles: il, lo, la, i, gli, le — Parlami" },
      { name: "description", content: "Learn the seven ways to say 'the' in Italian, and the sound logic that decides each one." },
      { property: "og:title", content: "Italian Definite Articles — Parlami" },
      { property: "og:description", content: "il, lo, l', la, i, gli, le — not seven rules, one idea: keep Italian easy to say." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArticlesPage,
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

type Icon = React.ComponentType<{ className?: string }>;

function Art({ a }: { a: string }) {
  return <span className="font-bold text-primary">{a}</span>;
}

/** "il libro" with the article coloured. */
function Phrase({ text, big }: { text: string; big?: boolean }) {
  const m = text.match(/^(l'|\S+\s)(.*)$/);
  const a = m?.[1] ?? "";
  const rest = m?.[2] ?? text;
  return (
    <span className={big ? "text-xl font-semibold" : "font-semibold"}>
      <Art a={a} />{rest}
    </span>
  );
}

function WordRow({ icon: I, sg, pl, en, tone }: { icon: Icon; sg: string; pl: string; en: string; tone: string }) {
  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><I className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 text-[17px]">
          <Phrase text={sg} /><ArrowRight className="h-4 w-4 text-muted-foreground" /><Phrase text={pl} />
        </div>
        <div className="text-sm text-muted-foreground">{en}</div>
      </div>
      <Listen text={`${sg}, ${pl}`} />
    </div>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 max-w-3xl text-[17px] leading-relaxed text-foreground">{children}</p>;
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-xl font-bold text-foreground">{children}</h2>;
}

const TABS = ["The core four", "The two fixers", "Gli & the full map", "Practise"];

function ArticlesPage() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <PageHeader title="Definite articles: saying “the”"
        description="English has one word. Italian has seven — but they all come from one simple idea: the article must match the word, and it must be easy to say." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step === 0 && <CoreFour />}
      {step === 1 && <Fixers />}
      {step === 2 && <FullMap />}
      {step === 3 && <Practice />}
      <div className="mt-8 flex justify-between gap-3">
        {step > 0 ? <button className={btn.outline} onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
        {step < 3 && <button className={btn.primary} onClick={() => setStep(step + 1)}>Next: {TABS[step + 1]} <ArrowRight className="h-4 w-4" /></button>}
      </div>
    </div>
  );
}

function CoreFour() {
  return (
    <div>
      <Lead>
        You already know <strong>un, una</strong> — they mean “a”, any one. Now we want “<em>the</em>”: <strong>this specific one</strong>.
        Every Italian noun is masculine or feminine, singular or plural. Four boxes, so start with four articles.
      </Lead>

      <Panel className="mb-6 overflow-hidden p-0">
        <div className="grid grid-cols-3 text-center">
          <div className="border-b border-r p-3" />
          <div className="flex items-center justify-center gap-1 border-b border-r p-3 text-sm font-semibold text-muted-foreground"><Mars className="h-4 w-4 text-primary" /> Masculine</div>
          <div className="flex items-center justify-center gap-1 border-b p-3 text-sm font-semibold text-muted-foreground"><Venus className="h-4 w-4 text-pink" /> Feminine</div>
          <div className="border-b border-r p-4 text-left text-sm font-semibold text-muted-foreground">One</div>
          <div className="border-b border-r p-4"><div className="text-3xl font-bold text-primary">il</div><div className="text-sm text-muted-foreground">il libro</div></div>
          <div className="border-b p-4"><div className="text-3xl font-bold text-primary">la</div><div className="text-sm text-muted-foreground">la penna</div></div>
          <div className="border-r p-4 text-left text-sm font-semibold text-muted-foreground">Many</div>
          <div className="border-r p-4"><div className="text-3xl font-bold text-primary">i</div><div className="text-sm text-muted-foreground">i libri</div></div>
          <div className="p-4"><div className="text-3xl font-bold text-primary">le</div><div className="text-sm text-muted-foreground">le penne</div></div>
        </div>
      </Panel>

      <H>A memory trick hidden in the letters</H>
      <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">
        Look at the last letter of three of them: <strong className="text-foreground">la</strong> ends in <strong className="text-foreground">-a</strong> like <em>penna</em>,
        <strong className="text-foreground"> le</strong> ends in <strong className="text-foreground">-e</strong> like <em>penne</em>,
        and <strong className="text-foreground">i</strong> is the <strong className="text-foreground">-i</strong> of <em>libri</em>. The article echoes the ending you already learned in Plurals.
        Only <strong className="text-foreground">il</strong> breaks the pattern — and it's the one you'll hear most, so it sticks anyway.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary"><Mars className="h-4 w-4" /> il → i</div>
          <WordRow icon={BookOpen} sg="il libro" pl="i libri" en="the book → the books" tone="bg-tile-blue text-primary" />
          <WordRow icon={IceCream} sg="il gelato" pl="i gelati" en="the ice cream → the ice creams" tone="bg-tile-blue text-primary" />
          <WordRow icon={Baby} sg="il bambino" pl="i bambini" en="the child → the children" tone="bg-tile-blue text-primary" />
          <WordRow icon={Coffee} sg="il caffè" pl="i caffè" en="the coffee → the coffees (accented: word stays)" tone="bg-tile-blue text-primary" />
        </Panel>
        <Panel>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-pink"><Venus className="h-4 w-4" /> la → le</div>
          <WordRow icon={PenLine} sg="la penna" pl="le penne" en="the pen → the pens" tone="bg-tile-pink text-pink" />
          <WordRow icon={Coffee} sg="la tazza" pl="le tazze" en="the mug → the mugs" tone="bg-tile-pink text-pink" />
          <WordRow icon={UtensilsCrossed} sg="la forchetta" pl="le forchette" en="the fork → the forks" tone="bg-tile-pink text-pink" />
          <WordRow icon={Users} sg="la ragazza" pl="le ragazze" en="the girl → the girls" tone="bg-tile-pink text-pink" />
        </Panel>
      </div>
    </div>
  );
}

function Fixers() {
  return (
    <div>
      <Lead>
        The four articles work for most words. But some words start in a way that makes <strong>il</strong> or <strong>la</strong> awkward to say.
        Italian doesn't tolerate awkward — so it has two small repairs. Don't learn them as rules. Learn them as <strong>what your mouth would do anyway</strong>.
      </Lead>

      <section className="mb-10">
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tile-green text-3xl font-bold text-success">l'</span>
          <H>Fixer 1 — when two vowels collide</H>
        </div>
        <p className="mb-4 max-w-3xl leading-relaxed text-muted-foreground">
          Say <em>la acqua</em> out loud, quickly. The two a's smear into one — you're already saying <strong className="text-foreground">l'acqua</strong>.
          Italian simply writes what you hear: the vowel of the article drops and an apostrophe marks the gap. It works for <strong className="text-foreground">both genders</strong>.
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-lg">
          <span className="rounded-xl border bg-muted px-3 py-2 text-muted-foreground line-through">la acqua</span>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <span className="rounded-xl border border-success/40 bg-tile-green px-3 py-2 font-semibold"><Art a="l'" />acqua</span>
          <span className="ml-4 rounded-xl border bg-muted px-3 py-2 text-muted-foreground line-through">lo amico</span>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <span className="rounded-xl border border-success/40 bg-tile-green px-3 py-2 font-semibold"><Art a="l'" />amico</span>
        </div>
        <Panel>
          <WordRow icon={Droplets} sg="l'acqua" pl="le acque" en="feminine: plural goes back to le" tone="bg-tile-pink text-pink" />
          <WordRow icon={Users} sg="l'amico" pl="gli amici" en="masculine: plural becomes gli (step 3)" tone="bg-tile-blue text-primary" />
          <WordRow icon={Palette} sg="l'arte" pl="le arti" en="the art → the arts" tone="bg-tile-pink text-pink" />
        </Panel>
        <p className="mt-3 text-sm text-muted-foreground">Notice the hidden detail: in the plural, <em>le acque</em> keeps its full article. The apostrophe is a singular-only habit with <em>le</em>.</p>
      </section>

      <section className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tile-amber text-2xl font-bold text-warning">lo</span>
          <H>Fixer 2 — when consonants pile up</H>
        </div>
        <p className="mb-4 max-w-3xl leading-relaxed text-muted-foreground">
          Italian loves the rhythm <strong className="text-foreground">consonant–vowel, consonant–vowel</strong> (<em>ba-na-na</em>, <em>pa-ni-no</em>). Now try
          <em> il straniero</em>: that's <strong className="text-foreground">l-s-t-r</strong>, four consonants with no vowel to rest on. Swap <em>il</em> for <strong className="text-foreground">lo</strong> and
          you get a vowel cushion: <em>lo-stra-nie-ro</em>. That's the whole reason. Masculine words only.
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-lg">
          <span className="rounded-xl border bg-muted px-3 py-2 text-muted-foreground line-through">il straniero</span>
          <Wind className="h-5 w-5 text-muted-foreground" />
          <span className="rounded-xl border border-warning/40 bg-tile-amber px-3 py-2 font-semibold"><Art a="lo " />straniero</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STRONG_SOUNDS.map((s) => (
            <Panel key={s.cluster} className="p-4">
              <div className="text-sm font-bold uppercase tracking-wide text-warning">{s.cluster}</div>
              <div className="mt-2 flex items-center justify-between gap-2"><Phrase text={`lo ${s.word}`} /><Listen text={`lo ${s.word}`} /></div>
              <div className="text-sm text-muted-foreground">{s.en} · {s.note}</div>
            </Panel>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Shortcut: if a word takes <strong className="text-foreground">uno</strong> (“a”), it takes <strong className="text-foreground">lo</strong> (“the”). <em>uno zaino → lo zaino</em>.</p>
      </section>

      <div className="flex gap-3 rounded-2xl border border-warning/40 bg-tile-amber p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
        <div className="leading-relaxed text-foreground">
          <strong>The trap almost every learner falls into:</strong> seeing a <em>z</em> or <em>s+consonant</em> and reaching for <em>lo</em> on a feminine word.
          Gender comes first, sound second. <strong>la zanzara, la strada, la storia</strong> — feminine words never use <em>lo</em> or <em>gli</em>.
        </div>
      </div>
    </div>
  );
}

const OPENINGS: { id: Opening; label: string; ex: Record<Gender, string> }[] = [
  { id: "consonant", label: "a normal consonant", ex: { m: "libro", f: "penna" } },
  { id: "vowel", label: "a vowel", ex: { m: "amico", f: "acqua" } },
  { id: "strong", label: "s+consonant, z, gn, ps, x, y", ex: { m: "zaino", f: "zanzara" } },
];

function FullMap() {
  const [g, setG] = useState<Gender>("m");
  const [o, setO] = useState<Opening>("consonant");
  const word = OPENINGS.find((x) => x.id === o)!.ex[g];
  return (
    <div>
      <Lead>
        Both fixers were masculine-friendly, and they share one plural: <strong>gli</strong>. Think of it as the plural of the “special” masculine words.
        <em> l'amico → gli amici</em>, <em>lo zaino → gli zaini</em>. Everyone else stays with <strong>i</strong>.
      </Lead>
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border bg-card p-5">
        <span className="text-4xl font-bold text-primary">gli</span>
        <div className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">How to say it:</strong> not “g-lee”. The <em>g</em> is silent; <em>gli</em> sounds close to the middle of “mi<strong className="text-foreground">lli</strong>on”, with the tongue pressed flat on the roof of the mouth.
        </div>
        <Listen text="gli amici, gli zaini, gli stranieri" />
      </div>

      <H>Find the article in two questions</H>
      <p className="mb-4 text-muted-foreground">This is the order a native brain works in. Pick the answers and watch the result.</p>
      <Panel className="mb-8">
        <div className="mb-4">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">1. Is the word masculine or feminine?</div>
          <div className="flex flex-wrap gap-2">
            {(["m", "f"] as Gender[]).map((x) => (
              <button key={x} onClick={() => setG(x)} aria-pressed={g === x}
                className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${g === x ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                {x === "m" ? "Masculine" : "Feminine"}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">2. What does it start with?</div>
          <div className="flex flex-wrap gap-2">
            {OPENINGS.map((x) => (
              <button key={x.id} onClick={() => setO(x.id)} aria-pressed={o === x.id}
                className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${o === x.id ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-tile-blue p-4"><div className="text-sm text-muted-foreground">One</div><Phrase big text={withArticle(word, g)} /></div>
          <div className="rounded-2xl bg-tile-pink p-4"><div className="text-sm text-muted-foreground">Many</div>
            <Phrase big text={`${articleFor(word, g, true)} ${DECK.find((d) => d.it === word)?.pl ?? { libro: "libri", penna: "penne", acqua: "acque" }[word] ?? word}`} /></div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{reasonFor(word, g)}</p>
      </Panel>

      <H>The complete map</H>
      <Panel className="overflow-x-auto p-0">
        <table className="w-full text-left text-[15px]">
          <thead><tr className="border-b text-sm text-muted-foreground"><th className="p-3">Word type</th><th className="p-3">One</th><th className="p-3">Many</th></tr></thead>
          <tbody>
            {[
              ["Masculine, normal consonant", "il libro", "i libri"],
              ["Masculine, vowel", "l'amico", "gli amici"],
              ["Masculine, heavy sound", "lo zaino", "gli zaini"],
              ["Feminine, consonant (any)", "la zanzara", "le zanzare"],
              ["Feminine, vowel", "l'arancia", "le arance"],
            ].map(([t = "", s = "", p = ""]) => (
              <tr key={t} className="border-b last:border-0"><td className="p-3 text-muted-foreground">{t}</td><td className="p-3"><Phrase text={s} /></td><td className="p-3"><Phrase text={p} /></td></tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Teacher's advice:</strong> never learn a noun alone. Learn <em>lo zaino</em>, not <em>zaino</em>. The article carries the gender for you, and after a few weeks the wrong one will simply sound wrong.
      </p>
    </div>
  );
}

function shuffle<T>(a: T[]) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = b[i] as T; b[i] = b[j] as T; b[j] = t; }
  return b;
}

const SG_CHOICES = ["il", "lo", "l'", "la"];

function Practice() {
  const [round, setRound] = useState(0);
  const deck = useMemo(() => shuffle(DECK).slice(0, 10), [round]);
  const [i, setI] = useState(0);
  const [stage, setStage] = useState<"pick" | "plural" | "done">("pick");
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const n = deck[i] ?? DECK[0]!;

  function reset() { setRound(round + 1); setI(0); setStage("pick"); setPicked(null); setTyped(""); setChecked(null); setScore(0); }
  function next() {
    if (i + 1 >= deck.length) { setStage("done"); return; }
    setI(i + 1); setStage("pick"); setPicked(null); setTyped(""); setChecked(null);
  }

  if (stage === "done") {
    return (
      <Panel className="text-center">
        <div className="text-sm text-muted-foreground">Round complete</div>
        <div className="my-2 text-4xl font-bold text-foreground">{score} / {deck.length * 2}</div>
        <p className="mb-4 text-muted-foreground">Each word counted twice: the singular article and the full plural.</p>
        <button className={btn.primary} onClick={reset}><RotateCcw className="h-4 w-4" /> New round</button>
      </Panel>
    );
  }

  const correctSg = articleFor(n.it, n.g);
  const pluralAnswer = `${articleFor(n.it, n.g, true)} ${n.pl}`;

  return (
    <div>
      <Lead>Two moves per word, like in real speech: first choose “the” for one, then say it for many. The words come from home and daily life.</Lead>
      <ProgressBar value={Math.round((i / deck.length) * 100)} label={`Word ${i + 1} of ${deck.length}`} />
      <Panel className="mt-4">
        <div className="mb-1 text-sm text-muted-foreground">{n.g === "m" ? "Masculine" : "Feminine"} · “{n.en}”</div>
        <div className="mb-5 text-3xl font-bold text-foreground">
          {stage === "pick" && !picked ? <><span className="text-muted-foreground">___ </span>{n.it}</> : <Phrase big text={withArticle(n.it, n.g)} />}
        </div>

        {stage === "pick" && (
          <>
            <div className="flex flex-wrap gap-2">
              {SG_CHOICES.map((c) => {
                const state = picked == null ? "" : c === correctSg ? "border-success bg-tile-green" : c === picked ? "border-destructive bg-destructive/10" : "opacity-50";
                return (
                  <button key={c} disabled={picked != null} onClick={() => { setPicked(c); if (c === correctSg) setScore((s) => s + 1); speak(withArticle(n.it, n.g)); }}
                    className={`min-h-12 min-w-16 rounded-xl border bg-card px-4 text-lg font-bold text-foreground ${state}`}>{c}</button>
                );
              })}
            </div>
            {picked && (
              <div className="mt-4">
                <p className={`flex items-start gap-2 ${picked === correctSg ? "text-success" : "text-destructive"}`}>
                  {picked === correctSg ? <Check className="mt-0.5 h-5 w-5" /> : <X className="mt-0.5 h-5 w-5" />}
                  <span className="text-foreground">{reasonFor(n.it, n.g)}</span>
                </p>
                <button className={`${btn.primary} mt-4`} onClick={() => setStage("plural")}>Now make it plural <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}
          </>
        )}

        {stage === "plural" && (
          <form onSubmit={(e) => { e.preventDefault(); if (checked != null) { next(); return; } const ok = isCorrectPluralPhrase(n, typed); setChecked(ok); if (ok) setScore((s) => s + 1); speak(pluralAnswer); }}>
            <label className="mb-2 block text-sm font-semibold text-muted-foreground" htmlFor="pl">Type “the {n.en}s” — article and word</label>
            <input id="pl" autoFocus autoComplete="off" value={typed} disabled={checked != null} onChange={(e) => setTyped(e.target.value)}
              className="h-12 w-full max-w-md rounded-xl border bg-card px-4 text-lg text-foreground outline-none focus:border-primary" placeholder="e.g. gli zaini" />
            {checked != null && (
              <div className="mt-4">
                <p className={`flex items-start gap-2 ${checked ? "text-success" : "text-destructive"}`}>
                  {checked ? <Check className="mt-0.5 h-5 w-5" /> : <X className="mt-0.5 h-5 w-5" />}
                  <span className="text-foreground"><Phrase text={pluralAnswer} /> — {reasonFor(n.it, n.g, true)}</span>
                </p>
              </div>
            )}
            <button type="submit" className={`${btn.primary} mt-4`} disabled={checked == null && !typed.trim()}>
              {checked == null ? "Check" : i + 1 >= deck.length ? "See result" : "Next word"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </Panel>
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Backpack className="h-4 w-4" /> Watch for heavy sounds</span>
        <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Gender decides first</span>
        <span className="flex items-center gap-1"><Brain className="h-4 w-4" /> Say it aloud before you answer</span>
      </div>
    </div>
  );
}
