import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookA, PenLine, BarChart3, Route as RouteIcon, RotateCcw } from "lucide-react";
import { VERBS, LEVEL } from "@/data/verbs";
import { useProgress, statusOf } from "@/lib/progress";
import { IconTile, Panel, ProgressBar, btn } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Parlami Italian" },
      { name: "description", content: "Continue your Italian A1–A2 journey: verbs, practice and real progress in one place." },
      { property: "og:title", content: "Parlami — Learn Italian step by step" },
      { property: "og:description", content: "Every Italian verb form explained in English, with focused practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const progress = useProgress();
  const a1 = VERBS.filter((v) => LEVEL[v.infinitive] === "A1");
  const mastered = a1.filter((v) => statusOf(progress[v.infinitive]) === "mastered").length;
  const started = Object.keys(progress).length > 0;
  const next = VERBS.find((v) => statusOf(progress[v.infinitive]) !== "mastered") ?? VERBS[0]!;
  const review = VERBS.filter((v) => statusOf(progress[v.infinitive]) === "practising").slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-[28px]">{started ? "Bentornato! Welcome back." : "Benvenuto! Let's start your Italian."}</h1>
        <p className="mt-1 text-muted-foreground">{started ? "Pick up where you left off." : "Start with the most important verb in Italian — it takes about two minutes."}</p>
      </div>

      <section className="overflow-hidden rounded-[24px] border bg-gradient-feature p-5 shadow-card sm:p-8">
        <p className="text-sm font-semibold text-accent-foreground">Currently studying</p>
        <h2 className="mt-1 text-xl font-bold sm:text-2xl">A1 Verbs · Present tense</h2>
        <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
          <span>{mastered === 0 ? "No verbs mastered yet" : `${mastered} of ${a1.length} A1 verbs mastered`}</span>
          <span className="font-semibold text-foreground">{Math.round((mastered / a1.length) * 100)}%</span>
        </div>
        <div className="mt-2"><ProgressBar value={(mastered / a1.length) * 100} label="A1 verbs mastered" /></div>

        <div className="mt-6 flex flex-col gap-4 rounded-[18px] border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{started ? "Your next verb" : "Your first verb"}</p>
            <p className="mt-0.5 text-xl font-bold">{next.infinitive} <span className="font-medium text-muted-foreground">— {next.english}</span></p>
          </div>
          <Link to="/verbs" search={{ verb: next.infinitive, mode: "learn" }} className={btn.cta}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      {review.length > 0 && (
        <Panel>
          <div className="flex items-center gap-3"><IconTile icon={RotateCcw} color="amber" size="sm" /><h2 className="text-lg font-bold">Ready for review</h2></div>
          <p className="mt-1 text-sm text-muted-foreground">You've practised these but haven't scored 6/6 yet.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {review.map((v) => (
              <Link key={v.infinitive} to="/verbs" search={{ verb: v.infinitive, mode: "practice" }} className={btn.outline}>
                {v.infinitive} <span className="text-sm font-medium text-muted-foreground">{progress[v.infinitive]!.best}/6</span>
              </Link>
            ))}
          </div>
        </Panel>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/verbs", icon: BookA, color: "blue", t: "Verbs", d: `${VERBS.length} verbs with English meanings` },
          { to: "/practice", icon: PenLine, color: "pink", t: "Practice", d: "One question at a time" },
          { to: "/path", icon: RouteIcon, color: "lavender", t: "Learning Path", d: "What to learn, in order" },
          { to: "/progress", icon: BarChart3, color: "green", t: "Progress", d: "Your real results" },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-[20px] border bg-card p-5 shadow-card transition hover:border-primary/40">
            <IconTile icon={c.icon} color={c.color as "blue"} />
            <h3 className="mt-4 font-bold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
