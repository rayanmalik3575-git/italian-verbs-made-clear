import { useEffect, useState } from "react";
import { Check, X, RotateCcw, MicOff } from "lucide-react";
import { scoreQuiz, type QuizItem } from "@/content/questions-lesson";
import { AudioButtons } from "./AudioButton";
import { fileExists } from "./audio";

/** A short quiz. Calls onFinish(score,total) once every item is answered. */
export function Quiz({ items, onFinish }: { items: QuizItem[]; onFinish: (score: number, total: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    const clips = items.flatMap((q) => (q.kind === "audio-choice" ? [q.sentence.audioNormal] : []));
    if (!clips.length) { setReady(true); return; }
    Promise.all(clips.map(fileExists)).then((r) => setReady(r.every(Boolean)));
  }, [items]);
  const done = items.every((q) => answers[q.id]);
  const score = scoreQuiz(items, answers);
  useEffect(() => { if (done) onFinish(score, items.length); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  if (ready === false) {
    return <div className="flex items-center gap-2 rounded-2xl border border-dashed p-5 text-muted-foreground"><MicOff className="h-5 w-5" />This listening quiz opens once all {items.length} recordings are uploaded.</div>;
  }
  return (
    <div className="space-y-3">
      {items.map((q, n) => {
        const a = answers[q.id];
        const opts = q.kind === "audio-choice" ? ["statement", "question"] : q.options;
        const why = a && a !== q.answer && q.kind === "multiple-choice" && q.whyWrong?.[a] ? q.whyWrong[a] : q.why;
        return (
          <fieldset key={q.id} className="rounded-2xl border bg-card p-4">
            <legend className="sr-only">Question {n + 1}</legend>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">{n + 1}.</span>
              {q.kind === "audio-choice" ? <><span className="font-semibold">Listen, then choose</span><AudioButtons s={q.sentence} /></> : <span className="text-lg font-semibold">"{q.prompt}"</span>}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {opts.map((o) => {
                const st = !a ? "bg-card hover:border-primary" : o === q.answer ? "border-correct bg-correct/10 text-correct" : o === a ? "border-wrong bg-wrong/10 text-wrong" : "opacity-50";
                return (
                  <button key={o} type="button" disabled={!!a || ready === null} onClick={() => setAnswers({ ...answers, [q.id]: o })}
                    className={`min-h-11 rounded-xl border px-3 text-base font-semibold ${st}`}>
                    {q.kind === "audio-choice" ? (o === "statement" ? "Statement" : "Question") : o}
                  </button>
                );
              })}
            </div>
            {a && (
              <p className={`mt-3 flex items-start gap-2 ${a === q.answer ? "text-correct" : "text-wrong"}`} aria-live="polite">
                {a === q.answer ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
                <span className="text-foreground">{q.kind === "audio-choice" && <strong>"{q.sentence.italian}" </strong>}{why}</span>
              </p>
            )}
          </fieldset>
        );
      })}
      {done && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
          <span className="text-lg font-bold">{score} / {items.length}</span>
          <span className="text-muted-foreground">{score >= Math.ceil(items.length * 0.75) ? "Mastered." : "Review the step and try again."}</span>
          <button type="button" onClick={() => setAnswers({})} className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold"><RotateCcw className="h-4 w-4" />Try again</button>
        </div>
      )}
    </div>
  );
}
