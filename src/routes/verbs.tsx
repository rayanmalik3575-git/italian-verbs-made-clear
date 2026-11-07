import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Check, X, AlertTriangle, Volume2, Search, ArrowRight, RotateCcw, Info } from "lucide-react";
import { PRONOUNS, VERBS, LEVEL, RANK, type Verb, type Level } from "@/data/verbs";
import { familyOf, isIrregular, isIsc, patternLabel, type Family } from "@/lib/verb-meta";
import { grade, type Grade } from "@/lib/grading";
import { recordAttempt, useProgress, statusOf, STATUS_LABEL } from "@/lib/progress";
import { Chip, Panel, PageHeader, ProgressBar, btn } from "@/components/app-shell";

type Mode = "learn" | "practice";
export const Route = createFileRoute("/verbs")({
  validateSearch: (s: Record<string, unknown>): { verb?: string; mode?: Mode } => ({
    verb: typeof s.verb === "string" ? s.verb : undefined,
    mode: s.mode === "practice" ? "practice" : s.mode === "learn" ? "learn" : undefined,
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

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
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
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-md bg-tile-blue px-2 py-1 text-tile-blue-ink">{LEVEL[selected.infinitive]}</span>
                  <span className={`rounded-md px-2 py-1 ${isIrregular(selected) ? "bg-tile-pink text-tile-pink-ink" : "bg-tile-green text-tile-green-ink"}`}>{patternLabel(selected)}</span>
                  <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">#{RANK[selected.infinitive]} · {STATUS_LABEL[statusOf(progress[selected.infinitive])]}</span>
                </div>
                <h2 className="mt-3 flex items-center gap-2 text-3xl font-bold sm:text-4xl">
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
              : <Practice key={selected.infinitive} verb={selected} onLearn={() => select(selected.infinitive, "learn")} />}
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
                    <Form verb={verb} form={verb.forms[i] ?? ""} /><Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden />
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

      <button onClick={onPractice} className={`${btn.cta} w-full sm:w-auto`}>Practise this verb <ArrowRight className="h-4 w-4" /></button>
    </div>
  );
}

const ACCENTS = ["à", "è", "é", "ì", "ò", "ù"];

function Practice({ verb, onLearn }: { verb: Verb; onLearn: () => void }) {
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
          <button onClick={onLearn} className={btn.outline}>Review the table</button>
        </div>
      </div>
    );
  }

  const i = order[step] ?? 0;
  const p = PRONOUNS[i]!;
  const expected = verb.forms[i] ?? "";
  const submit = () => {
    if (result !== null) {
      const nextStep = step + 1;
      if (nextStep >= order.length) recordAttempt(verb.infinitive, score);
      setStep(nextStep); setAnswer(""); setResult(null); setHint(false);
      setTimeout(() => input.current?.focus(), 0);
      return;
    }
    if (!answer.trim()) return;
    const g = grade(answer, expected);
    setResult(g);
    if (g === "correct") setScore((s) => s + 1);
    speak(expected);
  };
  const insert = (ch: string) => {
    const el = input.current;
    const s = el?.selectionStart ?? answer.length, e = el?.selectionEnd ?? answer.length;
    setAnswer(answer.slice(0, s) + ch + answer.slice(e));
    setTimeout(() => { el?.focus(); el?.setSelectionRange(s + 1, s + 1); }, 0);
  };

  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_240px]">
      <div>
        <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Question {step + 1} of 6</span><span>Score {score}</span></div>
        <div className="mt-2"><ProgressBar value={(step / 6) * 100} label="Practice progress" /></div>
        <p className="mt-6 text-sm font-semibold text-muted-foreground">Write this in Italian:</p>
        <p className="mt-1 text-2xl font-bold">“{verb.en[i]}”</p>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-5">
          <label htmlFor="answer" className="text-sm font-semibold">{p.it} …</label>
          <input id="answer" ref={input} autoFocus autoComplete="off" autoCapitalize="off" spellCheck={false}
            value={answer} onChange={(e) => setAnswer(e.target.value)} readOnly={result !== null}
            placeholder={`form of ${verb.infinitive}`}
            className="mt-1.5 min-h-13 w-full rounded-xl border border-input bg-card px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-ring read-only:bg-muted" />
          <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Insert accented letter">
            {ACCENTS.map((a) => <button type="button" key={a} disabled={result !== null} onClick={() => insert(a)} aria-label={`Insert ${a}`} className="h-10 w-10 rounded-lg border bg-card text-lg font-semibold hover:bg-muted disabled:opacity-40">{a}</button>)}
          </div>

          {result && <Feedback result={result} answer={answer} expected={`${p.it} ${expected}`} meaning={verb.en[i] ?? ""} />}

          <button className={`${btn.primary} mt-5 w-full sm:w-auto`} disabled={result === null && !answer.trim()}>
            {result === null ? "Check answer" : step === 5 ? "See result" : "Continue"} {result !== null && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      </div>

      <aside className="h-fit rounded-[16px] border bg-muted/60 p-4 text-sm" aria-label="Help">
        <p className="font-semibold">Need a hint?</p>
        {hint
          ? <p className="mt-1 text-muted-foreground">{isIrregular(verb) ? `Starts with “${expected.slice(0, 2)}…”` : ruleFor(verb)}</p>
          : <button type="button" onClick={() => setHint(true)} className="mt-2 font-semibold text-accent-foreground underline">Show a hint</button>}
        <button type="button" onClick={onLearn} className="mt-3 block font-semibold text-accent-foreground underline">Open the conjugation table</button>
      </aside>
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

export { Link };
