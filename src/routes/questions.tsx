import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X, Volume2, RotateCcw, Lightbulb, AlertTriangle, Zap, Pin, TrendingUp } from "lucide-react";
import { Panel, ProgressBar, btn } from "@/components/app-shell";
import { StepVoice } from "@/components/lesson/QuestionSteps";
import { recordStep, useStepProgress } from "@/lib/progress";
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

const TABS = ["Make a question", "The question words", "Practise"];

function QuestionsPage() {
  const [step, setStep] = useState(0);
  const prog = useStepProgress();
  const KEYS = ["make"];
  const go = (s: number) => { setStep(s); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };
  const reduce = useReducedMotion();
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  useEffect(() => { setSlot(document.getElementById("header-slot")); }, []);
  const isDone = (i: number) => !!(KEYS[i] && prog[KEYS[i]!]?.done);
  return (
    <div className="pt-6 sm:pt-0">
      <section className="mx-auto flex max-w-[960px] flex-col rounded-3xl border bg-card shadow-[0_8px_30px_-12px_rgba(23,50,77,0.18)] md:min-h-[640px]">
        {slot && createPortal(
<nav aria-label="Lesson steps" className="min-w-0">
          <ol className="relative flex items-center justify-between gap-0">
            {TABS.map((t, i) => {
              const active = step === i, done = isDone(i) && !active;
              const TAB_ON = ["border-[#009246] bg-[#009246] text-white","border-[#17324D] bg-white text-[#17324D]","border-[#CE2B37] bg-[#CE2B37] text-white"];
              const cls = active ? TAB_ON[i] : done ? "border-success bg-success text-white" : "border-border bg-card text-muted-foreground hover:text-foreground";
              return (
                <li key={t} className="flex items-center">
                  {i > 0 && <span aria-hidden className="h-px w-1.5 bg-border sm:w-3 lg:w-5" />}
                  <button type="button" onClick={() => go(i)} aria-current={active ? "step" : undefined} aria-label={`Step ${i + 1}: ${t}${done ? " (completed)" : ""}`}
                    className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3 ${cls}`}>
                    {done ? <Check aria-hidden className="h-4 w-4" /> : <span>{i + 1}</span>}
                    <span className={`hidden whitespace-nowrap ${active ? "lg:inline" : "2xl:inline"}`}>{t}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          
        </nav>,
        slot)}
        <h2 className="px-5 pt-6 text-[15px] font-semibold text-foreground sm:px-8 lg:sr-only">{TABS[step]}</h2>
        <motion.div key={step} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
          className="flex-1 px-5 py-8 sm:px-8">
          {step === 0 && <StepVoice />}
          {step === 1 && <StepWords />}
          {step === 2 && <StepPractice />}
          <div className="mt-12 flex items-center justify-between gap-3">
            {step > 0 ? <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[15px] font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
            {step < TABS.length - 1 && <button type="button" className="inline-flex min-h-12 max-w-full items-center gap-2 rounded-full bg-primary px-6 text-[16px] font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => go(step + 1)}><span className="truncate">Next: {TABS[step + 1]}</span> <ArrowRight className="h-4 w-4 shrink-0" /></button>}
          </div>
        </motion.div>
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
      <section className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="flex max-w-[26ch] items-center gap-3 text-left text-2xl font-bold leading-tight text-foreground sm:text-[30px]">
          <span aria-hidden className="shrink-0 text-[44px] font-extrabold leading-none bg-[linear-gradient(135deg,#009246_0%,#009246_38%,#E2E8F0_38%,#E2E8F0_62%,#CE2B37_62%,#CE2B37_100%)] bg-clip-text text-transparent sm:text-[52px]" style={{WebkitTextStroke:"1px rgba(23,50,77,0.35)"}}>2</span>
          The question words
        </h2>
        <p className="mt-2 text-[16px] font-medium text-foreground">The words that open every conversation</p>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-[1.75] text-foreground"><b>This is the second rule of asking questions in Italian.</b> When you want more than a yes or no, start with a question word. Here is the secret that makes Italian questions so easy: <b>the question word and the verb are glued together.</b> There is no <i>"do"</i> or <i>"does"</i>, and if there is a person or thing in the question, push them to the very end.</p>
        <div className="mt-8 w-full max-w-[640px] rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm sm:px-7">
          <div className="text-[14px] font-bold uppercase tracking-wide text-primary">How Italian does it (glued together)</div>
          <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-center sm:gap-3">
            {([["q","question word","Quando","(When)"],["v","verb","parte","(leaves)"],["x","who / what / the rest","il treno?","(the train?)"]] as const).map(([r,label,it,en],i)=>(
              <div key={label} className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-3">
                {i>0 && <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground sm:mt-2 sm:rotate-0" />}
                <div className="flex flex-col items-center text-center">
                  <Chunk r={r}>{label}</Chunk>
                  <span className="mt-2 text-[18px] font-bold text-foreground">{it}</span>
                  <span className="text-[14px] text-foreground">{en}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-4">
            {([["Dove","lavora","tuo padre?","Where does your father work?"],["Quando","arriva","l'autobus?","When does the bus arrive?"],["Cosa","mangiano","i bambini?","What are the children eating?"]] as const).map(([q,v,x,en])=>(
              <div key={q} className="flex flex-wrap items-center justify-center gap-2">
                <Chunk r="q">{q}</Chunk><Chunk r="v">{v}</Chunk><Chunk r="s">{x}</Chunk>
                <span className="text-[15px] text-foreground">{en}</span>
                <Listen text={`${q} ${v} ${x}`} />
              </div>
            ))}
          </div>
        </div>
        
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-foreground">Learn the words below and you can ask for directions, prices, times and reasons anywhere in Italy. Each one has a small detail worth remembering.</p>
      </section>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {QWORDS.map((w) => (
          <Panel key={w.it} className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold capitalize text-foreground">{w.it}</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[14px] font-semibold text-primary">{w.en}</span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[14px] font-medium text-foreground">{w.say}</span>
              </div>
              <Listen text={w.it.split(" · ")[0]!} />
            </div>
            <section className="rounded-xl border border-border bg-accent/30 px-3.5 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-wide text-primary"><Lightbulb className="h-4 w-4" />Memory hook</div>
              <p className="text-[15px] leading-relaxed text-foreground">{w.hook}</p>
            </section>
            <section className="rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-3">
              <div className="mb-1 flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-wide text-primary"><Zap className="h-4 w-4" />Daily survival phrase</div>
              <div className="flex items-center gap-2">
                <div className="flex-1"><div className="text-[16px] font-bold text-foreground">{w.ex}</div><div className="text-[14px] text-foreground">{w.exEn}</div></div>
                <Listen text={w.ex} />
              </div>
            </section>
            <section className={`mt-auto rounded-xl border px-3.5 py-3 ${w.power.kind === "trap" ? "border-destructive/25 bg-destructive/5" : "border-border bg-muted/50"}`}>
              <div className={`mb-1.5 flex items-center gap-1.5 text-[14px] font-bold uppercase tracking-wide ${w.power.kind === "trap" ? "text-destructive" : "text-foreground"}`}>
                {w.power.kind === "trap" ? <AlertTriangle className="h-4 w-4" /> : <Pin className="h-4 w-4" />}{w.power.title}
              </div>
              <ul className="space-y-1">
                {w.power.lines.map((l) => <li key={l} className="text-[15px] leading-relaxed text-foreground">{l}</li>)}
              </ul>
            </section>
          </Panel>
        ))}
      </div>
      <H>Three details that make you sound Italian</H>
      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <div className="text-[14px] font-semibold uppercase tracking-wide text-primary">Cosa or che?</div>
          <p className="mt-2 text-[16px] leading-relaxed text-foreground">Before a verb, both are fine: <em>Cosa bevi?</em> = <em>Che bevi?</em> Before a noun, only <b>che</b>: <em>Che vino bevi?</em></p>
        </Panel>
        <Panel className="p-5">
          <div className="text-[14px] font-semibold uppercase tracking-wide text-primary">Qual è, not cosa è</div>
          <p className="mt-2 text-[16px] leading-relaxed text-foreground">For name, number or address, Italian picks one from many: <em>Qual è il tuo numero?</em> Written without an apostrophe.</p>
        </Panel>
        <Panel className="p-5">
          <div className="text-[14px] font-semibold uppercase tracking-wide text-primary">Perché non…?</div>
          <p className="mt-2 text-[16px] leading-relaxed text-foreground">Turns a question into an invitation, like "why don't we…?": <em>Perché non prendiamo un gelato?</em></p>
        </Panel>
      </div>
      <Panel className="mt-6 p-5 sm:p-6">
        <Line it="Che vino bevi?" en="What wine are you drinking?" />
        <Line it="Qual è il tuo nome?" en="What's your name?" />
        <Line it="Perché non vieni anche tu?" en="Why don't you come too?" />
      </Panel>
    </div>
  );
}

function StepPractice() {
  const [part, setPart] = useState<"build" | "pick">("build");
  return (
    <div>
      <section className="mx-auto mb-8 flex max-w-[720px] flex-col items-center text-center">
        <h2 className="flex items-center gap-3 text-2xl font-bold leading-tight text-foreground sm:text-[30px]">
          <span aria-hidden className="shrink-0 text-[44px] font-extrabold leading-none bg-[linear-gradient(135deg,#009246_0%,#009246_38%,#E2E8F0_38%,#E2E8F0_62%,#CE2B37_62%,#CE2B37_100%)] bg-clip-text text-transparent sm:text-[52px]" style={{WebkitTextStroke:"1px rgba(23,50,77,0.35)"}}>3</span>
          Practise
        </h2>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-foreground">Two short drills. First put the blocks in the Italian order, then choose the right question word.</p>
      </section>
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
