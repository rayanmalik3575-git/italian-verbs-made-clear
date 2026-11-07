import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PenLine, RotateCcw, Sparkles } from "lucide-react";
import { VERBS } from "@/data/verbs";
import { useProgress, statusOf } from "@/lib/progress";
import { IconTile, PageHeader, Panel, btn } from "@/components/app-shell";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — Parlami Italian" },
      { name: "description", content: "Practise Italian verb forms one question at a time, with clear feedback." },
      { property: "og:title", content: "Practise Italian verbs — Parlami" },
      { property: "og:description", content: "Focused, one-at-a-time Italian verb practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  const progress = useProgress();
  const review = VERBS.filter((v) => statusOf(progress[v.infinitive]) === "practising");
  const fresh = VERBS.filter((v) => statusOf(progress[v.infinitive]) === "not-started").slice(0, 6);
  const Row = ({ title, icon, color, verbs, empty }: { title: string; icon: typeof PenLine; color: "amber" | "blue"; verbs: typeof VERBS; empty: string }) => (
    <Panel>
      <div className="flex items-center gap-3"><IconTile icon={icon} color={color} size="sm" /><h2 className="text-lg font-bold">{title}</h2></div>
      {verbs.length === 0 ? <p className="mt-3 text-muted-foreground">{empty}</p> : (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {verbs.map((v) => (
            <li key={v.infinitive}>
              <Link to="/verbs" search={{ verb: v.infinitive, mode: "practice" }} className="flex min-h-14 items-center justify-between rounded-[14px] border px-4 hover:border-primary/40 hover:bg-muted/50">
                <span><span className="block font-semibold">{v.infinitive}</span><span className="text-sm text-muted-foreground">{v.english}</span></span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">{progress[v.infinitive] ? `Best ${progress[v.infinitive]!.best}/6` : ""}<ArrowRight className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
  const first = review[0] ?? fresh[0];
  return (
    <div className="space-y-5">
      <PageHeader title="Practice" description="Six questions per verb, one at a time. Score 6/6 to master it."
        actions={first && <Link to="/verbs" search={{ verb: first.infinitive, mode: "practice" }} className={btn.cta}><Sparkles className="h-4 w-4" /> Start with {first.infinitive}</Link>} />
      <Row title="Review" icon={RotateCcw} color="amber" verbs={review} empty="Nothing to review yet. Verbs you practise without a perfect score will show up here." />
      <Row title="Try something new" icon={PenLine} color="blue" verbs={fresh} empty="You've tried every verb — great work!" />
    </div>
  );
}
