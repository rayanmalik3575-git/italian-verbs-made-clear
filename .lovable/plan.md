# Rebuild "Asking questions" — Steps 1 and 2

Steps 3, 4 and 5 stay exactly as they are. Sidebar, header, page layout and the look of the step buttons don't change. I'll keep every Italian and English line from your brief word for word.

## Step 1: Your voice does it
- Headline and short intro from your brief.
- Three pairs side by side (stacked on phones): the statement has a blue falling curve, the question has an orange rising curve. Each line has its English and two audio buttons (normal and slow 0.7x).
- The long question "Prenotate una camera per tre notti?" shown as word chips, with the orange rise over the last chip and your caption.
- A "Know this" table with 3 rows: regional melody, writing, punctuation.
- Listening quiz with 4 items: play the clip, tap Statement or Question, get green or red feedback with a one-line reason. Score at the end, plus "Try again".
- Button: Next: Forget "do".

## Step 2: Forget "do"
- Headline and intro.
- 5-row table: English | Italian with a word-by-word English pill under each word | audio.
- "The habit to build" in 4 numbered steps.
- 5 "Show me" animations: the English question appears, the helper word turns red, gets crossed out and fades, then the words turn into the Italian with the ending in purple. Each has Replay and audio. Your present-tense note sits below them.
- "Why the ending is enough": lavorare table with the stem in dark text and the ending in purple, the person labelled under it, then your note about emphasis.
- Yellow "Watch out" box with your 4 points (wrong line in red, right line in green).
- 4-question multiple-choice quiz with reasons, score and "Try again".
- Buttons: Back and Next: The one word order.

## How the visuals behave
- When audio plays, the curve draws itself across the sentence and a dot travels along it, timed to the clip (1.8s if the length is unknown). When nothing plays, the curve shows fully drawn.
- Only one audio plays at a time, and the button shows when it's playing.
- If you haven't uploaded a recording yet, the browser's Italian voice reads the line and a small "temporary voice" label appears next to it.
- If your device is set to reduce motion, you see the finished state with no animation.
- Built for phones first and checked at 375px wide. Text is never smaller than 14px. No grey italics for anything important.

## Progress
- Finishing a step's quiz (with any score) marks that step done, and a small check appears on its step button. This is saved in the browser under `parlami.questions.progress`.

## Technical details
- Content goes in `src/content/questions-lesson.ts` as typed data: `Sentence` objects plus each step's headline, paragraphs, tables, warnings and quiz items. No text is hardcoded in the page.
- New components in `src/components/lesson/`: AudioButton (one shared player that also handles the voice fallback), PitchCurve (SVG with an animated stroke), WordGlossBar, EndingHighlight, StripAnimation, QuizCard, WarningBox.
- I'll add framer-motion and use its `useReducedMotion`. To avoid the page jumping, the animations keep a fixed height.
- The lesson colours become named design tokens in `src/styles.css` (statement blue, question orange, ending purple, plus correct and wrong). The page itself uses only these names, not raw colour codes.
- The saving logic goes in `src/lib/progress.ts`, which follows the project rule for progress.
- Tests: quiz scoring, the audio file names that come from each sentence id, and saving/reading step progress.
- Checks: keyboard use of the quizzes, aria-labels on every audio button, and a Playwright run at 375px and 1280px with no console errors.

## Audio files you'll upload
They go in `/public/audio/questions/`, two files per sentence (`<id>.mp3` and `<id>-slow.mp3`), for all three pairs, the long question, the 4 quiz clips, the 5 table lines and the 5 animations. At the end I'll give you the exact list of names.
