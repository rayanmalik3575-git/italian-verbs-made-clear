import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { STEP1 } from "@/content/questions-lesson";
import { AudioButtons } from "./AudioButton";

const D = { fall: "M4,8 C70,9 140,14 196,34", rise: "M4,26 C90,26 140,26 196,4" };

export function TuneToggle({ onSwitch }: { onSwitch?: () => void }) {
  const c = STEP1.tune;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [q, setQ] = useState(false);
  const touched = useRef(false);
  useEffect(() => {
    if (!seen || reduce) return;
    const t = setTimeout(() => { if (!touched.current) setQ(true); }, 1200);
    return () => clearTimeout(t);
  }, [seen, reduce]);
  const pick = (v: boolean) => { touched.current = true; setQ(v); onSwitch?.(); };
  const s = q ? c.question : c.statement;
  const tone = q ? "text-voice-rise" : "text-voice-fall";
  const dur = reduce ? 0 : 0.4;
  return (
    <div ref={ref} className="rounded-3xl border bg-card p-5 sm:p-8">
      <svg viewBox="0 0 200 38" preserveAspectRatio="none" className={`h-12 w-full overflow-visible ${tone}`} aria-hidden>
        <motion.path initial={false} animate={{ d: q ? D.rise : D.fall }} transition={{ duration: dur }} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-4 flex flex-wrap items-start justify-center gap-3">
        {c.words.map((w, i) => (
          <div key={w} className="flex flex-col items-center gap-1.5">
            <span className="rounded-2xl border bg-background px-4 py-2 text-2xl font-bold text-foreground sm:text-3xl">
              {w}
              {i === c.words.length - 1 && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={q ? "q" : "s"} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: dur / 2 }} className={`inline-block ${tone}`}>{q ? "?" : "."}</motion.span>
                </AnimatePresence>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-[14px] font-medium text-correct"><Check aria-hidden className="h-4 w-4" />same</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[17px] text-muted-foreground" aria-live="polite">{s.english}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
      <p className="mt-5 text-center text-[15px] font-medium text-foreground">{c.caption}</p>
    </div>
  );
}
