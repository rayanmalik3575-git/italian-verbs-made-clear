import type { Sentence } from "@/content/questions-lesson";

const s = (id: string, italian: string, english: string, type: Sentence["type"] = "statement"): Sentence => ({
  id: `bb-${id}`, italian, english, type,
  audioNormal: `/audio/sentences/bb-${id}.mp3`, audioSlow: `/audio/sentences/bb-${id}-slow.mp3`,
});

export const ACTION_ROWS = {
  named: s("marco", "Marco beve un caffè.", "Marco drinks a coffee."),
  dropped: s("bevo", "Bevo un caffè.", "I drink a coffee."),
};

export const SHAPES = [
  { key: "statement", label: "Statement", formula: "ACTION + WHAT", sentence: s("parli", "Parli italiano.", "You speak Italian."),
    rule: "This is the backbone. Everything else is built on it." },
  { key: "negative", label: "Negative", formula: "NON + ACTION + WHAT", sentence: s("nonparli", "Non parli italiano.", "You don't speak Italian."),
    rule: "Non always goes right in front of the verb. No \"don't\" or \"doesn't\" needed." },
  { key: "question", label: "Question", formula: "ACTION + WHAT + ?", sentence: s("parliq", "Parli italiano?", "Do you speak Italian?", "question"),
    rule: "Same word order as the statement. Never translate \"do/does\": add ? and raise your voice at the end." },
] as const;

export const GROW = [
  { added: "Mangio", label: "Just the verb", sentence: s("g1", "Mangio.", "I eat."), note: "One word is already a full sentence. The -o tells you it's I." },
  { added: "una pizza", label: "+ What", sentence: s("g2", "Mangio una pizza.", "I eat a pizza."), note: "" },
  { added: "calda", label: "+ Description", sentence: s("g3", "Mangio una pizza calda.", "I eat a hot pizza."), note: "The description comes after the noun, not before." },
  { added: "Oggi", extra: "a Roma", label: "+ When / Where", sentence: s("g4", "Oggi mangio una pizza calda a Roma.", "Today I eat a hot pizza in Rome."), note: "Time often opens the sentence, place usually closes it." },
] as const;

export const TRANSFORM = {
  statement: s("t1", "Bevi un caffè.", "You drink a coffee."),
  negative: s("t2", "Non bevi un caffè.", "You don't drink a coffee."),
  question: s("t3", "Bevi un caffè?", "Do you drink a coffee?", "question"),
};

export const TILE_TASK = {
  english: "I don't drink coffee.",
  answer: ["non", "bevo", "il", "caffè"],
  bank: ["caffè", "bevi", "il", "non", "bevo"],
  sentence: s("tile", "Non bevo il caffè.", "I don't drink coffee."),
};

export type TileResult = { ok: boolean; tip: string };
export function checkTiles(picked: string[]): TileResult {
  if (picked.includes("bevi")) return { ok: false, tip: "Bevi means \"you drink\". For I, you need the -o form: bevo." };
  const joined = picked.join(" ");
  if (joined === TILE_TASK.answer.join(" ")) return { ok: true, tip: "Right. Non goes right before the verb it cancels: non bevo." };
  if (picked.indexOf("non") > picked.indexOf("bevo")) return { ok: false, tip: "Non must come right before the verb, never after it." };
  return { ok: false, tip: "Start from non + the verb, then add what you drink: il caffè." };
}
