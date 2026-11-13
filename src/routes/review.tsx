import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Volume2, X, ArrowRight, Layers } from "lucide-react";
import { PageHeader, Panel, ProgressBar, Chip, btn } from "@/components/app-shell";
import { buildSession, isCorrect, SKILL_LABEL, type Item, type Skill } from "@/content/mixed-practice";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "All-in-one Review — Parlami Italian" },
      { name: "description", content: "One mixed workout for articles, plurals, negatives, questions and sentences." },
      { property: "og:title", content: "All-in-one Italian Review — Parlami" },
      { property: "og:description", content: "Combine every rule you've learned in real Italian sentences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReviewPage,
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT"; u.rate = 0.9;
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("it"));
  if (v) u.voice = v;
  if (text.endsWith("?")) u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

const fullSentence = (it: Item) => (it.kind === "choice" && it.prompt.includes("___") ? it.prompt.replace("___", it.answer) : it.answer);
const SKILLS: (Skill | "all")[] = ["all", "articles", "plurals", "negatives", "questions", "sentences"];

function ReviewPage() {
  const [skill, setSkill] = useState<Skill | "all">("all");
  const [seed, setSeed] = useState(0);
  const [session, setSession] = useState<Item[]>([]);
  useEffect(() => { setSession(buildSession(skill)); setI(0); setScore(0); setMissed([]); setPicked(null); setBuilt([]); }, [skill, seed]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Skill[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [built, setBuilt] = useState<number[]>([]);
  const item = session[i];
  const tiles = useMemo(() => (item?.kind === "build" ? item.tiles.map((t, k) => ({ t, k })).sort(() => Math.random() - 0.5) : []), [item]);
  const done = session.length > 0 && i >= session.length;

  function check(answer: string) {
    if (!item || picked !== null) return;
    setPicked(answer);
    if (isCorrect(item, answer)) { setScore((s) => s + 1); speak(fullSentence(item)); }
    else setMissed((m) => [...m, ...item.skills]);
  }
  function next() { setI((x) => x + 1); setPicked(null); setBuilt([]); }

  const ok = item && picked !== null && isCorrect(item, picked);
  const builtText = built.map((k) => item?.kind === "build" ? item.tiles[k] : "").join(" ");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title="All-in-one review" description="Every question mixes rules you've already learned. Answer without translating — think in Italian." />
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((s) => <Chip key={s} active={skill === s} onClick={() => setSkill(s)}>{s === "all" ? "Mixed" : SKILL_LABEL[s]}</Chip>)}
      </div>

      {done ? (
        <Panel>
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">Session complete</p>
            <p className="mt-2 text-5xl font-bold">{score}/{session.length}</p>
            {missed.length > 0 ? (
              <p className="mt-4 text-[17px]">Review next: <strong>{[...new Set(missed)].map((s) => SKILL_LABEL[s]).join(", ")}</strong></p>
            ) : <p className="mt-4 text-[17px]">No mistakes. These rules are yours.</p>}
            <button className={`${btn.cta} mt-6`} onClick={() => setSeed((x) => x + 1)}><RotateCcw className="h-4 w-4" /> New session</button>
          </div>
        </Panel>
      ) : item ? (
        <Panel>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" />{item.skills.map((s) => SKILL_LABEL[s]).join(" + ")}</span>
            <span>{i + 1} / {session.length} · {score} correct</span>
          </div>
          <div className="mt-3"><ProgressBar value={(i / session.length) * 100} label="Session progress" /></div>

          <p className="mt-6 text-sm font-semibold text-muted-foreground">{item.kind === "build" ? "Say it in Italian" : "Complete it"}</p>
          <p className="mt-1 text-[17px]">{item.english}</p>

          {item.kind === "choice" ? (
            <>
              <p className="mt-4 text-2xl font-bold">{item.prompt}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.options.map((o) => {
                  const state = picked === null ? "" : o === item.answer ? "border-success bg-tile-green" : o === picked ? "border-destructive bg-destructive/10" : "opacity-60";
                  return <button key={o} disabled={picked !== null} onClick={() => check(o)} className={`min-h-12 rounded-[14px] border px-4 text-left text-[17px] font-semibold hover:border-primary/50 ${state}`}>{o}</button>;
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mt-4 flex min-h-14 flex-wrap items-center gap-2 rounded-[14px] border border-dashed p-3">
                {built.length === 0 && <span className="text-muted-foreground">Tap the words in order</span>}
                {built.map((k, n) => (
                  <button key={n} disabled={picked !== null} onClick={() => setBuilt((b) => b.filter((_, x) => x !== n))} className="rounded-lg bg-tile-blue px-3 py-1.5 text-[17px] font-semibold text-tile-blue-ink">{item.tiles[k]}</button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tiles.map(({ t, k }) => (
                  <button key={k} disabled={built.includes(k) || picked !== null} onClick={() => setBuilt((b) => [...b, k])} className="rounded-lg border px-3 py-1.5 text-[17px] font-semibold hover:border-primary/50 disabled:opacity-30">{t}</button>
                ))}
              </div>
              {picked === null && <button className={`${btn.cta} mt-4`} disabled={built.length !== item.tiles.length} onClick={() => check(builtText)}>Check</button>}
            </>
          )}

          {picked !== null && (
            <div className={`mt-5 rounded-[14px] border p-4 ${ok ? "border-success/40 bg-tile-green/50" : "border-destructive/40 bg-destructive/5"}`}>
              <div className="flex items-center gap-2 font-bold">
                {ok ? <Check className="h-5 w-5 text-success" /> : <X className="h-5 w-5 text-destructive" />}
                <span>{fullSentence(item)}</span>
                <button aria-label="Hear it" onClick={() => speak(fullSentence(item))} className="ml-1 rounded-full p-1.5 hover:bg-muted"><Volume2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-[16px] leading-relaxed">{item.why}</p>
              <button className={`${btn.cta} mt-4`} onClick={next}>{i + 1 === session.length ? "See result" : "Next"} <ArrowRight className="h-4 w-4" /></button>
            </div>
          )}
        </Panel>
      ) : null}
    </div>
  );
}
