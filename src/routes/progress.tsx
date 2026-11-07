import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Check, Clock, PenLine } from "lucide-react";
import { VERBS, LEVEL } from "@/data/verbs";
import { useProgress, statusOf, STATUS_LABEL } from "@/lib/progress";
import { IconTile, PageHeader, Panel, ProgressBar, btn } from "@/components/app-shell";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress — Parlami Italian" },
      { name: "description", content: "See which Italian verbs you've practised and mastered." },
      { property: "og:title", content: "Your Italian progress — Parlami" },
      { property: "og:description", content: "Track your verb practice results." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const progress = useProgress();
  const entries = VERBS.filter((v) => progress[v.infinitive]).sort((a, b) => progress[b.infinitive]!.last - progress[a.infinitive]!.last);
  const mastered = entries.filter((v) => statusOf(progress[v.infinitive]) === "mastered").length;
  const sessions = entries.reduce((n, v) => n + progress[v.infinitive]!.attempts, 0);

  if (entries.length === 0) {
    return (
      <div>
        <PageHeader title="Progress" />
        <Panel className="text-center">
          <div className="flex justify-center"><IconTile icon={BarChart3} color="green" /></div>
          <h2 className="mt-4 text-lg font-bold">No practice yet</h2>
          <p className="mx-auto mt-1 max-w-md text-muted-foreground">Finish a practice round and your results will appear here. Progress is stored in this browser.</p>
          <Link to="/verbs" search={{ verb: VERBS[0]!.infinitive, mode: "practice" }} className={`${btn.primary} mt-5`}>Practise {VERBS[0]!.infinitive}</Link>
        </Panel>
      </div>
    );
  }

  const levelPct = (l: "A1" | "A2") => {
    const all = VERBS.filter((v) => LEVEL[v.infinitive] === l);
    const m = all.filter((v) => statusOf(progress[v.infinitive]) === "mastered").length;
    return { m, n: all.length };
  };
  return (
    <div className="space-y-5">
      <PageHeader title="Progress" description="Based on practice rounds you've completed in this browser." />
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ i: PenLine, c: "blue", l: "Verbs practised", v: entries.length }, { i: Check, c: "green", l: "Verbs mastered", v: mastered }, { i: Clock, c: "lavender", l: "Rounds completed", v: sessions }].map((s) => (
          <Panel key={s.l}><div className="flex items-center gap-3"><IconTile icon={s.i} color={s.c as "blue"} /><div><p className="text-2xl font-bold">{s.v}</p><p className="text-sm text-muted-foreground">{s.l}</p></div></div></Panel>
        ))}
      </div>
      <Panel>
        {(["A1", "A2"] as const).map((l) => { const { m, n } = levelPct(l); return (
          <div key={l} className="mb-4 last:mb-0"><div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold">{l} verbs</span><span className="text-muted-foreground">{m} / {n}</span></div><ProgressBar value={(m / n) * 100} label={`${l} mastered`} /></div>
        ); })}
      </Panel>
      <Panel className="!p-0">
        <table className="w-full text-left">
          <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3">Verb</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Best</th><th className="hidden px-5 py-3 sm:table-cell">Rounds</th></tr></thead>
          <tbody className="divide-y">
            {entries.map((v) => { const r = progress[v.infinitive]!; const st = statusOf(r); return (
              <tr key={v.infinitive}>
                <td className="px-5 py-3"><Link to="/verbs" search={{ verb: v.infinitive, mode: "practice" }} className="font-semibold hover:underline">{v.infinitive}</Link></td>
                <td className="px-5 py-3"><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${st === "mastered" ? "bg-tile-green text-tile-green-ink" : "bg-tile-amber text-tile-amber-ink"}`}>{STATUS_LABEL[st]}</span></td>
                <td className="px-5 py-3 tabular-nums">{r.best}/6</td>
                <td className="hidden px-5 py-3 tabular-nums sm:table-cell">{r.attempts}</td>
              </tr>); })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
