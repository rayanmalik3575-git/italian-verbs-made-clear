import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, MessageSquareText, PenLine } from "lucide-react";
import { TranslateMode, StoryMode, ReadingMode } from "@/components/review/ReviewModes";
import { READINGS, STORIES, TRANSLATE } from "@/content/review-extras";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Master Review — Parlami Italian" },
      { name: "description", content: "One big practice of everything taught: articles, plurals, negatives, questions and sentences." },
      { property: "og:title", content: "Master Review — Parlami" },
      { property: "og:description", content: "Translate lines, then paragraphs, then read Italian and answer in Italian." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReviewPage,
});

const TIERS = [
  { id: "lines", n: 1, icon: PenLine, title: "Power lines", sub: `${TRANSLATE.length} sentences · English → Italian` },
  { id: "story", n: 2, icon: MessageSquareText, title: "Paragraphs", sub: `${STORIES.length} scenes · connected lines` },
  { id: "reading", n: 3, icon: BookOpen, title: "Read & answer", sub: `${READINGS.length} texts · think in Italian` },
] as const;
type Tier = (typeof TIERS)[number]["id"];

function ReviewPage() {
  const [tier, setTier] = useState<Tier>("lines");
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="text-center">
        <h1 className="text-[28px] font-bold leading-tight sm:text-[32px]">Master review</h1>
        <p className="mx-auto mt-2 max-w-[60ch] text-[17px] leading-relaxed text-foreground/80">
          Only what you learned in the lessons — articles, plurals, negatives, questions and sentences — mixed together. Start with single lines, then whole paragraphs, then read Italian and answer in Italian.
        </p>
      </header>

      <div role="tablist" className="grid gap-2 sm:grid-cols-3">
        {TIERS.map((t) => {
          const on = tier === t.id; const Icon = t.icon;
          return (
            <button key={t.id} role="tab" aria-selected={on} onClick={() => setTier(t.id)}
              className={`flex items-center gap-3 rounded-[18px] border p-3 text-left transition ${on ? "border-primary bg-card shadow-sm ring-2 ring-primary/20" : "bg-card/60 hover:bg-card"}`}>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[12px] ${on ? "bg-primary text-primary-foreground" : "bg-tile-blue text-tile-blue-ink"}`}><Icon className="h-5 w-5" /></span>
              <span className="min-w-0">
                <span className="block text-[15px] font-bold">{t.n}. {t.title}</span>
                <span className="block text-[14px] text-foreground/70">{t.sub}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div hidden={tier !== "lines"}><TranslateMode /></div>
      <div hidden={tier !== "story"}><StoryMode /></div>
      <div hidden={tier !== "reading"}><ReadingMode /></div>
    </div>
  );
}
