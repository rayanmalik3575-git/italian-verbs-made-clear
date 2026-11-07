export type Pronoun = "io" | "tu" | "lui/lei" | "noi" | "voi" | "loro";

export const PRONOUNS: { it: Pronoun; en: string; note: string }[] = [
  { it: "io", en: "I", note: "Talking about yourself" },
  { it: "tu", en: "you", note: "One person, informal (friend, family)" },
  { it: "lui/lei", en: "he / she (also formal 'you' – Lei)", note: "One other person" },
  { it: "noi", en: "we", note: "You + others" },
  { it: "voi", en: "you all", note: "A group you're talking to" },
  { it: "loro", en: "they", note: "A group of other people" },
];

export type Verb = {
  infinitive: string;
  english: string;
  type: "-are" | "-ere" | "-ire" | "irregular";
  meaning: string;
  forms: string[]; // 6 forms, PRONOUNS order
  en: string[]; // English sentence meaning per form
  examples: { it: string; en: string }[];
};

export const VERBS: Verb[] = [
  {
    infinitive: "essere", english: "to be", type: "irregular",
    meaning: "Describes identity, origin, qualities and states. One of the two most important verbs in Italian.",
    forms: ["sono", "sei", "è", "siamo", "siete", "sono"],
    en: ["I am", "you are", "he/she is", "we are", "you all are", "they are"],
    examples: [{ it: "Io sono italiano.", en: "I am Italian." }, { it: "Siamo a Roma.", en: "We are in Rome." }],
  },
  {
    infinitive: "avere", english: "to have", type: "irregular",
    meaning: "Possession, age (ho 20 anni = I am 20), and feelings like hunger or thirst.",
    forms: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
    en: ["I have", "you have", "he/she has", "we have", "you all have", "they have"],
    examples: [{ it: "Ho fame.", en: "I'm hungry (lit. I have hunger)." }, { it: "Hai un cane?", en: "Do you have a dog?" }],
  },
  {
    infinitive: "parlare", english: "to speak", type: "-are",
    meaning: "Regular -are verb. Drop -are, add -o, -i, -a, -iamo, -ate, -ano.",
    forms: ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"],
    en: ["I speak", "you speak", "he/she speaks", "we speak", "you all speak", "they speak"],
    examples: [{ it: "Parlo un po' d'italiano.", en: "I speak a little Italian." }],
  },
  {
    infinitive: "mangiare", english: "to eat", type: "-are",
    meaning: "Regular -are verb. Note: tu mangi and noi mangiamo keep only one 'i'.",
    forms: ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"],
    en: ["I eat", "you eat", "he/she eats", "we eat", "you all eat", "they eat"],
    examples: [{ it: "Mangiamo la pizza.", en: "We eat pizza." }],
  },
  {
    infinitive: "abitare", english: "to live (reside)", type: "-are",
    meaning: "Used for where you live: Abito a Milano = I live in Milan.",
    forms: ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"],
    en: ["I live", "you live", "he/she lives", "we live", "you all live", "they live"],
    examples: [{ it: "Dove abiti?", en: "Where do you live?" }],
  },
  {
    infinitive: "prendere", english: "to take", type: "-ere",
    meaning: "Regular -ere verb. Also used for ordering: Prendo un caffè = I'll have a coffee.",
    forms: ["prendo", "prendi", "prende", "prendiamo", "prendete", "prendono"],
    en: ["I take", "you take", "he/she takes", "we take", "you all take", "they take"],
    examples: [{ it: "Prendo il treno.", en: "I take the train." }],
  },
  {
    infinitive: "leggere", english: "to read", type: "-ere",
    meaning: "Regular -ere verb. Pronunciation shifts: leggo (hard g), leggi (soft g).",
    forms: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"],
    en: ["I read", "you read", "he/she reads", "we read", "you all read", "they read"],
    examples: [{ it: "Leggi un libro?", en: "Are you reading a book?" }],
  },
  {
    infinitive: "dormire", english: "to sleep", type: "-ire",
    meaning: "Regular -ire verb. Drop -ire, add -o, -i, -e, -iamo, -ite, -ono.",
    forms: ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"],
    en: ["I sleep", "you sleep", "he/she sleeps", "we sleep", "you all sleep", "they sleep"],
    examples: [{ it: "Dormo otto ore.", en: "I sleep eight hours." }],
  },
  {
    infinitive: "capire", english: "to understand", type: "-ire",
    meaning: "An -isc- verb: adds -isc- in every form except noi and voi.",
    forms: ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"],
    en: ["I understand", "you understand", "he/she understands", "we understand", "you all understand", "they understand"],
    examples: [{ it: "Non capisco.", en: "I don't understand." }],
  },
  {
    infinitive: "andare", english: "to go", type: "irregular",
    meaning: "Irregular. Andare a + city, andare in + country.",
    forms: ["vado", "vai", "va", "andiamo", "andate", "vanno"],
    en: ["I go", "you go", "he/she goes", "we go", "you all go", "they go"],
    examples: [{ it: "Vado in Italia.", en: "I'm going to Italy." }],
  },
  {
    infinitive: "fare", english: "to do / to make", type: "irregular",
    meaning: "Irregular and everywhere: fare colazione (have breakfast), fa caldo (it's hot).",
    forms: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"],
    en: ["I do", "you do", "he/she does", "we do", "you all do", "they do"],
    examples: [{ it: "Cosa fai?", en: "What are you doing?" }],
  },
  {
    infinitive: "volere", english: "to want", type: "irregular",
    meaning: "Irregular. Vorrei (I would like) is the polite form for ordering.",
    forms: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"],
    en: ["I want", "you want", "he/she wants", "we want", "you all want", "they want"],
    examples: [{ it: "Voglio un gelato.", en: "I want an ice cream." }],
  },
];

export type Level = "A1" | "A2";
export const LEVEL: Record<string, Level> = {};

type Seed = [inf: string, en: string, base: string, third: string, level: Level, exIt: string, exEn: string];

function conjugateAre(inf: string): string[] {
  const stem = inf.slice(0, -3);
  const hard = /[cg]$/.test(stem) ? stem + "h" : stem; // pagare → paghi
  const soft = /i$/.test(stem) && !/(sciare|inviare)$/.test(inf) ? stem.slice(0, -1) : hard; // studiare → studi
  return [stem + "o", soft + "i", stem + "a", soft + "iamo", stem + "ate", stem + "ano"];
}
function conjugateRegular(inf: string, type: "-ere" | "-ire", isc = false): string[] {
  const s = inf.slice(0, -3);
  const v = type === "-ere" ? "e" : "i";
  if (isc) return [s + "isco", s + "isci", s + "isce", s + "iamo", s + v + "te", s + "iscono"];
  return [s + "o", s + "i", s + "e", s + "iamo", s + v + "te", s + "ono"];
}
const enLines = (base: string, third: string) => [`I ${base}`, `you ${base}`, `he/she ${third}`, `we ${base}`, `you all ${base}`, `they ${base}`];

const ARE_SEEDS: Seed[] = [
  ["lavorare", "to work", "work", "works", "A1", "Lavoro in un ufficio.", "I work in an office."],
  ["studiare", "to study", "study", "studies", "A1", "Studio l'italiano ogni giorno.", "I study Italian every day."],
  ["ascoltare", "to listen", "listen", "listens", "A1", "Ascoltiamo la musica.", "We listen to music."],
  ["guardare", "to watch / look at", "watch", "watches", "A1", "Guardi la TV stasera?", "Are you watching TV tonight?"],
  ["comprare", "to buy", "buy", "buys", "A1", "Compro il pane.", "I buy bread."],
  ["aspettare", "to wait (for)", "wait", "waits", "A1", "Aspetto l'autobus.", "I'm waiting for the bus."],
  ["chiamare", "to call", "call", "calls", "A1", "Chiamo mia madre.", "I call my mother."],
  ["cucinare", "to cook", "cook", "cooks", "A1", "Cuciniamo la pasta.", "We cook pasta."],
  ["trovare", "to find", "find", "finds", "A1", "Non trovo le chiavi.", "I can't find the keys."],
  ["pensare", "to think", "think", "thinks", "A1", "Penso di sì.", "I think so."],
  ["viaggiare", "to travel", "travel", "travels", "A1", "Viaggiamo in treno.", "We travel by train."],
  ["arrivare", "to arrive", "arrive", "arrives", "A1", "Il treno arriva alle otto.", "The train arrives at eight."],
  ["entrare", "to enter", "enter", "enters", "A1", "Entriamo nel bar.", "We go into the café."],
  ["tornare", "to return", "return", "returns", "A1", "Torno a casa.", "I'm going back home."],
  ["amare", "to love", "love", "loves", "A1", "Amo l'Italia.", "I love Italy."],
  ["cercare", "to look for", "look for", "looks for", "A1", "Cerco un albergo.", "I'm looking for a hotel."],
  ["pagare", "to pay", "pay", "pays", "A1", "Pago con la carta.", "I pay by card."],
  ["lavare", "to wash", "wash", "washes", "A1", "Lavo i piatti.", "I wash the dishes."],
  ["giocare", "to play (games/sports)", "play", "plays", "A1", "Giochiamo a calcio.", "We play football."],
  ["suonare", "to play (music) / ring", "play", "plays", "A1", "Suoni la chitarra?", "Do you play the guitar?"],
  ["cantare", "to sing", "sing", "sings", "A1", "Lei canta bene.", "She sings well."],
  ["ballare", "to dance", "dance", "dances", "A1", "Balliamo stasera!", "Let's dance tonight!"],
  ["imparare", "to learn", "learn", "learns", "A1", "Imparo una nuova lingua.", "I'm learning a new language."],
  ["cominciare", "to begin", "begin", "begins", "A1", "La lezione comincia alle nove.", "The lesson begins at nine."],
  ["mandare", "to send", "send", "sends", "A2", "Ti mando un messaggio.", "I'll send you a message."],
  ["ricordare", "to remember", "remember", "remembers", "A2", "Ricordi il suo nome?", "Do you remember his name?"],
  ["dimenticare", "to forget", "forget", "forgets", "A2", "Dimentico sempre l'ombrello.", "I always forget my umbrella."],
  ["camminare", "to walk", "walk", "walks", "A2", "Camminiamo nel parco.", "We walk in the park."],
  ["incontrare", "to meet", "meet", "meets", "A2", "Incontro Marco al bar.", "I meet Marco at the café."],
  ["portare", "to bring / wear", "bring", "brings", "A2", "Porto il vino.", "I'll bring the wine."],
  ["passare", "to pass / spend (time)", "spend", "spends", "A2", "Passiamo l'estate al mare.", "We spend the summer at the sea."],
  ["prenotare", "to book", "book", "books", "A2", "Prenoto un tavolo per due.", "I'm booking a table for two."],
  ["visitare", "to visit", "visit", "visits", "A2", "Visitiamo Firenze.", "We visit Florence."],
  ["preparare", "to prepare", "prepare", "prepares", "A2", "Preparo la cena.", "I'm making dinner."],
  ["usare", "to use", "use", "uses", "A2", "Usi il computer?", "Do you use the computer?"],
  ["provare", "to try", "try", "tries", "A2", "Provo questa giacca.", "I'll try on this jacket."],
  ["lasciare", "to leave (something)", "leave", "leaves", "A2", "Lascio la borsa qui.", "I leave the bag here."],
  ["parcheggiare", "to park", "park", "parks", "A2", "Dove parcheggi?", "Where do you park?"],
  ["noleggiare", "to rent", "rent", "rents", "A2", "Noleggiamo una macchina.", "We rent a car."],
  ["spiegare", "to explain", "explain", "explains", "A2", "Il professore spiega la regola.", "The teacher explains the rule."],
  ["costare", "to cost", "cost", "costs", "A2", "Quanto costa?", "How much does it cost?"],
  ["sperare", "to hope", "hope", "hopes", "A2", "Spero di sì.", "I hope so."],
  ["continuare", "to continue", "continue", "continues", "A2", "Continuiamo domani.", "Let's continue tomorrow."],
  ["aiutare", "to help", "help", "helps", "A2", "Ti aiuto io.", "I'll help you."],
  ["raccontare", "to tell (a story)", "tell", "tells", "A2", "Racconto una storia.", "I tell a story."],
];

const OTHER: { inf: string; en: string; base: string; third: string; level: Level; type: "-ere" | "-ire"; isc?: boolean; ex: [string, string] }[] = [
  { inf: "scrivere", en: "to write", base: "write", third: "writes", level: "A1", type: "-ere", ex: ["Scrivo una mail.", "I write an email."] },
  { inf: "vedere", en: "to see", base: "see", third: "sees", level: "A1", type: "-ere", ex: ["Vedo il mare.", "I see the sea."] },
  { inf: "vivere", en: "to live", base: "live", third: "lives", level: "A1", type: "-ere", ex: ["Vivo a Napoli.", "I live in Naples."] },
  { inf: "chiedere", en: "to ask", base: "ask", third: "asks", level: "A1", type: "-ere", ex: ["Chiedo il conto.", "I ask for the bill."] },
  { inf: "credere", en: "to believe", base: "believe", third: "believes", level: "A2", type: "-ere", ex: ["Ci credo.", "I believe it."] },
  { inf: "partire", en: "to leave / depart", base: "leave", third: "leaves", level: "A1", type: "-ire", ex: ["Parto domani.", "I leave tomorrow."] },
  { inf: "aprire", en: "to open", base: "open", third: "opens", level: "A1", type: "-ire", ex: ["Apri la finestra?", "Will you open the window?"] },
  { inf: "sentire", en: "to hear / feel", base: "hear", third: "hears", level: "A1", type: "-ire", ex: ["Senti la musica?", "Do you hear the music?"] },
  { inf: "finire", en: "to finish", base: "finish", third: "finishes", level: "A1", type: "-ire", isc: true, ex: ["Finisco alle sei.", "I finish at six."] },
  { inf: "preferire", en: "to prefer", base: "prefer", third: "prefers", level: "A1", type: "-ire", isc: true, ex: ["Preferisco il tè.", "I prefer tea."] },
  { inf: "pulire", en: "to clean", base: "clean", third: "cleans", level: "A2", type: "-ire", isc: true, ex: ["Pulisco la casa.", "I clean the house."] },
];

for (const v of VERBS) LEVEL[v.infinitive] = "A1";
for (const [inf, english, base, third, level, it, en] of ARE_SEEDS) {
  VERBS.push({ infinitive: inf, english, type: "-are", meaning: `Regular -are verb. Stem "${inf.slice(0, -3)}-" + -o, -i, -a, -iamo, -ate, -ano.`, forms: conjugateAre(inf), en: enLines(base, third), examples: [{ it, en }] });
  LEVEL[inf] = level;
}
for (const o of OTHER) {
  VERBS.push({ infinitive: o.inf, english: o.en, type: o.type, meaning: o.isc ? `-ire verb with -isc-: finisco, finisci, finisce, finiamo, finite, finiscono.` : `Regular ${o.type} verb. Stem "${o.inf.slice(0, -3)}-" + -o, -i, -e, -iamo, ${o.type === "-ere" ? "-ete" : "-ite"}, -ono.`, forms: conjugateRegular(o.inf, o.type, o.isc), en: enLines(o.base, o.third), examples: [{ it: o.ex[0], en: o.ex[1] }] });
  LEVEL[o.inf] = o.level;
}

export const GROUP_INFO: Record<string, { title: string; endings: string; note: string }> = {
  "-are": { title: "-ARE verbs", endings: "-o · -i · -a · -iamo · -ate · -ano", note: "The biggest family in Italian. Drop -are and add the ending." },
  "-ere": { title: "-ERE verbs", endings: "-o · -i · -e · -iamo · -ete · -ono", note: "Second family. Drop -ere and add the ending." },
  "-ire": { title: "-IRE verbs", endings: "-o · -i · -e · -iamo · -ite · -ono", note: "Some add -isc- (finisco, capisco) in io, tu, lui/lei, loro." },
  irregular: { title: "Irregular", endings: "Memorise each form", note: "The most used verbs — they follow their own rules." },
};
