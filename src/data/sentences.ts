/** Original Parlami content for the "Sentence building" lesson. */
export type Role = "subject" | "verb" | "object" | "describe" | "time" | "place" | "link";

export const ROLE_LABEL: Record<Role, string> = {
  subject: "Who", verb: "Action", object: "What", describe: "Description",
  time: "When", place: "Where / with whom", link: "Joining word",
};

export type Block = { it: string; en: string; role: Role };

export const BACKBONE: Block[][] = [
  [{ it: "Marco", en: "Marco", role: "subject" }, { it: "beve", en: "drinks", role: "verb" }, { it: "un caffè", en: "a coffee", role: "object" }],
  [{ it: "La nonna", en: "Grandma", role: "subject" }, { it: "prepara", en: "makes", role: "verb" }, { it: "la pizza", en: "the pizza", role: "object" }],
];

export type Idea = { title: string; why: string; english: string; italian: string; note: string };

export const IDEAS: Idea[] = [
  {
    title: "The verb already says who",
    why: "Each verb ending points to one person, so io, tu, lui… are usually left out.",
    english: "I speak Italian.", italian: "Parlo italiano.",
    note: "Add the pronoun only to stress or contrast: Io parlo italiano, tu no.",
  },
  {
    title: "The thing first, then its description",
    why: "Most describing words come after the noun they describe.",
    english: "a red car", italian: "una macchina rossa",
    note: "A few short, common ones (bello, buono, grande) often go before.",
  },
  {
    title: "Blocks can move, but stay whole",
    why: "Time and place blocks can sit at the start or the end. Just don't split a block apart.",
    english: "Tomorrow I'm going to Rome.", italian: "Domani vado a Roma. = Vado a Roma domani.",
    note: "“a Roma” is one block — never separate “a” from “Roma”.",
  },
  {
    title: "Questions keep the same order",
    why: "There's no “do / does”. Keep the sentence and let your voice rise at the end.",
    english: "Do you speak English?", italian: "Parli inglese?",
    note: "In writing, the question mark does all the work.",
  },
  {
    title: "No small words get dropped",
    why: "Articles (il, la, un) and little linking words (a, di, con) still need to be there, just like in English.",
    english: "I'm going to the cinema with Luca.", italian: "Vado al cinema con Luca.",
    note: "al = a + il. Joined forms like this are very common.",
  },
];

export const CONNECTORS = [
  { it: "e", en: "and", example: "Leggo e ascolto musica.", exampleEn: "I read and listen to music." },
  { it: "ma", en: "but", example: "È tardi, ma non sono stanca.", exampleEn: "It's late, but I'm not tired." },
  { it: "perché", en: "because", example: "Resto a casa perché piove.", exampleEn: "I'm staying home because it's raining." },
  { it: "quindi", en: "so", example: "Ho fame, quindi mangio.", exampleEn: "I'm hungry, so I eat." },
  { it: "poi", en: "then / afterwards", example: "Lavoro, poi vado in palestra.", exampleEn: "I work, then I go to the gym." },
  { it: "anche", en: "also / too", example: "Studio anche lo spagnolo.", exampleEn: "I also study Spanish." },
];

export type Trap = { it: string; why: string };
export type BuildTask = { english: string; tier: 1 | 2 | 3; blocks: Block[]; accepted: string[][]; traps?: Trap[]; why: string };

const b = (it: string, en: string, role: Role): Block => ({ it, en, role });

export const BUILD_TASKS: BuildTask[] = [
  { tier: 1, english: "Anna reads a book.", why: "Name first, then the action, then what she reads.",
    blocks: [b("un libro", "a book", "object"), b("Anna", "Anna", "subject"), b("legge", "reads", "verb")],
    accepted: [["Anna", "legge", "un libro"]], traps: [{ it: "leggo", why: "leggo means I read. Anna needs legge." }] },
  { tier: 1, english: "We eat a big pizza.", why: "The description sits after the noun: una pizza grande.",
    blocks: [b("grande", "big", "describe"), b("mangiamo", "we eat", "verb"), b("una pizza", "a pizza", "object")],
    accepted: [["mangiamo", "una pizza", "grande"]], traps: [{ it: "noi", why: "mangiamo already says we. Noi is only for contrast." }] },
  { tier: 1, english: "This evening I'm going to the cinema.", why: "Time can open or close the sentence. Just keep al cinema whole.",
    blocks: [b("al cinema", "to the cinema", "place"), b("stasera", "this evening", "time"), b("vado", "I'm going", "verb")],
    accepted: [["stasera", "vado", "al cinema"], ["vado", "al cinema", "stasera"]], traps: [{ it: "sto", why: "\u201cI'm going\u201d is just vado. Italian rarely needs a separate \u201cam\u201d word." }] },
  { tier: 1, english: "I drink water because I'm thirsty.", why: "Two thoughts joined by perché. Italian says \u201cI have thirst\u201d: ho sete.",
    blocks: [b("ho sete", "I'm thirsty", "verb"), b("acqua", "water", "object"), b("perché", "because", "link"), b("bevo", "I drink", "verb")],
    accepted: [["bevo", "acqua", "perché", "ho sete"]], traps: [{ it: "sono sete", why: "Thirst is something you have in Italian: ho sete, never sono sete." }] },
  { tier: 1, english: "Do you live in Milan?", why: "Same order as a statement. Only the question mark and your voice change.",
    blocks: [b("a Milano?", "in Milan?", "place"), b("abiti", "you live", "verb")],
    accepted: [["abiti", "a Milano?"]], traps: [{ it: "fai", why: "There is no \u201cdo\u201d helper in Italian questions." }] },
  { tier: 2, english: "I don't eat meat.", why: "Non goes right before the verb, always.",
    blocks: [b("la carne", "meat", "object"), b("mangio", "I eat", "verb"), b("non", "not", "link")],
    accepted: [["non", "mangio", "la carne"]], traps: [{ it: "no", why: "No answers a question. Inside a sentence you need non." }] },
  { tier: 2, english: "Luca has a red car.", why: "Colours come after the noun: una macchina rossa.",
    blocks: [b("rossa", "red", "describe"), b("Luca", "Luca", "subject"), b("una macchina", "a car", "object"), b("ha", "has", "verb")],
    accepted: [["Luca", "ha", "una macchina", "rossa"]], traps: [{ it: "rosso", why: "Macchina is feminine, so the colour becomes rossa." }] },
  { tier: 2, english: "Tomorrow we're going to Rome with Sara.", why: "Time first or last; a Roma and con Sara stay as whole blocks.",
    blocks: [b("con Sara", "with Sara", "place"), b("domani", "tomorrow", "time"), b("a Roma", "to Rome", "place"), b("andiamo", "we're going", "verb")],
    accepted: [["domani", "andiamo", "a Roma", "con Sara"], ["andiamo", "a Roma", "con Sara", "domani"]], traps: [{ it: "in Roma", why: "Cities take a: a Roma, a Milano." }] },
  { tier: 3, english: "I'm tired, so I'm staying home this evening.", why: "Quindi links cause and result. Stasera can close the second thought.",
    blocks: [b("stasera", "this evening", "time"), b("resto a casa", "I'm staying home", "verb"), b("quindi", "so", "link"), b("sono stanco", "I'm tired", "verb")],
    accepted: [["sono stanco", "quindi", "resto a casa", "stasera"], ["sono stanco", "quindi", "stasera", "resto a casa"]], traps: [{ it: "ho stanco", why: "Tiredness uses essere: sono stanco." }] },
  { tier: 3, english: "Marta works in a bank, but she doesn't like it.", why: "Ma joins two opposite ideas. Non hugs the verb in the second half.",
    blocks: [b("non le piace", "she doesn't like it", "verb"), b("in banca", "in a bank", "place"), b("ma", "but", "link"), b("Marta lavora", "Marta works", "verb")],
    accepted: [["Marta lavora", "in banca", "ma", "non le piace"]], traps: [{ it: "lei", why: "After ma you don't repeat lei: the verb already points to Marta." }] },
];

/** True when the chosen block order matches one of the accepted orders. */
export function isAcceptedOrder(task: BuildTask, order: string[]): boolean {
  return task.accepted.some((a) => a.length === order.length && a.every((w, i) => w === order[i]));
}

/** Sentence accordion: one thought growing block by block. */
export const ACCORDION: { add: string; blocks: Block[]; en: string }[] = [
  { add: "Just the action", en: "I eat.", blocks: [b("Mangio", "I eat", "verb")] },
  { add: "+ what", en: "I eat a pizza.", blocks: [b("Mangio", "I eat", "verb"), b("una pizza", "a pizza", "object")] },
  { add: "+ with whom", en: "I eat a pizza with Marco.", blocks: [b("Mangio", "I eat", "verb"), b("una pizza", "a pizza", "object"), b("con Marco", "with Marco", "place")] },
  { add: "+ when and where", en: "This evening I'm eating a pizza with Marco in town.", blocks: [b("Stasera", "this evening", "time"), b("mangio", "I eat", "verb"), b("una pizza", "a pizza", "object"), b("con Marco", "with Marco", "place"), b("in centro", "in town", "place")] },
];

export type HabitRule = { title: string; plain: string; wrong: string; right: string; en: string; note: string };
export const HABIT_RULES: HabitRule[] = [
  { title: "The noun comes first, its description after", plain: "In English the description goes before the thing. In Italian you say the thing, then describe it.",
    wrong: "una rossa macchina", right: "una macchina rossa", en: "a red car", note: "A few short everyday words (bello, buono, grande) often sit before the noun." },
  { title: "Non sits right before the verb", plain: "To make any sentence negative, put non directly in front of the verb. Nothing goes between them except small words like lo or mi.",
    wrong: "Mangio non la carne.", right: "Non mangio la carne.", en: "I don't eat meat.", note: "There is no \u201cdon't\u201d helper. Non does the whole job." },
  { title: "Time and place can move, as whole blocks", plain: "Words like domani or stasera can open or close the sentence. What you can't do is split a block such as a Roma.",
    wrong: "Vado a domani Roma.", right: "Domani vado a Roma.", en: "Tomorrow I'm going to Rome.", note: "Vado a Roma domani is also correct. Both sound natural." },
];

export const LINKED = [
  { it: "e", en: "and", a: "Leggo", b: "ascolto musica", full: "Leggo e ascolto musica.", fullEn: "I read and listen to music." },
  { it: "ma", en: "but", a: "È tardi", b: "non sono stanca", full: "È tardi, ma non sono stanca.", fullEn: "It's late, but I'm not tired." },
  { it: "perché", en: "because", a: "Resto a casa", b: "piove", full: "Resto a casa perché piove.", fullEn: "I'm staying home because it's raining." },
  { it: "quindi", en: "so", a: "Ho fame", b: "mangio", full: "Ho fame, quindi mangio.", fullEn: "I'm hungry, so I eat." },
  { it: "poi", en: "then", a: "Lavoro", b: "vado in palestra", full: "Lavoro, poi vado in palestra.", fullEn: "I work, then I go to the gym." },
  { it: "anche", en: "also / too", a: "Studio l'inglese", b: "lo spagnolo", full: "Studio l'inglese e anche lo spagnolo.", fullEn: "I study English and Spanish too." },
];
