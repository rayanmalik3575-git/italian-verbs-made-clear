/**
 * All-in-one review content. Curriculum-locked: only articles, plurals, negatives,
 * questions, sentence structure and the present-tense verbs taught in the lessons.
 */
export type Translate = { id: string; english: string; answers: string[]; why: string; rules?: string[] };
export type Story = { id: string; title: string; scene: string; lines: Translate[] };
export type ReadQ = { q: string; qEn: string; options: string[]; answer: string; why: string };
export type Reading = { id: string; title: string; italian: string[]; english: string; questions: ReadQ[] };

export const TRANSLATE: Translate[] = [
  { id: "t1", rules: ["Negatives", "Sentences"], english: "I don't understand the question.", answers: ["Non capisco la domanda"], why: "No io — capisco already says who. Non sits right before the verb." },
  { id: "t2", rules: ["Questions", "Articles"], english: "Where are the students?", answers: ["Dove sono gli studenti?"], why: "Dove → verb → subject. Studente takes lo, so the plural is gli." },
  { id: "t3", rules: ["Negatives"], english: "We never eat meat.", answers: ["Non mangiamo mai carne", "Non mangiamo mai la carne"], why: "Non before the verb, mai after it. Italian keeps both." },
  { id: "t4", rules: ["Questions", "Plurals"], english: "How many brothers do you have?", answers: ["Quanti fratelli hai?"], why: "No 'do'. Quanti matches fratelli: masculine plural." },
  { id: "t5", rules: ["Plurals", "Articles"], english: "The girls are Italian.", answers: ["Le ragazze sono italiane"], why: "Feminine plural everywhere: le, ragazze, italiane." },
  { id: "t6", rules: ["Questions", "Negatives"], english: "Why aren't you coming?", answers: ["Perché non vieni?"], why: "Same as a statement: non before the verb. Your voice lifts at the end." },
  { id: "t7", rules: ["Plurals", "Sentences"], english: "The bars are closed today.", answers: ["I bar sono chiusi oggi", "Oggi i bar sono chiusi"], why: "Bar never changes. Only the article shows the plural: i bar. Oggi can sit first or last." },
  { id: "t8", rules: ["Questions"], english: "What is your name?", answers: ["Qual è il tuo nome?", "Come ti chiami?"], why: "Qual è — no apostrophe. Natives most often just say Come ti chiami?" },
  { id: "t9", rules: ["Negatives"], english: "Nobody speaks English here.", answers: ["Qui non parla nessuno inglese", "Nessuno parla inglese qui", "Qui nessuno parla inglese", "Non parla nessuno inglese qui"], why: "Nessuno first needs no non. Nessuno after the verb needs non in front." },
  { id: "t10", rules: ["Questions", "Articles"], english: "When does the train leave?", answers: ["Quando parte il treno?"], why: "Quando → verb → subject at the end. No 'does'." },
  { id: "t11", rules: ["Questions"], english: "Do you speak Italian?", answers: ["Parli italiano?"], why: "A yes/no question is the statement plus a lift at the end. No 'do', no tu." },
  { id: "t12", rules: ["Plurals", "Articles"], english: "The men drink the coffees.", answers: ["Gli uomini bevono i caffè"], why: "L'uomo → gli uomini. Caffè ends in a stressed vowel, so it never changes." },
  { id: "t13", rules: ["Sentences", "Plurals"], english: "I have a red car.", answers: ["Ho una macchina rossa"], why: "The describing word comes after the noun and matches it: macchina rossa." },
  { id: "t14", rules: ["Questions", "Articles"], english: "Where is the station?", answers: ["Dov'è la stazione?"], why: "Dove + è contracts to dov'è." },
  { id: "t15", rules: ["Negatives", "Articles"], english: "I don't have the keys.", answers: ["Non ho le chiavi"], why: "Non before ho. La chiave → le chiavi." },
  { id: "t16", rules: ["Sentences"], english: "I work in Rome but I live in Milan.", answers: ["Lavoro a Roma ma abito a Milano"], why: "Ma joins two ideas. Cities take a. No io in either half." },
  { id: "t17", rules: ["Questions", "Plurals"], english: "Which shoes do you buy?", answers: ["Quali scarpe compri?"], why: "Scarpe is plural, so quale becomes quali. No 'do'." },
  { id: "t18", rules: ["Plurals", "Articles"], english: "The problems are big.", answers: ["I problemi sono grandi"], why: "Il problema is masculine (Greek -ma), so: i problemi." },
  { id: "t19", rules: ["Sentences", "Negatives"], english: "I'm not eating because I'm not hungry.", answers: ["Non mangio perché non ho fame"], why: "Perché joins the reason. Italians 'have' hunger: ho fame." },
  { id: "t20", rules: ["Questions", "Articles"], english: "What are the children eating?", answers: ["Cosa mangiano i bambini?", "Che cosa mangiano i bambini?"], why: "Question word → verb → subject. 'Are eating' is just mangiano." },
];

export const STORIES: Story[] = [
  { id: "bar", title: "Morning at the bar", scene: "Marco's daily coffee", lines: [
    { id: "b1", english: "Marco works in Rome.", answers: ["Marco lavora a Roma"], why: "Cities take a: a Roma." },
    { id: "b2", english: "Every morning he drinks a coffee at the bar.", answers: ["Ogni mattina beve un caffè al bar", "Beve un caffè al bar ogni mattina"], why: "No lui — beve already says he. A + il = al." },
    { id: "b3", english: "He doesn't eat anything.", answers: ["Non mangia niente"], why: "Non … niente wraps the verb." },
    { id: "b4", english: "Why doesn't he eat?", answers: ["Perché non mangia?"], why: "Question word, non, verb. Done." },
  ]},
  { id: "station", title: "At the station", scene: "Two students and a late train", lines: [
    { id: "s1", english: "Where is the station?", answers: ["Dov'è la stazione?"], why: "Dove + è contracts to dov'è." },
    { id: "s2", english: "The students don't have the tickets.", answers: ["Gli studenti non hanno i biglietti"], why: "Gli studenti, non before hanno, i biglietti." },
    { id: "s3", english: "When does the train leave?", answers: ["Quando parte il treno?"], why: "Verb right after quando; subject at the end." },
    { id: "s4", english: "The trains are always late.", answers: ["I treni sono sempre in ritardo"], why: "Il treno → i treni. Essere in ritardo = to be late." },
  ]},
  { id: "friends", title: "Evening with friends", scene: "Dinner at Giulia's", lines: [
    { id: "f1", english: "We eat at Giulia's house tonight.", answers: ["Stasera mangiamo a casa di Giulia", "Mangiamo a casa di Giulia stasera"], why: "Stasera moves as one block. No noi." },
    { id: "f2", english: "Giulia cooks a pasta and the friends bring the wine.", answers: ["Giulia cucina una pasta e gli amici portano il vino"], why: "E joins the ideas. Amico → gli amici." },
    { id: "f3", english: "Luca doesn't drink wine, so he drinks water.", answers: ["Luca non beve vino quindi beve acqua", "Luca non beve il vino quindi beve l'acqua"], why: "Quindi gives the result. Non before beve." },
    { id: "f4", english: "Who washes the dishes?", answers: ["Chi lava i piatti?"], why: "Chi + verb. Il piatto → i piatti." },
  ]},
];

export const READINGS: Reading[] = [
  { id: "giulia", title: "Giulia e le amiche",
    italian: ["Giulia abita a Milano con due amiche.", "Studiano italiano e inglese.", "La sera non guardano mai la televisione: parlano, cucinano e mangiano insieme.", "Il sabato vanno al mare. Giulia non nuota, ma legge un libro."],
    english: "Giulia lives in Milan with two friends. They study Italian and English. In the evening they never watch TV: they talk, cook and eat together. On Saturday they go to the sea. Giulia doesn't swim, but she reads a book.",
    questions: [
      { q: "Dove abita Giulia?", qEn: "Where does Giulia live?", options: ["A Roma", "A Milano", "Al mare"], answer: "A Milano", why: "Giulia abita a Milano." },
      { q: "Con chi abita?", qEn: "Who does she live with?", options: ["Da sola", "Con due amiche", "Con i genitori"], answer: "Con due amiche", why: "Amiche is feminine plural of amica." },
      { q: "Guardano la televisione la sera?", qEn: "Do they watch TV in the evening?", options: ["Sì, sempre", "No, mai", "Solo il sabato"], answer: "No, mai", why: "Non guardano mai = they never watch." },
      { q: "Cosa fa Giulia al mare?", qEn: "What does Giulia do at the sea?", options: ["Nuota", "Cucina", "Legge un libro"], answer: "Legge un libro", why: "Non nuota, ma legge un libro." },
    ]},
  { id: "bar", title: "Al bar",
    italian: ["— Buongiorno! Cosa prendi?", "— Un cappuccino, grazie. Quanto costa?", "— Due euro.", "— Perché non hai le brioche oggi?", "— Non ho le brioche, ma ho i biscotti."],
    english: "— Good morning! What are you having? — A cappuccino, thanks. How much is it? — Two euros. — Why don't you have croissants today? — I don't have croissants, but I have biscuits.",
    questions: [
      { q: "Cosa prende il cliente?", qEn: "What does the customer order?", options: ["Un caffè", "Un cappuccino", "Una brioche"], answer: "Un cappuccino", why: "Un cappuccino, grazie." },
      { q: "Quanto costa?", qEn: "How much is it?", options: ["Un euro", "Due euro", "Tre euro"], answer: "Due euro", why: "Euro never changes in the plural." },
      { q: "Ha le brioche il bar?", qEn: "Does the bar have croissants?", options: ["Sì", "No, ha i biscotti", "Sì, molte"], answer: "No, ha i biscotti", why: "Non ho le brioche, ma ho i biscotti." },
    ]},
  { id: "marco", title: "La famiglia di Marco",
    italian: ["Marco ha due fratelli e una sorella.", "I fratelli lavorano a Roma, ma la sorella studia a Bologna.", "La domenica mangiano tutti insieme dalla nonna.", "Marco non cucina mai: lava i piatti."],
    english: "Marco has two brothers and a sister. The brothers work in Rome, but the sister studies in Bologna. On Sunday they all eat together at grandma's. Marco never cooks: he washes the dishes.",
    questions: [
      { q: "Quanti fratelli ha Marco?", qEn: "How many brothers does Marco have?", options: ["Uno", "Due", "Tre"], answer: "Due", why: "Marco ha due fratelli." },
      { q: "Dove studia la sorella?", qEn: "Where does the sister study?", options: ["A Roma", "A Bologna", "A Milano"], answer: "A Bologna", why: "La sorella studia a Bologna." },
      { q: "Quando mangiano insieme?", qEn: "When do they eat together?", options: ["Il sabato", "La domenica", "Ogni sera"], answer: "La domenica", why: "La domenica = on Sundays." },
      { q: "Cucina Marco?", qEn: "Does Marco cook?", options: ["Sì, sempre", "No, mai", "Solo la domenica"], answer: "No, mai", why: "Marco non cucina mai." },
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

/** One-line mentor tip for the classic English-thinking mistakes taught in the lessons. */
export function trapTip(given: string): string | null {
  const g = ` ${cleanIt(given)} `;
  if (/ (fai|fa|fate|fanno) (parli|parla|mangi|hai|vieni|bevi|compri|lavori|abiti)/.test(g)) return "Italian has no 'do' helper. The verb alone makes the question.";
  if (/^ (io|tu|noi|voi) /.test(g)) return "Drop the pronoun — the verb ending already says who.";
  if (/ (sono|è|siamo) (mangio|mangia|mangiamo|lavoro|bevo|cerco)/.test(g)) return "'I am eating' is just mangio. Don't add sono.";
  if (/ qual'è /.test(g)) return "Qual è never takes an apostrophe.";
  if (/ i studenti | il studente | i zoo /.test(g)) return "S + consonant and z take lo / gli.";
  return null;
}
