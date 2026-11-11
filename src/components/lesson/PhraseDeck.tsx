import { STEP1 } from "@/content/questions-lesson";
import { AudioButtons } from "./AudioButton";
import { PitchCurve } from "./PitchCurve";

export function PhraseDeck() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STEP1.deck.phrases.map((p) => (
        <div key={p.id} className="flex flex-col rounded-3xl border bg-card p-5">
          <div className="text-2xl font-bold text-foreground">{p.italian}</div>
          <div className="mt-1 text-[15px] text-muted-foreground">{p.english}</div>
          <div className="mt-3 w-24"><PitchCurve direction="rise" playingId={p.id} label={false} /></div>
          <div className="mt-3"><AudioButtons s={p} /></div>
        </div>
      ))}
    </div>
  );
}
