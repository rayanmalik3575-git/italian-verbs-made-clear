// Original Parlami content: Italian plurals and their exceptions (A1).

export type Noun = { sg: string; pl: string; en: string; enPl: string; article: [string, string]; note?: string };

/** The three everyday vowel switches. */
export const SWITCHES = [
  {
    from: "o", to: "i", who: "Masculine words",
    line: "Most words ending in -o are masculine. Swap the -o for -i.",
    words: [
      { sg: "libro", pl: "libri", en: "book", enPl: "books", article: ["il", "i"] },
      { sg: "ragazzo", pl: "ragazzi", en: "boy", enPl: "boys", article: ["il", "i"] },
      { sg: "treno", pl: "treni", en: "train", enPl: "trains", article: ["il", "i"] },
    ] as Noun[],
  },
  {
    from: "a", to: "e", who: "Feminine words",
    line: "Most words ending in -a are feminine. Swap the -a for -e.",
    words: [
      { sg: "pizza", pl: "pizze", en: "pizza", enPl: "pizzas", article: ["la", "le"] },
      { sg: "casa", pl: "case", en: "house", enPl: "houses", article: ["la", "le"] },
      { sg: "ragazza", pl: "ragazze", en: "girl", enPl: "girls", article: ["la", "le"] },
    ] as Noun[],
  },
  {
    from: "e", to: "i", who: "Masculine or feminine",
    line: "Words ending in -e can be either gender, but the plural is always -i. You don't need to know the gender to make it plural.",
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
    why: "Italian 'ce' sounds like 'che' in 'cheese'. To keep the hard K sound of amica, Italian slips in an h.",
    words: [
      { sg: "amica", pl: "amiche", en: "female friend", enPl: "female friends", article: ["l'", "le"] },
      { sg: "banca", pl: "banche", en: "bank", enPl: "banks", article: ["la", "le"] },
      { sg: "collega", pl: "colleghe", en: "(female) colleague", enPl: "colleagues", article: ["la", "le"] },
    ] as Noun[],
  },
  {
    title: "-co / -go → usually -chi / -ghi",
    why: "Short words, stressed near the end, keep the hard sound with an h. Longer words stressed earlier (médico, amíco) often go soft: -ci. Learn the soft ones as you meet them.",
    words: [
      { sg: "parco", pl: "parchi", en: "park", enPl: "parks", article: ["il", "i"] },
      { sg: "lago", pl: "laghi", en: "lake", enPl: "lakes", article: ["il", "i"] },
      { sg: "amico", pl: "amici", en: "friend", enPl: "friends", article: ["l'", "gli"], note: "Soft! Sounds like 'ah-MEE-chee'." },
      { sg: "medico", pl: "medici", en: "doctor", enPl: "doctors", article: ["il", "i"], note: "Soft, stressed on MÉ-dico." },
    ] as Noun[],
  },
  {
    title: "-cia / -gia → -cie or -ce",
    why: "Look at the letter before -cia. A vowel before it? Keep the i (camicie). A consonant before it? Drop the i (arance). The sound is the same either way, so this only matters when writing.",
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
    line: "The article does all the work. Only il/la → i/le tells you it's plural.",
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
    line: "Many words ending in -ma come from Greek. They are masculine, so the plural is -i, not -e.",
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
    line: "A leftover from Latin: some body parts are masculine in the singular but feminine in the plural, ending in -a.",
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
    line: "Just a handful. Learn them as whole words.",
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
