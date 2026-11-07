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
