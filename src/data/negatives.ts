// Negatives lesson data + logic. Original Parlami content.

export const SUBJECTS = ["io", "tu", "lui", "lei", "noi", "voi", "loro", "Lei"];
export const CLITICS = ["mi", "ti", "ci", "vi", "si", "lo", "la", "li", "le", "gli", "ne"];

function clean(s: string) {
  return s.trim().toLowerCase().replace(/[.!?¿¡,]/g, "").replace(/’/g, "'").replace(/\s+/g, " ");
}

/**
 * Makes a present/compound Italian sentence negative:
 * [subject] + non + [pronoun + verb block].
 */
export function negate(sentence: string): string {
  const words = sentence.trim().split(/\s+/);
  let i = 0;
  if (words[0] && SUBJECTS.includes(words[0].toLowerCase())) i = 1;
  // "non" always goes before the whole pronoun+verb block — never inside it.
  words.splice(i, 0, "non");
  return words.join(" ");
}

export function isCorrectNegative(answer: string, affirmative: string): boolean {
  return clean(answer) === clean(negate(affirmative));
}

export type FlipTask = { it: string; en: string; neg_en: string; hint: string };
export const FLIP_TASKS: FlipTask[] = [
  { it: "parlo italiano", en: "I speak Italian", neg_en: "I don't speak Italian", hint: "Plain verb: non goes straight in front." },
  { it: "sono americano", en: "I'm American", neg_en: "I'm not American", hint: "Essere works like any other verb — no special form." },
  { it: "io abito a Roma", en: "I live in Rome", neg_en: "I don't live in Rome", hint: "The subject stays first: io non abito…" },
  { it: "Marco lavora oggi", en: "Marco works today", neg_en: "Marco isn't working today", hint: "A name is a subject too… but the rule is just: non before the verb. Here Marco comes first." },
  { it: "ti amo", en: "I love you", neg_en: "I don't love you", hint: "ti + amo is one block — non goes before both." },
  { it: "mi chiamo Luca", en: "My name is Luca", neg_en: "My name isn't Luca", hint: "mi chiamo is one block." },
  { it: "mi piace il caffè", en: "I like coffee", neg_en: "I don't like coffee", hint: "Never 'mi non piace'." },
  { it: "lo so", en: "I know (it)", neg_en: "I don't know", hint: "Non lo so — the sentence you'll say most in Italy." },
  { it: "ho capito", en: "I understood", neg_en: "I didn't understand", hint: "ho capito is two words but one verb — don't split it." },
  { it: "tu hai fame", en: "You're hungry", neg_en: "You're not hungry", hint: "Subject, then non, then verb." },
  { it: "capisco", en: "I understand", neg_en: "I don't understand", hint: "No 'do' needed — Italian just adds non." },
  { it: "voi siete stanchi", en: "You (all) are tired", neg_en: "You aren't tired", hint: "voi first, then non siete." },
];

// "Marco" isn't in SUBJECTS, so give named subjects explicit support.
const NAMED: Record<string, string> = { "Marco lavora oggi": "Marco non lavora oggi" };
export function expectedNegative(t: FlipTask) {
  return NAMED[t.it] ?? negate(t.it);
}
export function checkFlip(answer: string, t: FlipTask) {
  return clean(answer) === clean(expectedNegative(t));
}

export type SpotTask = { sentence: string; ok: boolean; fix: string; why: string };
export const SPOT_TASKS: SpotTask[] = [
  { sentence: "Non parlo tedesco.", ok: true, fix: "Non parlo tedesco.", why: "non right before the verb." },
  { sentence: "Ti non amo.", ok: false, fix: "Non ti amo.", why: "ti amo is one block; non goes before it." },
  { sentence: "Io non sono stanco.", ok: true, fix: "Io non sono stanco.", why: "Subject → non → verb." },
  { sentence: "Mi non piace.", ok: false, fix: "Non mi piace.", why: "mi piace can't be broken." },
  { sentence: "Ho non capito.", ok: false, fix: "Non ho capito.", why: "ho capito is one verb in two words." },
  { sentence: "Non io parlo francese.", ok: false, fix: "Io non parlo francese.", why: "The subject comes before non." },
  { sentence: "Non lo so.", ok: true, fix: "Non lo so.", why: "non + [lo so]." },
  { sentence: "Non mi chiamo Anna.", ok: true, fix: "Non mi chiamo Anna.", why: "Block kept intact." },
];

export type ReplyTask = { q: string; qEn: string; answer: string; en: string };
export const REPLY_TASKS: ReplyTask[] = [
  { q: "Vuoi la pizza?", qEn: "Do you want pizza?", answer: "No, non voglio la pizza", en: "No, I don't want pizza" },
  { q: "Sei italiano?", qEn: "Are you Italian?", answer: "No, non sono italiano", en: "No, I'm not Italian" },
  { q: "Parli spagnolo?", qEn: "Do you speak Spanish?", answer: "No, non parlo spagnolo", en: "No, I don't speak Spanish" },
  { q: "Hai capito?", qEn: "Did you understand?", answer: "No, non ho capito", en: "No, I didn't understand" },
];

/** A real reply needs both words: the answer "No," and the verb's "non". */
export function checkReply(answer: string, t: ReplyTask) {
  return clean(answer) === clean(t.answer);
}
