import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X, AlertTriangle, Volume2, Search, ArrowRight, RotateCcw, Info, Lightbulb, Key, Coffee, Luggage, Smartphone, Utensils, TrainFront, Home, BookOpen, Music, ShoppingBag, Heart, Sun, Car, Mail, Users, Clock, Briefcase, PartyPopper, MapPin, DoorOpen, Zap } from "lucide-react";
import { PRONOUNS, VERBS, LEVEL, RANK, type Verb, type Level } from "@/data/verbs";
import { familyOf, isIrregular, isIsc, patternLabel, type Family } from "@/lib/verb-meta";
import { grade, type Grade } from "@/lib/grading";
import { contextFor, fill } from "@/data/verb-sentences";
import { momentsFor, trapTip, type MomentIcon } from "@/data/verb-moments";

const ENDING_CLUE = [
  "Ends in -o (or -go/-sco) → it's me, I.",
  "Ends in -i → it's you (one friend).",
  "Ends in -a or -e → he, she, or polite you.",
  "Ends in -iamo → it's always WE, in every verb.",
  "Ends in -te → you all.",
  "Ends in -no → they.",
];
import { blueprintOf, chunksFor, roundsFor, fillBlank, EAR, continuousOf, spellingNote, hardSoundTip } from "@/data/verb-reflex";
import { recordAttempt, useProgress, statusOf, STATUS_LABEL } from "@/lib/progress";
import { Chip, Panel, PageHeader, ProgressBar, btn } from "@/components/app-shell";

type Mode = "learn" | "practice";
export const Route = createFileRoute("/verbs")({
  validateSearch: (s: Record<string, unknown>): { verb?: string | undefined; mode?: Mode | undefined } => ({
    verb: typeof s["verb"] === "string" ? s["verb"] : undefined,
    mode: s["mode"] === "practice" ? "practice" : s["mode"] === "learn" ? "learn" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Italian Verbs: -are, -ere, -ire (A1–A2) — Parlami" },
      { name: "description", content: "Choose an Italian verb, see every present-tense form with English meaning, then practise." },
      { property: "og:title", content: "Italian Verbs All-in-One — Parlami" },
      { property: "og:description", content: "Every A1–A2 verb form explained in English, with focused practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerbsPage,
});

let itVoice: SpeechSynthesisVoice | undefined;
function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  itVoice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("it"));
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  pickVoice();
  window.speechSynthesis.addEventListener?.("voiceschanged", pickVoice);
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const ss = window.speechSynthesis;
  if (ss.speaking || ss.pending) ss.cancel();
  if (!itVoice) pickVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  if (itVoice) u.voice = itVoice;
  u.rate = 0.8;
  if (text.trim().endsWith("?")) u.pitch = 1.15;
  ss.resume();
  ss.speak(u);
  return true;
}

const FAMILIES: ("all" | Family)[] = ["all", "-are", "-ere", "-ire"];
type Reg = "all" | "regular" | "irregular";

function VerbsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const progress = useProgress();
  const [family, setFamily] = useState<"all" | Family>("all");
  const [reg, setReg] = useState<Reg>("all");
  const [level, setLevel] = useState<"all" | Level>("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const list = VERBS.filter((v) =>
    (family === "all" || familyOf(v) === family) &&
    (reg === "all" || (reg === "irregular") === isIrregular(v)) &&
    (level === "all" || LEVEL[v.infinitive] === level) &&
    (!q || v.infinitive.includes(q) || v.english.toLowerCase().includes(q)));
  const selected = VERBS.find((v) => v.infinitive === search.verb) ?? list[0] ?? VERBS[0]!;
  const mode: Mode = search.mode ?? "learn";
  const select = (verb: string, m: Mode = "learn") => {
    navigate({ search: { verb, mode: m }, replace: true, resetScroll: false });
    if (typeof window !== "undefined" && window.innerWidth < 1024) document.getElementById("lesson")?.scrollIntoView({ behavior: "smooth" });
  };
  const famCount = (f: "all" | Family) => VERBS.filter((v) => f === "all" || familyOf(v) === f).length;

  return (
    <div>
      <PageHeader
        title="Verbs"
        description={<>Pick a verb, see every form with its English meaning, then practise. <span className="font-semibold text-foreground">Tense: Present (presente)</span></>}
      />

      <div className="mb-5 space-y-3 rounded-[20px] border bg-card p-4 shadow-card">
        <FilterRow label="Family">
          {FAMILIES.map((f) => <Chip key={f} active={family === f} onClick={() => setFamily(f)}>{f === "all" ? "All" : f.toUpperCase()} <span className="opacity-75">({famCount(f)})</span></Chip>)}
        </FilterRow>
        <FilterRow label="Type">
          {(["all", "regular", "irregular"] as Reg[]).map((r) => <Chip key={r} active={reg === r} onClick={() => setReg(r)}>{r === "all" ? "All" : r === "regular" ? "Regular" : "Irregular"}</Chip>)}
        </FilterRow>
        <FilterRow label="Level">
          {(["all", "A1", "A2"] as const).map((l) => <Chip key={l} active={level === l} onClick={() => setLevel(l)}>{l === "all" ? "All levels" : l}</Chip>)}
          <span className="text-xs text-muted-foreground">Our curriculum grouping, based on common A1/A2 course lists — not an official CEFR list.</span>
        </FilterRow>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Panel className="h-fit !p-3 lg:sticky lg:top-20">
          <label className="relative block">
            <span className="sr-only">Search verbs</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Italian or English…" className="min-h-11 w-full rounded-xl border border-input bg-card pl-9 pr-3 text-base outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <p className="px-1 pb-1 pt-3 text-xs font-medium text-muted-foreground">{list.length} verbs · most important first</p>
          <ul className="max-h-[50vh] space-y-0.5 overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
            {list.map((v) => {
              const on = selected.infinitive === v.infinitive;
              const st = statusOf(progress[v.infinitive]);
              return (
                <li key={v.infinitive}>
                  <button onClick={() => select(v.infinitive)} aria-current={on ? "true" : undefined}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 py-1.5 text-left transition-colors ${on ? "bg-accent" : "hover:bg-muted"}`}>
                    <span className="w-6 text-right text-xs font-semibold tabular-nums text-muted-foreground">{RANK[v.infinitive]}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate font-semibold ${on ? "text-accent-foreground" : ""}`}>{v.infinitive}</span>
                      <span className="block truncate text-xs text-muted-foreground">{v.english}</span>
                    </span>
                    {st !== "not-started" && <StatusDot status={st} />}
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{LEVEL[v.infinitive]}</span>
                  </button>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="p-4 text-center text-sm text-muted-foreground">
                No verbs match these filters.
                <button className="mt-2 block w-full font-semibold text-accent-foreground underline" onClick={() => { setFamily("all"); setReg("all"); setLevel("all"); setQuery(""); }}>Clear filters</button>
              </li>
            )}
          </ul>
        </Panel>

        <div id="lesson" className="min-w-0 scroll-mt-20">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-3xl font-bold sm:text-4xl">
                  {selected.infinitive}
                  <button onClick={() => speak(selected.infinitive)} aria-label={`Listen to ${selected.infinitive}`} className="grid h-10 w-10 place-items-center rounded-xl border text-muted-foreground hover:bg-muted hover:text-foreground"><Volume2 className="h-5 w-5" /></button>
                </h2>
                <p className="mt-1 text-lg text-muted-foreground">{selected.english}</p>
              </div>
              <div role="tablist" aria-label="Lesson mode" className="flex rounded-xl bg-muted p-1">
                {(["learn", "practice"] as const).map((m) => (
                  <button key={m} role="tab" aria-selected={mode === m} onClick={() => select(selected.infinitive, m)}
                    className={`min-h-10 rounded-lg px-5 text-sm font-semibold ${mode === m ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`}>
                    {m === "learn" ? "Learn" : "Practice"}
                  </button>
                ))}
              </div>
            </div>
            {mode === "learn"
              ? <Learn verb={selected} onPractice={() => select(selected.infinitive, "practice")} />
              : <PracticeModes verb={selected} onLearn={() => select(selected.infinitive, "learn")} />}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="w-14 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: "practising" | "mastered" }) {
  return status === "mastered"
    ? <Check className="h-4 w-4 text-success" aria-label="Mastered" />
    : <span className="h-2 w-2 rounded-full bg-warning" aria-label="Practising" title="Practising" />;
}

function Form({ verb, form }: { verb: Verb; form: string }) {
  if (isIrregular(verb)) return <>{form}</>;
  const stem = verb.infinitive.slice(0, -3);
  let n = form.startsWith(stem) ? stem.length : 0;
  if (n === 0) { // spelling-changed stems like paghi / studi
    while (n < form.length && form[n] === stem[n]) n++;
  }
  return <>{form.slice(0, n)}<span className="text-brand">{form.slice(n)}</span></>;
}

function ruleFor(v: Verb): string {
  if (isIrregular(v)) return "Irregular: the stem changes, so learn each form by heart. Start with io, tu and lui/lei — they're used most.";
  const f = familyOf(v);
  const stem = v.infinitive.slice(0, -3);
  if (isIsc(v)) return `-ISC- pattern: drop -ire from ${v.infinitive} (${stem}-), then add -isco, -isci, -isce, -iamo, -ite, -iscono. noi and voi don't take -isc-.`;
  const ends = f === "-are" ? "-o, -i, -a, -iamo, -ate, -ano" : f === "-ere" ? "-o, -i, -e, -iamo, -ete, -ono" : "-o, -i, -e, -iamo, -ite, -ono";
  const extra = f === "-ire" ? " This is the standard -IRE pattern (no -isc-)." : "";
  return `Drop ${f} from ${v.infinitive} to get the stem ${stem}-, then add ${ends}.${extra}`;
}

function Learn({ verb, onPractice }: { verb: Verb; onPractice: () => void }) {
  const [showEn, setShowEn] = useState(true);
  return (
    <div className="mt-6 space-y-6">
      <div className="flex gap-3 rounded-[16px] bg-accent p-4 text-[15px] text-foreground">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" aria-hidden />
        <div><p className="font-semibold">How it works</p><p className="mt-0.5 text-muted-foreground">{ruleFor(verb)}</p>
          {verb.meaning && <p className="mt-1 text-muted-foreground">{verb.meaning}</p>}</div>
      </div>

      <div className="overflow-hidden rounded-[16px] border">
        <table className="w-full text-left">
          <caption className="sr-only">Present tense of {verb.infinitive}</caption>
          <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr><th className="px-4 py-2.5 font-semibold">Person</th><th className="px-4 py-2.5 font-semibold">Italian</th><th className="hidden px-4 py-2.5 font-semibold sm:table-cell">Meaning</th></tr>
          </thead>
          <tbody className="divide-y">
            {PRONOUNS.map((p, i) => (
              <tr key={p.it} className="align-top">
                <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">{p.it}</td>
                <td className="px-4 py-3">
                  <button onClick={() => speak(`${p.it === "lui/lei" ? "lui" : p.it} ${verb.forms[i]}`)} className="inline-flex items-center gap-2 rounded-md text-left text-lg font-bold" aria-label={`Listen: ${p.it} ${verb.forms[i]}`}>
                    <span><Form verb={verb} form={verb.forms[i] ?? ""} /></span><Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </button>
                  <div className="text-sm text-muted-foreground sm:hidden">{verb.en[i]}</div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell"><div className="font-medium">{verb.en[i]}</div><div className="text-xs text-muted-foreground">{p.note}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isIrregular(verb) && <p className="-mt-3 text-sm text-muted-foreground"><span className="font-semibold text-brand">Blue</span> shows the ending you add to the stem.</p>}

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">In real life</h3>
          <button onClick={() => setShowEn((s) => !s)} aria-pressed={showEn} className={btn.ghost}>{showEn ? "Hide" : "Show"} translations</button>
        </div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {verb.examples.map((e) => (
            <li key={e.it} className="flex items-start justify-between gap-3 rounded-[16px] border p-4">
              <div><p className="text-lg font-semibold">{e.it}</p>{showEn && <p className="text-sm text-muted-foreground">{e.en}</p>}</div>
              <button onClick={() => speak(e.it)} aria-label={`Listen: ${e.it}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Volume2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </div>

      <HowItWorks verb={verb} />

      <button onClick={onPractice} className={`${btn.cta} w-full sm:w-auto`}>Practise this verb <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

const ACCENTS = ["à", "è", "é", "ì", "ò", "ù"];

function PracticeModes({ verb, onLearn }: { verb: Verb; onLearn: () => void }) {
  type K = "drill" | "reflex" | "sentence";
  const [kind, setKind] = useState<K>("drill");
  const modes = [
    { id: "drill" as const, n: 1, title: "Verb forms", sub: "Lock in the six endings" },
    { id: "reflex" as const, n: 2, title: "Reply reflex", sub: "Hear a question, answer" },
    { id: "sentence" as const, n: 3, title: "Real-life trigger", sub: "React to real moments without translating in your head" },
  ];
  return (
    <div className="mt-6">
      <div role="tablist" aria-label="Practice type" className="grid gap-2 sm:grid-cols-3">
        {modes.map((m) => (
          <button key={m.id} role="tab" aria-selected={kind === m.id} onClick={() => setKind(m.id)}
            className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${kind === m.id ? "border-primary bg-accent" : "bg-card hover:bg-muted"}`}>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${kind === m.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{m.n}</span>
            <span><span className="block font-semibold">{m.title}</span><span className="block text-xs text-muted-foreground">{m.sub}</span></span>
          </button>
        ))}
      </div>
      <div hidden={kind !== "drill"}><Practice key={verb.infinitive + "drill"} kind="drill" verb={verb} onLearn={onLearn} onNext={() => setKind("reflex")} /></div>
      <div hidden={kind !== "reflex"}><Reflex key={verb.infinitive} verb={verb} active={kind === "reflex"} onNext={() => setKind("sentence")} /></div>
      <div hidden={kind !== "sentence"}><Trigger key={verb.infinitive} verb={verb} /></div>
    </div>
  );
}

function HowItWorks({ verb }: { verb: Verb }) {
  const b = blueprintOf(verb);
  const chunks = chunksFor(verb);
  return (
    <div className="rounded-[20px] border bg-card p-5 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How it works · the engine of {verb.infinitive}</p>
      <h3 className="mt-1 text-2xl font-bold">Stem: <span className="text-primary">{b.stem}</span></h3>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{b.idea}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[["One person", b.singular, "io · tu · lui/lei"], ["More people", b.plural, "noi · voi · loro"]].map(([t, forms, who]) => (
          <button key={t} type="button" onClick={() => speak(forms!)} className="rounded-2xl border p-4 text-left hover:bg-muted">
            <span className="flex items-center justify-between text-xs font-semibold text-muted-foreground">{t} <Volume2 className="h-4 w-4" aria-hidden /></span>
            <span className="mt-1 block text-xl font-bold">{forms}</span>
            <span className="text-xs text-muted-foreground">{who}</span>
          </button>
        ))}
      </div>

      <h4 className="mt-8 font-bold">Train your ear: the ending tells you who</h4>
      <p className="mt-1 text-sm text-muted-foreground">Italians drop io, tu, lui. You don't hear "who" — you hear the ending.</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {verb.forms.map((f, i) => (
          <li key={i} className="flex items-baseline justify-between gap-2 rounded-xl bg-muted px-3 py-2">
            <span className="font-bold">{f}</span><span className="text-xs text-muted-foreground">{EAR[i]!.who}</span>
          </li>
        ))}
      </ul>

      <h4 className="mt-8 font-bold">Say it in chunks</h4>
      <p className="mt-1 text-sm text-muted-foreground">Natives store these as one piece. Tap to hear, repeat out loud.</p>
      <ul className="mt-3 divide-y rounded-2xl border">
        {chunks.map((c) => (
          <li key={c.it}>
            <button type="button" onClick={() => speak(c.it)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted">
              <Volume2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="font-semibold">{c.it}</span>
              <span className="ml-auto text-sm text-muted-foreground">{c.en}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const GUIDE: string[] = [
  "They're asking about you → answer with io · ends in -o",
  "Turn it back to your friend → use tu · ends in -i",
  "About one other person → use lui / lei",
  "They asked your group → answer with noi · ends in -iamo",
  "Talking to a group → use voi · -ate / -ete / -ite",
  "About other people → use loro · -ano / -ono",
];

function Reflex({ verb, onNext, active = true }: { verb: Verb; onNext?: (() => void) | undefined; active?: boolean }) {
  const rounds = useMemo(() => roundsFor(verb), [verb]);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Grade | null>(null);
  const [score, setScore] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const currentQ = rounds[step]?.q;
  useEffect(() => {
    if (!currentQ || !active) return;
    const t = setTimeout(() => speak(currentQ), 60);
    return () => clearTimeout(t);
  }, [currentQ, step, active]);

  if (step >= rounds.length) {
    return (
      <div className="mt-8 rounded-[18px] border bg-gradient-feature p-6 text-center sm:p-10">
        <p className="text-sm font-semibold text-muted-foreground">Reply reflex · {verb.infinitive}</p>
        <p className="mt-1 text-5xl font-bold">{score}<span className="text-muted-foreground">/{rounds.length}</span></p>
        <p className="mt-2 text-muted-foreground">{score === rounds.length ? "You answered like a native. Do it again faster." : "Repeat until you answer without thinking."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => { setStep(0); setScore(0); setResult(null); setAnswer(""); }} className={btn.primary}><RotateCcw className="h-4 w-4" /> Again</button>
          {onNext && <button onClick={onNext} className={btn.outline}>Next step <ArrowRight className="h-4 w-4" /></button>}
        </div>
      </div>
    );
  }
  const r = rounds[step]!;
  const expected = verb.forms[r.idx] ?? "";
  const full = fillBlank(r.a, expected);
  const [before = "", after = ""] = r.a.split("_");
  const submit = () => {
    if (result !== null) { setStep(step + 1); setAnswer(""); setResult(null); setTimeout(() => input.current?.focus(), 0); return; }
    if (!answer.trim()) return;
    const g = grade(answer.trim().toLowerCase(), expected);
    setResult(g); if (g === "correct") setScore((s) => s + 1);
    speak(full);
  };
  return (
    <div className="mt-5 rounded-[20px] border bg-card p-5 sm:p-7">
      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Round {step + 1} of {rounds.length}</span><span>Score {score}</span></div>
      <div className="mt-2"><ProgressBar value={(step / rounds.length) * 100} label="Reflex progress" /></div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Someone says to you</p>
      <div className="mt-2 flex items-start">
        <div className="flex items-center gap-3 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
          <div>
            <p className="text-xl font-bold sm:text-2xl">{r.q}</p>
            <p className="mt-1 text-[15px] font-semibold text-foreground/85">“{r.qEn}”</p>
          </div>
          <button type="button" onClick={() => speak(r.q)} aria-label="Hear the question" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"><Volume2 className="h-4 w-4" /></button>
        </div>
      </div>
      {hardSoundTip(verb) && <p className="mt-2 flex items-start gap-2 px-1 text-sm text-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />{hardSoundTip(verb)}</p>}

      <div className="mt-4 flex flex-col items-end">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">You reply</p>
        <div className="rounded-2xl rounded-tr-sm border-2 border-primary/30 px-4 py-3 text-right">
          <p className="text-xl font-bold sm:text-2xl">{before}<span className="mx-1 inline-block min-w-16 border-b-2 border-primary text-center text-primary">{result ? (before ? expected : expected.charAt(0).toUpperCase() + expected.slice(1)) : "…"}</span>{after}</p>
        </div>
        <p className="mt-1.5 pr-1 text-[15px] font-semibold text-foreground/85">“{r.aEn}”</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-5">
        <input id="reflex-answer" aria-label={`Form of ${verb.infinitive}`} placeholder={`form of ${verb.infinitive}`} ref={input} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
          value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={result !== null}
          className="min-h-13 w-full rounded-xl border border-input bg-card px-4 py-3 text-lg outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring read-only:bg-muted" />
        {result === null && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["à", "è", "é", "ì", "ò", "ù"].map((c) => (
              <button key={c} type="button" onClick={() => { setAnswer((a) => a + c); input.current?.focus(); }} className="h-9 w-9 rounded-lg border bg-card text-base font-semibold hover:bg-muted">{c}</button>
            ))}
          </div>
        )}
        {result && <Feedback result={result} answer={answer} expected={full} meaning={r.aEn} />}
        {result && <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">The reflex:</span> {r.why}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button className={`${btn.primary} w-full sm:w-auto`} disabled={result === null && !answer.trim()}>
            {result === null ? "Reply" : step === rounds.length - 1 ? "See result" : "Next round"} {result !== null && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}

function Practice({ verb, onLearn, kind, onNext }: { verb: Verb; onLearn: () => void; kind: "drill" | "sentence"; onNext?: (() => void) | undefined }) {
  const S = kind === "sentence";
  const order = useMemo(() => [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5), []);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Grade | null>(null);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  if (step >= order.length) {
    return (
      <div className="mt-8 rounded-[18px] border bg-gradient-feature p-6 text-center sm:p-10">
        <p className="text-sm font-semibold text-muted-foreground">Your score for {verb.infinitive}</p>
        <p className="mt-1 text-5xl font-bold text-foreground">{score}<span className="text-muted-foreground">/6</span></p>
        <p className="mt-2 text-muted-foreground">{score === 6 ? "Perfetto! Marked as mastered." : "Saved. Score 6/6 to master this verb."}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => { setStep(0); setScore(0); setResult(null); setAnswer(""); }} className={btn.primary}><RotateCcw className="h-4 w-4" /> Try again</button>
          {onNext && <button onClick={onNext} className={btn.outline}>Next step <ArrowRight className="h-4 w-4" /></button>}
          <button onClick={onLearn} className={btn.outline}>Review the table</button>
        </div>
      </div>
    );
  }

  const i = order[step] ?? 0;
  const p = PRONOUNS[i]!;
  const expected = verb.forms[i] ?? "";
  const ctx = contextFor(verb)[i]!;
  const [before = "", after = ""] = ctx.it.split("_");
  const full = S ? fill(ctx.it, expected) : `${p.it} ${expected}`;
  const submit = () => {
    if (result !== null) {
      const nextStep = step + 1;
      if (nextStep >= order.length) recordAttempt(verb.infinitive, score);
      setStep(nextStep); setAnswer(""); setResult(null); setHint(false);
      setTimeout(() => input.current?.focus(), 0);
      return;
    }
    if (!answer.trim()) return;
    const g = grade(answer.trim().toLowerCase(), expected);
    setResult(g);
    if (g === "correct") setScore((s) => s + 1);
    speak(full);
  };
  const insert = (ch: string) => {
    const el = input.current;
    const s = el?.selectionStart ?? answer.length, e = el?.selectionEnd ?? answer.length;
    setAnswer(answer.slice(0, s) + ch + answer.slice(e));
    setTimeout(() => { el?.focus(); el?.setSelectionRange(s + 1, s + 1); }, 0);
  };

  return (
    <div className="mt-5 rounded-[20px] border bg-card p-5 sm:p-7">
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Question {step + 1} of 6</span><span>Score {score}</span></div>
        <div className="mt-2"><ProgressBar value={(step / 6) * 100} label="Practice progress" /></div>
        {!S && <>
        <p className="mt-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Say this in Italian</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">“{verb.en[i]}”</p>
        {continuousOf(verb, i) && <p className="mt-1.5 text-sm text-muted-foreground">Also means: {continuousOf(verb, i)}</p>}
        {spellingNote(verb, i) && <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />{spellingNote(verb, i)}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">({p.it})</span>
          <span className="inline-block min-w-28 border-b-2 border-primary text-3xl font-bold text-primary sm:text-4xl">{result ? expected : "…"}</span>
          {result && <button type="button" onClick={() => speak(expected)} className="inline-flex items-center gap-1 text-sm font-semibold text-primary"><Volume2 className="h-4 w-4" aria-hidden /> Hear it</button>}
        </div>
        </>}
        {S && <>
        <p className="mt-6 inline-flex rounded-full bg-tile-blue px-3 py-1 text-xs font-semibold text-tile-blue-ink">{ctx.situation}</p>
        <p className="mt-4 text-3xl font-bold leading-snug sm:text-4xl" aria-label="Italian sentence with a blank">
          {before}<span className="mx-1 inline-block min-w-20 border-b-2 border-primary text-center text-primary">{result ? (before ? expected : expected.charAt(0).toUpperCase() + expected.slice(1)) : "…"}</span>{after}
        </p>
        <p className="mt-3 text-lg font-semibold text-foreground"><span className="text-sm font-medium text-muted-foreground">Meaning · </span>{ctx.en}</p>
        <button type="button" onClick={() => speak(result ? full : ctx.it.replace("_", "…"))} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"><Volume2 className="h-4 w-4" aria-hidden /> Listen first</button>
        </>}

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-5">
          <label htmlFor={`answer-${kind}`} className="sr-only">Your answer · form of {verb.infinitive}</label>
          <input id={`answer-${kind}`} ref={input} autoFocus={!S} autoComplete="off" autoCapitalize="off" spellCheck={false}
            value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={result !== null}
            placeholder={`form of ${verb.infinitive}`}
            className="mt-1.5 min-h-13 w-full rounded-xl border border-input bg-card px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-ring read-only:bg-muted" />
          <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Insert accented letter">
            {ACCENTS.map((a) => <button type="button" key={a} disabled={result !== null} onClick={() => insert(a)} aria-label={`Insert ${a}`} className="h-10 w-10 rounded-lg border bg-card text-lg font-semibold hover:bg-muted disabled:opacity-40">{a}</button>)}
          </div>

          {result && <Feedback result={result} answer={answer} expected={full} meaning={S ? ctx.en : verb.en[i] ?? ""} />}
          {result && S && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Why “{expected}”?</span> {ctx.tip ?? `The ending already says who: “${expected}” = ${p.en}. Italians usually drop “${p.it}”.`}
              <button type="button" onClick={() => speak(full)} className="ml-2 inline-flex items-center gap-1 font-semibold text-primary"><Volume2 className="h-4 w-4" aria-hidden /> Hear again</button>
            </p>
          )}

          {hint && result === null && <p className="mt-3 rounded-xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">{!S ? ENDING_CLUE[i] : isIrregular(verb) ? `Starts with “${expected.slice(0, 2)}…”` : ruleFor(verb)}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button className={`${btn.primary} w-full sm:w-auto`} disabled={result === null && !answer.trim()}>
              {result === null ? "Check answer" : step === 5 ? "See result" : "Continue"} {result !== null && <ArrowRight className="h-4 w-4" />}
            </button>
            {!hint && result === null && <button type="button" onClick={() => setHint(true)} className="text-sm font-semibold text-accent-foreground underline">Show a hint</button>}
            <button type="button" onClick={onLearn} className="text-sm font-semibold text-accent-foreground underline">Conjugation table</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Feedback({ result, answer, expected, meaning }: { result: Grade; answer: string; expected: string; meaning: string }) {
  const cfg = {
    correct: { Icon: Check, cls: "border-success/30 bg-tile-green text-tile-green-ink", title: "Corretto! That's right." },
    partial: { Icon: AlertTriangle, cls: "border-warning/30 bg-tile-amber text-tile-amber-ink", title: "Almost — check the accent." },
    incorrect: { Icon: X, cls: "border-destructive/30 bg-tile-pink text-destructive", title: "Not quite." },
  }[result];
  return (
    <div role="status" className={`mt-4 rounded-xl border p-4 ${cfg.cls}`}>
      <p className="flex items-center gap-2 font-bold"><cfg.Icon className="h-5 w-5" aria-hidden />{cfg.title}</p>
      <dl className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-[15px] text-foreground">
        <dt className="text-muted-foreground">Your answer</dt><dd className={result === "incorrect" ? "line-through" : ""}>{answer}</dd>
        {result !== "correct" && <><dt className="text-muted-foreground">Correct</dt><dd className="font-semibold">{expected}</dd></>}
        <dt className="text-muted-foreground">Meaning</dt><dd>{meaning}</dd>
      </dl>
      {result === "partial" && <p className="mt-2 text-sm text-foreground">Partly correct answers don't add to your score — accents change meaning in Italian.</p>}
    </div>
  );
}


const MOMENT_ICON: Record<MomentIcon, typeof Key> = {
  key: Key, coffee: Coffee, bag: Luggage, phone: Smartphone, food: Utensils, train: TrainFront, home: Home, book: BookOpen,
  music: Music, shop: ShoppingBag, heart: Heart, sun: Sun, car: Car, mail: Mail, users: Users, clock: Clock, work: Briefcase,
  party: PartyPopper, map: MapPin, door: DoorOpen,
};

/** Sentence with the verb + the word after it highlighted in green. */
function Combo({ text, form }: { text: string; form: string }) {
  const words = text.split(" ");
  const k = words.findIndex((w) => w.toLowerCase().replace(/[^\p{L}']/gu, "") === form.toLowerCase());
  if (k < 0) return <>{text}</>;
  const art = /^(il|lo|la|le|i|gli|un|una|uno|del|della|dei|delle|l'.*|un'.*)$/i.test(words[k + 1] ?? "");
  const end = Math.min(words.length, k + (art ? 3 : 2));
  return <>{words.slice(0, k).join(" ")}{k > 0 ? " " : ""}<span className="text-success">{words.slice(k, end).join(" ")}</span>{end < words.length ? " " : ""}{words.slice(end).join(" ")}</>;
}

function Trigger({ verb }: { verb: Verb }) {
  const items = useMemo(() => momentsFor(verb), [verb]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Grade | null>(null);
  const [tip, setTip] = useState<string | undefined>();
  const input = useRef<HTMLInputElement>(null);
  const m = items[step];

  if (!m) {
    return (
      <div className="mt-8 rounded-[18px] border bg-gradient-feature p-6 text-center sm:p-10">
        <p className="text-sm font-semibold text-muted-foreground">Real-life trigger · {verb.infinitive}</p>
        <p className="mt-1 text-5xl font-bold">{score}<span className="text-muted-foreground">/{items.length}</span></p>
        <p className="mt-2 text-muted-foreground">{score === items.length ? "Every moment answered in Italian. Now say each one out loud." : "Go again — react before you translate."}</p>
        <button onClick={() => { setStep(0); setScore(0); setAnswer(""); setResult(null); setTip(undefined); }} className={`${btn.primary} mt-6`}><RotateCcw className="h-4 w-4" /> Again</button>
      </div>
    );
  }
  const form = verb.forms[m.idx] ?? "";
  const full = fillBlank(m.it, form);
  const [before = "", after = ""] = m.it.split("_");
  const Icon = MOMENT_ICON[m.icon] ?? Users;
  const submit = () => {
    if (result !== null) { setStep(step + 1); setAnswer(""); setResult(null); setTip(undefined); setTimeout(() => input.current?.focus(), 0); return; }
    if (!answer.trim()) return;
    const t = trapTip(verb, m, answer);
    if (t) { setTip(t); return; }
    const g = grade(answer.trim().toLowerCase(), form);
    setResult(g); if (g === "correct") setScore((s) => s + 1);
    speak(full);
  };
  const insert = (ch: string) => { setAnswer((a) => a + ch); input.current?.focus(); };
  const shown = before ? form : form.charAt(0).toUpperCase() + form.slice(1);

  return (
    <div className="mt-5 rounded-[20px] border bg-card p-5 sm:p-7">
      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Moment {step + 1} of {items.length}</span><span>Score {score}</span></div>
      <div className="mt-2"><ProgressBar value={(step / items.length) * 100} label="Real-life trigger progress" /></div>

      <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" aria-hidden /> Imagine this moment
      </p>
      <p className="mt-3 text-lg font-semibold leading-snug text-foreground sm:text-xl">{m.situation}</p>

      <div className="mt-5 rounded-2xl border-2 border-primary/30 px-4 py-4">
        <p className="text-2xl font-bold sm:text-3xl">
          {result && result !== "incorrect" ? <Combo text={full} form={form} /> : <>{before}<span className="mx-1 inline-block min-w-20 border-b-2 border-primary text-center text-primary">{result ? shown : "…"}</span>{after}</>}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">{result ? `“${m.en}”` : `missing word: “${m.whisper}”`}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-5">
        <label htmlFor="trigger-answer" className="sr-only">Form of {verb.infinitive}</label>
        <input id="trigger-answer" ref={input} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
          placeholder={`form of ${verb.infinitive}`} value={answer} onChange={(e) => { setAnswer(e.target.value); setTip(undefined); }} readOnly={result !== null}
          className="min-h-13 w-full rounded-xl border border-input bg-card px-4 py-3 text-lg outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring read-only:bg-muted" />
        {result === null && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ACCENTS.map((c) => <button key={c} type="button" onClick={() => insert(c)} className="h-9 w-9 rounded-lg border bg-card text-base font-semibold hover:bg-muted">{c}</button>)}
          </div>
        )}
        {tip && <p className="mt-4 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-[15px] text-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />{tip}</p>}
        {result && result !== "incorrect" && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-tile-green px-3 py-1 text-sm font-semibold text-foreground"><Zap className="h-4 w-4 text-success" aria-hidden /> Brain-to-mouth combo unlocked!</p>
        )}
        {result && <Feedback result={result} answer={answer} expected={full} meaning={m.en} />}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className={`${btn.primary} w-full sm:w-auto`} disabled={result === null && !answer.trim()}>
            {result === null ? "Check" : step === items.length - 1 ? "See result" : "Next moment"} {result !== null && <ArrowRight className="h-4 w-4" />}
          </button>
          {result !== null && <button type="button" onClick={() => speak(full)} className={btn.outline}><Volume2 className="h-4 w-4" /> Hear it again</button>}
        </div>
      </form>
    </div>
  );
}
