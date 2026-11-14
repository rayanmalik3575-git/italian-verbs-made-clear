import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Blocks, Check, Lightbulb, Link2, RotateCcw, X, Plus, Minus, HelpCircle } from "lucide-react";
import { PageHeader, Panel, IconTile, ProgressBar, btn } from "@/components/app-shell";
import { BUILD_TASKS, CONNECTORS, IDEAS, ROLE_LABEL, isAcceptedOrder, type Role } from "@/data/sentences";
import { ACTION_ROWS, SHAPES, GROW, TRANSFORM, TILE_TASK, checkTiles } from "@/content/sentences-backbone";
import { AudioButtons } from "@/components/lesson/AudioButton";
import { play } from "@/components/lesson/audio";

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
    <div className="space-y-5">
      <ActionFirst />
      <ThreeShapes />
      <Grow />
      <QuickCheck />
    </div>
  );
}

function SectionHead({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n}</span>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-[15px] text-foreground/80">{sub}</p>
      </div>
    </div>
  );
}

function ActionFirst() {
  const { named, dropped } = ACTION_ROWS;
  return (
    <Panel>
      <SectionHead n={1} title="Start from the action" sub="An Italian sentence grows out of the verb. The verb ending already tells you who is doing it." />
      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">When you name someone · 3 blocks</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tile it="Marco" role="subject" /><ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <Tile it="beve" role="verb" /><ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <Tile it="un caffè" role="object" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3"><span className="font-semibold text-foreground/80">{named.english}</span><AudioButtons s={named} /></div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">When it's I / you / we · 2 blocks, most of real Italian</div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex flex-col rounded-xl bg-gradient-to-r from-tile-lavender to-tile-blue px-3 py-2 text-tile-blue-ink">
              <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Who + Action</span>
              <span className="text-base font-bold">Bev<span className="text-pink">o</span></span>
              <span className="text-xs opacity-80">-o = I</span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            <Tile it="un caffè" role="object" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3"><span className="font-semibold text-foreground/80">{dropped.english}</span><AudioButtons s={dropped} /></div>
        </div>
      </div>
      <p className="mt-4 flex gap-2 text-sm text-foreground/80"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />You already know the endings (-o, -i, -a…), so you usually skip io / tu / noi and start the sentence with the verb.</p>
    </Panel>
  );
}

const SHAPE_ICON = { statement: Plus, negative: Minus, question: HelpCircle } as const;

function ThreeShapes() {
  return (
    <Panel>
      <SectionHead n={2} title="One backbone, three shapes" sub="English adds do, does and don't. Italian keeps the same words in the same order." />
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {SHAPES.map((sh) => {
          const Icon = SHAPE_ICON[sh.key];
          const words = sh.sentence.italian.split(" ");
          return (
            <div key={sh.key} className="flex flex-col rounded-2xl border p-4">
              <div className="flex items-center gap-2 text-sm font-bold"><Icon className="h-4 w-4 text-primary" aria-hidden />{sh.label}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{sh.formula}</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {words.map((w, i) => (
                  <span key={i} className={`rounded-lg px-2.5 py-1 font-bold ${w === "Non" ? "bg-tile-pink text-tile-pink-ink" : i === (words[0] === "Non" ? 1 : 0) ? "bg-tile-blue text-tile-blue-ink" : "bg-tile-green text-tile-green-ink"}`}>{w}</span>
                ))}
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground/80">{sh.sentence.english}</div>
              <p className="mt-3 flex-1 text-sm text-foreground/80">{sh.rule}</p>
              <div className="mt-3"><AudioButtons s={sh.sentence} /></div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Grow() {
  const [shown, setShown] = useState(1);
  return (
    <Panel>
      <SectionHead n={3} title="How a 1-word verb becomes a full sentence" sub="Add one piece at a time. The verb stays the centre." />
      <ol className="mt-5 space-y-3">
        {GROW.slice(0, shown).map((g, i) => {
          const marks = [g.added, "extra" in g ? g.extra : ""].filter(Boolean) as string[];
          return (
            <li key={i} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Step {i + 1} · {g.label}</div>
                  <div className="mt-1 text-lg font-bold">
                    {splitMarks(g.sentence.italian, marks).map((p, k) => p.m ? <span key={k} className="rounded bg-tile-green px-0.5 text-tile-green-ink">{p.t}</span> : <span key={k}>{p.t}</span>)}
                  </div>
                  <div className="text-sm font-semibold text-foreground/80">{g.sentence.english}</div>
                </div>
                <AudioButtons s={g.sentence} />
              </div>
              {g.note && <p className="mt-2 text-sm text-foreground/80">{g.note}</p>}
            </li>
          );
        })}
      </ol>
      {shown < GROW.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={btn.primary} onClick={() => setShown(shown + 1)}><Plus className="h-4 w-4" />Add the next piece</button>
          <button className={btn.outline} onClick={() => setShown(GROW.length)}>Show all</button>
        </div>
      )}
    </Panel>
  );
}

function splitMarks(text: string, marks: string[]) {
  const out: { t: string; m: boolean }[] = [];
  let rest = text;
  while (rest) {
    let best = -1, mk = "";
    for (const m of marks) { const i = rest.indexOf(m); if (i >= 0 && (best < 0 || i < best)) { best = i; mk = m; } }
    if (best < 0) { out.push({ t: rest, m: false }); break; }
    if (best > 0) out.push({ t: rest.slice(0, best), m: false });
    out.push({ t: mk, m: true });
    rest = rest.slice(best + mk.length);
  }
  return out;
}

function QuickCheck() {
  const [shape, setShape] = useState<keyof typeof TRANSFORM>("statement");
  const [picked, setPicked] = useState<number[]>([]);
  const [result, setResult] = useState<ReturnType<typeof checkTiles> | null>(null);
  const words = picked.map((i) => TILE_TASK.bank[i]);
  const cur = TRANSFORM[shape];
  const choose = (k: keyof typeof TRANSFORM) => { setShape(k); play(TRANSFORM[k]); };
  const check = () => { const r = checkTiles(words); setResult(r); if (r.ok) play(TILE_TASK.sentence); };
  return (
    <Panel>
      <SectionHead n={4} title="Quick check: transform this sentence" sub="Same backbone, three shapes. Switch and listen." />
      <div className="mt-5 rounded-2xl border p-4">
        <div role="radiogroup" aria-label="Sentence shape" className="inline-flex rounded-xl border bg-muted p-1">
          {(["statement", "negative", "question"] as const).map((k) => (
            <button key={k} role="radio" aria-checked={shape === k} onClick={() => choose(k)}
              className={`min-h-10 rounded-lg px-3 text-sm font-semibold capitalize ${shape === k ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{k}</button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div><div className="text-2xl font-bold">{cur.italian}</div><div className="text-sm font-semibold text-foreground/80">{cur.english}</div></div>
          <AudioButtons s={cur} />
        </div>
      </div>
      <div className="mt-4 rounded-2xl border p-4">
        <div className="text-sm font-semibold text-foreground/80">Build: <span className="text-foreground">"{TILE_TASK.english}"</span></div>
        <div className="mt-3 flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-dashed p-2">
          {words.length === 0 && <span className="text-sm text-muted-foreground">Tap the words below</span>}
          {picked.map((bi, i) => (
            <button key={i} onClick={() => { setPicked(picked.filter((_, j) => j !== i)); setResult(null); }} className="rounded-lg bg-tile-blue px-3 py-1.5 font-bold text-tile-blue-ink">
              {i === 0 ? TILE_TASK.bank[bi][0].toUpperCase() + TILE_TASK.bank[bi].slice(1) : TILE_TASK.bank[bi]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TILE_TASK.bank.map((w, i) => !picked.includes(i) && (
            <button key={i} onClick={() => { setPicked([...picked, i]); setResult(null); }} className="rounded-lg border bg-card px-3 py-1.5 font-bold hover:bg-accent">{w}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={btn.primary} disabled={words.length === 0} onClick={check}><Check className="h-4 w-4" />Check</button>
          <button className={btn.outline} onClick={() => { setPicked([]); setResult(null); }}><RotateCcw className="h-4 w-4" />Reset</button>
        </div>
        {result && (
          <p role="status" className={`mt-3 flex gap-2 rounded-xl p-3 text-sm font-semibold ${result.ok ? "bg-tile-green text-tile-green-ink" : "bg-tile-pink text-tile-pink-ink"}`}>
            {result.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}{result.tip}
          </p>
        )}
      </div>
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
