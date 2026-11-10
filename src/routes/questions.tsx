import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X, Volume2, RotateCcw, Lightbulb, AlertTriangle, TrendingUp } from "lucide-react";
import { PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";
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
  const go = (s: number) => { setStep(s); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };
  return (
    <div>
      <PageHeader title="Asking questions"
        description="English rebuilds a sentence to ask something: you work → do you work? Italian doesn't. Learn the two moves that cover every question you'll ask at this level." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => go(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step === 0 && <StepVoice />}
      {step === 1 && <StepNoDo />}
      {step === 2 && <StepOrder />}
      {step === 3 && <StepWords />}
      {step === 4 && <StepPractice />}
      <div className="mt-8 flex justify-between gap-3">
        {step > 0 ? <button className={btn.outline} onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
        {step < 4 && <button className={btn.primary} onClick={() => go(step + 1)}>Next: {TABS[step + 1]} <ArrowRight className="h-4 w-4" /></button>}
      </div>
    </div>
  );
}

function StepVoice() {
  const pairs = [
    { s: "Parli inglese.", q: "Parli inglese?", es: "You speak English.", eq: "Do you speak English?" },
    { s: "Il museo è chiuso.", q: "Il museo è chiuso?", es: "The museum is closed.", eq: "Is the museum closed?" },
    { s: "Prendete un caffè.", q: "Prendete un caffè?", es: "You're having a coffee.", eq: "Are you guys having a coffee?" },
  ];
  return (
    <div>
      <Lead>
        Here is the good news first. To ask a yes-or-no question in Italian, you take the normal sentence and <strong>say it like a question</strong>.
        Same words, same order. Nothing moves. Only your voice changes.
      </Lead>
      <Panel className="p-5 sm:p-6">
        <div className="mb-3 grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Statement · voice falls</span><span>Question · voice rises</span>
        </div>
        {pairs.map((p) => (
          <div key={p.q} className="grid grid-cols-2 gap-4 border-b py-3 last:border-0">
            <div className="flex items-center gap-2"><div className="flex-1"><div className="font-semibold">{p.s}</div><div className="text-sm text-muted-foreground">{p.es}</div></div><Listen text={p.s} /></div>
            <div className="flex items-center gap-2"><div className="flex-1"><div className="font-semibold text-primary">{p.q}</div><div className="text-sm text-muted-foreground">{p.eq}</div></div><Listen text={p.q} /></div>
          </div>
        ))}
      </Panel>
      <H>Where the voice goes up</H>
      <P>
        Lift your pitch on the last word or two, the way you would in English if you said in surprise “you're leaving?”. In a long sentence,
        Italians often lift slightly at the end of each chunk, so the question sounds like a little staircase.
      </P>
      <div className="flex max-w-3xl flex-wrap items-end gap-2">
        {["Prenotate", "una camera", "per tre notti?"].map((c, i) => (
          <span key={c} className="rounded-xl border bg-card px-3 py-2 font-semibold text-foreground" style={{ marginBottom: i * 10 }}>{c}</span>
        ))}
        <TrendingUp className="mb-6 h-5 w-5 text-primary" />
        <Listen text="Prenotate una camera per tre notti?" />
      </div>
      <Note title="What this means for you">
        Every sentence you learn from now on is also a question you already know. Learn <em>Hai fame.</em> (you're hungry) and you own <em>Hai fame?</em> for free.
      </Note>
      <Note tone="amber" title="When you're writing">
        In a text message there's no voice, so the <strong>?</strong> is the only thing that tells the reader it's a question. Never drop it.
      </Note>
    </div>
  );
}

function StepNoDo() {
  return (
    <div>
      <Lead>
        The biggest obstacle for English speakers is a word Italian doesn't have. <strong>Do, does, are, is</strong> in English questions
        are helper words. Italian has no helper. The verb ending already says who is doing it, so you go straight to the verb.
      </Lead>
      <Panel className="p-5 sm:p-6">
        <Line it="Lavori?" en="Do you work?" lit="you-work?" />
        <Line it="Mangiamo?" en="Are we eating? / Shall we eat?" lit="we-eat?" />
        <Line it="Capisce?" en="Do you understand? (formal)" lit="you-understand?" />
        <Line it="Arrivano stasera?" en="Are they arriving tonight?" lit="they-arrive tonight?" />
      </Panel>
      <H>The habit to build</H>
      <P>
        When an English question forms in your head, strip it before you speak. “Do you work?” becomes “you work?”. “Are we eating?” becomes “we eat?”.
        That stripped version is exactly the Italian sentence. Italian present tense covers both “I eat” and “I am eating”, so you never need an extra word.
      </P>
      <div className="max-w-3xl rounded-2xl border bg-card p-5">
        {[
          ["Do you live here?", "you live here?", "Abiti qui?"],
          ["Is she coming?", "she comes?", "Viene?"],
          ["Are you guys tired?", "you guys are tired?", "Siete stanchi?"],
        ].map(([a, b, c]) => (
          <div key={a} className="flex flex-wrap items-center gap-2 border-b py-3 last:border-0">
            <span className="text-muted-foreground line-through decoration-muted-foreground/40">{a}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="italic text-muted-foreground">{b}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{c}</span>
            <span className="ml-auto"><Listen text={c!} /></span>
          </div>
        ))}
      </div>
      <Note tone="amber" title="The mistake to avoid">
        Don't hunt for a word that means “do”. <em>Fai lavori?</em> is not Italian. <em>Fare</em> means “to do” as an action (fare la spesa), never as a question helper.
      </Note>
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
