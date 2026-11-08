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

export type BuildTask = { english: string; blocks: Block[]; accepted: string[][] };

const b = (it: string, en: string, role: Role): Block => ({ it, en, role });

export const BUILD_TASKS: BuildTask[] = [
  {
    english: "Anna reads a book.",
    blocks: [b("un libro", "a book", "object"), b("Anna", "Anna", "subject"), b("legge", "reads", "verb")],
    accepted: [["Anna", "legge", "un libro"]],
  },
  {
    english: "We eat a big pizza.",
    blocks: [b("grande", "big", "describe"), b("mangiamo", "we eat", "verb"), b("una pizza", "a pizza", "object")],
    accepted: [["mangiamo", "una pizza", "grande"]],
  },
  {
    english: "This evening I'm going to the cinema.",
    blocks: [b("al cinema", "to the cinema", "place"), b("stasera", "this evening", "time"), b("vado", "I'm going", "verb")],
    accepted: [["stasera", "vado", "al cinema"], ["vado", "al cinema", "stasera"]],
  },
  {
    english: "I drink water because I'm thirsty.",
    blocks: [b("ho sete", "I'm thirsty", "verb"), b("acqua", "water", "object"), b("perché", "because", "link"), b("bevo", "I drink", "verb")],
    accepted: [["bevo", "acqua", "perché", "ho sete"]],
  },
  {
    english: "Do you live in Milan?",
    blocks: [b("a Milano?", "in Milan?", "place"), b("abiti", "you live", "verb")],
    accepted: [["abiti", "a Milano?"]],
  },
];

/** True when the chosen block order matches one of the accepted orders. */
export function isAcceptedOrder(task: BuildTask, order: string[]): boolean {
  return task.accepted.some((a) => a.length === order.length && a.every((w, i) => w === order[i]));
}
