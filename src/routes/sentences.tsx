import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Blocks, Check, Lightbulb, Link2, RotateCcw, X } from "lucide-react";
import { PageHeader, Panel, IconTile, ProgressBar, btn } from "@/components/app-shell";
import { BACKBONE, BUILD_TASKS, CONNECTORS, IDEAS, ROLE_LABEL, isAcceptedOrder, type Role } from "@/data/sentences";

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

const STEPS = ["The backbone", "5 key ideas", "Joining words", "Build it"] as const;

function SentencesPage() {
  const [step, setStep] = useState(0);
  return (
    <div>
      <PageHeader title="Building Italian sentences" description="Good news: Italian word order is close to English. Learn the few differences, then build sentences yourself." />
      <div role="tablist" aria-label="Lesson steps" className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <button key={s} role="tab" aria-selected={step === i} onClick={() => setStep(i)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${step === i ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>
      {step === 0 && <Backbone />}
      {step === 1 && <Ideas />}
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

function Tile({ it, en, role }: { it: string; en?: string; role: Role }) {
  return (
    <span className={`inline-flex flex-col rounded-xl px-3 py-2 ${ROLE_STYLE[role]}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">{ROLE_LABEL[role]}</span>
      <span className="text-base font-bold">{it}</span>
      {en && <span className="text-xs opacity-80">{en}</span>}
    </span>
  );
}

function Backbone() {
  return (
    <Panel>
      <div className="flex items-start gap-4">
        <IconTile icon={Blocks} />
        <div>
          <h2 className="text-lg font-bold">Who → Action → What</h2>
          <p className="mt-1 text-muted-foreground">Like English, a basic Italian sentence names who does something, the action, then what it's done to. If you can say it in English, you already know the order.</p>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {BACKBONE.map((row, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            {row.map((bl, j) => (<span key={j} className="flex items-center gap-2"><Tile {...bl} />{j < row.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />}</span>))}
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-xl bg-accent p-4 text-sm text-accent-foreground">Start with this pattern. The next step shows the few places where Italian does things its own way.</p>
    </Panel>
  );
}

function Ideas() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {IDEAS.map((d, i) => (
        <Panel key={d.title}>
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
            <h2 className="font-bold">{d.title}</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{d.why}</p>
          <div className="mt-4 rounded-xl border p-3">
            <div className="text-sm text-muted-foreground">{d.english}</div>
            <div className="text-lg font-bold text-primary">{d.italian}</div>
          </div>
          <p className="mt-3 flex gap-2 text-sm"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />{d.note}</p>
        </Panel>
      ))}
    </div>
  );
}

function Connectors() {
  return (
    <Panel>
      <div className="flex items-start gap-4">
        <IconTile icon={Link2} color="pink" />
        <div>
          <h2 className="text-lg font-bold">Six words that join ideas</h2>
          <p className="mt-1 text-muted-foreground">Short sentences are perfectly fine. When you want to say more, these six words join two ideas together.</p>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CONNECTORS.map((c) => (
          <li key={c.it} className="rounded-xl border p-4">
            <div className="flex items-baseline gap-2"><span className="text-xl font-bold text-primary">{c.it}</span><span className="text-sm text-muted-foreground">= {c.en}</span></div>
            <div className="mt-2 font-medium">{c.example}</div>
            <div className="text-sm text-muted-foreground">{c.exampleEn}</div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function Builder() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const done = idx >= BUILD_TASKS.length;

  if (done) {
    return (
      <Panel className="text-center">
        <h2 className="text-xl font-bold">Round complete</h2>
        <p className="mt-2 text-muted-foreground">You built {score} of {BUILD_TASKS.length} sentences correctly on the first try.</p>
        <button className={`${btn.primary} mt-4`} onClick={() => { setIdx(0); setPicked([]); setResult(null); setScore(0); }}><RotateCcw className="h-4 w-4" /> Try again</button>
      </Panel>
    );
  }

  const task = BUILD_TASKS[idx]!;
  const order = picked.map((p) => task.blocks[p]!.it);
  const full = picked.length === task.blocks.length;
  const check = () => { const ok = isAcceptedOrder(task, order); setResult(ok); if (ok) setScore((s) => s + 1); };
  const next = () => { setIdx(idx + 1); setPicked([]); setResult(null); };

  return (
    <Panel>
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground"><span>Sentence {idx + 1} of {BUILD_TASKS.length}</span><span>Score {score}</span></div>
      <ProgressBar value={(idx / BUILD_TASKS.length) * 100} label="Builder progress" />
      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Say this in Italian</p>
      <p className="text-xl font-bold">{task.english}</p>

      <div aria-label="Your sentence" className="mt-4 flex min-h-20 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed p-3">
        {picked.length === 0 && <span className="text-sm text-muted-foreground">Tap the blocks below in order.</span>}
        {picked.map((p) => (
          <button key={p} disabled={result !== null} onClick={() => setPicked(picked.filter((x) => x !== p))} aria-label={`Remove ${task.blocks[p]!.it}`}>
            <Tile it={task.blocks[p]!.it} role={task.blocks[p]!.role} />
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {task.blocks.map((bl, i) => picked.includes(i) ? null : (
          <button key={i} disabled={result !== null} onClick={() => setPicked([...picked, i])} aria-label={`Add ${bl.it}`}>
            <Tile it={bl.it} en={bl.en} role={bl.role} />
          </button>
        ))}
      </div>

      {result !== null && (
        <div role="status" className={`mt-5 flex gap-3 rounded-xl p-4 ${result ? "bg-tile-green text-tile-green-ink" : "bg-tile-pink text-tile-pink-ink"}`}>
          {result ? <Check className="h-5 w-5 shrink-0" /> : <X className="h-5 w-5 shrink-0" />}
          <div>
            <div className="font-bold">{result ? "Correct!" : "Not quite"}</div>
            <div className="text-sm">{task.accepted.length > 1 ? "Correct orders: " : "Correct order: "}{task.accepted.map((a) => a.join(" ")).join("  ·  ")}</div>
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {result === null ? (
          <>
            <button className={btn.ghost} onClick={() => setPicked([])} disabled={!picked.length}>Clear</button>
            <button className={btn.primary} onClick={check} disabled={!full}>Check sentence</button>
          </>
        ) : (
          <button className={btn.primary} onClick={next}>{idx + 1 < BUILD_TASKS.length ? "Next sentence" : "See result"} <ArrowRight className="h-4 w-4" /></button>
        )}
      </div>
    </Panel>
  );
}
