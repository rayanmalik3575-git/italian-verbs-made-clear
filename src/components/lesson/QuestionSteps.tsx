import { Mic, Pencil } from "lucide-react";
import { TuneToggle } from "./TuneToggle";
import { RebuildCompare } from "./RebuildCompare";
import { STEP1, STEP2, LONG, audioPaths, type Sentence } from "@/content/questions-lesson";
import { recordStep } from "@/lib/progress";
import { Panel } from "@/components/app-shell";
import { AudioButtons } from "./AudioButton";
import { PitchCurve } from "./PitchCurve";
import { EndingHighlight, WarningBox } from "./bits";
import { StripAnimation } from "./StripAnimation";
import { Quiz } from "./QuizCard";

const H = ({ children }: { children: string }) => <h3 className="mb-3 mt-10 text-xl font-bold text-foreground">{children}</h3>;
const P = ({ children }: { children: string }) => <p className="mb-3 max-w-[65ch] text-[17px] leading-[1.6] text-foreground">{children}</p>;

function SentenceCell({ s }: { s: Sentence }) {
  const rise = s.type === "question";
  return (
    <div className="min-w-0 py-3">
      <PitchCurve direction={rise ? "rise" : "fall"} playingId={s.id} />
      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className={`text-lg font-bold ${rise ? "text-voice-rise" : "text-voice-fall"}`}>{s.italian}</div>
          <div className="text-[15px] text-muted-foreground">{s.english}</div>
        </div>
        <AudioButtons s={s} />
      </div>
    </div>
  );
}

function Scene({ title, line, children }: { title: string; line: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 first:mt-0">
      <h3 className="text-2xl font-bold text-foreground">{title}</h3>
      <p className="mb-5 mt-2 max-w-[65ch] text-[17px] leading-[1.6] text-muted-foreground">{line}</p>
      {children}
    </section>
  );
}

export function StepVoice() {
    return (
    <div>
      <section className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="flex max-w-[26ch] items-center gap-3 text-left text-2xl font-bold leading-tight text-foreground sm:text-[30px]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">1</span>
          How Italian asks a yes/no question
        </h2>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-foreground"><b>This is the first rule of asking questions in Italian.</b> In English you add "do" or flip the words: <b>"you speak"</b> becomes <b>"do you speak?"</b>. Italian does neither. You say the statement exactly as it is, and change only one thing:</p>
        <ul className="mt-5 space-y-2 text-left text-[17px] leading-[1.6] text-foreground">
          <li className="flex gap-2"><Mic className="mt-1 h-5 w-5 shrink-0 text-voice-rise" aria-hidden /><span><b>Speaking:</b> your voice lifts at the end. That change of tone is how the listener knows you're asking.</span></li>
          <li className="flex gap-2"><Pencil className="mt-1 h-5 w-5 shrink-0 text-voice-rise" aria-hidden /><span><b>Writing:</b> you put a question mark at the end.</span></li>
        </ul>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-muted-foreground">Everything else stays the same: same words, same order, same verb. Italians ask questions this way all day, at the bar, on the phone and with friends.</p>
      </section>
      <section className="mt-6">
        <Panel className="p-4 sm:p-6">
          <div className="mb-1 hidden grid-cols-2 gap-6 text-[14px] font-semibold uppercase tracking-wide sm:grid">
            <span className="text-voice-fall">Statement · voice settles</span><span className="text-voice-rise">Question · voice lifts</span>
          </div>
          {STEP1.pairs.map(([a, b]) => (
            <div key={a.id} className="grid gap-x-6 border-b last:border-0 sm:grid-cols-2"><SentenceCell s={a} /><SentenceCell s={b} /></div>
          ))}
        </Panel>
        <p className="mt-4 max-w-[65ch] text-[15px] text-muted-foreground">When texting, always keep the <b className="text-foreground">?</b>, because without it the reader sees a statement.</p>
      </section>
      <SayWriteAnswer />
      <LongQuestions />
      <section className="mt-14"><NoDo /></section>
    </div>
  );
}

const REPLIES: [string, string][] = [
  ["Certo!", "Sure, of course"], ["Dipende.", "It depends"], ["Un po'.", "A little"],
  ["Magari!", "I wish!"], ["Per niente.", "Not at all"], ["Boh.", "No idea"],
];
const TIPS: [string, string][] = [
  ["Leave out \"you\".", "Vieni? and Hai fame? are complete questions; the ending already says who. Tu vieni? stresses YOU, as in \"are YOU coming?\"."],
  ["Strangers and formal situations.", "Same tune, formal verb: Parla inglese? instead of Parli inglese?"],
  ["Don't answer with a bare sì.", "Natives usually repeat the verb: Hai fame? → Sì, ho fame. It sounds warmer and confirms you understood."],
  ["Soften with the end words.", "Add no? or vero? to check something you think is true: Sei italiano, vero? (You're Italian, right?)"],
  ["Regional melody.", "The lift is the standard pattern. Some regions (for example Naples) use a different melody. Copy the people around you."],
];

function SayWriteAnswer() {
  return (
    <section className="mt-14">
      <H>Answers natives actually use</H>
      <div className="grid gap-2 sm:grid-cols-3">
        {REPLIES.map(([it, en]) => (
          <div key={it} className="rounded-xl border bg-card px-4 py-3"><div className="font-bold text-foreground">{it}</div><div className="text-[14px] text-muted-foreground">{en}</div></div>
        ))}
      </div>
      <H>What every learner should know</H>
      <ul className="space-y-3">
        {TIPS.map(([b, txt]) => <li key={b} className="max-w-[70ch] text-[16px] leading-[1.6] text-foreground"><b>{b}</b> {txt}</li>)}
      </ul>
    </section>
  );
}

const ROLE_LABEL: Record<string, string> = { o: "I", i: "you", a: "he/she", iamo: "we", ate: "you all", ano: "they", ete: "you all", è: "is" };


function NoDo() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-foreground">Why Italian needs no "do"</h3>
      <p className="mt-2 max-w-[65ch] text-[17px] leading-[1.6] text-foreground">To ask a question, English adds "do" or moves words around: <i>you speak</i> becomes <i>do you speak?</i>, <i>you are</i> becomes <i>are you?</i>. Italian does neither. The verb ending already tells you who is doing the action, so <i>parli</i> already means "you speak", and <i>Parli?</i> already means "do you speak?".</p>
      <div className="mt-6"><RebuildCompare /></div>
      <p className="mt-4 max-w-[65ch] text-[17px] leading-[1.6] text-foreground">So don't look for an Italian word for "do". Think of the action, say it, and lift your voice.</p>
      <H>Watch out</H>
      <div className="space-y-3">
        {STEP2.warnings.slice(0, 1).map((w) => <WarningBox key={w.text} wrong={w.wrong} right={w.right}>{w.text}</WarningBox>)}
      </div>
      <H>Check yourself</H>
      <Quiz items={STEP2.quiz} onFinish={(sc, t) => recordStep("make", sc, t)} />
    </div>
  );
}

function Blocks({ blocks }: { blocks: string[] }) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      {blocks.map((w, i, arr) => {
        const last = i === arr.length - 1;
        return (
          <div key={w} className="flex flex-col">
            <div className="h-8 w-full">
              <svg viewBox="0 0 100 38" preserveAspectRatio="none" className={`h-full w-full ${last ? "text-voice-rise" : "text-muted-foreground/50"}`} aria-hidden>
                <path d={last ? "M0,26 C50,26 70,26 98,4" : "M0,26 L100,26"} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <span className={`rounded-xl border px-3 py-2 text-lg font-semibold ${last ? "border-voice-rise/40 text-voice-rise" : "bg-card text-foreground"}`}>{w}</span>
          </div>
        );
      })}
    </div>
  );
}

function LongQuestions() {
  return (
    <section className="mt-14">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <h2 className="flex max-w-[28ch] items-center gap-3 text-left text-2xl font-bold leading-tight text-foreground sm:text-[30px]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">2</span>
          How to say a long question
        </h2>
        <p className="mt-4 max-w-[60ch] text-[17px] leading-[1.6] text-foreground"><b>The rule is the same, the sentence is just longer.</b> Most learners rush a long question or lift their voice too early. Natives say it in small blocks: level, level, and a lift only at the very end.</p>
      </div>
      <ul className="mx-auto mt-6 max-w-[720px] space-y-3">
        {LONG.rules.map((r, i) => (
          <li key={r.title} className="flex gap-3 text-[17px] leading-[1.6] text-foreground">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[14px] font-bold text-foreground">{i + 1}</span>
            <span><b>{r.title}</b> {r.text}</span>
          </li>
        ))}
      </ul>
      <Panel className="mt-8 p-4 sm:p-6">
        {LONG.examples.map((e) => (
          <div key={e.sentence.id} className="border-b py-5 first:pt-0 last:border-0 last:pb-0">
            <div className="flex flex-wrap items-end justify-between gap-3"><Blocks blocks={e.blocks} /><AudioButtons s={e.sentence} /></div>
            <div className="mt-2 text-[15px] text-muted-foreground">{e.sentence.english}</div>
            <p className="mt-1 text-[15px] text-foreground">{e.note}</p>
          </div>
        ))}
      </Panel>
      <H>{LONG.build.title}</H>
      <P>{LONG.build.line}</P>
      <Panel className="p-4 sm:p-6">
        <ol className="space-y-3">
          {LONG.build.steps.map((s, i) => (
            <li key={s.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
              <div className="min-w-0" style={{ paddingLeft: `${i * 12}px` }}>
                <div className="text-lg font-bold text-foreground">{s.italian.split(" ").map((w, j, arr) => <span key={j} className={j === arr.length - 1 ? "text-voice-rise" : ""}>{w}{j < arr.length - 1 ? " " : ""}</span>)}</div>
                <div className="text-[15px] text-muted-foreground">{s.english}</div>
              </div>
              <AudioButtons s={s} />
            </li>
          ))}
        </ol>
      </Panel>
      <H>Common mistakes</H>
      <div className="space-y-3">
        {LONG.mistakes.map((m) => <WarningBox key={m.text} wrong={m.wrong} right={m.right}>{m.text}</WarningBox>)}
      </div>
    </section>
  );
}
