/** All-in-one review: every item combines rules from the lessons learned so far. */
export type Skill = "articles" | "plurals" | "negatives" | "questions" | "sentences";
export const SKILL_LABEL: Record<Skill, string> = {
  articles: "Articles", plurals: "Plurals", negatives: "Negatives", questions: "Questions", sentences: "Sentences",
};
type Base = { id: string; skills: Skill[]; english: string; answer: string; why: string };
export type ChoiceItem = Base & { kind: "choice"; prompt: string; options: string[] };
export type BuildItem = Base & { kind: "build"; tiles: string[] };
export type Item = ChoiceItem | BuildItem;

export const ITEMS: Item[] = [
  // Articles + plurals
  { id: "a1", kind: "choice", skills: ["articles", "plurals"], english: "The students are here.", prompt: "___ studenti sono qui.", options: ["I", "Gli", "Le", "Lo"], answer: "Gli", why: "Studente starts with s + consonant, so it takes lo — and lo becomes gli in the plural." },
  { id: "a2", kind: "choice", skills: ["articles", "plurals"], english: "The men speak Italian.", prompt: "Gli ___ parlano italiano.", options: ["uomi", "uomini", "uomo", "uome"], answer: "uomini", why: "Uomo is irregular: l'uomo → gli uomini. Learn it as one pair." },
  { id: "a3", kind: "choice", skills: ["articles"], english: "The friend (female) arrives.", prompt: "___ amica arriva.", options: ["La", "L'", "Lo", "Il"], answer: "L'", why: "Before a vowel, la and lo shorten to l'. You hear one smooth word: l'amica." },
  { id: "a4", kind: "choice", skills: ["articles", "plurals"], english: "The hands are cold.", prompt: "Le ___ sono fredde.", options: ["mane", "mani", "mano", "mana"], answer: "mani", why: "Mano is feminine but ends in -o. The plural is le mani." },
  { id: "a5", kind: "choice", skills: ["articles", "plurals"], english: "The bars are closed.", prompt: "I ___ sono chiusi.", options: ["bari", "bars", "bar", "bare"], answer: "bar", why: "Words ending in a consonant never change in the plural. Only the article tells you: il bar → i bar." },
  { id: "a6", kind: "choice", skills: ["articles", "plurals"], english: "The problems are big.", prompt: "I ___ sono grandi.", options: ["probleme", "problemi", "problema", "problemo"], answer: "problemi", why: "Greek -ma words are masculine: il problema → i problemi." },
  { id: "a7", kind: "choice", skills: ["articles", "plurals"], english: "The cities are beautiful.", prompt: "Le ___ sono belle.", options: ["città", "citte", "cittàs", "citti"], answer: "città", why: "Words ending in a stressed vowel don't change: la città → le città." },
  { id: "a8", kind: "choice", skills: ["articles"], english: "The zoo is closed.", prompt: "___ zoo è chiuso.", options: ["Il", "Lo", "L'", "La"], answer: "Lo", why: "Masculine words starting with z take lo, like s + consonant." },
  // Negatives
  { id: "n1", kind: "build", skills: ["negatives", "sentences"], english: "I don't understand.", tiles: ["Non", "capisco"], answer: "Non capisco", why: "Non goes right before the verb. No io needed — capisco already means I understand." },
  { id: "n2", kind: "build", skills: ["negatives", "sentences"], english: "I never eat meat.", tiles: ["Non", "mangio", "mai", "carne"], answer: "Non mangio mai carne", why: "Italian keeps both: non before the verb, mai after it. A double negative is correct here." },
  { id: "n3", kind: "build", skills: ["negatives"], english: "I don't see anything.", tiles: ["Non", "vedo", "niente"], answer: "Non vedo niente", why: "Non … niente works as a pair around the verb." },
  { id: "n4", kind: "choice", skills: ["negatives"], english: "No, I don't work today.", prompt: "___, non lavoro oggi.", options: ["Non", "No", "Né", "Mai"], answer: "No", why: "No answers the question. Non negates the verb. You often need both: No, non lavoro." },
  { id: "n5", kind: "choice", skills: ["negatives", "articles"], english: "I don't have the keys.", prompt: "Non ho ___ chiavi.", options: ["i", "gli", "le", "la"], answer: "le", why: "Chiave is feminine: la chiave → le chiavi." },
  { id: "n6", kind: "build", skills: ["negatives", "sentences"], english: "Nobody speaks.", tiles: ["Non", "parla", "nessuno"], answer: "Non parla nessuno", why: "With nessuno after the verb, non stays in front. (Nessuno parla is also fine.)" },
  // Questions
  { id: "q1", kind: "build", skills: ["questions"], english: "Where does your father work?", tiles: ["Dove", "lavora", "tuo", "padre?"], answer: "Dove lavora tuo padre?", why: "Question word → verb → the rest. There is no 'does' in Italian." },
  { id: "q2", kind: "choice", skills: ["questions"], english: "What is your name?", prompt: "___ è il tuo nome?", options: ["Cosa", "Qual", "Qual'", "Che"], answer: "Qual", why: "Qual è never has an apostrophe — and you use quale, not cosa, to ask for a name or a number." },
  { id: "q3", kind: "choice", skills: ["questions", "plurals"], english: "How many brothers do you have?", prompt: "___ fratelli hai?", options: ["Quanto", "Quanta", "Quanti", "Quante"], answer: "Quanti", why: "Quanto matches the noun: fratelli is masculine plural → quanti." },
  { id: "q4", kind: "choice", skills: ["questions", "negatives"], english: "Why aren't you coming?", prompt: "Perché ___ vieni?", options: ["no", "non", "mai", "niente"], answer: "non", why: "Same rule as statements: non sits right before the verb." },
  { id: "q5", kind: "choice", skills: ["questions"], english: "Do you speak English?", prompt: "Which one is the question?", options: ["Parli inglese.", "Parli inglese?", "Fai parli inglese?", "Tu fai parlare inglese?"], answer: "Parli inglese?", why: "A yes/no question is the statement itself — your voice lifts on the last word." },
  { id: "q6", kind: "choice", skills: ["questions", "plurals"], english: "Which shoes do you buy?", prompt: "___ scarpe compri?", options: ["Quale", "Quali", "Cosa", "Chi"], answer: "Quali", why: "Scarpe is plural, so quale becomes quali." },
  { id: "q7", kind: "build", skills: ["questions", "articles"], english: "When does the train leave?", tiles: ["Quando", "parte", "il", "treno?"], answer: "Quando parte il treno?", why: "The verb comes right after quando; the subject goes at the end." },
  { id: "q8", kind: "choice", skills: ["questions"], english: "Where is the station?", prompt: "___ la stazione?", options: ["Dove è", "Dov'è", "Dove'è", "Dov è"], answer: "Dov'è", why: "Dove + è contracts to dov'è — that's how it's written and said." },
  // Sentences
  { id: "s1", kind: "build", skills: ["sentences", "articles"], english: "I study Italian at home.", tiles: ["Studio", "italiano", "a", "casa"], answer: "Studio italiano a casa", why: "Drop io: studio already says who. After studiare, a language usually takes no article." },
  { id: "s2", kind: "build", skills: ["sentences", "plurals", "articles"], english: "The children eat the apples.", tiles: ["I", "bambini", "mangiano", "le", "mele"], answer: "I bambini mangiano le mele", why: "Subject → verb → object, like English. Both nouns are plural, so both articles are plural." },
  { id: "s3", kind: "choice", skills: ["sentences"], english: "We live in Rome.", prompt: "___ a Roma.", options: ["Noi abitiamo", "Abitiamo", "Abitare", "Abita"], answer: "Abitiamo", why: "Natives drop noi unless contrasting. Abitiamo alone sounds native." },
  { id: "s4", kind: "build", skills: ["sentences", "negatives", "articles"], english: "Marco doesn't drink coffee.", tiles: ["Marco", "non", "beve", "il", "caffè"], answer: "Marco non beve il caffè", why: "Name → non → verb → object. Non never moves away from the verb." },
  { id: "s5", kind: "choice", skills: ["sentences", "plurals"], english: "The girls are Italian.", prompt: "Le ragazze sono ___.", options: ["italiano", "italiani", "italiane", "italiana"], answer: "italiane", why: "The adjective matches: feminine plural → -e." },
  { id: "s6", kind: "build", skills: ["sentences", "questions", "plurals"], english: "What do the children eat?", tiles: ["Cosa", "mangiano", "i", "bambini?"], answer: "Cosa mangiano i bambini?", why: "Every rule at once: question word, plural verb, plural article, subject at the end." },
];

/** Build a session: one skill, or a balanced mix of everything. */
export function buildSession(skill: Skill | "all", size = 15, rand: () => number = Math.random): Item[] {
  const pool = skill === "all" ? ITEMS : ITEMS.filter((i) => i.skills.includes(skill));
  const shuffled = [...pool].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(size, shuffled.length));
}

export function normalise(s: string) {
  return s.trim().toLowerCase().replace(/[.!]$/, "").replace(/\s+/g, " ");
}
export function isCorrect(item: Item, given: string) {
  return normalise(given) === normalise(item.answer);
}
