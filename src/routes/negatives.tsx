import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, X, Volume2, RotateCcw, Lightbulb, AlertTriangle, Link2, MessageCircle, Ban, Lock,
} from "lucide-react";
import { PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";
import {
  FLIP_TASKS, SPOT_TASKS, REPLY_TASKS, checkFlip, checkReply, expectedNegative,
} from "@/data/negatives";

export const Route = createFileRoute("/negatives")({
  head: () => ({
    meta: [
      { title: "Italian Negative Sentences: no vs non — Parlami" },
      { name: "description", content: "How to say “don't” in Italian: where non goes, why it never splits a verb block, and how to answer with no." },
      { property: "og:title", content: "Negative sentences in Italian — Parlami" },
      { property: "og:description", content: "One word, one position, two blocks you never break. Master Italian negatives." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NegativesPage,
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

const Non = () => <span className="rounded-md bg-pink/10 px-1.5 font-bold text-pink">non</span>;

/** Renders an Italian sentence with "non" highlighted. */
function It({ text, big }: { text: string; big?: boolean }) {
  const parts = text.split(/(\bnon\b|\bNon\b)/);
  return (
    <span className={big ? "text-xl font-semibold text-foreground" : "font-semibold text-foreground"}>
      {parts.map((p, i) => (/^non$/i.test(p) ? <span key={i} className="rounded-md bg-pink/10 px-1 font-bold text-pink">{p}</span> : <span key={i}>{p}</span>))}
    </span>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 max-w-3xl text-[17px] leading-relaxed text-foreground">{children}</p>;
}
function H({ n, children }: { n?: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-8 flex items-baseline gap-2 text-xl font-bold text-foreground first:mt-0">
      {n && <span className="text-sm font-semibold text-primary">{n}</span>}{children}
    </h2>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 max-w-3xl leading-relaxed text-muted-foreground">{children}</p>;
}
function Note({ tone = "blue", icon: I = Lightbulb, title, children }: { tone?: "blue" | "amber"; icon?: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  const c = tone === "blue" ? "border-primary/20 bg-primary/5 text-primary" : "border-amber-300/50 bg-amber-50 text-amber-700";
  return (
    <div className={`my-6 flex max-w-3xl gap-3 rounded-2xl border p-4 ${c}`}>
      <I className="mt-0.5 h-5 w-5 shrink-0" />
      <div><div className="font-semibold">{title}</div><div className="mt-1 leading-relaxed text-foreground">{children}</div></div>
    </div>
  );
}
function Pair({ a, b, en }: { a: string; b: string; en: [string, string] }) {
  return (
    <div className="grid items-center gap-2 border-b py-3 last:border-0 sm:grid-cols-[1fr_auto_1fr_auto]">
      <div><It text={a} /><div className="text-sm text-muted-foreground">{en[0]}</div></div>
      <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
      <div><It text={b} /><div className="text-sm text-muted-foreground">{en[1]}</div></div>
      <Listen text={b} />
    </div>
  );
}
function Wrong({ bad, good, why }: { bad: string; good: string; why: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b py-3 last:border-0">
      <span className="inline-flex items-center gap-1 text-muted-foreground line-through decoration-destructive"><X className="h-4 w-4 text-destructive" />{bad}</span>
      <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-success" /><It text={good} /></span>
      <span className="text-sm text-muted-foreground">{why}</span>
      <span className="ml-auto"><Listen text={good} /></span>
    </div>
  );
}

const TABS = ["Sì, no & non", "Where non goes", "Blocks you never break", "Sound natural", "Practise"];

function NegativesPage() {
  const [step, setStep] = useState(0);
  const go = (s: number) => { setStep(s); if (typeof window !== "undefined") window.scrollTo({ top: 0 }); };
  return (
    <div>
      <PageHeader title="Negative sentences: saying “don't”"
        description="English needs don't, doesn't, didn't, am not, isn't. Italian needs one small word in one fixed place. This lesson shows you that place, and the two blocks it can never break into." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button key={t} role="tab" aria-selected={step === i} onClick={() => go(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {step === 0 && <StepWords />}
      {step === 1 && <StepPosition />}
      {step === 2 && <StepBlocks />}
      {step === 3 && <StepNatural />}
      {step === 4 && <StepPractice />}
      <div className="mt-8 flex justify-between gap-3">
        {step > 0 ? <button className={btn.outline} onClick={() => go(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}
        {step < 4 && <button className={btn.primary} onClick={() => go(step + 1)}>Next: {TABS[step + 1]} <ArrowRight className="h-4 w-4" /></button>}
      </div>
    </div>
  );
}

function StepWords() {
  return (
    <div>
      <Lead>
        Before we make sentences negative, separate three little words. Beginners mix up <strong>no</strong> and <strong>non</strong> more than anything else in this lesson,
        and once you see what each one does, the rest is easy.
      </Lead>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { w: "sì", en: "yes", job: "An answer on its own.", d: "Always written with the accent. Without it, si is a different word you'll meet later." },
          { w: "no", en: "no", job: "An answer on its own.", d: "Open, round O — close to the “no” in eggnog. It can stand alone: “Caffè?” — “No.”" },
          { w: "non", en: "not / don't", job: "Works on a verb.", d: "It can't stand alone. It always needs a verb right after it: non parlo, non sono." },
        ].map((c) => (
          <Panel key={c.w} className="p-5">
            <div className="flex items-start justify-between">
              <div className={`text-4xl font-bold ${c.w === "non" ? "text-pink" : "text-primary"}`}>{c.w}</div>
              <Listen text={c.w} />
            </div>
            <div className="mt-1 text-sm font-semibold text-muted-foreground">{c.en}</div>
            <div className="mt-3 font-semibold text-foreground">{c.job}</div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </Panel>
        ))}
      </div>
      <Note title="The simple test">
        Ask yourself: <em>is there a verb right after it?</em> If yes, you need <Non />. If the word is alone, as an answer, you need <strong>no</strong>.
      </Note>
      <H>Why Italian needs no “do”</H>
      <P>
        To make a verb negative, English brings in a helper: <em>I speak → I <strong>do</strong> not speak</em>, <em>he works → he <strong>does</strong> not work</em>.
        Italian has no helper verb. You keep the verb exactly as it is, already conjugated, and put <Non /> in front of it. You don't learn new verb forms, and nothing changes for io, tu or loro.
      </P>
      <Panel className="p-5">
        <Pair a="parlo italiano" b="non parlo italiano" en={["I speak Italian", "I don't speak Italian"]} />
        <Pair a="sono americano" b="non sono americano" en={["I'm American", "I'm not American"]} />
        <Pair a="Giulia lavora" b="Giulia non lavora" en={["Giulia works", "Giulia doesn't work"]} />
      </Panel>
      <P>
        <span className="mt-4 block">Notice that <em>don't</em>, <em>'m not</em> and <em>doesn't</em> are all the same <Non /> in Italian. Learn one word and you have them all.</span>
      </P>
    </div>
  );
}

function StepPosition() {
  return (
    <div>
      <Lead>
        Now you know the word. Here is the rule for where it goes, and it never changes: <strong><Non /> goes directly before the verb.</strong>
      </Lead>
      <Panel className="mb-6 p-6">
        <div className="mb-3 text-sm font-semibold text-muted-foreground">The negative sentence formula</div>
        <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
          <span className="rounded-xl border border-dashed px-3 py-2 text-muted-foreground">(subject)</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-xl bg-pink/10 px-3 py-2 text-pink">non</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-xl bg-primary/10 px-3 py-2 text-primary">verb</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="rounded-xl border px-3 py-2 text-muted-foreground">the rest</span>
        </div>
      </Panel>

      <H n="1">Without a subject (the usual way)</H>
      <P>
        As you saw in Verbs, the ending <em>-o</em> already tells everyone it's “I”, so Italians usually leave <em>io</em> out. Then <Non /> is the first word of the sentence.
      </P>
      <Panel className="mb-6 p-5">
        <Pair a="capisco" b="non capisco" en={["I understand", "I don't understand"]} />
        <Pair a="abito qui" b="non abito qui" en={["I live here", "I don't live here"]} />
      </Panel>

      <H n="2">With a subject</H>
      <P>
        Use the subject when you want to stress it, or when it's a name. It goes <strong className="text-foreground">before</strong> <Non />, never after.
      </P>
      <Panel className="mb-2 p-5">
        <Pair a="io parlo italiano" b="io non parlo italiano" en={["I speak Italian", "I (personally) don't speak Italian"]} />
        <Pair a="Marco mangia carne" b="Marco non mangia carne" en={["Marco eats meat", "Marco doesn't eat meat"]} />
      </Panel>
      <Panel className="mb-6 p-5">
        <Wrong bad="non io parlo italiano" good="io non parlo italiano" why="Subject first, then non." />
      </Panel>

      <H n="3">Say it as one word</H>
      <P>
        <Non /> is short, but it carries the whole meaning. Don't pause after it. Say <em>non‑parlo</em> as if it were one word. If you stop after <em>non</em>, the listener waits for something and the sentence sounds broken.
      </P>
      <div className="flex flex-wrap gap-2">
        {["non parlo", "non sono", "non capisco", "non voglio"].map((w) => (
          <button key={w} onClick={() => speak(w)} className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 hover:bg-accent">
            <It text={w} /><Volume2 className="h-4 w-4 text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}

function StepBlocks() {
  return (
    <div>
      <Lead>
        The rule says “before the verb”. But some verbs come with a partner that's stuck to them. When that happens, <Non /> goes before the <strong>whole block</strong>.
        You'll study these structures properly later. You meet the rule now so you never pick up the wrong habit.
      </Lead>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /><span className="font-bold text-foreground">Block 1 · little word + verb</span></div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Short words like <strong>mi, ti, lo</strong> (“me”, “you”, “it”) sit in front of the verb and belong to it. Together they work as one unit.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
            <span className="rounded-xl bg-pink/10 px-3 py-1.5 text-pink">non</span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 text-primary"><Lock className="h-4 w-4" />ti amo</span>
          </div>
        </Panel>
        <Panel className="p-5">
          <div className="mb-3 flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /><span className="font-bold text-foreground">Block 2 · two-word verbs</span></div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            Some verbs are made of two words, like <strong>ho capito</strong> (“I understood”). It looks like two words, but it is one verb.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
            <span className="rounded-xl bg-pink/10 px-3 py-1.5 text-pink">non</span>
            <span className="inline-flex items-center gap-1 rounded-xl bg-primary/10 px-3 py-1.5 text-primary"><Lock className="h-4 w-4" />ho capito</span>
          </div>
        </Panel>
      </div>

      <H>The mistakes to avoid</H>
      <P>Each of these sounds wrong to Italians straight away. The fix is always the same: put <Non /> at the front of the block.</P>
      <Panel className="p-5">
        <Wrong bad="ti non amo" good="non ti amo" why="I don't love you" />
        <Wrong bad="mi non chiamo Peter" good="non mi chiamo Peter" why="My name isn't Peter" />
        <Wrong bad="mi non piace l'Italia" good="non mi piace l'Italia" why="I don't like Italy" />
        <Wrong bad="lo non so" good="non lo so" why="I don't know" />
        <Wrong bad="ho non capito" good="non ho capito" why="I didn't understand" />
      </Panel>

      <Note tone="amber" icon={AlertTriangle} title="Why English speakers fall into this trap">
        English puts “not” <em>inside</em> two-word verbs: I have <strong>not</strong> understood. Italian never does. <em>Ho capito</em> stays together, and <Non /> stays outside it.
      </Note>

      <H>Everything together</H>
      <P>If a sentence has a subject and a block, the order is still the same chain:</P>
      <Panel className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
          <span className="rounded-xl border px-3 py-1.5 text-muted-foreground">io</span>
          <span className="rounded-xl bg-pink/10 px-3 py-1.5 text-pink">non</span>
          <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-primary">mi chiamo</span>
          <span className="rounded-xl border px-3 py-1.5 text-muted-foreground">Francesco</span>
          <span className="ml-auto"><Listen text="io non mi chiamo Francesco" /></span>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">subject → non → block → the rest</div>
      </Panel>
    </div>
  );
}

function StepNatural() {
  return (
    <div>
      <Lead>
        Your grammar can be correct and still sound foreign. This step covers the habit that makes your negatives sound Italian: <strong>the double no</strong> when you answer.
      </Lead>
      <H>Answer with “No,” then <Non /></H>
      <P>
        English does this too: <em>“No, I don't.”</em> Learners often drop the first <strong>no</strong> and reply only “non voglio…”. That's grammatical, but in conversation it sounds abrupt, a bit odd. Give the answer first, then the negative sentence.
      </P>
      <Panel className="mb-6 p-5">
        {REPLY_TASKS.map((r) => (
          <div key={r.q} className="flex flex-wrap items-center gap-3 border-b py-3 last:border-0">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{r.q}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span><span className="font-bold text-primary">No,</span> <It text={r.answer.replace(/^No, /, "")} /></span>
            <span className="text-sm text-muted-foreground">({r.en})</span>
            <span className="ml-auto"><Listen text={r.answer} /></span>
          </div>
        ))}
      </Panel>
      <P>
        Say it out loud: “<em>No, non ho capito</em>”. The two words sound almost the same, which is why beginners mix them up. Make a small pause after the first <strong>No,</strong> where the comma is, and no pause after <Non />.
      </P>

      <H>Three negatives you'll use every day in Italy</H>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { it: "Non lo so.", en: "I don't know.", d: "Your answer to any question you can't answer." },
          { it: "Non ho capito.", en: "I didn't catch that.", d: "Your most useful tool as a learner. Add “Può ripetere?”" },
          { it: "Non parlo bene l'italiano.", en: "I don't speak Italian well.", d: "People will slow down for you." },
        ].map((c) => (
          <Panel key={c.it} className="p-5">
            <div className="flex items-start justify-between gap-2"><It text={c.it} big /><Listen text={c.it} /></div>
            <div className="mt-1 text-sm font-semibold text-muted-foreground">{c.en}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
          </Panel>
        ))}
      </div>

      <Note title="Coming later: double negatives are normal">
        In English, “I don't see nobody” is wrong. In Italian it's the correct way: <It text="non vedo nessuno" /> (I don't see anyone), <It text="non bevo mai" /> (I never drink).
        The rule you learned today doesn't change: <Non /> before the verb, then the second word after it. We'll practise these in a later lesson.
      </Note>
    </div>
  );
}

/* ---------------- Practice ---------------- */

function shuffle<T>(a: T[]) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j]!, r[i]!]; }
  return r;
}

type Q =
  | { kind: "flip"; t: (typeof FLIP_TASKS)[number] }
  | { kind: "spot"; t: (typeof SPOT_TASKS)[number] }
  | { kind: "reply"; t: (typeof REPLY_TASKS)[number] };

function buildRound(): Q[] {
  return [
    ...shuffle(FLIP_TASKS).slice(0, 5).map((t) => ({ kind: "flip" as const, t })),
    ...shuffle(SPOT_TASKS).slice(0, 4).map((t) => ({ kind: "spot" as const, t })),
    ...shuffle(REPLY_TASKS).slice(0, 2).map((t) => ({ kind: "reply" as const, t })),
  ];
}

function StepPractice() {
  const [seed, setSeed] = useState(0);
  const round = useMemo(() => buildRound(), [seed]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const q = round[i];
  const done = i >= round.length;

  const restart = () => { setSeed(seed + 1); setI(0); setScore(0); setInput(""); setResult(null); };
  const submit = (ok: boolean, say: string) => { setResult(ok); if (ok) setScore((s) => s + 1); speak(say); };
  const next = () => { setI(i + 1); setInput(""); setResult(null); };

  if (done) {
    return (
      <Panel className="p-8 text-center">
        <div className="text-3xl font-bold text-foreground">{score} / {round.length}</div>
        <p className="mt-2 text-muted-foreground">{score === round.length ? "Every non in the right place." : "Go back over the ones you missed, then try a fresh round."}</p>
        <button className={`${btn.primary} mt-6`} onClick={restart}><RotateCcw className="h-4 w-4" /> New round</button>
      </Panel>
    );
  }
  if (!q) return null;

  const expected = q.kind === "flip" ? expectedNegative(q.t) : q.kind === "reply" ? q.t.answer : q.t.fix;

  return (
    <div>
      <ProgressBar value={(i / round.length) * 100} label={`Question ${i + 1} of ${round.length}`} />
      <Panel className="mt-4 p-6">
        {q.kind === "flip" && (
          <>
            <div className="text-sm font-semibold text-primary">Make it negative</div>
            <div className="mt-2 flex items-center gap-2"><span className="text-2xl font-semibold text-foreground">{q.t.it}</span><Listen text={q.t.it} /></div>
            <div className="text-muted-foreground">{q.t.en} → <strong className="text-foreground">{q.t.neg_en}</strong></div>
          </>
        )}
        {q.kind === "reply" && (
          <>
            <div className="text-sm font-semibold text-primary">Answer “no” in a full sentence</div>
            <div className="mt-2 flex items-center gap-2"><span className="text-2xl font-semibold text-foreground">{q.t.q}</span><Listen text={q.t.q} /></div>
            <div className="text-muted-foreground">{q.t.qEn} → <strong className="text-foreground">{q.t.en}</strong></div>
          </>
        )}
        {q.kind === "spot" && (
          <>
            <div className="text-sm font-semibold text-primary">Is this sentence correct?</div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{q.t.sentence}</div>
          </>
        )}

        {q.kind !== "spot" ? (
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => {
            e.preventDefault();
            if (result !== null || !input.trim()) return;
            submit(q.kind === "flip" ? checkFlip(input, q.t) : checkReply(input, q.t), expected);
          }}>
            <input autoFocus value={input} onChange={(e) => setInput(e.target.value)} disabled={result !== null}
              placeholder="Type the Italian sentence" aria-label="Your answer"
              className="min-h-12 flex-1 rounded-xl border bg-background px-4 text-lg text-foreground outline-none focus:border-primary" />
            {result === null && <button type="submit" className={btn.primary}>Check</button>}
          </form>
        ) : result === null && (
          <div className="mt-5 flex gap-3">
            <button className={btn.outline} onClick={() => submit(q.t.ok, q.t.fix)}><Check className="h-4 w-4" /> Correct</button>
            <button className={btn.outline} onClick={() => submit(!q.t.ok, q.t.fix)}><Ban className="h-4 w-4" /> Wrong</button>
          </div>
        )}

        {result !== null && (
          <div className={`mt-5 rounded-2xl border p-4 ${result ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
            <div className="flex items-center gap-2 font-semibold text-foreground">
              {result ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />}
              {result ? "Right." : "Not quite."}
            </div>
            <div className="mt-2 flex items-center gap-2"><It text={expected} big /><Listen text={expected} /></div>
            <p className="mt-1 text-sm text-muted-foreground">
              {q.kind === "flip" ? q.t.hint : q.kind === "spot" ? q.t.why : "First “No,” as the answer, then non before the verb."}
            </p>
            <button className={`${btn.primary} mt-4`} onClick={next}>Next <ArrowRight className="h-4 w-4" /></button>
          </div>
        )}
      </Panel>
    </div>
  );
}
