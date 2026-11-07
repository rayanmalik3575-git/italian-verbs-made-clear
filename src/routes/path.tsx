import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookA, Lock } from "lucide-react";
import { VERBS, LEVEL } from "@/data/verbs";
import { useProgress, statusOf } from "@/lib/progress";
import { IconTile, PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";

export const Route = createFileRoute("/path")({
  head: () => ({
    meta: [
      { title: "Learning Path — Parlami Italian" },
      { name: "description", content: "Your step-by-step Italian path from A1 to A2, starting with the most important verbs." },
      { property: "og:title", content: "Italian Learning Path — Parlami" },
      { property: "og:description", content: "A clear order for learning Italian verbs from A1 to A2." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PathPage,
});

const STAGES = [
  { title: "Stage 1 · The 10 pillar verbs", from: 0, to: 10 },
  { title: "Stage 2 · Everyday A1 verbs", level: "A1" as const, from: 10 },
  { title: "Stage 3 · A2 expansion", level: "A2" as const },
];

function PathPage() {
  const progress = useProgress();
  const a1 = VERBS.filter((v) => LEVEL[v.infinitive] === "A1");
  const stageVerbs = [VERBS.slice(0, 10), a1.slice(10), VERBS.filter((v) => LEVEL[v.infinitive] === "A2")];

  return (
    <div>
      <PageHeader title="Learning Path" description="Follow the stages in order. Each verb is marked mastered once you score 6/6 in practice." />
      <ol className="space-y-4">
        {STAGES.map((s, idx) => {
          const verbs = stageVerbs[idx]!;
          const done = verbs.filter((v) => statusOf(progress[v.infinitive]) === "mastered").length;
          const next = verbs.find((v) => statusOf(progress[v.infinitive]) !== "mastered");
          return (
            <li key={s.title}>
              <Panel>
                <div className="flex flex-wrap items-center gap-4">
                  <IconTile icon={BookA} color={(["blue", "lavender", "pink"] as const)[idx] ?? "blue"} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold">{s.title}</h2>
                    <p className="text-sm text-muted-foreground">{done} of {verbs.length} mastered</p>
                  </div>
                  {next && <Link to="/verbs" search={{ verb: next.infinitive, mode: "learn" }} className={btn.outline}>Next: {next.infinitive} <ArrowRight className="h-4 w-4" /></Link>}
                </div>
                <div className="mt-4"><ProgressBar value={(done / verbs.length) * 100} label={`${s.title} progress`} /></div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {verbs.map((v) => {
                    const st = statusOf(progress[v.infinitive]);
                    return (
                      <Link key={v.infinitive} to="/verbs" search={{ verb: v.infinitive, mode: "learn" }}
                        className={`rounded-lg border px-2.5 py-1 text-sm font-medium ${st === "mastered" ? "border-success/30 bg-tile-green text-tile-green-ink" : st === "practising" ? "border-warning/30 bg-tile-amber text-tile-amber-ink" : "text-muted-foreground hover:bg-muted"}`}>
                        {v.infinitive}
                      </Link>
                    );
                  })}
                </div>
              </Panel>
            </li>
          );
        })}
      </ol>
      <Panel className="mt-4 border-dashed !shadow-none">
        <div className="flex items-center gap-4"><IconTile icon={Lock} color="amber" />
          <div><h2 className="font-bold">More modules are in development</h2><p className="text-sm text-muted-foreground">Greetings, articles & nouns and numbers will appear here once they're ready.</p></div></div>
      </Panel>
    </div>
  );
}
