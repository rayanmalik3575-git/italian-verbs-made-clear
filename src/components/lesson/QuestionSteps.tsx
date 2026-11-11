import { Info } from "lucide-react";
import { STEP1, STEP2, audioPaths, type Sentence } from "@/content/questions-lesson";
import { recordStep } from "@/lib/progress";
import { Panel } from "@/components/app-shell";
import { AudioButtons } from "./AudioButton";
import { PitchCurve } from "./PitchCurve";
import { EndingHighlight, WarningBox, WordGlossBar } from "./bits";
import { StripAnimation } from "./StripAnimation";
import { Quiz } from "./QuizCard";

const H1 = ({ children }: { children: string }) => <h2 className="mb-4 max-w-[22ch] text-balance text-2xl font-bold leading-snug text-foreground sm:text-[28px]">{children}</h2>;
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

export function StepVoice() {
  const l = STEP1.long;
  return (
    <div>
      <P>{"English rebuilds a sentence to ask something: you work → do you work? Italian doesn't. Learn the two moves that cover every question you'll ask at this level."}</P>
      <H1>{STEP1.headline}</H1>
      {STEP1.paragraphs.map((p) => <P key={p}>{p}</P>)}
      <p className="mb-6 flex w-fit max-w-[65ch] items-start gap-2 rounded-xl bg-muted px-3 py-2 text-[14px] text-muted-foreground"><Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{STEP1.footnote}</p>
      <Panel className="p-4 sm:p-6">
        <div className="mb-1 hidden grid-cols-2 gap-6 text-sm font-semibold uppercase tracking-wide sm:grid">
          <span className="text-voice-fall">Statement · voice falls</span><span className="text-voice-rise">Question · voice rises</span>
        </div>
        {STEP1.pairs.map(([a, b]) => (
          <div key={a.id} className="grid gap-x-6 border-b last:border-0 sm:grid-cols-2"><SentenceCell s={a} /><SentenceCell s={b} /></div>
        ))}
      </Panel>
      <Panel className="mt-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-end gap-2">
          {l.wordGloss!.map((w, i, arr) => (
            <div key={w} className="flex flex-col">
              <div className="h-10">{i === arr.length - 1 && <PitchCurve direction="rise" playingId={l.id} label={false} />}</div>
              <span className={`rounded-xl border px-3 py-2 text-lg font-semibold ${i === arr.length - 1 ? "border-voice-rise/40 text-voice-rise" : "bg-card text-foreground"}`}>{w}</span>
            </div>
          ))}
          <AudioButtons s={l} />
        </div>
        <div className="mt-2 text-[15px] text-muted-foreground">{l.english} · <span className="font-medium text-voice-rise">Typical pattern</span></div>
        <p className="mt-3 text-foreground">{STEP1.longCaption}</p>
      </Panel>
      <H>Know this</H>
      <Panel className="divide-y">
        {STEP1.knowThis.map(([k, v]) => (
          <div key={k} className="grid gap-1 p-4 sm:grid-cols-[180px_1fr] sm:gap-4"><div className="font-semibold">{k}</div><div className="leading-relaxed">{v}</div></div>
        ))}
      </Panel>
      <H>Check your ear</H>
      <Quiz items={STEP1.quiz} onFinish={(sc, t) => recordStep("voice", sc, t)} />
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = { o: "I", i: "you", a: "he/she", iamo: "we", ate: "you all", ano: "they", ete: "you all", è: "is" };

export function StepNoDo() {
  return (
    <div>
      <H1>{STEP2.headline}</H1>
      {STEP2.paragraphs.map((p) => <P key={p}>{p}</P>)}
      <Panel className="mt-6 divide-y">
        {STEP2.table.map((r) => (
          <div key={r.it.id} className="grid items-center gap-3 p-4 sm:grid-cols-[1fr_1.3fr_auto]">
            <div className="font-medium text-muted-foreground">{r.en}</div>
            <WordGlossBar words={r.it.italian.split(" ")} gloss={r.it.wordGloss ?? []} />
            <AudioButtons s={r.it} />
          </div>
        ))}
      </Panel>
      <H>{STEP2.habitTitle}</H>
      <ol className="max-w-3xl space-y-2">
        {STEP2.habit.map((h, i) => (
          <li key={h} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{i + 1}</span><span className="pt-0.5">{h}</span></li>
        ))}
      </ol>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {STEP2.strips.map((x) => (
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
        {STEP2.warnings.map((w) => <WarningBox key={w.text} wrong={w.wrong} right={w.right}>{w.text}</WarningBox>)}
      </div>
      <H>Check yourself</H>
      <Quiz items={STEP2.quiz} onFinish={(sc, t) => recordStep("nodo", sc, t)} />
    </div>
  );
}
