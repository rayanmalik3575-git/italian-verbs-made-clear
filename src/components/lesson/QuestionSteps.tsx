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
        <h2 className="text-2xl font-bold text-foreground sm:text-[28px] sm:leading-tight">Turn any statement into a question</h2>
        <p className="mt-2 max-w-[65ch] text-[17px] leading-[1.6] text-muted-foreground">By the end of this step you'll ask <i>Parli inglese?</i> and <i>Lavori?</i> without building the sentence word by word.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {["Use your voice", "Drop the English helper “do”", "Check yourself"].map((x, i) => (
            <li key={x} className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-[14px] font-medium text-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[14px] font-bold text-primary">{i + 1}</span>{x}
            </li>
          ))}
        </ul>
        <div className="mt-8"><TuneToggle /></div>
      </section>
      <Scene title={STEP1.rebuild.title} line={STEP1.rebuild.line}><RebuildCompare /></Scene>
      <Scene title={STEP1.pairsTitle} line={STEP1.pairsLine}>
        <Panel className="p-4 sm:p-6">
          <div className="mb-1 hidden grid-cols-2 gap-6 text-[14px] font-semibold uppercase tracking-wide sm:grid">
            <span className="text-voice-fall">Statement · voice lands</span><span className="text-voice-rise">Question · voice lifts</span>
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
          <p className="mt-3 text-foreground">{STEP1.longCaption}</p>
        </Panel>
        <p className="mt-4 text-[17px] font-semibold text-foreground">In writing, the ? is your voice. Never drop it.</p>
        <p className="mt-2 text-[14px] text-muted-foreground">{STEP1.regionNote}</p>
      </Scene>
      <section className="mt-14"><NoDo /></section>
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = { o: "I", i: "you", a: "he/she", iamo: "we", ate: "you all", ano: "they", ete: "you all", è: "is" };

const KEEP = ["abiti-qui-q", "hai-penna-q", "siete-stanchi-q"];

function NoDo() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-foreground">Forget “do”</h3>
      <p className="mb-5 mt-2 max-w-[65ch] text-[17px] leading-[1.6] text-muted-foreground">{STEP2.headline}</p>
      {STEP2.paragraphs.map((p) => <P key={p}>{p}</P>)}
      <H>{STEP2.habitTitle}</H>
      <ol className="max-w-3xl space-y-2">
        {STEP2.habit.map((h, i) => (
          <li key={h} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span><span className="pt-0.5">{h}</span></li>
        ))}
      </ol>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {STEP2.strips.filter((x) => KEEP.includes(x.id)).map((x) => (
          <StripAnimation key={x.id} item={x} sentence={{ id: x.id, italian: x.italian, english: x.english, type: "question", ...audioPaths(x.id) }} />
        ))}
      </div>
      <p className="mt-4 max-w-3xl font-medium text-foreground">{STEP2.stripNote}</p>
      <H>{STEP2.endingsTitle}</H>
      <Panel className="grid grid-cols-2 gap-px overflow-hidden bg-border sm:grid-cols-3">
        {STEP2.endings.map(([who, stem, end]) => (
          <div key={who} className="bg-card p-4">
            <div className="text-sm font-semibold text-muted-foreground">{who}</div>
            <EndingHighlight stem={stem} ending={end} label={ROLE_LABEL[end]} />
          </div>
        ))}
      </Panel>
      <p className="mt-4 max-w-3xl leading-relaxed">{STEP2.endingsNote}</p>
      <H>Watch out</H>
      <div className="space-y-3">
        {STEP2.warnings.slice(0, 1).map((w) => <WarningBox key={w.text} wrong={w.wrong} right={w.right}>{w.text}</WarningBox>)}
      </div>
      <H>Check yourself</H>
      <Quiz items={STEP2.quiz} onFinish={(sc, t) => recordStep("make", sc, t)} />
    </div>
  );
}
