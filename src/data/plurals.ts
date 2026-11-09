// Original Parlami content: Italian plurals and their exceptions (A1).

export type Noun = { sg: string; pl: string; en: string; enPl: string; article: [string, string]; note?: string };

/** The three everyday vowel switches. */
export const SWITCHES = [
  {
    from: "o", to: "i", who: "Masculine words",
    line: "Most nouns that end in -o are masculine. To talk about more than one, take off the -o and put -i in its place. Notice that the article changes with it: il becomes i. Think of the word and its article as a pair that always travels together.",
    words: [
      { sg: "libro", pl: "libri", en: "book", enPl: "books", article: ["il", "i"] },
      { sg: "ragazzo", pl: "ragazzi", en: "boy", enPl: "boys", article: ["il", "i"] },
      { sg: "treno", pl: "treni", en: "train", enPl: "trains", article: ["il", "i"] },
    ] as Noun[],
  },
  {
    from: "a", to: "e", who: "Feminine words",
    line: "Most nouns that end in -a are feminine. Here the -a becomes -e, and la becomes le. When you read le at the start of a phrase, you already know two things before the noun arrives: it's feminine, and there's more than one.",
    words: [
      { sg: "pizza", pl: "pizze", en: "pizza", enPl: "pizzas", article: ["la", "le"] },
      { sg: "casa", pl: "case", en: "house", enPl: "houses", article: ["la", "le"] },
      { sg: "ragazza", pl: "ragazze", en: "girl", enPl: "girls", article: ["la", "le"] },
    ] as Noun[],
  },
  {
    from: "e", to: "i", who: "Masculine or feminine",
    line: "Nouns in -e are the ones students worry about, because they can be masculine (il cane) or feminine (la notte). Here is the good news: for the plural, the gender doesn't matter. Every -e becomes -i. You only need the gender to choose the article — i cani, but le notti.",
    words: [
      { sg: "cane", pl: "cani", en: "dog", enPl: "dogs", article: ["il", "i"] },
      { sg: "notte", pl: "notti", en: "night", enPl: "nights", article: ["la", "le"] },
      { sg: "chiave", pl: "chiavi", en: "key", enPl: "keys", article: ["la", "le"] },
    ] as Noun[],
  },
] as const;

/** Spelling that protects the sound. */
export const SOUND_RULES = [
  {
    title: "-ca / -ga → -che / -ghe",
    why: "In Italian, the letters ce are pronounced like the \"che\" in \"cheque\". So if amica simply became amice, the word would suddenly sound different. To keep the hard K sound you hear in the singular, Italian writes an h before the -e. The h is silent; its only job is to protect the sound.",
    words: [
      { sg: "amica", pl: "amiche", en: "female friend", enPl: "female friends", article: ["l'", "le"] },
      { sg: "banca", pl: "banche", en: "bank", enPl: "banks", article: ["la", "le"] },
      { sg: "collega", pl: "colleghe", en: "(female) colleague", enPl: "colleagues", article: ["la", "le"] },
    ] as Noun[],
  },
  {
    title: "-co / -go → usually -chi / -ghi",
    why: "Masculine words follow the same idea, but with one honest caveat: this rule is not perfectly regular. Most words keep the hard sound and add an h (parchi, laghi). A few very common ones go soft instead (amici, medici). There's no shortcut I can give you here that always works — the practical approach is to learn the soft ones as you meet them. At A1 level, amico and medico are the two that matter most.",
    words: [
      { sg: "parco", pl: "parchi", en: "park", enPl: "parks", article: ["il", "i"] },
      { sg: "lago", pl: "laghi", en: "lake", enPl: "lakes", article: ["il", "i"] },
      { sg: "amico", pl: "amici", en: "friend", enPl: "friends", article: ["l'", "gli"], note: "Soft! Sounds like 'ah-MEE-chee'." },
      { sg: "medico", pl: "medici", en: "doctor", enPl: "doctors", article: ["il", "i"], note: "Soft, stressed on MÉ-dico." },
    ] as Noun[],
  },
  {
    title: "-cia / -gia → -cie or -ce",
    why: "This one only affects spelling — you pronounce the plural the same either way, so don't let it slow you down when speaking. When writing, look at the letter just before -cia or -gia. If it's a vowel, keep the i (camicia → camicie). If it's a consonant, drop the i (arancia → arance).",
    words: [
      { sg: "camicia", pl: "camicie", en: "shirt", enPl: "shirts", article: ["la", "le"] },
      { sg: "valigia", pl: "valigie", en: "suitcase", enPl: "suitcases", article: ["la", "le"] },
      { sg: "arancia", pl: "arance", en: "orange", enPl: "oranges", article: ["l'", "le"] },
      { sg: "spiaggia", pl: "spiagge", en: "beach", enPl: "beaches", article: ["la", "le"] },
    ] as Noun[],
  },
] as const;

/** Words that break the vowel switch. */
export const REBELS = [
  {
    title: "They never change",
    line: "Some nouns keep exactly the same form in the plural. In these cases the article carries the meaning: il caffè is one coffee, i caffè is several. That's why it's worth always learning nouns together with their article — without it, you couldn't tell one from many.",
    groups: [
      { label: "Ends with an accent", words: [
        { sg: "città", pl: "città", en: "city", enPl: "cities", article: ["la", "le"] },
        { sg: "caffè", pl: "caffè", en: "coffee", enPl: "coffees", article: ["il", "i"] },
        { sg: "università", pl: "università", en: "university", enPl: "universities", article: ["l'", "le"] },
      ] as Noun[] },
      { label: "Ends with a consonant (borrowed words)", words: [
        { sg: "bar", pl: "bar", en: "café-bar", enPl: "café-bars", article: ["il", "i"] },
        { sg: "film", pl: "film", en: "film", enPl: "films", article: ["il", "i"], note: "Never 'films' in Italian." },
        { sg: "computer", pl: "computer", en: "computer", enPl: "computers", article: ["il", "i"] },
      ] as Noun[] },
      { label: "Shortened words", words: [
        { sg: "foto", pl: "foto", en: "photo", enPl: "photos", article: ["la", "le"], note: "Short for la fotografia, so it's feminine." },
        { sg: "moto", pl: "moto", en: "motorbike", enPl: "motorbikes", article: ["la", "le"] },
        { sg: "cinema", pl: "cinema", en: "cinema", enPl: "cinemas", article: ["il", "i"] },
      ] as Noun[] },
    ],
  },
  {
    title: "Masculine words in -a",
    line: "These look feminine because they end in -a, but they're actually masculine — most came into Italian from Greek. Since they're masculine, they take the masculine plural -i. You'll use problema constantly, so it's a good one to remember as your model.",
    groups: [
      { label: "-ma → -mi", words: [
        { sg: "problema", pl: "problemi", en: "problem", enPl: "problems", article: ["il", "i"], note: "Italians say 'nessun problema' — no problem." },
        { sg: "programma", pl: "programmi", en: "programme / plan", enPl: "plans", article: ["il", "i"] },
        { sg: "tema", pl: "temi", en: "topic / essay", enPl: "topics", article: ["il", "i"] },
      ] as Noun[] },
    ],
  },
  {
    title: "Body parts that switch gender",
    line: "A small group, mostly body parts that come in pairs or sets, inherited an old Latin plural ending in -a. The singular is masculine, but the plural becomes feminine — so the article changes from il to le. There are only a handful at this level, so they're easy to collect.",
    groups: [
      { label: "il … → le …a", words: [
        { sg: "braccio", pl: "braccia", en: "arm", enPl: "arms", article: ["il", "le"] },
        { sg: "dito", pl: "dita", en: "finger", enPl: "fingers", article: ["il", "le"] },
        { sg: "ginocchio", pl: "ginocchia", en: "knee", enPl: "knees", article: ["il", "le"] },
        { sg: "uovo", pl: "uova", en: "egg", enPl: "eggs", article: ["l'", "le"], note: "Not a body part, but it plays the same trick." },
      ] as Noun[] },
    ],
  },
  {
    title: "Totally irregular",
    line: "Finally, a couple of words simply have their own plural. There's no rule to apply, but there are very few of them — learn each one as a complete pair, the same way you learned \"man → men\" in English.",
    groups: [
      { label: "One of a kind", words: [
        { sg: "uomo", pl: "uomini", en: "man", enPl: "men", article: ["l'", "gli"] },
        { sg: "mano", pl: "mani", en: "hand", enPl: "hands", article: ["la", "le"], note: "Ends in -o but it's feminine: la mano." },
      ] as Noun[] },
    ],
  },
] as const;

/** Regular-rule pluralizer. Exceptions are handled by the lists above. */
export function regularPlural(sg: string): string {
  if (/[àèéìòù]$/.test(sg) || /[^aeiou]$/.test(sg)) return sg;
  if (/[cg]a$/.test(sg)) return sg.slice(0, -1) + "he";
  if (/[aeiou][cg]ia$/.test(sg)) return sg.slice(0, -1) + "e";
  if (/[^aeiou][cg]ia$/.test(sg)) return sg.slice(0, -2) + "e";
  if (sg.endsWith("io")) return sg.slice(0, -1);
  if (sg.endsWith("o") || sg.endsWith("e")) return sg.slice(0, -1) + "i";
  if (sg.endsWith("a")) return sg.slice(0, -1) + "e";
  return sg;
}

export type PluralTask = { sg: string; en: string; answer: string; why: string };

export const PLURAL_TASKS: PluralTask[] = [
  { sg: "il gatto", en: "the cat", answer: "i gatti", why: "Masculine -o becomes -i, and il becomes i." },
  { sg: "la porta", en: "the door", answer: "le porte", why: "Feminine -a becomes -e, and la becomes le." },
  { sg: "la lezione", en: "the lesson", answer: "le lezioni", why: "Every -e becomes -i, even feminine words." },
  { sg: "l'amica", en: "the (female) friend", answer: "le amiche", why: "-ca adds an h to keep the hard K sound." },
  { sg: "la città", en: "the city", answer: "le città", why: "An accent on the last letter means no change. Only the article moves." },
  { sg: "il problema", en: "the problem", answer: "i problemi", why: "-ma words are masculine, so they take -i." },
  { sg: "il bar", en: "the bar", answer: "i bar", why: "Borrowed words ending in a consonant never change." },
  { sg: "la foto", en: "the photo", answer: "le foto", why: "Foto is short for fotografia. Shortened words stay the same." },
  { sg: "il braccio", en: "the arm", answer: "le braccia", why: "A body-part rebel: masculine in the singular, feminine -a in the plural." },
  { sg: "l'uomo", en: "the man", answer: "gli uomini", why: "Fully irregular — learn it as a whole." },
  { sg: "il parco", en: "the park", answer: "i parchi", why: "A short -co word keeps the hard sound: -chi." },
  { sg: "la valigia", en: "the suitcase", answer: "le valigie", why: "A vowel comes before -gia, so the i stays." },
];

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/’/g, "'");
export function isCorrectPlural(task: PluralTask, input: string): boolean {
  const a = norm(input), b = norm(task.answer);
  return a === b || a === b.split(" ").slice(1).join(" ");
}

// ---------- Smart plural explainer (logic upgrade) ----------

export type RuleId = "o-i" | "a-e" | "e-i" | "hard" | "soft" | "cia" | "io" | "same" | "ma" | "body" | "irregular";

export type Explained = { sg: string; pl: string; rule: RuleId; reason: string };

const IRREGULAR: Record<string, string> = { uomo: "uomini", mano: "mani", dio: "dei", bue: "buoi" };
const BODY: Record<string, string> = { braccio: "braccia", dito: "dita", ginocchio: "ginocchia", uovo: "uova", labbro: "labbra", osso: "ossa", lenzuolo: "lenzuola", paio: "paia" };
/** Common -co/-go words that go soft (-ci/-gi). */
const SOFT = new Set(["amico", "medico", "greco", "nemico", "porco", "meccanico", "politico", "psicologo", "biologo", "asparago", "tecnico", "magico"]);
/** Shortened / invariable words ending in a plain vowel. */
const SAME = new Set(["foto", "moto", "auto", "radio", "cinema", "bici", "serie", "specie", "re", "gru", "virus", "crisi", "analisi", "tesi", "sport"]);
/** Masculine -a words. */
const MASC_A = new Set(["problema", "programma", "tema", "sistema", "clima", "dramma", "poeta", "pianeta", "papa", "telegramma", "diploma", "panorama"]);

const REASON: Record<RuleId, string> = {
  "o-i": "Masculine -o becomes -i.",
  "a-e": "Feminine -a becomes -e.",
  "e-i": "Every -e becomes -i, masculine or feminine.",
  hard: "An h is added to keep the hard K / G sound.",
  soft: "One of the common words that turn soft: -ci / -gi.",
  cia: "-cia / -gia: keep the i after a vowel, drop it after a consonant.",
  io: "-io loses the o and keeps one i (figlio → figli).",
  same: "Accented, borrowed or shortened words don't change — only the article does.",
  ma: "Looks feminine but it's masculine, so it takes -i.",
  body: "Old Latin plural in -a: masculine singular, feminine plural.",
  irregular: "Its own unique plural — learn it as a pair.",
};

/** Turns any singular noun into its plural and names the rule used. */
export function explainPlural(raw: string): Explained | null {
  const sg = raw.trim().toLowerCase().replace(/^(il|lo|la|l'|l’|un|una|uno)\s*/, "");
  if (!/^[a-zàèéìòù]+$/.test(sg)) return null;
  const out = (pl: string, rule: RuleId): Explained => ({ sg, pl, rule, reason: REASON[rule] });
  if (IRREGULAR[sg]) return out(IRREGULAR[sg], "irregular");
  if (BODY[sg]) return out(BODY[sg], "body");
  if (SAME.has(sg) || /[àèéìòù]$/.test(sg) || /[^aeiou]$/.test(sg)) return out(sg, "same");
  if (MASC_A.has(sg)) return out(sg.slice(0, -1) + "i", "ma");
  if (/[cg]o$/.test(sg)) return SOFT.has(sg) ? out(sg.slice(0, -1) + "i", "soft") : out(sg.slice(0, -1) + "hi", "hard");
  if (/[cg]a$/.test(sg)) return out(sg.slice(0, -1) + "he", "hard");
  if (/[cg]ia$/.test(sg)) return out(regularPlural(sg), "cia");
  if (sg.endsWith("io")) return out(sg.slice(0, -1), "io");
  if (sg.endsWith("o")) return out(sg.slice(0, -1) + "i", "o-i");
  if (sg.endsWith("e")) return out(sg.slice(0, -1) + "i", "e-i");
  if (sg.endsWith("a")) return out(sg.slice(0, -1) + "e", "a-e");
  return null;
}

/** Targeted hint when the learner applied the wrong rule. */
export function mistakeHint(task: PluralTask, input: string): string | null {
  const word = norm(input).split(" ").pop() ?? "";
  const sg = task.sg.split(/\s|'/).pop() ?? "";
  const target = task.answer.split(" ").pop() ?? "";
  const [art] = norm(input).split(" ");
  const wantArt = task.answer.split(" ")[0];
  if (word === target && norm(input).includes(" ") && art !== wantArt) return `The word is right — just change the article to "${wantArt}".`;
  if (word === sg && target !== sg) return "This word does change in the plural — look at its ending again.";
  if (target === sg && word !== sg) return "Trick question: this word never changes. Only the article moves.";
  if (/[cg]a$/.test(sg) && /[cg]e$/.test(word)) return "Without the h the sound would turn soft. Add an h before -e.";
  if (/[cg]o$/.test(sg) && /[cg]i$/.test(word) && !/h/.test(word.slice(-2))) return "Most -co / -go words keep the hard sound with -chi / -ghi.";
  return null;
}
