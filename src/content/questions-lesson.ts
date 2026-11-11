/** Editable content for the "Asking questions" lesson, steps 1 and 2. */
export type Sentence = {
  id: string;
  italian: string;
  english: string;
  audioNormal: string;
  audioSlow: string;
  type: "statement" | "question";
  wordGloss?: string[];
  /** true = a real recording is required (no browser voice fallback). */
  needsRecording?: boolean;
};

export const AUDIO_DIR = "/audio/questions/";
export const audioPaths = (id: string) => ({ audioNormal: `${AUDIO_DIR}${id}.mp3`, audioSlow: `${AUDIO_DIR}${id}-slow.mp3` });

function s(id: string, italian: string, english: string, extra: Partial<Sentence> = {}): Sentence {
  return { id, italian, english, type: italian.trim().endsWith("?") ? "question" : "statement", ...audioPaths(id), ...extra };
}
const rec = { needsRecording: true };

export type QuizItem =
  | { kind: "audio-choice"; id: string; sentence: Sentence; answer: "statement" | "question"; why: string }
  | { kind: "multiple-choice"; id: string; prompt: string; options: string[]; answer: string; why: string; whyWrong?: Record<string, string> };

export const STEP1 = {
  headline: "In Italian, a yes/no question looks exactly like a statement.",
  paragraphs: [
    "To turn a statement into a yes/no question, change nothing. Same words, same order. Only your voice changes in speech, and only the ? changes in writing.",
    "Statement: voice goes down at the end. Question: voice goes up toward the end.",
    "English does this too in surprise: \"You're leaving?\" Italian does this for yes/no questions all the time.",
  ],
  footnote: "Word order can change too. Step 3 covers that.",
  pairs: [
    [s("parli-inglese", "Parli inglese.", "You speak English.", rec), s("parli-inglese-q", "Parli inglese?", "Do you speak English?", rec)],
    [s("museo-chiuso", "Il museo è chiuso.", "The museum is closed.", rec), s("museo-chiuso-q", "Il museo è chiuso?", "Is the museum closed?", rec)],
    [s("prendete-caffe", "Prendete un caffè.", "You all are having a coffee.", rec), s("prendete-caffe-q", "Prendete un caffè?", "Are you all having a coffee?", rec)],
  ] as [Sentence, Sentence][],
  long: s("prenotate-camera-q", "Prenotate una camera per tre notti?", "Are you all booking a room for three nights?", { ...rec, wordGloss: ["Prenotate", "una camera", "per tre notti?"] }),
  longCaption: "In a long sentence, the rise comes at the end of the whole question.",
  knowThis: [
    ["Regional melody", "The rise is the standard pattern, but some regions (for example Naples and parts of the south) use a different melody. Copy the audio."],
    ["Writing", "In a text message there is no voice, so ? is the only signal. Never drop it."],
    ["Punctuation", "Italian uses only the final ?, no upside-down ¿ like Spanish."],
  ] as [string, string][],
  quiz: [
    { kind: "audio-choice", id: "q1", sentence: s("hai-fame", "Hai fame.", "You're hungry.", rec), answer: "statement", why: "The voice falls at the end: it's telling you, not asking." },
    { kind: "audio-choice", id: "q2", sentence: s("hai-fame-q", "Hai fame?", "Are you hungry?", rec), answer: "question", why: "Same words, but the voice rises on the last word: it's asking." },
    { kind: "audio-choice", id: "q3", sentence: s("siete-a-casa-q", "Siete a casa?", "Are you all at home?", rec), answer: "question", why: "The rise across \"a casa\" turns it into a question." },
    { kind: "audio-choice", id: "q4", sentence: s("siete-a-casa", "Siete a casa.", "You all are at home.", rec), answer: "statement", why: "The voice drops at the end: a plain statement." },
  ] as QuizItem[],
};

export type StripItem = { id: string; english: string; helperWord: string; stripped: string; italian: string; stem: string; ending: string; rest: string };

export const STEP2 = {
  headline: "English needs a helper word. Italian doesn't.",
  paragraphs: [
    "English builds most questions with a helper: do / does. \"Do you work?\"",
    "Italian has no helper. The verb ending already tells you who is acting, so you go straight to the verb.",
  ],
  table: [
    { en: "Do you work?", it: s("lavori-q", "Lavori?", "Do you work?", { wordGloss: ["you-work"] }) },
    { en: "Are we eating? (Shall we eat?)", it: s("mangiamo-q", "Mangiamo?", "Are we eating?", { wordGloss: ["we-eat"] }) },
    { en: "Do you understand? (informal)", it: s("capisci-q", "Capisci?", "Do you understand?", { wordGloss: ["you-understand"] }) },
    { en: "Does he/she understand? (Do you understand? formal)", it: s("capisce-q", "Capisce?", "Does he/she understand?", { wordGloss: ["he/she-understands"] }) },
    { en: "Are they arriving tonight?", it: s("arrivano-stasera-q", "Arrivano stasera?", "Are they arriving tonight?", { wordGloss: ["they-arrive", "tonight"] }) },
  ],
  habitTitle: "The habit to build: strip, then translate",
  habit: [
    "Say the English question in your head.",
    "Delete the helper (do / does).",
    "If it starts with am/is/are, swap it back to a statement.",
    "Translate what is left.",
    "Check the verb ending matches who you mean.",
  ],
  strips: [
    { id: "abiti-qui-q", english: "Do you live here?", helperWord: "Do", stripped: "you live here", italian: "Abiti qui?", stem: "Abit", ending: "i", rest: " qui?" },
    { id: "hai-penna-q", english: "Do you have a pen?", helperWord: "Do", stripped: "you have a pen", italian: "Hai una penna?", stem: "Ha", ending: "i", rest: " una penna?" },
    { id: "museo-aperto-q", english: "Is the museum open?", helperWord: "Is", stripped: "the museum is open", italian: "Il museo è aperto?", stem: "Il museo ", ending: "è", rest: " aperto?" },
    { id: "siete-stanchi-q", english: "Are you all tired?", helperWord: "Are", stripped: "you all are tired", italian: "Siete stanchi?", stem: "Si", ending: "ete", rest: " stanchi?" },
    { id: "mangiano-q", english: "Do they eat?", helperWord: "Do", stripped: "they eat", italian: "Mangiano?", stem: "Mangi", ending: "ano", rest: "?" },
  ] as StripItem[],
  stripNote: "Italian present tense covers \"I eat\", \"I am eating\" and \"do I eat?\", so you never need an extra word.",
  endingsTitle: "Why the ending is enough",
  endings: [
    ["I", "lavor", "o"], ["you", "lavor", "i"], ["he/she/you formal", "lavor", "a"],
    ["we", "lavor", "iamo"], ["you all", "lavor", "ate"], ["they", "lavor", "ano"],
  ] as [string, string, string][],
  endingsNote: "Because the ending carries the subject, Italian usually drops io, tu, lui. Add it only for emphasis: Tu lavori? means 'Are YOU the one working?'",
  warnings: [
    { text: "Fai lavori? is real Italian but means \"Are you doing (building/repair) work?\". Fare is \"to do/make\" as a main verb, never a question helper.", wrong: "Fai lavori? (for \"Do you work?\")", right: "Lavori?" },
    { text: "Don't look for an Italian word for \"do\". There isn't one. Delete it and use the verb." },
    { text: "Viene? can mean \"Is he/she coming?\" or \"Are you (formal) coming?\". Context decides. Add a name when unclear: Marco viene?" },
    { text: "Don't strip \"Do you like...?\" Italian uses piacere, which gets its own lesson." },
  ] as { text: string; wrong?: string; right?: string }[],
  quiz: [
    { kind: "multiple-choice", id: "m1", prompt: "Do you work?", options: ["Lavori?", "Fai lavori?", "Tu fai lavorare?"], answer: "Lavori?", why: "No helper: go straight to the verb. -i means you." },
    { kind: "multiple-choice", id: "m2", prompt: "Are we eating?", options: ["Mangiamo?", "Mangi?", "Mangiate?"], answer: "Mangiamo?", why: "-iamo is the we ending. Mangi is you, mangiate is you all." },
    { kind: "multiple-choice", id: "m3", prompt: "Do they arrive tonight?", options: ["Arrivano stasera?", "Arriva stasera?", "Arriviamo stasera?"], answer: "Arrivano stasera?", why: "-ano is the they ending." },
    { kind: "multiple-choice", id: "m4", prompt: "Do you have a pen? (informal)", options: ["Hai una penna?", "Fai una penna?", "Ha una penna?"], answer: "Hai una penna?", why: "Hai is informal you.", whyWrong: { "Ha una penna?": "Ha is the formal \"you\" or \"he/she\", not informal.", "Fai una penna?": "Fare means to make: \"are you making a pen?\"" } },
  ] as QuizItem[],
};

/** Every recording the lesson can use. */
export function allSentences(): Sentence[] {
  const strip = STEP2.strips.map((x) => s(x.id, x.italian, x.english));
  return [
    ...STEP1.pairs.flat(), STEP1.long,
    ...STEP1.quiz.flatMap((q) => (q.kind === "audio-choice" ? [q.sentence] : [])),
    ...STEP2.table.map((r) => r.it), ...strip,
  ];
}
export function scoreQuiz(items: QuizItem[], answers: Record<string, string>): number {
  return items.filter((q) => answers[q.id] === q.answer).length;
}
