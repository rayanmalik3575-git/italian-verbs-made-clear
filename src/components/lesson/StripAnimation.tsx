import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import type { Sentence, StripItem } from "@/content/questions-lesson";
import { AudioButtons } from "./AudioButton";

/** English question → helper struck out → Italian with the ending in purple. */
export function StripAnimation({ item, sentence }: { item: StripItem; sentence: Sentence }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? 3 : 0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!run || reduce) return;
    setStep(1);
    const a = setTimeout(() => setStep(2), 1200), b = setTimeout(() => setStep(3), 2400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [run, reduce]);
  const rest = item.english.slice(item.helperWord.length).trim();
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex min-h-14 items-center text-xl font-semibold">
        <AnimatePresence mode="wait" initial={false}>
          {step <= 1 && (
            <motion.span key="en" exit={{ opacity: 0 }} className="text-foreground">
              {step === 1
                ? <><motion.span initial={{ opacity: 1 }} animate={{ opacity: 0.35 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-wrong line-through">{item.helperWord}</motion.span> {rest}</>
                : item.english}
            </motion.span>
          )}
          {step === 2 && <motion.span key="st" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-muted-foreground">{item.stripped}?</motion.span>}
          {step === 3 && (
            <motion.span key="it" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-foreground">
              {item.stem}<span className="text-ending">{item.ending}</span>{item.rest}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-semibold text-primary hover:bg-accent">
          {run ? <><RotateCcw className="h-4 w-4" />Replay</> : <><Play className="h-4 w-4" />Show me</>}
        </button>
        {run > 0 && step === 3 && <span className="text-sm text-muted-foreground">{item.english} → {item.stripped} → {item.italian}</span>}
        <span className="ml-auto"><AudioButtons s={sentence} /></span>
      </div>
    </div>
  );
}
