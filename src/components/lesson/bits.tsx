import type { ReactNode } from "react";
import { AlertTriangle, Check, X } from "lucide-react";

export function WordGlossBar({ words, gloss }: { words: string[]; gloss: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((w, i) => (
        <span key={i} className="flex flex-col items-center gap-1">
          <span className="rounded-lg border bg-card px-2.5 py-1 text-lg font-semibold text-foreground">{w}</span>
          {gloss[i] && <span className="rounded-full bg-muted px-2.5 py-0.5 text-[14px] font-medium text-foreground">{gloss[i]}</span>}
        </span>
      ))}
    </div>
  );
}

export function EndingHighlight({ stem, ending, label }: { stem: string; ending: string; label?: string }) {
  return (
    <span className="inline-flex items-start text-xl font-bold">
      <span className="text-foreground">{stem}</span>
      <span className="flex flex-col items-center">
        <span className="text-ending">{ending}</span>
        {label && <span className="text-[14px] font-semibold text-ending">{label}</span>}
      </span>
    </span>
  );
}

export function WarningBox({ title, children, wrong, right }: { title?: string; children?: ReactNode; wrong?: string; right?: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-amber-300/50 bg-amber-50 p-4 text-amber-800">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 space-y-1.5 text-foreground">
        {title && <div className="font-semibold text-amber-800">{title}</div>}
        {wrong && <div className="flex items-center gap-2 font-semibold text-wrong"><X className="h-4 w-4 shrink-0" />{wrong}</div>}
        {right && <div className="flex items-center gap-2 font-semibold text-correct"><Check className="h-4 w-4 shrink-0" />{right}</div>}
        {children && <div className="leading-relaxed">{children}</div>}
      </div>
    </div>
  );
}
