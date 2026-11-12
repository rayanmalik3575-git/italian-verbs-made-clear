// Asking questions — lesson data + logic. Original Parlami content.

export function clean(s: string): string {
  return s.trim().toLowerCase().replace(/[?¿!.,]/g, "").replace(/’/g, "'").replace(/\s+/g, " ");
}

/** A yes/no question is the statement itself — only the voice changes. */
export function toYesNoQuestion(statement: string): string {
  return statement.trim().replace(/[.!?]+$/, "") + "?";
}

export type QWord = {
  it: string; en: string; say: string;
  hook: string; rule: string; ex: string; exEn: string; trap?: string;
};

export const QWORDS: QWord[] = [
  { it: "dove", en: "where", say: "DOH-veh", hook: "Spelled like the English bird. Picture it: where did the dove go?", rule: "Before è it drops the e: dov'è.", ex: "Dov'è il bagno?", exEn: "Where's the bathroom?" },
  { it: "quando", en: "when", say: "KWAN-doh", hook: "The famous song: “Quando, quando, quando…” — when, when, when will you come?", rule: "Goes straight in front of the verb.", ex: "Quando parte il treno?", exEn: "When does the train leave?" },
  { it: "come", en: "how", say: "KOH-meh", hook: "You already know it from Come stai? — how are you?", rule: "Come si dice…? is the sentence you'll use most as a learner.", ex: "Come si dice “fork”?", exEn: "How do you say “fork”?" },
  { it: "chi", en: "who", say: "KEE", hook: "Sounds like “key”. Who has the key? Chi?", rule: "Never changes. The verb shows one person or more.", ex: "Chi paga?", exEn: "Who's paying?", trap: "Never say “chee”. The h keeps the c hard." },
  { it: "cosa · che · che cosa", en: "what", say: "KOH-zah · KEH", hook: "Cosa literally means “thing”. Cosa fai? = what thing are you doing?", rule: "Before a verb, all three work. Before a noun, only che.", ex: "Cosa prendi?", exEn: "What are you having?", trap: "Che vino? — never cosa vino?" },
  { it: "quale · quali", en: "which", say: "KWAH-leh · KWAH-lee", hook: "Close to “quality”: you're choosing one from a shelf.", rule: "Quale for one thing, quali for more.", ex: "Qual è il tuo preferito?", exEn: "Which one is your favourite?", trap: "Qual è has no apostrophe — never qual'è." },
  { it: "quanto · quanta · quanti · quante", en: "how much · how many", say: "KWAN-toh", hook: "Close to “quantity”: you're asking for an amount.", rule: "Matches the noun: quanti anni, quante pizze. Alone, quanto = how much.", ex: "Quanto costa?", exEn: "How much is it?", trap: "Quanti anni hai? — Italians ask how many years you have." },
  { it: "perché", en: "why · because", say: "pehr-KEH", hook: "Two for one: the same word asks the question and gives the answer.", rule: "Perché studi? — Perché mi piace! The accent is part of the spelling.", ex: "Perché no?", exEn: "Why not?" },
];

/** Word-order builder: learner arranges blocks; any listed order is accepted. */
export type OrderTask = { en: string; blocks: string[]; accept: string[]; why: string };

export const ORDER_TASKS: OrderTask[] = [
  { en: "Where do you work?", blocks: ["lavori", "Dove"], accept: ["Dove lavori"], why: "No “do”. lavori already means “you work”." },
  { en: "Where does Giulia live?", blocks: ["Giulia", "abita", "Dove"], accept: ["Dove abita Giulia"], why: "Question word → verb → subject. Giulia goes last." },
  { en: "When does the train arrive?", blocks: ["il treno", "Quando", "arriva"], accept: ["Quando arriva il treno"], why: "Same pattern: the train comes after the verb." },
  { en: "What are your parents cooking?", blocks: ["i tuoi", "Cosa", "cucinano"], accept: ["Cosa cucinano i tuoi"], why: "i tuoi = your folks. Subject at the end, for clarity." },
  { en: "Which book is your mum buying?", blocks: ["compra", "tua madre", "Quale libro"], accept: ["Quale libro compra tua madre"], why: "Quale libro travels together as one block, then verb, then subject." },
  { en: "Why don't we eat out tonight?", blocks: ["mangiamo fuori", "non", "Perché", "stasera"], accept: ["Perché non mangiamo fuori stasera", "Perché stasera non mangiamo fuori"], why: "Perché non + verb = the Italian way to suggest something." },
  { en: "Who's paying?", blocks: ["paga", "Chi"], accept: ["Chi paga"], why: "Chi + third-person verb. Two words, done." },
  { en: "How are you and Luca getting there?", blocks: ["tu e Luca", "arrivate", "Come"], accept: ["Come arrivate tu e Luca"], why: "arrivate already says “you two”. tu e Luca just confirms who." },
];

export function isAcceptedQuestion(task: OrderTask, attempt: string[]): boolean {
  const a = clean(attempt.join(" "));
  return task.accept.some((x) => clean(x) === a);
}

/** Pick the question word. */
export type PickTask = { before: string; after: string; en: string; options: string[]; answer: string; why: string };

export const PICK_TASKS: PickTask[] = [
  { before: "", after: " film guardiamo stasera?", en: "What film are we watching tonight?", options: ["Cosa", "Che", "Chi"], answer: "Che", why: "A noun follows (film), so only che works." },
  { before: "", after: " fai domani?", en: "What are you doing tomorrow?", options: ["Che", "Quale", "Cosa"], answer: "Cosa", why: "A verb follows, so cosa is perfect (che works too)." },
  { before: "", after: " è il bagno, scusi?", en: "Where's the bathroom, please?", options: ["Dove", "Dov'", "Come"], answer: "Dov'", why: "Dove + è merges into dov'è." },
  { before: "", after: " scarpe preferisci?", en: "Which shoes do you prefer?", options: ["Quale", "Quali", "Cosa"], answer: "Quali", why: "scarpe is plural, so quali." },
  { before: "", after: " non andiamo al mare?", en: "Why don't we go to the beach?", options: ["Perché", "Quando", "Come"], answer: "Perché", why: "Perché non + verb is a friendly suggestion." },
  { before: "", after: " viene alla festa?", en: "Who's coming to the party?", options: ["Che", "Chi", "Cosa"], answer: "Chi", why: "Asking about a person: chi." },
  { before: "", after: " si dice “fork” in italiano?", en: "How do you say “fork” in Italian?", options: ["Come", "Cosa", "Quale"], answer: "Come", why: "The sentence you'll use every day: Come si dice…?" },
  { before: "", after: " è il tuo numero?", en: "What's your number?", options: ["Cosa", "Qual", "Che"], answer: "Qual", why: "Asking for one item from many options (a number, a name, an address) uses qual è — English says “what”." },
];

export function isCorrectPick(task: PickTask, choice: string): boolean {
  return choice === task.answer;
}
