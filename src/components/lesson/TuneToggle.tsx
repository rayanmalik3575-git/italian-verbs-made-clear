import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { STEP1 } from "@/content/questions-lesson";
import { AudioButtons } from "./AudioButton";
import { play, usePlayer } from "./audio";

// viewBox 200x56: level across the first word, then a clear ~40px move over the last word.
const D = { fall: "M6,10 L100,10 C140,10 160,18 194,50", rise: "M6,46 L100,46 C140,46 160,38 194,6" };
const END = { fall: { x: 194, y: 50 }, rise: { x: 194, y: 6 } };

const COACH = [
  "Try it: press Question",
  "Same two words. Only the ? and your voice changed. Press Statement to go back.",
  "Listen: the statement lands, the question lifts at the end. Switch again to compare.",
  "Got it. Scroll down to see how English does this differently.",
];

export function TuneToggle({ onSwitch }: { onSwitch?: () => void }) {
  const c = STEP1.tune;
  const reduce = useReducedMotion();
  const player = usePlayer();
  const [q, setQ] = useState(false);
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (player.id && (player.id === c.question.id || player.id === c.statement.id)) setStage(3);
  }, [player.id, c.question.id, c.statement.id]);
  const pick = (v: boolean) => {
    setQ(v); onSwitch?.();
    play(v ? c.question : c.statement);
    setStage((st) => (st === 3 ? 3 : v ? (st === 0 ? 1 : st) : st >= 1 ? 2 : st));
  };
  const s = q ? c.question : c.statement;
  const dir = q ? "rise" : "fall";
  const tone = q ? "text-voice-rise" : "text-voice-fall";
  const dur = reduce ? 0 : 0.4;
  const shown = stage >= 1;
  return (
    <div className="mx-auto max-w-[560px] rounded-[20px] border bg-card p-6">
      <div className={`relative h-14 w-full ${tone}`} aria-hidden>
      <svg viewBox="0 0 200 56" preserveAspectRatio="none" className="block h-full w-full overflow-visible">
        <motion.path initial={false} animate={{ d: D[dir] }} transition={{ duration: dur }} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
        <motion.span initial={false} animate={{ top: `${(END[dir].y / 56) * 100}%` }} transition={{ duration: dur }}
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" style={{ left: `${(END[dir].x / 200) * 100}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {c.words.map((w, i) => (
          <div key={w} className="flex flex-col items-center gap-1.5">
            <span className="whitespace-nowrap rounded-2xl border bg-background px-4 py-2 text-[22px] font-bold text-foreground">
              {w}
              {i === c.words.length - 1 && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={q ? "q" : "s"} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: dur / 2 }} className={`inline-block ${tone}`}>{q ? "?" : "."}</motion.span>
                </AnimatePresence>
              )}
            </span>
            <motion.span initial={false} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.3 }} aria-hidden={!shown}
              className="inline-flex items-center gap-1 text-[14px] font-medium text-correct"><Check aria-hidden className="h-4 w-4" />same</motion.span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[16px] text-muted-foreground">{s.english}</p>
      <p aria-live="polite" className="mx-auto mt-5 flex w-fit items-start gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-[16px] font-medium text-primary">
        <ArrowRight aria-hidden className="mt-1 h-4 w-4 shrink-0" />{COACH[stage]}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <div role="radiogroup" aria-label="Sentence type" className="inline-flex rounded-full border bg-muted p-1">
          {([false, true] as const).map((v) => (
            <button key={String(v)} type="button" role="radio" aria-checked={q === v} onClick={() => pick(v)}
              className={`min-h-10 rounded-full px-5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${q === v ? (v ? "bg-voice-rise text-white" : "bg-voice-fall text-white") : "text-muted-foreground hover:text-foreground"}`}>
              {v ? "Question" : "Statement"}
            </button>
          ))}
        </div>
        <AudioButtons s={s} />
      </div>
    </div>
  );
}
