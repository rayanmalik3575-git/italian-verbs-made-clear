/** Production practice for the all-in-one review: translation, stories, reading. */
export type Translate = { id: string; english: string; answers: string[]; why: string };
export type Story = { id: string; title: string; lines: Translate[] };
export type ReadQ = { q: string; qEn: string; options: string[]; answer: string; why: string };
export type Reading = { id: string; title: string; italian: string[]; english: string; questions: ReadQ[] };

export const TRANSLATE: Translate[] = [
  { id: "t1", english: "I don't understand the question.", answers: ["Non capisco la domanda"], why: "No io — capisco already says who. Non sits right before the verb." },
  { id: "t2", english: "Where are the students?", answers: ["Dove sono gli studenti?"], why: "Dove → verb → subject. Studente takes lo, so the plural is gli." },
  { id: "t3", english: "We never eat meat.", answers: ["Non mangiamo mai carne", "Non mangiamo mai la carne"], why: "Non before the verb, mai after it. Both stay." },
  { id: "t4", english: "How many brothers do you have?", answers: ["Quanti fratelli hai?"], why: "No 'do'. Quanti matches fratelli: masculine plural." },
  { id: "t5", english: "The girls are Italian.", answers: ["Le ragazze sono italiane"], why: "Feminine plural everywhere: le, ragazze, italiane." },
  { id: "t6", english: "Why aren't you coming?", answers: ["Perché non vieni?"], why: "Same as a statement: non before the verb. Your voice lifts at the end." },
  { id: "t7", english: "The bars are closed today.", answers: ["I bar sono chiusi oggi", "Oggi i bar sono chiusi"], why: "Bar never changes. Only the article shows the plural: i bar." },
  { id: "t8", english: "What is your name?", answers: ["Qual è il tuo nome?", "Come ti chiami?"], why: "Qual è — no apostrophe. Natives most often just say Come ti chiami?" },
  { id: "t9", english: "Nobody speaks English here.", answers: ["Qui non parla nessuno inglese", "Nessuno parla inglese qui", "Qui nessuno parla inglese", "Non parla nessuno inglese qui"], why: "Nessuno first needs no non. Nessuno after the verb needs non in front." },
  { id: "t10", english: "When does the train leave?", answers: ["Quando parte il treno?"], why: "Quando → verb → subject at the end. No 'does'." },
];

export const STORIES: Story[] = [
  { id: "bar", title: "Morning at the bar", lines: [
    { id: "b1", english: "Marco works in Rome.", answers: ["Marco lavora a Roma"], why: "Cities take a: a Roma." },
    { id: "b2", english: "Every morning he drinks a coffee at the bar.", answers: ["Ogni mattina beve un caffè al bar", "Beve un caffè al bar ogni mattina"], why: "No lui — beve already says he. A + il = al." },
    { id: "b3", english: "He doesn't eat anything.", answers: ["Non mangia niente"], why: "Non … niente wraps the verb." },
    { id: "b4", english: "Why doesn't he eat?", answers: ["Perché non mangia?"], why: "Question word, non, verb. Done." },
  ]},
  { id: "station", title: "At the station", lines: [
    { id: "s1", english: "Where is the station?", answers: ["Dov'è la stazione?"], why: "Dove + è contracts to dov'è." },
    { id: "s2", english: "The trains are late.", answers: ["I treni sono in ritardo"], why: "Essere in ritardo = to be late." },
    { id: "s3", english: "The students don't have the tickets.", answers: ["Gli studenti non hanno i biglietti"], why: "Gli studenti, non before hanno, i biglietti." },
    { id: "s4", english: "When does the bus arrive?", answers: ["Quando arriva l'autobus?"], why: "Verb right after quando; l' before a vowel." },
  ]},
];

export const READINGS: Reading[] = [
  { id: "giulia", title: "Giulia e i suoi amici",
    italian: ["Giulia abita a Milano con due amiche.", "Studiano italiano e inglese all'università.", "La sera non guardano mai la televisione: parlano, cucinano e mangiano insieme.", "Il fine settimana vanno al mare. Giulia non nuota, ma legge un libro."],
    english: "Giulia lives in Milan with two friends. They study Italian and English at university. In the evening they never watch TV: they talk, cook and eat together. At the weekend they go to the sea. Giulia doesn't swim, but she reads a book.",
    questions: [
      { q: "Dove abita Giulia?", qEn: "Where does Giulia live?", options: ["A Roma", "A Milano", "Al mare"], answer: "A Milano", why: "Giulia abita a Milano." },
      { q: "Con chi abita?", qEn: "Who does she live with?", options: ["Da sola", "Con due amiche", "Con i genitori"], answer: "Con due amiche", why: "…con due amiche — amiche is feminine plural." },
      { q: "Guardano la televisione la sera?", qEn: "Do they watch TV in the evening?", options: ["Sì, sempre", "No, mai", "Solo il fine settimana"], answer: "No, mai", why: "Non guardano mai = they never watch." },
      { q: "Cosa fa Giulia al mare?", qEn: "What does Giulia do at the sea?", options: ["Nuota", "Cucina", "Legge un libro"], answer: "Legge un libro", why: "Non nuota, ma legge un libro." },
    ]},
  { id: "luca", title: "Una domanda al bar",
    italian: ["— Buongiorno! Cosa prendi?", "— Un cappuccino, grazie. Quanto costa?", "— Due euro.", "— Perché non hai le brioche oggi?", "— Sono finite! Domani, però, ci sono."],
    english: "— Good morning! What are you having? — A cappuccino, thanks. How much is it? — Two euros. — Why don't you have croissants today? — They've run out! Tomorrow, though, there are some.",
    questions: [
      { q: "Cosa prende il cliente?", qEn: "What does the customer order?", options: ["Un caffè", "Un cappuccino", "Una brioche"], answer: "Un cappuccino", why: "Un cappuccino, grazie." },
      { q: "Quanto costa?", qEn: "How much is it?", options: ["Un euro", "Due euro", "Tre euro"], answer: "Due euro", why: "Euro never changes in the plural." },
      { q: "Ci sono le brioche oggi?", qEn: "Are there croissants today?", options: ["Sì", "No, sono finite", "Solo domani mattina presto"], answer: "No, sono finite", why: "Sono finite = they're gone." },
    ]},
];

/** Forgiving compare: ignores case, punctuation, apostrophe style and extra spaces — never accents. */
export function cleanIt(s: string) {
  return s.toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:—-]/g, " ").replace(/\s+/g, " ").trim();
}
export function matches(t: Translate, given: string) {
  const g = cleanIt(given);
  return t.answers.some((a) => cleanIt(a) === g);
}
