import { useState } from "react";
import { ArrowRight, Check, Eye, RotateCcw, Volume2, X } from "lucide-react";
import { Panel, ProgressBar, btn } from "@/components/app-shell";
import { READINGS, STORIES, TRANSLATE, matches, type Translate } from "@/content/review-extras";

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT"; u.rate = 0.9;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("it"));
  if (v) u.voice = v;
  if (text.trim().endsWith("?")) u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

const ACCENTS = ["à", "è", "é", "ì", "ò", "ù", "'"];
const Hear = ({ text }: { text: string }) => (
  <button aria-label="Hear it" onClick={() => speak(text)} className="rounded-full p-1.5 hover:bg-muted"><Volume2 className="h-4 w-4" /></button>
);

/** One English line → typed Italian, graded with feedback. */
function TranslateCard({ item, onDone, last }: { item: Translate; onDone: (ok: boolean) => void; last: boolean }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const check = () => { const ok = matches(item, text); setResult(ok); speak(item.answers[0]!); };
  return (
    <div>
      <p className="text-sm font-semibold text-muted-foreground">Say it in Italian</p>
      <p className="mt-1 text-2xl font-bold">{item.english}</p>
      <textarea value={text} disabled={result !== null} onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (result === null && text.trim()) check(); } }}
        rows={2} aria-label="Your Italian" placeholder="Scrivi in italiano…"
        className="mt-4 w-full rounded-[14px] border bg-card p-3 text-[17px] outline-none focus:border-primary" />
      {result === null && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {ACCENTS.map((a) => <button key={a} onClick={() => setText((t) => t + a)} className="h-9 min-w-9 rounded-lg border text-[16px] font-semibold hover:bg-muted">{a}</button>)}
          <button className={`${btn.cta} ml-auto`} disabled={!text.trim()} onClick={check}>Check</button>
        </div>
      )}
      {result !== null && (
        <div className={`mt-4 rounded-[14px] border p-4 ${result ? "border-success/40 bg-tile-green/50" : "border-destructive/40 bg-destructive/5"}`}>
          <div className="flex items-center gap-2 font-bold">
            {result ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />}
            <span>{item.answers[0]!}</span><Hear text={item.answers[0]!} />
          </div>
          {item.answers.length > 1 && <p className="mt-1 text-[15px]">Also right: {item.answers.slice(1).join(" · ")}</p>}
          <p className="mt-2 text-[16px] leading-relaxed">{item.why}</p>
          <button className={`${btn.cta} mt-4`} onClick={() => onDone(result)}>{last ? "See result" : "Next"} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

function Result({ score, total, onAgain, children }: { score: number; total: number; onAgain: () => void; children?: React.ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-muted-foreground">Complete</p>
      <p className="mt-2 text-5xl font-bold">{score}/{total}</p>
      {children}
      <button className={`${btn.cta} mt-6`} onClick={onAgain}><RotateCcw className="h-4 w-4" /> Again</button>
    </div>
  );
}

export function TranslateMode() {
  const [round, setRound] = useState(0);
  const [i, setI] = useState(0); const [score, setScore] = useState(0);
  const items = TRANSLATE;
  if (i >= items.length) return <Panel><Result score={score} total={items.length} onAgain={() => { setI(0); setScore(0); setRound((r) => r + 1); }} /></Panel>;
  return (
    <Panel>
      <div className="mb-5 flex justify-between text-sm text-muted-foreground"><span>English → Italian</span><span>{i + 1} / {items.length}</span></div>
      <ProgressBar value={(i / items.length) * 100} label="Progress" />
      <div className="mt-6"><TranslateCard key={`${round}-${i}`} item={items[i]!} last={i + 1 === items.length} onDone={(ok) => { if (ok) setScore((s) => s + 1); setI((x) => x + 1); }} /></div>
    </Panel>
  );
}

export function StoryMode() {
  const [s, setS] = useState(0); const [i, setI] = useState(0); const [score, setScore] = useState(0);
  const story = STORIES[s]!;
  const done = i >= story.lines.length;
  const reset = (n: number) => { setS(n); setI(0); setScore(0); };
  const full = story.lines.map((l) => l.answers[0].replace(/([^?])$/, "$1.")).join(" ");
  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {STORIES.map((st, n) => <button key={st.id} onClick={() => reset(n)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${n === s ? "border-primary bg-tile-blue text-tile-blue-ink" : "hover:bg-muted"}`}>{st.title}</button>)}
      </div>
      <div className="mt-5 rounded-[14px] border bg-muted/40 p-4">
        <p className="text-sm font-semibold text-muted-foreground">The paragraph</p>
        <p className="mt-1 text-[17px] leading-relaxed">
          {story.lines.map((l, n) => <span key={l.id} className={n === i ? "rounded bg-tile-blue px-1 font-semibold text-tile-blue-ink" : n < i ? "opacity-60" : ""}>{l.english} </span>)}
        </p>
      </div>
      {i > 0 && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-muted-foreground">Your Italian so far</p>
          <p className="mt-1 text-[17px] font-semibold leading-relaxed">{story.lines.slice(0, i).map((l) => l.answers[0]).join(" · ")}</p>
        </div>
      )}
      <div className="mt-6">
        {done ? (
          <Result score={score} total={story.lines.length} onAgain={() => reset(s)}>
            <p className="mx-auto mt-4 max-w-[60ch] text-[17px] leading-relaxed">{full}</p>
            <button className={`${btn.outline} mt-4`} onClick={() => speak(full)}><Volume2 className="h-4 w-4" /> Hear the whole story</button>
          </Result>
        ) : (
          <TranslateCard key={`${s}-${i}`} item={story.lines[i]!} last={i + 1 === story.lines.length} onDone={(ok) => { if (ok) setScore((x) => x + 1); setI((x) => x + 1); }} />
        )}
      </div>
    </Panel>
  );
}

export function ReadingMode() {
  const [r, setR] = useState(0); const [picked, setPicked] = useState<Record<number, string>>({}); const [showEn, setShowEn] = useState(false);
  const rd = READINGS[r]!;
  const answered = Object.keys(picked).length;
  const score = rd.questions.filter((q, n) => picked[n] === q.answer).length;
  const pick = (n: number) => { setR(n); setPicked({}); setShowEn(false); };
  return (
    <Panel>
      <div className="flex flex-wrap gap-2">
        {READINGS.map((x, n) => <button key={x.id} onClick={() => pick(n)} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${n === r ? "border-primary bg-tile-blue text-tile-blue-ink" : "hover:bg-muted"}`}>{x.title}</button>)}
      </div>
      <div className="mt-5 rounded-[14px] border p-5">
        <div className="flex items-center justify-between"><p className="text-sm font-semibold text-muted-foreground">Read or listen</p>
          <button className={btn.outline} onClick={() => speak(rd.italian.join(" "))}><Volume2 className="h-4 w-4" /> Listen</button></div>
        <div className="mt-3 space-y-1.5 text-[18px] leading-relaxed">{rd.italian.map((l) => <p key={l}>{l}</p>)}</div>
        <button className={`${btn.ghost} mt-3`} onClick={() => setShowEn((v) => !v)}><Eye className="h-4 w-4" />{showEn ? "Hide English" : "Stuck? Show English"}</button>
        {showEn && <p className="mt-2 text-[16px] leading-relaxed">{rd.english}</p>}
      </div>
      <div className="mt-6 space-y-5">
        {rd.questions.map((q, n) => (
          <div key={q.q}>
            <p className="flex items-center gap-1 text-[18px] font-bold">{q.q}<Hear text={q.q} /></p>
            <p className="text-[15px]">{q.qEn}</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {q.options.map((o) => {
                const p = picked[n]; const st = p === undefined ? "" : o === q.answer ? "border-success bg-tile-green" : o === p ? "border-destructive bg-destructive/10" : "opacity-60";
                return <button key={o} disabled={p !== undefined} onClick={() => setPicked((x) => ({ ...x, [n]: o }))} className={`min-h-11 rounded-[12px] border px-3 text-left text-[16px] font-semibold hover:border-primary/50 ${st}`}>{o}</button>;
              })}
            </div>
            {picked[n] !== undefined && <p className="mt-2 text-[15px]">{q.why}</p>}
          </div>
        ))}
      </div>
      {answered === rd.questions.length && <p className="mt-6 text-center text-xl font-bold">{score}/{rd.questions.length} understood</p>}
    </Panel>
  );
}
