import { TuneToggle } from "./TuneToggle";
import { RebuildCompare } from "./RebuildCompare";
import { STEP1, STEP2, audioPaths, type Sentence } from "@/content/questions-lesson";
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
  const l = STEP1.long;
  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold text-foreground sm:text-[28px] sm:leading-tight">What a question is, and how Italian asks one</h2>
        <p className="mt-3 max-w-[65ch] text-[17px] leading-[1.6] text-foreground">A question is simply a sentence that waits for an answer. Some questions want a <b>yes or no</b> (<i>Parli inglese?</i>), others want a piece of information and start with a word like <i>dove</i> or <i>quando</i>. This first step is about the yes/no kind.</p>
        <p className="mt-3 max-w-[65ch] text-[17px] leading-[1.6] text-foreground">Here is the good news: in Italian you don't change the sentence at all. You take the statement, keep every word where it is, and let your voice <b className="text-voice-rise">go up at the end</b>. When you write, the <b>?</b> does that same job.</p>
      </section>
      <Scene title={STEP1.pairsTitle} line="Listen to each pair. The words are identical; only the ending of your voice changes. A statement settles down, a question stays open and lifts, because you are waiting for the other person to answer.">
        <Panel className="p-4 sm:p-6">
          <div className="mb-1 hidden grid-cols-2 gap-6 text-[14px] font-semibold uppercase tracking-wide sm:grid">
            <span className="text-voice-fall">Statement · voice settles</span><span className="text-voice-rise">Question · voice lifts</span>
          </div>
          {STEP1.pairs.map(([a, b]) => (
            <div key={a.id} className="grid gap-x-6 border-b last:border-0 sm:grid-cols-2"><SentenceCell s={a} /><SentenceCell s={b} /></div>
          ))}
        </Panel>
        <Panel className="mt-6 p-4 sm:p-6">
          <div className="flex flex-wrap items-end gap-2">
            {l.wordGloss!.map((w, i, arr) => (
              <div key={w} className="flex flex-col">
                <div className="h-10 w-full">
                  <svg viewBox="0 0 100 38" preserveAspectRatio="none" className={`h-full w-full ${i === arr.length - 1 ? "text-voice-rise" : "text-muted-foreground/50"}`} aria-hidden>
                    <path d={i === arr.length - 1 ? "M0,26 C50,26 70,26 98,4" : "M0,26 L100,26"} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <span className={`rounded-xl border px-3 py-2 text-lg font-semibold ${i === arr.length - 1 ? "border-voice-rise/40 text-voice-rise" : "bg-card text-foreground"}`}>{w}</span>
              </div>
            ))}
            <AudioButtons s={l} />
          </div>
          <div className="mt-2 text-[15px] text-muted-foreground">{l.english}</div>
          <p className="mt-3 text-foreground">With a longer question, keep your voice level through the sentence and lift only on the last words.</p>
        </Panel>
        <p className="mt-4 max-w-[65ch] text-[15px] text-muted-foreground">When texting, always keep the <b className="text-foreground">?</b>, because without it the reader sees a statement. {STEP1.regionNote}</p>
      </Scene>
      <section className="mt-14"><NoDo /></section>
    </div>
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
