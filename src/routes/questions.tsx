import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, Volume2, RotateCcw, Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";
import { Panel, ProgressBar, btn } from "@/components/app-shell";
import { StepVoice, StepNoDo } from "@/components/lesson/QuestionSteps";
import { useStepProgress } from "@/lib/progress";
import { QWORDS, ORDER_TASKS, PICK_TASKS, isAcceptedQuestion, isCorrectPick, type OrderTask } from "@/data/questions";

export const Route = createFileRoute("/questions")({
  head: () => ({
    meta: [
      { title: "Asking Questions in Italian: word order & question words — Parlami" },
      { name: "description", content: "Why Italian has no “do”, how intonation turns a statement into a question, and the one word order every Italian question follows." },
      { property: "og:title", content: "Asking questions in Italian — Parlami" },
      { property: "og:description", content: "No “do”, no reshuffling. Question word, verb, subject — and your voice does the rest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuestionsPage,
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT"; u.rate = 0.85;
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
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 max-w-3xl text-[17px] leading-relaxed text-foreground">{children}</p>;
}
function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 mt-10 text-xl font-bold text-foreground first:mt-0">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 max-w-3xl leading-relaxed text-muted-foreground">{children}</p>;
}
function Note({ tone = "blue", title, children }: { tone?: "blue" | "amber"; title: string; children: React.ReactNode }) {
  const c = tone === "blue" ? "border-primary/20 bg-primary/5 text-primary" : "border-amber-300/50 bg-amber-50 text-amber-700";
  const I = tone === "blue" ? Lightbulb : AlertTriangle;
  return (
    <div className={`my-6 flex max-w-3xl gap-3 rounded-2xl border p-4 ${c}`}>
      <I className="mt-0.5 h-5 w-5 shrink-0" />
      <div><div className="font-semibold">{title}</div><div className="mt-1 leading-relaxed text-foreground">{children}</div></div>
    </div>
  );
}
/** One row: Italian + English + listen. */
function Line({ it, en, lit }: { it: string; en: string; lit?: string }) {
  return (
    <div className="flex items-center gap-3 border-b py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="text-lg font-semibold text-foreground">{it}</div>
        <div className="text-sm text-muted-foreground">{en}{lit && <span className="ml-2 italic opacity-80">· word for word: {lit}</span>}</div>
      </div>
      <Listen text={it} />
    </div>
  );
}
/** Coloured block chip used to show word order. */
const ROLE = {
  q: "bg-pink/10 text-pink border-pink/20",
  v: "bg-primary/10 text-primary border-primary/20",
  s: "bg-success/10 text-success border-success/20",
  x: "bg-muted text-muted-foreground border-border",
} as const;
function Chunk({ r, children }: { r: keyof typeof ROLE; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-semibold ${ROLE[r]}`}>{children}</span>;
}

const TABS = ["Your voice does it", "Forget “do”", "The one word order", "The question words", "Practise"];

function QuestionsPage() {
  const [step, setStep] = useState(0);
  const prog = useStepProgress();
  const KEYS = ["voice", "nodo"];
  const go = (s: number) => { setStep(s); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };
  const reduce = useReducedMotion();
  const isDone = (i: number) => !!(KEYS[i] && prog[KEYS[i]!]?.done);
  return (
    <div className="pt-6 sm:pt-0">
      <section className="mx-auto flex max-w-[960px] flex-col rounded-3xl border bg-card shadow-[0_8px_30px_-12px_rgba(23,50,77,0.18)] md:min-h-[640px]">
        <div className="flex items-center justify-between px-5 pt-5 text-[14px] font-medium text-muted-foreground sm:px-8">
          <span>Asking questions · A1</span><span>Step {step + 1} of 5</span>
        </div>
        <nav aria-label="Lesson steps" className="px-5 pt-5 sm:px-8">
          <ol className="relative flex items-center justify-between gap-1 sm:justify-center sm:gap-0">
            {TABS.map((t, i) => {
              const active = step === i, done = isDone(i) && !active;
              const cls = active ? "border-primary bg-primary text-primary-foreground" : done ? "border-success bg-success text-white" : "border-border bg-card text-muted-foreground hover:text-foreground";
              return (
                <li key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden className="h-px w-4 bg-border sm:w-3 lg:w-5" />}
                  <button type="button" onClick={() => go(i)} aria-current={active ? "step" : undefined} aria-label={`Step ${i + 1}: ${t}${done ? " (completed)" : ""}`}
                    className={`inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full border text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3 ${cls}`}>
                    {done ? <Check aria-hidden className="h-4 w-4" /> : <span>{i + 1}</span>}
                    <span className="hidden whitespace-nowrap lg:inline">{t}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-center text-[15px] font-semibold text-foreground lg:hidden">{TABS[step]}</p>
        </nav>
        <motion.div key={step} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
          className="flex-1 px-5 py-8 sm:px-8">
          {step === 0 && <StepVoice />}
          {step === 1 && <StepNoDo />}
          {step === 2 && <StepOrder />}
          {step === 3 && <StepWords />}
          {step === 4 && <StepPractice />}
        </motion.div>
        <div className="sticky bottom-0 flex justify-between gap-3 rounded-b-3xl border-t bg-card/95 px-5 py-4 backdrop-blur sm:px-8">
          {step > 0 ? <button className={btn.outline} onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
          {step < 4 && <button className={btn.primary} onClick={() => go(step + 1)}><span className="truncate">Next: {TABS[step + 1]}</span> <ArrowRight className="h-4 w-4 shrink-0" /></button>}
        </div>
      </section>
    </div>
  );
}

function StepOrder() {
  return (
    <div>
      <Lead>
        Now questions with a question word: where, when, what, who. English puts the person <em>before</em> the verb: where does <strong>Marco</strong> work?
        Italian puts the person <em>after</em> it. Every one of these questions follows the same three-part order.
      </Lead>
      <Panel className="p-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-lg">
          <Chunk r="q">question word</Chunk><ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Chunk r="v">verb</Chunk><ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Chunk r="s">subject (if needed)</Chunk>
        </div>
        <div className="mt-6 space-y-3">
          {[
            ["Dove", "lavora", "Marco", "Where does Marco work?", "Dove lavora Marco?"],
            ["Quando", "parte", "il treno", "When does the train leave?", "Quando parte il treno?"],
            ["Cosa", "studia", "tua sorella", "What is your sister studying?", "Cosa studia tua sorella?"],
          ].map(([q, v, s, en, full]) => (
            <div key={full} className="flex flex-wrap items-center justify-center gap-2">
              <Chunk r="q">{q}</Chunk><Chunk r="v">{v}</Chunk><Chunk r="s">{s}</Chunk>
              <span className="text-sm text-muted-foreground">{en}</span><Listen text={full!} />
            </div>
          ))}
        </div>
      </Panel>
      <H>Why the subject goes last</H>
      <P>
        Because it's optional. <em>Dove lavora?</em> is already a full question: “where does he/she work?”. The ending <strong>-a</strong> carries the person.
        You only add <em>Marco</em> when the listener wouldn't otherwise know who you mean, and extra information goes at the end.
      </P>
      <P>
        A trick that works: think in deliberately bad English. <em>Where works Marco? When leaves the train?</em> It sounds wrong in English,
        but it's word-for-word Italian.
      </P>
      <H>When to say the subject, and when not to</H>
      <Panel className="p-5 sm:p-6">
        <Line it="Dove abiti?" en="Where do you live? — no tu needed, -i already means you" />
        <Line it="Dove abita tuo fratello?" en="Where does your brother live? — needed, otherwise who?" />
        <Line it="Io prendo un caffè. Cosa prendi tu?" en="I'm having a coffee. What are YOU having? — tu for contrast" />
      </Panel>
      <Note tone="amber" title="Don't put the subject first">
        <em>Dove Marco lavora?</em> is the English order wearing Italian words. Italians will understand you, but it immediately sounds foreign.
      </Note>
    </div>
  );
}

function StepWords() {
  return (
    <div>
      <Lead>
        Seven question words cover almost everything. All of them sit at the very start and are followed by the verb. What changes is the
        small detail each one carries. Learn the detail, and you won't make the classic mistakes.
      </Lead>
      <div className="grid gap-4 md:grid-cols-2">
        {QWORDS.map((w) => (
          <Panel key={w.it} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-2xl font-bold text-foreground">{w.it}</div>
                <div className="text-sm text-muted-foreground">{w.en} · <span className="tracking-wide">{w.say}</span></div>
              </div>
              <Listen text={w.it.split(" · ")[0]!} />
            </div>
            <p className="mt-3 leading-relaxed text-foreground">{w.rule}</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
              <div className="flex-1"><div className="font-semibold">{w.ex}</div><div className="text-sm text-muted-foreground">{w.exEn}</div></div>
              <Listen text={w.ex} />
            </div>
            {w.trap && <p className="mt-3 flex gap-2 text-sm text-amber-700"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{w.trap}</p>}
          </Panel>
        ))}
      </div>
      <H>Cosa, che, or che cosa?</H>
      <P>
        Before a verb, all three are correct and mean the same. <em>Cosa</em> is the most common in everyday speech, <em>che</em> sounds quick and casual,
        <em> che cosa</em> is the full version. Before a noun, only <strong>che</strong> works, because then it means “what kind of / which”.
      </P>
      <Panel className="p-5 sm:p-6">
        <Line it="Cosa bevi?" en="What are you drinking? — verb follows: any of the three" />
        <Line it="Che vino bevi?" en="What wine are you drinking? — noun follows: only che" />
      </Panel>
      <H>Perché non…? — the suggestion</H>
      <P>
        <em>Perché non</em> + a verb sounds like a question but works as an invitation, exactly like “why don't we…?”. You'll hear it constantly.
      </P>
      <Panel className="p-5 sm:p-6">
        <Line it="Perché non prendiamo un gelato?" en="Why don't we get an ice cream?" />
        <Line it="Perché non vieni anche tu?" en="Why don't you come too?" />
      </Panel>
      <Note title="Qual è — the one that surprises everyone">
        For “what's your name / number / address?”, Italian uses <strong>qual è</strong>, not <em>cosa è</em>, because you're picking one from many possible answers.
        <em> Qual è il tuo numero?</em> And no apostrophe: <em>qual è</em>, never <em>qual'è</em>.
      </Note>
    </div>
  );
}

function StepPractice() {
  const [part, setPart] = useState<"build" | "pick">("build");
  return (
    <div>
      <Lead>Two short drills. First put the blocks in the Italian order, then choose the right question word.</Lead>
      <div className="mb-6 grid gap-2 sm:grid-cols-2">
        {([["build", "1 · Build the question"], ["pick", "2 · Choose the word"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setPart(k)}
            className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${part === k ? "border-primary bg-primary/5 text-primary" : "bg-card text-muted-foreground"}`}>{l}</button>
        ))}
      </div>
      {part === "build" ? <Builder onDone={() => setPart("pick")} /> : <Picker />}
    </div>
  );
}

function shuffle<T>(a: T[], seed: number): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = (seed * (i + 7)) % (i + 1); [r[i], r[j]] = [r[j]!, r[i]!]; }
  return r;
}

function Builder({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const t: OrderTask = ORDER_TASKS[i]!;
  const pool = useMemo(() => shuffle(t.blocks, i + 3), [t, i]);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const done = i >= ORDER_TASKS.length - 1 && result !== null;
  const attempt = picked.map((k) => pool[k]!);
  const check = () => {
    const ok = isAcceptedQuestion(t, attempt);
    setResult(ok); if (ok) setScore((s) => s + 1);
    speak(t.accept[0]! + "?");
  };
  const next = () => { setI(i + 1); setPicked([]); setResult(null); };
  return (
    <Panel className="p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{i + 1} / {ORDER_TASKS.length}</span><div className="flex-1"><ProgressBar label="Lesson progress" value={((i + (result !== null ? 1 : 0)) / ORDER_TASKS.length) * 100} /></div><span>{score} correct</span>
      </div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ask this in Italian</div>
      <div className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">{t.en}</div>
      <div className="mt-6 flex min-h-14 flex-wrap items-center gap-2 rounded-2xl border border-dashed p-3">
        {attempt.length === 0 && <span className="text-sm text-muted-foreground">Tap the blocks in order</span>}
        {picked.map((k) => (
          <button key={k} disabled={result !== null} onClick={() => setPicked(picked.filter((x) => x !== k))}
            className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 font-semibold text-primary">{pool[k]}</button>
        ))}
        {attempt.length > 0 && <span className="text-lg font-bold text-primary">?</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((b, k) => !picked.includes(k) && (
          <button key={k} onClick={() => setPicked([...picked, k])} className="rounded-xl border bg-card px-3 py-2 font-semibold hover:border-primary">{b}</button>
        ))}
      </div>
      {result !== null && (
        <div className={`mt-5 rounded-2xl border p-4 ${result ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
          <div className="flex items-center gap-2 font-semibold">
            {result ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />}
            {result ? "Exactly how an Italian asks it." : <>Italian order: <span className="text-foreground">{t.accept[0]}?</span></>}
            <span className="ml-auto"><Listen text={t.accept[0]! + "?"} /></span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.why}</p>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        {result === null ? (
          <>
            <button className={btn.primary} disabled={picked.length !== pool.length} onClick={check}>Check</button>
            <button className={btn.outline} onClick={() => setPicked([])}><RotateCcw className="h-4 w-4" /> Clear</button>
          </>
        ) : done ? (
          <button className={btn.primary} onClick={onDone}>{score} / {ORDER_TASKS.length} · Next drill <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button className={btn.primary} onClick={next}>Next <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </Panel>
  );
}

function Picker() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const finished = i >= PICK_TASKS.length;
  if (finished) {
    return (
      <Panel className="p-7 text-center">
        <div className="text-2xl font-bold">{score} / {PICK_TASKS.length}</div>
        <p className="mt-2 text-muted-foreground">{score === PICK_TASKS.length ? "Clean sweep. You know which word carries which detail." : "Go back to step 4 for the words you missed, then try again."}</p>
        <button className={`${btn.outline} mt-5`} onClick={() => { setI(0); setScore(0); setChoice(null); }}><RotateCcw className="h-4 w-4" /> Try again</button>
      </Panel>
    );
  }
  const t = PICK_TASKS[i]!;
  const full = (choice ?? "___") + (t.after.startsWith(" è") && choice === "Dov'" ? t.after.slice(1) : t.after);
  const pick = (o: string) => {
    if (choice) return;
    setChoice(o); if (isCorrectPick(t, o)) setScore((s) => s + 1);
    speak(t.answer + (t.answer === "Dov'" ? t.after.slice(1) : t.after));
  };
  return (
    <Panel className="p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{i + 1} / {PICK_TASKS.length}</span><div className="flex-1"><ProgressBar label="Lesson progress" value={((i + (choice ? 1 : 0)) / PICK_TASKS.length) * 100} /></div><span>{score} correct</span>
      </div>
      <div className="text-2xl font-bold text-foreground sm:text-3xl">{full}</div>
      <div className="mt-1 text-muted-foreground">{t.en}</div>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        {t.options.map((o) => {
          const state = !choice ? "" : o === t.answer ? "border-success bg-success/10 text-success" : o === choice ? "border-destructive bg-destructive/10 text-destructive" : "opacity-50";
          return <button key={o} onClick={() => pick(o)} className={`min-h-12 rounded-xl border bg-card px-4 text-lg font-semibold ${state}`}>{o}</button>;
        })}
      </div>
      {choice && (
        <div className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{t.why}</span>
        </div>
      )}
      {choice && <button className={`${btn.primary} mt-6`} onClick={() => { setI(i + 1); setChoice(null); }}>Next <ArrowRight className="h-4 w-4" /></button>}
    </Panel>
  );
}
