import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, X, ArrowLeft, Volume2 } from "lucide-react";
import { PRONOUNS, VERBS, type Verb } from "@/data/verbs";

export const Route = createFileRoute("/verbs")({
  head: () => ({
    meta: [
      { title: "Italian Verbs All-in-One (A1) — Parlami" },
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

function VerbsPage() {
  const [selected, setSelected] = useState<Verb>(VERBS[0]!);
  const [mode, setMode] = useState<"learn" | "practice">("learn");
  const [query, setQuery] = useState("");
  const list = VERBS.filter((v) => (v.infinitive + v.english).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-6">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>
        <span className="font-display text-2xl font-bold">Verbs All‑in‑One</span>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">A1 · Present tense</span>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border bg-card p-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a verb…" className="mb-3 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
          <ul className="space-y-1">
            {list.map((v) => (
              <li key={v.infinitive}>
                <button
                  onClick={() => { setSelected(v); setMode("learn"); }}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${selected.infinitive === v.infinitive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <div className="font-medium">{v.infinitive}</div>
                  <div className={`text-xs ${selected.infinitive === v.infinitive ? "opacity-80" : "text-muted-foreground"}`}>{v.english} · {v.type}</div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="rounded-2xl border bg-card p-6 md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-5xl font-bold">
                {selected.infinitive}
                <button onClick={() => speak(selected.infinitive)} aria-label="Listen" className="text-muted-foreground hover:text-primary"><Volume2 className="h-6 w-6" /></button>
              </h1>
              <p className="mt-1 text-xl text-muted-foreground">{selected.english}</p>
            </div>
            <div className="flex rounded-full border p-1">
              {(["learn", "practice"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`rounded-full px-5 py-2 text-sm font-medium capitalize ${mode === m ? "bg-foreground text-background" : ""}`}>{m}</button>
              ))}
            </div>
          </div>
          <p className="mt-6 rounded-xl bg-muted p-4 text-sm">{selected.meaning}</p>

          {mode === "learn" ? <Learn verb={selected} /> : <Practice key={selected.infinitive} verb={selected} />}
        </main>
      </div>
    </div>
  );
}

function Learn({ verb }: { verb: Verb }) {
  return (
    <>
      <div className="mt-8 divide-y rounded-xl border">
        {PRONOUNS.map((p, i) => (
          <div key={p.it} className="grid grid-cols-[90px_1fr] items-center gap-4 p-4 md:grid-cols-[100px_160px_1fr]">
            <div className="text-sm font-semibold text-secondary">{p.it}</div>
            <button onClick={() => speak(`${p.it === "lui/lei" ? "lui" : p.it} ${verb.forms[i]}`)} className="flex items-center gap-2 text-left font-display text-2xl font-semibold text-primary">
              {verb.forms[i]} <Volume2 className="h-4 w-4 opacity-40" />
            </button>
            <div className="col-span-2 md:col-span-1">
              <div className="font-medium">{verb.en[i]}</div>
              <div className="text-xs text-muted-foreground">{p.note}</div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="mt-8 text-xl font-semibold">In real life</h3>
      <div className="mt-3 space-y-2">
        {verb.examples.map((e) => (
          <div key={e.it} className="rounded-xl border p-4">
            <div className="font-medium">{e.it}</div>
            <div className="text-sm text-muted-foreground">{e.en}</div>
          </div>
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
    const ok = norm(answer) === norm(verb.forms[i]);
    setResult(ok);
    if (ok) setScore(score + 1);
    speak(verb.forms[i]);
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
