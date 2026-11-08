export type Pattern = "four" | "two";

export interface Nationality {
  it: string; // masculine singular, always lowercase
  en: string;
  country: string; // Italian country name
  from: string; // "vengo da…" form
  note?: string;
}

export const NATIONALITIES: Nationality[] = [
  { it: "italiano", en: "Italian", country: "Italia", from: "dall'Italia" },
  { it: "americano", en: "American", country: "America / Stati Uniti", from: "dall'America", note: "What people say every day, even though America is two continents." },
  { it: "statunitense", en: "from the USA", country: "Stati Uniti", from: "dagli Stati Uniti", note: "The precise, official word — you'll hear it on the news and read it on forms." },
  { it: "canadese", en: "Canadian", country: "Canada", from: "dal Canada" },
  { it: "inglese", en: "English", country: "Inghilterra", from: "dall'Inghilterra", note: "Many Italians say inglese for anyone from the UK. A Scot may correct you!" },
  { it: "gallese", en: "Welsh", country: "Galles", from: "dal Galles" },
  { it: "scozzese", en: "Scottish", country: "Scozia", from: "dalla Scozia" },
  { it: "irlandese", en: "Irish", country: "Irlanda", from: "dall'Irlanda" },
  { it: "britannico", en: "British", country: "Regno Unito", from: "dal Regno Unito", note: "Plural is britannici — the c stays soft." },
  { it: "australiano", en: "Australian", country: "Australia", from: "dall'Australia" },
  { it: "neozelandese", en: "New Zealander", country: "Nuova Zelanda", from: "dalla Nuova Zelanda", note: "neo = new, zelandese = from Zealand. Literally 'New-Zealandish'." },
  { it: "sudafricano", en: "South African", country: "Sudafrica", from: "dal Sudafrica" },
  { it: "giapponese", en: "Japanese", country: "Giappone", from: "dal Giappone" },
  { it: "cinese", en: "Chinese", country: "Cina", from: "dalla Cina" },
  { it: "francese", en: "French", country: "Francia", from: "dalla Francia" },
  { it: "spagnolo", en: "Spanish", country: "Spagna", from: "dalla Spagna" },
  { it: "portoghese", en: "Portuguese", country: "Portogallo", from: "dal Portogallo" },
  { it: "tedesco", en: "German", country: "Germania", from: "dalla Germania", note: "Plural is tedeschi / tedesche: the h keeps the hard 'k' sound." },
  { it: "brasiliano", en: "Brazilian", country: "Brasile", from: "dal Brasile" },
  { it: "messicano", en: "Mexican", country: "Messico", from: "dal Messico" },
];

export const patternOf = (n: Nationality): Pattern => (n.it.endsWith("o") ? "four" : "two");

/** [masc sg, fem sg, masc pl, fem pl] */
export function formsOf(n: Nationality): [string, string, string, string] {
  const w = n.it;
  if (w.endsWith("e")) {
    const pl = w.slice(0, -1) + "i";
    return [w, w, pl, pl];
  }
  const stem = w.slice(0, -1);
  const hard = w === "tedesco"; // only list word where -co → -chi
  return [w, stem + "a", stem + (hard ? "hi" : "i"), stem + (hard ? "he" : "e")];
}

export type Who = 0 | 1 | 2 | 3;
export const PEOPLE: { name: string; verb: string; idx: Who; hint: string }[] = [
  { name: "Marco", verb: "è", idx: 0, hint: "one man" },
  { name: "Giulia", verb: "è", idx: 1, hint: "one woman" },
  { name: "Marco e Luca", verb: "sono", idx: 2, hint: "two men" },
  { name: "Anna e Sara", verb: "sono", idx: 3, hint: "two women" },
  { name: "Paolo e Chiara", verb: "sono", idx: 2, hint: "a man and a woman — mixed groups use the masculine plural" },
];

export interface AgreeTask { person: (typeof PEOPLE)[number]; nat: Nationality; answer: string; options: string[] }

const PICKS: [number, string][] = [
  [1, "spagnolo"], [0, "inglese"], [3, "tedesco"], [1, "francese"], [2, "messicano"],
  [4, "brasiliano"], [3, "giapponese"], [2, "tedesco"], [1, "australiano"], [4, "canadese"],
];

export const AGREE_TASKS: AgreeTask[] = PICKS.map(([p, w]) => {
  const nat = NATIONALITIES.find((n) => n.it === w)!;
  const person = PEOPLE[p]!;
  const forms = formsOf(nat);
  return { person, nat, answer: forms[person.idx], options: [...new Set(forms)] };
});

export const isCorrectAgreement = (t: AgreeTask, choice: string) => choice === t.answer;
