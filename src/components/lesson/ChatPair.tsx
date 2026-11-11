import { STEP1 } from "@/content/questions-lesson";

export function ChatPair() {
  const c = STEP1.chat;
  const items = [
    { ...c.statement, q: false },
    { ...c.question, q: true },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((b) => (
        <div key={String(b.q)} className="rounded-3xl border bg-card p-5">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[14px] font-semibold ${b.q ? "bg-voice-rise/10 text-voice-rise" : "bg-voice-fall/10 text-voice-fall"}`}>{b.q ? "Question" : "Statement"}</span>
          <div className="mt-3 w-fit rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-xl font-semibold text-foreground">
            {b.it}{b.q ? <span className="ml-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-voice-rise/15 text-voice-rise">?</span> : "."}
          </div>
          <p className="mt-2 text-[15px] text-muted-foreground">{b.en}</p>
        </div>
      ))}
    </div>
  );
}
