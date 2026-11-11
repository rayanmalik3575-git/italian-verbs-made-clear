import { useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Info, RotateCcw } from "lucide-react";
import { STEP1 } from "@/content/questions-lesson";
import { btn } from "@/components/app-shell";
import { AudioButtons } from "./AudioButton";

function Chip({ w, hot, tag, tagCls }: { w: string; hot?: boolean; tag?: string; tagCls?: string }) {
  return (
    <motion.span layout layoutId={undefined} className="flex flex-col items-center gap-1">
      <span className={`rounded-xl border px-3 py-1.5 text-lg font-semibold ${hot ? "border-amber-400 bg-amber-50 text-amber-800" : "bg-card text-foreground"}`}>{w}</span>
      {tag && <span className={`text-[14px] font-medium ${tagCls}`}>{tag}</span>}
    </motion.span>
  );
}

export function RebuildCompare() {
  const c = STEP1.rebuild;
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="rounded-3xl border bg-card p-5 sm:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">English</div>
          <div className="space-y-4">
            {c.rows.map((r) => {
              const words = on ? r.enQ : r.en;
              return (
                <LayoutGroup key={r.it.id}>
                  <div className="flex min-h-16 flex-wrap items-start gap-2">
                    {words.map((w, i) => {
                      const hot = on && r.changed.includes(w);
                      const end = i === words.length - 1;
                      return (
                        <motion.span key={w} layout={!reduce} initial={on && r.change === "added" && w === "Do" && !reduce ? { opacity: 0, x: -20 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                          <Chip w={w + (end ? (on ? "?" : ".") : "")} hot={hot} tag={hot ? r.change : undefined} tagCls="text-amber-700" />
                        </motion.span>
                      );
                    })}
                  </div>
                </LayoutGroup>
              );
            })}
          </div>
        </div>
        <div>
          <div className="mb-3 text-[14px] font-semibold uppercase tracking-wide text-muted-foreground">Italian</div>
          <div className="space-y-4">
            {c.rows.map((r) => {
              const g = r.it.wordGloss!;
              return (
                <div key={r.it.id} className="flex min-h-16 flex-wrap items-start gap-2">
                  {g.map((w, i) => (
                    <span key={w} className="flex flex-col items-center gap-1">
                      <span className="rounded-xl border bg-card px-3 py-1.5 text-lg font-semibold text-foreground">
                        {w}{i === g.length - 1 && <span className={on ? "text-voice-rise" : ""}>{on ? "?" : "."}</span>}
                      </span>
                      {on && <span className="text-[14px] font-medium text-correct">didn't move</span>}
                    </span>
                  ))}
                  <span className="ml-auto"><AudioButtons s={r.it} /></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className={btn.primary} onClick={() => setOn(true)} disabled={on}>Ask it as a question</button>
        <button type="button" className={btn.outline} onClick={() => setOn(false)} disabled={!on}><RotateCcw className="h-4 w-4" /> Replay</button>
      </div>
      <p className="mt-6 flex w-fit items-start gap-2 rounded-xl bg-muted px-3 py-2 text-[14px] text-muted-foreground"><Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />{c.note}</p>
    </div>
  );
}
