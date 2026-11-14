# Sentences page, Tab 1 "The backbone": new 4-part mini-lesson

Only Tab 1 of `/sentences` changes. Tabs 2-4, the tab bar, the "Next" button and the page header stay as they are.

## What the learner sees (top to bottom)

1. **Start from the action**
   - Row A, naming someone: `[WHO Marco] → [ACTION beve] → [WHAT un caffè]`, then "Marco drinks a coffee" and a speaker button.
   - Row B, I / you / we: one merged `[WHO + ACTION Bevo]` tile with a blue-to-pink edge and a small "-o = I" mark on the ending, then `→ [WHAT un caffè]`, "I drink a coffee" and a speaker button.
   - One-line note: because you learned the verb endings, Italians usually skip io / tu / noi and start with the verb.

2. **One backbone, three shapes**
   - Three cards side by side on desktop, stacked on mobile, all built from "parli italiano":
     - Statement: `Parli italiano.` / "You speak Italian."
     - Negative: a rose `Non` tile, then `parli italiano.` / "You don't speak Italian." Rule: *Non* always sits right before the verb, so no "don't" or "doesn't".
     - Question: `Parli italiano?` / "Do you speak Italian?" Rule: same word order as the statement; never translate "do/does", just raise your voice at the end.
   - Each card has a speaker button. The question uses the existing question intonation.
   - Small Lucide icons (Plus, Minus, HelpCircle) instead of emoji, per the project's no-emoji rule.

3. **Watch a sentence grow**
   - Four rows that reveal one at a time, with a "Add the next piece" button and a "Show all" option. Each row has a speaker and marks the new piece in colour:
     1. `Mangio.` / I eat.
     2. `Mangio una pizza.` / I eat a pizza.
     3. `Mangio una pizza calda.` / I eat a hot pizza. Note: the description comes after the noun.
     4. `Oggi mangio una pizza calda a Roma.` / Today I eat a hot pizza in Rome.

4. **Quick check: transform this sentence** (both parts, kept compact)
   - A three-way switch (Statement / Negative / Question) turns "Bevi un caffè" into each shape and speaks it as it changes.
   - Tile task: build "I don't drink coffee" from `non · bevo · il · caffè` plus one trap tile (`bevi`). Tiles are shown in lowercase. The first word gets a capital once placed. Green feedback: "*Non* goes right before the verb it cancels." If the learner picks `bevi`, they get a one-line tip: "bevi = you drink; you need the -o form for I."

## Technical section
- Lesson wording goes in a new `src/content/sentences-backbone.ts`, following the project rule that lesson content lives in `src/content`.
- The `Backbone()` function in `src/routes/sentences.tsx` gets rewritten, reusing `Panel`, `IconTile`, `btn`, the `Tile` role colours and the existing `AudioButton` / speech helper from `src/components/lesson/`.
- The old `BACKBONE` export stays in place in case anything else uses it. Its import gets removed if it ends up unused.
- A small test covers the tile check: the accepted order is `non bevo il caffè`, and `bevi` is rejected with its tip.
- Browser check at 375 px and 1280 px. Then I'll play through the switch and the tile task.
