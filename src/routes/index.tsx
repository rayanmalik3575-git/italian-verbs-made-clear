import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Languages, Target, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parlami — Master Italian from A1, one verb at a time" },
      { name: "description", content: "Learn and practice Italian verbs with every form explained in plain English. Start your A1 journey free." },
      { property: "og:title", content: "Parlami — Master Italian from A1" },
      { property: "og:description", content: "Every Italian verb form explained in English, with instant practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const modules = [
  { title: "Verbs All‑in‑One", desc: "Pick any verb. See every form with io, tu, lui… and what it means in English. Then practice.", to: "/verbs", live: true },
  { title: "Greetings & Introductions", desc: "Ciao, buongiorno, mi chiamo… the first conversations.", live: false },
  { title: "Articles & Nouns", desc: "il, la, lo, gli — masculine, feminine, plural, made simple.", live: false },
  { title: "Numbers, Time & Dates", desc: "Count, tell time, and book a table.", live: false },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-bold">Parlami<span className="text-primary">.</span></span>
        <Link to="/verbs" className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">Start A1</Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary">Level A1 · Now open</p>
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] md:text-7xl">
          Speak Italian like you <em className="text-primary">mean it</em>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Every word, every form, explained in plain English — then practiced until it sticks. A complete path from your first “ciao” to confident A1.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/verbs" className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground shadow-lg">Practice verbs now</Link>
          <a href="#path" className="rounded-full border border-foreground/20 px-7 py-3 font-medium">See the A1 path</a>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-3">
          {[
            { icon: Languages, t: "Meaning, not just translation", d: "“Parlo” isn't just “speak” — it's “I speak”. We show it for every pronoun." },
            { icon: Target, t: "Practice that adapts", d: "Type the right form, get instant feedback, and see your score grow." },
            { icon: BookOpen, t: "Step-by-step A1", d: "A clear curriculum aligned with the European CEFR framework." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="path" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-4xl font-bold">Your A1 path</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {modules.map((m, i) => {
            const inner = (
              <div className={`h-full rounded-2xl border p-6 transition ${m.live ? "bg-card hover:-translate-y-1 hover:shadow-xl" : "opacity-60"}`}>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Step {i + 1}</span>
                  {m.live ? <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">Available</span> : <Lock className="h-4 w-4" />}
                </div>
                <h3 className="mt-3 text-2xl font-semibold">{m.title}</h3>
                <p className="mt-2 text-muted-foreground">{m.desc}</p>
              </div>
            );
            return m.live ? <Link key={m.title} to="/verbs">{inner}</Link> : <div key={m.title}>{inner}</div>;
          })}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">© 2026 Parlami · Fatto con amore</footer>
    </div>
  );
}
