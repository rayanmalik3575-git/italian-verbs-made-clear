import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Blocks, Check, Lightbulb, Link2, RotateCcw, Volume2, X, Plus, Minus } from "lucide-react";
import { PageHeader, Panel, IconTile, ProgressBar, btn } from "@/components/app-shell";
import { ACCORDION, BUILD_TASKS, HABIT_RULES, LINKED, ROLE_LABEL, isAcceptedOrder, type Role } from "@/data/sentences";

export const Route = createFileRoute("/sentences")({
  head: () => ({
    meta: [
      { title: "Building Italian Sentences — Parlami" },
      { name: "description", content: "Learn how Italian sentences are put together, then build your own block by block." },
      { property: "og:title", content: "Building Italian Sentences — Parlami" },
      { property: "og:description", content: "Word order, joining words and a hands-on sentence builder for A1 learners." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SentencesPage,
});

const ROLE_STYLE: Record<Role, string> = {
  subject: "bg-tile-lavender text-tile-lavender-ink",
  verb: "bg-tile-blue text-tile-blue-ink",
  object: "bg-tile-green text-tile-green-ink",
  describe: "bg-tile-pink text-tile-pink-ink",
  time: "bg-tile-amber text-tile-amber-ink",
  place: "bg-tile-amber text-tile-amber-ink",
  link: "bg-muted text-foreground",
};

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.85;
  const v = synth.getVoices().find((x) => x.lang.startsWith("it"));
  if (v) u.voice = v;
  synth.speak(u);
}

function Say({ text }: { text: string }) {
  return (
    <button type="button" onClick={() => speak(text)} aria-label={`Listen: ${text}`}
      className="inline-grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-card text-primary hover:bg-accent">
      <Volume2 className="h-4 w-4" />
    </button>
  );
}

const STEPS = ["The native formula", "3 habit breakers", "Joining ideas", "Sentence lab"] as const;

function SentencesPage() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <PageHeader title="Building Italian sentences" description="Start from the action, grow the sentence one block at a time, and fix the three English habits that trip people up." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <button key={s} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>
      {step === 0 && <Formula />}
      {step === 1 && <Habits />}
      {step === 2 && <Connectors />}
      {step === 3 && <Builder />}
      {step < 3 && (
        <div className="mt-6 flex justify-end">
          <button className={btn.primary} onClick={() => setStep(step + 1)}>Next: {STEPS[step + 1]} <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}

function Tile({ it, en, role, plain }: { it: string; en?: string; role: Role; plain?: boolean }) {
  if (plain) return <span className="inline-flex rounded-xl border bg-card px-3 py-2 text-base font-bold">{it}</span>;
  return (
    <span className={`inline-flex flex-col rounded-xl px-3 py-2 ${ROLE_STYLE[role]}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{ROLE_LABEL[role]}</span>
      <span className="text-base font-bold">{it}</span>
      {en && <span className="text-xs opacity-80">{en}</span>}
    </span>
  );
}

function Formula() {
  const [level, setLevel] = useState(0);
  const row = ACCORDION[level]!;
  const text = row.blocks.map((b) => b.it).join(" ") + ".";
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-4">
          <IconTile icon={Blocks} />
          <div>
            <h2 className="text-lg font-bold">Start with the action, not with "I"</h2>
            <p className="mt-1 max-w-prose text-foreground">The ending of an Italian verb already tells you who is doing it. <b>Mangio</b> can only mean "I eat", so Italians don't say <i>io</i>. Leave the pronoun out, and add it back only when you want to contrast people.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border p-4"><div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What learners say</div><div className="mt-1 text-lg font-bold line-through decoration-destructive/60">Io bevo un caffè.</div><div className="text-sm text-foreground">Correct, but sounds like you're stressing "I".</div></div>
          <div className="rounded-xl border border-primary/40 bg-accent p-4"><div className="text-xs font-semibold uppercase tracking-wide text-primary">What Italians say</div><div className="mt-1 flex items-center gap-2 text-lg font-bold">Bevo un caffè. <Say text="Bevo un caffè." /></div><div className="text-sm text-foreground">I'm having a coffee.</div></div>
        </div>
        <p className="mt-3 text-sm text-foreground">With a name, keep it: <b>Marco beve un caffè.</b> The name is new information, so it stays.</p>
      </Panel>

      <Panel>
        <h2 className="text-lg font-bold">Grow one sentence, block by block</h2>
        <p className="mt-1 text-foreground">Every long sentence is a short one with blocks added. Build it up and listen at each stage.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2" aria-live="polite">
          {row.blocks.map((bl, i) => <Tile key={i} {...bl} />)}
          <Say text={text} />
        </div>
        <p className="mt-3 font-semibold text-foreground">{row.en}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {ACCORDION.map((a, i) => (
            <button key={i} onClick={() => { setLevel(i); speak(ACCORDION[i]!.blocks.map((b) => b.it).join(" ")); }}
              className={`min-h-9 rounded-full border px-3 text-sm font-semibold ${i === level ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground"}`}>{a.add}</button>
          ))}
          <span className="ml-auto flex gap-2">
            <button className={btn.ghost} aria-label="Shorter" disabled={level === 0} onClick={() => setLevel(level - 1)}><Minus className="h-4 w-4" /></button>
            <button className={btn.ghost} aria-label="Longer" disabled={level === ACCORDION.length - 1} onClick={() => setLevel(level + 1)}><Plus className="h-4 w-4" /></button>
          </span>
        </div>
      </Panel>
    </div>
  );
}

function Habits() {
  return (
    <div className="space-y-4">
      {HABIT_RULES.map((r, i) => (
        <Panel key={r.title}>
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
            <h2 className="font-bold">{r.title}</h2>
          </div>
          <p className="mt-2 max-w-prose text-foreground">{r.plain}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border p-3"><X className="h-4 w-4 shrink-0 text-destructive" aria-hidden /><span className="text-lg font-semibold text-muted-foreground line-through">{r.wrong}</span></div>
            <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-tile-green p-3"><Check className="h-4 w-4 shrink-0 text-tile-green-ink" aria-hidden /><span className="text-lg font-bold text-tile-green-ink">{r.right}</span><span className="ml-auto"><Say text={r.right} /></span></div>
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">{r.en}</p>
          <p className="mt-3 flex gap-2 text-sm text-foreground"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />{r.note}</p>
        </Panel>
      ))}
    </div>
  );
}

function Connectors() {
  const [joined, setJoined] = useState<Record<string, boolean>>({});
  return (
    <Panel>
      <div className="flex items-start gap-4">
        <IconTile icon={Link2} color="pink" />
        <div>
          <h2 className="text-lg font-bold">Six words that join two thoughts</h2>
          <p className="mt-1 text-foreground">Say two short sentences, then join them. Tap <b>Join</b> to see how they become one.</p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {LINKED.map((c) => {
          const on = joined[c.it];
          return (
            <li key={c.it} className="rounded-xl border p-4">
              <div className="flex items-baseline gap-2"><span className="text-xl font-bold text-primary">{c.it}</span><span className="text-sm text-foreground">= {c.en}</span>
                <button className="ml-auto text-sm font-semibold text-primary" onClick={() => { setJoined({ ...joined, [c.it]: !on }); if (!on) speak(c.full); }}>{on ? "Split" : "Join"}</button></div>
              {on ? (
                <div className="mt-2"><div className="flex items-center gap-2 font-bold">{c.full} <Say text={c.full} /></div><div className="text-sm text-foreground">{c.fullEn}</div></div>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm"><span className="rounded-lg bg-muted px-2 py-1 font-semibold">{c.a}</span><span className="text-muted-foreground">+</span><span className="rounded-lg bg-muted px-2 py-1 font-semibold">{c.b}</span></div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]; let x = seed + 7;
  for (let i = a.length - 1; i > 0; i--) { x = (x * 9301 + 49297) % 233280; const j = x % (i + 1); [a[i], a[j]] = [a[j]!, a[i]!]; }
  return a;
}

function Builder() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const done = idx >= BUILD_TASKS.length;
  const task = BUILD_TASKS[Math.min(idx, BUILD_TASKS.length - 1)]!;
  const bank = useMemo(() => shuffle([
    ...task.blocks.map((b) => ({ it: b.it, trap: undefined as string | undefined })),
    ...(task.traps ?? []).map((t) => ({ it: t.it, trap: t.why })),
  ], idx), [task, idx]);

  if (done) {
    return (
      <Panel className="text-center">
        <h2 className="text-xl font-bold">Lab complete</h2>
        <p className="mt-2 text-foreground">You built {score} of {BUILD_TASKS.length} sentences correctly on the first try.</p>
        <button className={`${btn.primary} mt-4`} onClick={() => { setIdx(0); setPicked([]); setResult(null); setScore(0); }}><RotateCcw className="h-4 w-4" /> Try again</button>
      </Panel>
    );
  }

  const order = picked.map((p) => bank[p]!.it);
  const trapHit = picked.map((p) => bank[p]!).find((x) => x.trap);
  const display = (w: string, i: number) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w);
  const sentence = task.accepted[0]!.join(" ").replace(/^./, (c) => c.toUpperCase()).replace(/([^?])$/, "$1.");
  const check = () => {
    const ok = !trapHit && isAcceptedOrder(task, order);
    setResult(ok); if (ok) { setScore((s) => s + 1); speak(sentence); }
  };
  const next = () => { setIdx(idx + 1); setPicked([]); setResult(null); };
  const tierLabel = ["", "Short sentences", "Everyday details", "Two joined thoughts"][task.tier];

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between text-sm text-foreground"><span>Sentence {idx + 1} of {BUILD_TASKS.length} · {tierLabel}</span><span>Score {score}</span></div>
      <ProgressBar value={(idx / BUILD_TASKS.length) * 100} label="Lab progress" />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Say this in Italian</p>
      <p className="text-xl font-bold">{task.english}</p>

      <div aria-label="Your sentence" className="mt-4 flex min-h-20 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-3">
        {picked.length === 0 && <span className="text-sm text-muted-foreground">Tap the blocks in order. Some don't belong.</span>}
        {picked.map((p, i) => (
          <button key={p} disabled={result !== null} onClick={() => setPicked(picked.filter((x) => x !== p))} aria-label={`Remove ${bank[p]!.it}`}>
            <Tile it={display(bank[p]!.it, i)} role="link" plain />
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {bank.map((bl, i) => picked.includes(i) ? null : (
          <button key={i} disabled={result !== null} onClick={() => setPicked([...picked, i])} aria-label={`Add ${bl.it}`}>
            <Tile it={bl.it} role="link" plain />
          </button>
        ))}
      </div>

      {result !== null && (
        <div role="status" className={`mt-5 flex gap-3 rounded-xl p-4 ${result ? "bg-tile-green text-tile-green-ink" : "bg-tile-pink text-tile-pink-ink"}`}>
          {result ? <Check className="h-5 w-5 shrink-0" /> : <X className="h-5 w-5 shrink-0" />}
          <div className="flex-1">
            <div className="font-bold">{result ? "Correct" : "Not quite"}</div>
            {!result && trapHit && <div className="text-sm"><b>{trapHit.it}</b>: {trapHit.trap}</div>}
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold">{sentence} <Say text={sentence} /></div>
            <div className="text-sm">{task.why}</div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {result === null ? (
          <>
            <button className={btn.ghost} onClick={() => setPicked([])} disabled={!picked.length}>Clear</button>
            <button className={btn.primary} onClick={check} disabled={!picked.length}>Check sentence</button>
          </>
        ) : (
          <button className={btn.primary} onClick={next}>{idx + 1 < BUILD_TASKS.length ? "Next sentence" : "See result"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </Panel>
  );
}
