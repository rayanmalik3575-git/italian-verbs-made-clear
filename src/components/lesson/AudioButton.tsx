import { Volume2, Snail, MicOff } from "lucide-react";
import type { Sentence } from "@/content/questions-lesson";
import { play, stop, useFileExists, usePlayer } from "./audio";

export function AudioButtons({ s }: { s: Sentence }) {
  const p = usePlayer();
  const has = useFileExists(s.audioNormal);
  if (has === false && s.needsRecording) {
    return <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed px-2.5 py-1.5 text-sm text-muted-foreground"><MicOff className="h-4 w-4" />Recording needed</span>;
  }
  const btn = (slow: boolean) => {
    const on = p.id === s.id && p.slow === slow;
    const Icon = slow ? Snail : Volume2;
    return (
      <button type="button" onClick={() => (on ? stop() : play(s, slow))}
        aria-label={`${on ? "Stop" : "Play"} ${slow ? "slowly" : ""} ${s.italian}`} aria-pressed={on}
        className={`inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-2 text-sm font-semibold transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card text-primary hover:bg-accent"}`}>
        <Icon className="h-4 w-4" />{slow && <span>0.7×</span>}
      </button>
    );
  };
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5">
      {btn(false)}{btn(true)}
      {has === false && <span className="text-sm text-muted-foreground">temporary voice</span>}
    </span>
  );
}
