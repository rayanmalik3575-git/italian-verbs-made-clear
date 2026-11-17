/** 60 everyday A1/A2 nouns, 10 per day, each paired with a core verb. */
export type Gender = "m" | "f";
export type Article = "il" | "lo" | "la" | "l'" | "i";
export type DailyNoun = {
  id: string; category: string; dayIndex: number;
  singular: string; article: Article; fullSingular: string; indefinite: string;
  plural: string; gender: Gender; english: string; endingHint: string;
  pairedVerbExample: { it: string; en: string };
};

export const NOUN_DAYS = [
  { day: 1, it: "Al bar & cibo", en: "Cafe & food" },
  { day: 2, it: "Città & viaggi", en: "City & travel" },
  { day: 3, it: "Casa & oggetti", en: "Home & objects" },
  { day: 4, it: "Tempo & giornata", en: "Time & daily life" },
  { day: 5, it: "Persone & famiglia", en: "People & connections" },
  { day: 6, it: "Negozi & servizi", en: "Shopping & places" },
];

// [singular, article, gender, plural, english, hint, exampleIt, exampleEn]
type Row = [string, Article, Gender, string, string, string, string, string];
const H = {
  o: "-o noun (masculine): il -o → i -i",
  a: "-a noun (feminine): la -a → le -e",
  em: "-e noun (masculine): il -e → i -i",
  ef: "-e noun (feminine): la -e → le -i",
  acc: "Ends in a stressed vowel: the noun never changes, only the article does",
  foreign: "Foreign word: the noun never changes, only the article does",
  vowel: "Starts with a vowel: l' in the singular",
  z: "Starts with z or s+consonant: lo → gli",
};
const D: Row[][] = [
  [
    ["caffè", "il", "m", "i caffè", "the coffee", H.acc, "Prendo un caffè.", "I'll have a coffee."],
    ["cornetto", "il", "m", "i cornetti", "the croissant", H.o, "Mangio un cornetto al bar.", "I eat a croissant at the bar."],
    ["conto", "il", "m", "i conti", "the bill", H.o, "Paghiamo il conto.", "We pay the bill."],
    ["acqua", "l'", "f", "le acque", "the water", H.vowel + " · la -a → le -e", "Bevo l'acqua.", "I drink the water."],
    ["pizza", "la", "f", "le pizze", "the pizza", H.a, "Stasera mangiamo una pizza.", "Tonight we're having a pizza."],
    ["tavolo", "il", "m", "i tavoli", "the table", H.o, "Cerchiamo un tavolo per due.", "We're looking for a table for two."],
    ["colazione", "la", "f", "le colazioni", "the breakfast", H.ef, "Faccio colazione alle otto.", "I have breakfast at eight."],
    ["vino", "il", "m", "i vini", "the wine", H.o, "Non bevo il vino.", "I don't drink wine."],
    ["gelato", "il", "m", "i gelati", "the ice cream", H.o, "Prendi un gelato?", "Are you having an ice cream?"],
    ["bottiglia", "la", "f", "le bottiglie", "the bottle", H.a, "Compro una bottiglia d'acqua.", "I buy a bottle of water."],
  ],
  [
    ["stazione", "la", "f", "le stazioni", "the station", H.ef, "Cerco la stazione.", "I'm looking for the station."],
    ["treno", "il", "m", "i treni", "the train", H.o, "Prendo il treno per Firenze.", "I'm taking the train to Florence."],
    ["albergo", "l'", "m", "gli alberghi", "the hotel", H.vowel + " · l' → gli, -go → -ghi", "Cerco l'albergo.", "I'm looking for the hotel."],
    ["biglietto", "il", "m", "i biglietti", "the ticket", H.o, "Compro il biglietto.", "I buy the ticket."],
    ["strada", "la", "f", "le strade", "the street", H.a, "Conosci la strada?", "Do you know the way?"],
    ["aeroporto", "l'", "m", "gli aeroporti", "the airport", H.vowel + " · l' → gli", "Arrivo all'aeroporto alle sei.", "I arrive at the airport at six."],
    ["piazza", "la", "f", "le piazze", "the square", H.a, "Aspetto in piazza.", "I'll wait in the square."],
    ["centro", "il", "m", "i centri", "the centre", H.o, "Vai in centro oggi?", "Are you going into town today?"],
    ["mappa", "la", "f", "le mappe", "the map", H.a, "Guardo la mappa.", "I look at the map."],
    ["autobus", "l'", "m", "gli autobus", "the bus", H.vowel + " · " + H.foreign, "Quando arriva l'autobus?", "When does the bus arrive?"],
  ],
  [
    ["chiave", "la", "f", "le chiavi", "the key", H.ef, "Cerco le chiavi.", "I'm looking for the keys."],
    ["telefono", "il", "m", "i telefoni", "the phone", H.o, "Dov'è il telefono?", "Where's the phone?"],
    ["borsa", "la", "f", "le borse", "the bag", H.a, "Prendi la borsa?", "Are you taking the bag?"],
    ["libro", "il", "m", "i libri", "the book", H.o, "Leggo un libro la sera.", "I read a book in the evening."],
    ["soldi", "i", "m", "i soldi", "the money", "Always plural in Italian: i soldi", "Non ho i soldi.", "I don't have the money."],
    ["porta", "la", "f", "le porte", "the door", H.a, "Apri la porta?", "Can you open the door?"],
    ["camera", "la", "f", "le camere", "the room", H.a, "La camera è piccola.", "The room is small."],
    ["letto", "il", "m", "i letti", "the bed", H.o, "Vado a letto presto.", "I go to bed early."],
    ["zaino", "lo", "m", "gli zaini", "the backpack", H.z, "Cosa cerchi nello zaino?", "What are you looking for in the backpack?"],
    ["computer", "il", "m", "i computer", "the computer", H.foreign, "Uso il computer per lavoro.", "I use the computer for work."],
  ],
  [
    ["giorno", "il", "m", "i giorni", "the day", H.o, "Lavoro tutti i giorni.", "I work every day."],
    ["mattina", "la", "f", "le mattine", "the morning", H.a, "La mattina bevo un caffè.", "In the morning I drink a coffee."],
    ["sera", "la", "f", "le sere", "the evening", H.a, "La sera guardo un film.", "In the evening I watch a film."],
    ["settimana", "la", "f", "le settimane", "the week", H.a, "Parto la settimana prossima.", "I'm leaving next week."],
    ["lavoro", "il", "m", "i lavori", "the work / job", H.o, "Cerchi lavoro qui?", "Are you looking for work here?"],
    ["ora", "l'", "f", "le ore", "the hour", H.vowel + " · la -a → le -e", "Che ore sono?", "What time is it?"],
    ["fine settimana", "il", "m", "i fine settimana", "the weekend", "Compound noun: it never changes", "Cosa fai il fine settimana?", "What are you doing at the weekend?"],
    ["vacanza", "la", "f", "le vacanze", "the holiday", H.a, "Andiamo in vacanza ad agosto.", "We go on holiday in August."],
    ["tempo", "il", "m", "i tempi", "the time / weather", H.o, "Hai tempo adesso?", "Do you have time now?"],
    ["festa", "la", "f", "le feste", "the party", H.a, "Stasera c'è una festa.", "There's a party tonight."],
  ],
  [
    ["amico", "l'", "m", "gli amici", "the friend (m)", H.vowel + " · -co → -ci", "Aspetto un amico.", "I'm waiting for a friend."],
    ["amica", "l'", "f", "le amiche", "the friend (f)", H.vowel + " · -ca → -che", "Chiamo un'amica.", "I'm calling a friend."],
    ["ragazzo", "il", "m", "i ragazzi", "the boy / boyfriend", H.o, "Il ragazzo studia italiano.", "The boy studies Italian."],
    ["ragazza", "la", "f", "le ragazze", "the girl / girlfriend", H.a, "La ragazza abita a Roma.", "The girl lives in Rome."],
    ["famiglia", "la", "f", "le famiglie", "the family", H.a, "Vedo la famiglia la domenica.", "I see the family on Sundays."],
    ["professore", "il", "m", "i professori", "the teacher", H.em, "Il professore parla piano.", "The teacher speaks slowly."],
    ["cameriere", "il", "m", "i camerieri", "the waiter", H.em, "Chiamo il cameriere.", "I call the waiter."],
    ["medico", "il", "m", "i medici", "the doctor", H.o + " · -co → -ci", "Vado dal medico.", "I'm going to the doctor."],
    ["cliente", "il", "m", "i clienti", "the customer", H.em, "Il cliente paga alla cassa.", "The customer pays at the till."],
    ["vicino", "il", "m", "i vicini", "the neighbour", H.o, "Conosci il vicino?", "Do you know the neighbour?"],
  ],
  [
    ["farmacia", "la", "f", "le farmacie", "the pharmacy", H.a, "Cerco una farmacia.", "I'm looking for a pharmacy."],
    ["supermercato", "il", "m", "i supermercati", "the supermarket", H.o, "Vado al supermercato.", "I'm going to the supermarket."],
    ["ristorante", "il", "m", "i ristoranti", "the restaurant", H.em, "Conosci un buon ristorante?", "Do you know a good restaurant?"],
    ["banca", "la", "f", "le banche", "the bank", H.a + " · -ca → -che", "La banca apre alle nove.", "The bank opens at nine."],
    ["negozio", "il", "m", "i negozi", "the shop", H.o + " · -io → -i", "Il negozio chiude presto.", "The shop closes early."],
    ["ospedale", "l'", "m", "gli ospedali", "the hospital", H.vowel + " · l' → gli", "Dov'è l'ospedale?", "Where's the hospital?"],
    ["mercato", "il", "m", "i mercati", "the market", H.o, "Compro la frutta al mercato.", "I buy fruit at the market."],
    ["cassa", "la", "f", "le casse", "the till", H.a, "Pago alla cassa.", "I pay at the till."],
    ["scontrino", "lo", "m", "gli scontrini", "the receipt", H.z, "Prendi lo scontrino!", "Take the receipt!"],
    ["prezzo", "il", "m", "i prezzi", "the price", H.o, "Il prezzo è giusto.", "The price is fair."],
  ],
];

const indef = (s: string, a: Article, g: Gender) => {
  if (a === "i") return "dei " + s;
  if (g === "f") return (a === "l'" ? "un'" : "una ") + s;
  return (a === "lo" ? "uno " : "un ") + s;
};

export const DAILY_NOUNS: DailyNoun[] = D.flatMap((rows, i) =>
  rows.map(([s, a, g, pl, en, hint, eit, een]) => ({
    id: s.replace(/\s+/g, "-"), category: NOUN_DAYS[i].en, dayIndex: i + 1,
    singular: s, article: a, fullSingular: a === "l'" ? "l'" + s : `${a} ${s}`,
    indefinite: indef(s, a, g), plural: pl, gender: g, english: en, endingHint: hint,
    pairedVerbExample: { it: eit, en: een },
  })),
);

export const nounsForDay = (d: number) => DAILY_NOUNS.filter((n) => n.dayIndex === d);

/** Why the singular article is what it is — one teacher line. */
export function articleRule(n: DailyNoun): string {
  if (n.article === "l'") return "Starts with a vowel, so the article shortens to l'.";
  if (n.article === "lo") return "Masculine word starting with z or s+consonant takes lo.";
  if (n.article === "i") return "This word only exists in the plural: i soldi.";
  if (n.article === "la") return "Feminine word starting with a consonant takes la.";
  return "Masculine word starting with a normal consonant takes il.";
}
