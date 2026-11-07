import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, ArrowLeft, Volume2 } from "lucide-react";
import { PRONOUNS, VERBS, LEVEL, RANK, GROUP_INFO, type Verb, type Level } from "@/data/verbs";

export const Route = createFileRoute("/verbs")({
  head: () => ({
    meta: [
      { title: "Italian Verbs: -are, -ere, -ire (A1–A2) — Parlami" },
      { name: "description", content: "Choose an Italian verb, see every present-tense form with English meaning, then practice." },
      { property: "og:title", content: "Italian Verbs All-in-One — Parlami" },
      { property: "og:description", content: "Every A1 verb form explained in English, with instant practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerbsPage,
});

const norm = (s: string) => s.trim().toLowerCase().replace(/[’']/g, "'").replace("e'", "è");

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "it-IT";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

type Group = "all" | "-are" | "-ere" | "-ire" | "irregular";
const GROUPS: { id: Group; label: string }[] = [
  { id: "all", label: "All" }, { id: "-are", label: "-ARE" }, { id: "-ere", label: "-ERE" }, { id: "-ire", label: "-IRE" }, { id: "irregular", label: "Irregular" },
];

function VerbsPage() {
  const [group, setGroup] = useState<Group>("all");
  const [level, setLevel] = useState<"all" | Level>("all");
  const [query, setQuery] = useState("");
  const list = VERBS.filter((v) => (group === "all" || v.type === group) && (level === "all" || LEVEL[v.infinitive] === level) && (v.infinitive + v.english).toLowerCase().includes(query.toLowerCase()));
  const [selectedName, setSelectedName] = useState("essere");
  const selected = list.find((v) => v.infinitive === selectedName) ?? list[0] ?? VERBS[0]!;
  const [mode, setMode] = useState<"learn" | "practice">("learn");
  const count = (g: Group) => VERBS.filter((v) => (g === "all" || v.type === g) && (level === "all" || LEVEL[v.infinitive] === level)).length;

  return (
    <div className="min-h-screen">
      <div className="tricolore h-1 w-full" />
      <header className="border-b bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>
          <span className="h-5 w-px bg-border" />
          <span className="font-display text-xl font-semibold">Verbi <span className="italic text-primary">All‑in‑One</span></span>
          <span className="ml-auto rounded-full border px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">Presente · A1–A2</span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Choose a verb family</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {GROUPS.map((g) => {
            const active = group === g.id;
            const info = g.id === "all" ? null : GROUP_INFO[g.id];
            return (
              <button key={g.id} onClick={() => setGroup(g.id)} className={`rounded-2xl border p-4 text-left transition ${active ? "border-primary bg-primary text-primary-foreground shadow-elegant" : "bg-card hover:border-foreground/30"}`}>
                <div className="font-display text-2xl font-semibold">{g.label}</div>
                <div className={`mt-1 text-xs ${active ? "opacity-85" : "text-muted-foreground"}`}>{count(g.id)} verbs{info ? "" : " · every family"}</div>
              </button>
            );
          })}
        </div>
        {group !== "all" && (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-2xl border bg-accent/50 px-5 py-3 text-sm">
            <span className="font-semibold text-accent-foreground">{GROUP_INFO[group]!.title}</span>
            <span className="font-mono text-accent-foreground">{GROUP_INFO[group]!.endings}</span>
            <span className="text-muted-foreground">{GROUP_INFO[group]!.note}</span>
          </div>
        )}
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-3xl border bg-card p-4 md:sticky md:top-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a verb…" className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <div className="my-3 flex gap-1 rounded-full bg-muted p-1 text-xs">
            {(["all", "A1", "A2"] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={`flex-1 rounded-full py-1.5 font-medium ${level === l ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{l === "all" ? "All levels" : l}</button>
            ))}
          </div>
          <p className="mb-2 px-1 text-[11px] uppercase tracking-wider text-muted-foreground">Ordered: most important first</p>
          <ul className="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
            {list.map((v) => {
              const on = selected.infinitive === v.infinitive;
              return (
                <li key={v.infinitive}>
                  <button onClick={() => { setSelectedName(v.infinitive); setMode("learn"); }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${on ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                    <span className="flex items-center gap-3"><span className={`w-6 text-right font-mono text-xs ${on ? "opacity-60" : "text-muted-foreground"}`}>{RANK[v.infinitive]}</span><span>
                      <span className="block font-medium">{v.infinitive}</span>
                      <span className={`block text-xs ${on ? "opacity-70" : "text-muted-foreground"}`}>{v.english}</span>
                    </span></span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${LEVEL[v.infinitive] === "A1" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>{LEVEL[v.infinitive]}</span>
                  </button>
                </li>
              );
            })}
            {list.length === 0 && <li className="p-3 text-sm text-muted-foreground">No verbs match.</li>}
          </ul>
        </aside>

        <main className="rounded-3xl border bg-card p-6 shadow-elegant md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 text-xs font-semibold">
                <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">{LEVEL[selected.infinitive]}</span>
                <span className="rounded-full border px-2.5 py-1 text-muted-foreground">{selected.type}</span>
              </div>
              <h1 className="mt-3 flex items-center gap-3 text-5xl font-semibold md:text-6xl">
                {selected.infinitive}
                <button onClick={() => speak(selected.infinitive)} aria-label="Listen" className="rounded-full border p-2 text-muted-foreground hover:text-primary"><Volume2 className="h-5 w-5" /></button>
              </h1>
              <p className="mt-1 text-xl italic text-muted-foreground">{selected.english}</p>
            </div>
            <div className="flex rounded-full border bg-muted p-1">
              {(["learn", "practice"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-full px-5 py-2 text-sm font-medium capitalize ${mode === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{m}</button>
              ))}
            </div>
          </div>
          <p className="mt-6 border-l-2 border-secondary pl-4 text-sm text-muted-foreground">{selected.meaning}</p>

          {mode === "learn" ? <Learn verb={selected} /> : <Practice key={selected.infinitive} verb={selected} />}
        </main>
      </div>
    </div>
  );
}

function Form({ verb, form }: { verb: Verb; form: string }) {
  if (verb.type === "irregular") return <>{form}</>;
  const stem = verb.infinitive.slice(0, -3);
  const n = form.startsWith(stem) ? stem.length : 0;
  return <>{form.slice(0, n)}<span className="text-primary">{form.slice(n)}</span></>;
}

function Learn({ verb }: { verb: Verb }) {
  return (
    <>
      <div className="mt-8 divide-y overflow-hidden rounded-2xl border">
        {PRONOUNS.map((p, i) => (
          <div key={p.it} className="grid grid-cols-[90px_1fr] items-center gap-4 p-4 transition hover:bg-muted/50 md:grid-cols-[100px_200px_1fr]">
            <div className="text-sm font-semibold uppercase tracking-wider text-secondary">{p.it}</div>
            <button onClick={() => speak(`${p.it === "lui/lei" ? "lui" : p.it} ${verb.forms[i]}`)} className="flex items-center gap-2 text-left font-display text-2xl font-semibold">
              <span><Form verb={verb} form={verb.forms[i] ?? ""} /></span> <Volume2 className="h-4 w-4 text-muted-foreground opacity-50" />
            </button>
            <div className="col-span-2 md:col-span-1">
              <div className="font-medium">{verb.en[i]}</div>
              <div className="text-xs text-muted-foreground">{p.note}</div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="mt-10 text-xl font-semibold">In real life</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {verb.examples.map((e) => (
          <button key={e.it} onClick={() => speak(e.it)} className="rounded-2xl border bg-background p-4 text-left hover:border-primary/40">
            <div className="font-display text-lg">{e.it}</div>
            <div className="text-sm text-muted-foreground">{e.en}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function Practice({ verb }: { verb: Verb }) {
  const order = useMemo(() => [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5), []);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);

  if (step >= order.length) {
    return (
      <div className="mt-10 text-center">
        <div className="font-display text-6xl font-bold text-primary">{score}/6</div>
        <p className="mt-2 text-muted-foreground">{score === 6 ? "Perfetto! You've mastered it." : "Bravo! Practice again to make it perfect."}</p>
        <button onClick={() => { setStep(0); setScore(0); setResult(null); setAnswer(""); }} className="mt-6 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Try again</button>
      </div>
    );
  }

  const i = order[step] ?? 0;
  const p = PRONOUNS[i]!;
  const check = () => {
    if (result !== null) {
      setStep(step + 1); setAnswer(""); setResult(null); return;
    }
    const ok = norm(answer) === norm(verb.forms[i] ?? "");
    setResult(ok);
    if (ok) setScore(score + 1);
    speak(verb.forms[i] ?? "");
  };

  return (
    <div className="mt-8">
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${(step / 6) * 100}%` }} />
      </div>
      <p className="text-sm text-muted-foreground">Question {step + 1} of 6 · How do you say:</p>
      <p className="mt-2 text-3xl font-display font-semibold">“{verb.en[i]}”</p>
      <form onSubmit={(e) => { e.preventDefault(); check(); }} className="mt-6 flex items-center gap-3">
        <span className="font-semibold text-secondary">{p.it}</span>
        <input
          autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={result !== null}
          placeholder={`${verb.infinitive} → ?`}
          className="flex-1 rounded-xl border bg-background px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="rounded-xl bg-foreground px-6 py-3 font-medium text-background">{result === null ? "Check" : "Next"}</button>
      </form>
      {result !== null && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl p-4 ${result ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
          {result ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          {result ? "Corretto!" : <>The answer is <strong>{p.it} {verb.forms[i]}</strong> — “{verb.en[i]}”</>}
        </div>
      )}
    </div>
  );
}
