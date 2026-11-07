import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/app-shell";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Parlami Italian" },
      { name: "description", content: "How to use Parlami's verb lessons and practice." },
      { property: "og:title", content: "Help — Parlami" },
      { property: "og:description", content: "How to use Parlami's verb lessons and practice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  { q: "How do I learn a verb?", a: "Open Verbs, pick a verb from the list, and read the table. Tap any form to hear it. Blue letters show the ending added to the stem." },
  { q: "How does practice work?", a: "You'll see six English lines, one at a time. Type the Italian form and press Check answer. Use the accent buttons for à, è, é, ì, ò and ù." },
  { q: "What does “Almost” mean?", a: "Your letters were right but an accent was missing or wrong. It isn't counted as correct, because accents can change meaning (e vs è)." },
  { q: "When is a verb mastered?", a: "When you score 6 out of 6 in a practice round." },
  { q: "Where is my progress saved?", a: "In this browser only. Clearing browser data or switching devices will start you fresh." },
  { q: "Are the A1/A2 labels official?", a: "No. They're our curriculum grouping based on common A1/A2 course lists, not an official CEFR guarantee." },
  { q: "I can't hear audio.", a: "Pronunciation uses your device's built-in Italian voice. If none is installed, audio may be silent." },
];

function HelpPage() {
  return (
    <div>
      <PageHeader title="Help" description="Quick answers about lessons, practice and progress." />
      <Panel className="!p-0">
        <div className="divide-y">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  );
}
