import type { Verb } from "./verbs";
import { contextFor, fill, hasContext } from "./verb-sentences";

/** One "build the sentence" round: English thought → assemble the native Italian. */
export type BuildItem = { idx: number; it: string; en: string; tip?: string | undefined };

type Row = [string, string, string?]; // full Italian, English, tip
// Hand-written native sentences, PRONOUNS order (io, tu, lui/lei, noi, voi, loro).
const B: Record<string, Row[]> = {
  comprare: [
    ["Compro il pane ogni mattina.", "I buy bread every morning.", "No 'io' — the -o already says it's you."],
    ["Cosa compri per cena?", "What are you buying for dinner?", "Question word first, then the verb: Cosa compri…"],
    ["Mia madre compra sempre la frutta al mercato.", "My mum always buys fruit at the market.", "'Sempre' sits right after the verb."],
    ["Compriamo i biglietti online.", "We're buying the tickets online.", "-iamo = we. Present tense also covers 'we're buying'."],
    ["Ragazzi, comprate voi il vino?", "Guys, are you buying the wine?", "Here 'voi' is kept on purpose: 'are YOU the ones buying it?'"],
    ["I turisti comprano i souvenir in centro.", "The tourists buy souvenirs in the centre.", "'Souvenir' never changes in the plural."],
  ],
  pagare: [
    ["Pago io, tranquillo.", "I'll get this, don't worry.", "'Pago io' puts io after the verb: 'I'M paying'. Very common."],
    ["Paghi con la carta?", "Are you paying by card?", "Spelling keeps the hard g: pag-hi."],
    ["Marco paga sempre in contanti.", "Marco always pays cash.", "In contanti = in cash."],
    ["Paghiamo alla romana?", "Shall we split the bill?", "'Alla romana' = everyone pays their share."],
    ["Quanto pagate di affitto?", "How much rent do you pay?", "Di affitto = 'in rent'."],
    ["I clienti pagano alla cassa.", "Customers pay at the till."],
  ],
  cercare: [
    ["Cerco un lavoro a Milano.", "I'm looking for a job in Milan.", "Cercare already means 'look FOR' — no extra 'per'."],
    ["Cosa cerchi?", "What are you looking for?", "Hard c kept with h: cer-chi."],
    ["Anna cerca casa da mesi.", "Anna has been looking for a flat for months.", "'Da mesi' + present = has been … for months."],
    ["Cerchiamo un ristorante tranquillo.", "We're looking for a quiet restaurant."],
    ["Cercate qualcosa in particolare?", "Are you looking for anything in particular?"],
    ["I miei amici cercano un appartamento.", "My friends are looking for a flat."],
  ],
  vedere: [
    ["Non vedo niente senza occhiali.", "I can't see anything without glasses.", "Non … niente: Italian doubles the negative."],
    ["Vedi quella chiesa?", "Can you see that church?", "Italian drops 'can' with seeing: just 'vedi?'."],
    ["Luca vede la sua ragazza stasera.", "Luca is seeing his girlfriend tonight."],
    ["Ci vediamo domani!", "See you tomorrow!", "A fixed chunk: ci vediamo = see you."],
    ["Vedete il mare da qui?", "Can you see the sea from here?"],
    ["I bambini vedono i cartoni ogni sera.", "The kids watch cartoons every evening."],
  ],
  dire: [
    ["Dico sempre la verità.", "I always tell the truth."],
    ["Cosa dici?", "What are you saying?"],
    ["Come si dice 'thank you' in italiano?", "How do you say 'thank you' in Italian?", "'Si dice' = one says. Your survival phrase."],
    ["Diciamo di sì.", "We say yes.", "Dire di sì / di no — always with 'di'."],
    ["Ragazzi, che ne dite di una pizza?", "Guys, how about a pizza?", "Che ne dite di…? = how about…?"],
    ["Dicono che domani piove.", "They say it'll rain tomorrow.", "Present tense for near future is normal."],
  ],
  uscire: [
    ["Esco stasera con gli amici.", "I'm going out with friends tonight.", "Irregular: esc- for io/tu/lui/loro, usc- for noi/voi."],
    ["A che ora esci dal lavoro?", "What time do you finish work?", "Uscire dal lavoro = leave work."],
    ["Paola esce con un ragazzo nuovo.", "Paola is going out with a new guy."],
    ["Usciamo a prendere un caffè?", "Shall we go out for a coffee?"],
    ["Uscite anche voi?", "Are you going out too?"],
    ["I ragazzi escono dalla scuola alle due.", "The kids get out of school at two."],
  ],
  aspettare: [
    ["Ti aspetto davanti al bar.", "I'll wait for you in front of the bar.", "Aspettare = wait FOR. No extra word."],
    ["Chi aspetti?", "Who are you waiting for?"],
    ["Giulia aspetta un bambino.", "Giulia is expecting a baby."],
    ["Aspettiamo l'autobus da mezz'ora.", "We've been waiting for the bus for half an hour."],
    ["Mi aspettate un attimo?", "Can you wait a moment for me?"],
    ["Gli ospiti aspettano in salotto.", "The guests are waiting in the living room."],
  ],
  arrivare: [
    ["Arrivo tra cinque minuti!", "I'll be there in five minutes!", "Classic text message: 'Arrivo!'"],
    ["Quando arrivi a Roma?", "When do you get to Rome?"],
    ["Il treno arriva in ritardo.", "The train is arriving late."],
    ["Arriviamo stasera.", "We arrive this evening."],
    ["A che ora arrivate?", "What time are you arriving?"],
    ["I miei genitori arrivano domani.", "My parents arrive tomorrow."],
  ],
  leggere: [
    ["Leggo un libro prima di dormire.", "I read a book before sleeping."],
    ["Cosa leggi di bello?", "What are you reading that's good?", "'Di bello' = anything nice. Very native."],
    ["Mio padre legge il giornale a colazione.", "My dad reads the paper at breakfast."],
    ["Leggiamo insieme?", "Shall we read together?"],
    ["Leggete molto in inglese?", "Do you read a lot in English?"],
    ["Gli italiani leggono poco.", "Italians don't read much.", "Hard 'g' sound: leg-go, leg-gono."],
  ],
};

const SMALL = new Set(["il", "lo", "la", "i", "gli", "le", "un", "uno", "una", "un'", "di", "a", "da", "in", "con", "su", "per", "tra", "al", "alla", "allo", "ai", "agli", "alle", "del", "della", "dello", "dei", "degli", "delle", "dal", "dalla", "nel", "nella", "sul", "sulla", "mia", "mio", "mie", "miei", "tua", "tuo", "sua", "suo", "ti", "mi", "ci", "si", "ne", "che", "non", "quella", "quel", "quello", "questo", "questa"]);

/** Split a sentence into tappable chunks: small words glue onto the next word. */
export function blocksOf(it: string): string[] {
  const words = it.replace(/[.!?]+$/, "").split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let buf = "";
  for (const w of words) {
    buf = buf ? `${buf} ${w}` : w;
    if (!SMALL.has(w.toLowerCase().replace(/,$/, "")) || w.endsWith(",")) { out.push(buf); buf = ""; }
  }
  if (buf) out.push(buf);
  return out.length < 2 && words.length > 1 ? words.map((w) => w.replace(/,$/, ",")) : out;
}

export function endMark(it: string) {
  return /[.!?]+$/.exec(it)?.[0] ?? ".";
}

/** Rounds for a verb: hand-written builder rows, else the 20 context verbs, else the verb's own examples. */
export function builderFor(verb: Verb): BuildItem[] {
  const rows = B[verb.infinitive];
  if (rows && rows.length) return rows.map(([it, en, tip], idx) => ({ idx, it, en, tip }));
  if (hasContext(verb.infinitive)) {
    return contextFor(verb).map((c, idx) => ({ idx, it: fill(c.it, verb.forms[idx] ?? ""), en: c.en, tip: c.tip }));
  }
  return verb.examples.map((e) => {
    const idx = Math.max(0, verb.forms.findIndex((f) => e.it.toLowerCase().includes(f)));
    return { idx, it: e.it, en: e.en };
  });
}

export function hasFullBuilder(infinitive: string) {
  return !!B[infinitive]?.length || hasContext(infinitive);
}

export type Trap = { tile: string; why: string };
const BE_IT = ["sono", "sei", "è", "siamo", "siete", "sono"];
const PRON = ["io", "tu", "lui", "noi", "voi", "loro"];
const FOR_TRAP: Record<string, [string, string]> = {
  cercare: ["per", "'Cercare' already means 'to look for' — never add 'per'."],
  aspettare: ["per", "'Aspettare' already means 'to wait for' — never add 'per'."],
  pagare: ["per", "'Pagare' already includes 'for': pago la cena = I pay for dinner."],
  guardare: ["a", "'Guardare' takes the thing directly: guardo la TV — no 'a'."],
  ascoltare: ["a", "'Ascoltare' already means 'listen to' — no 'a'."],
  chiedere: ["per", "'Chiedere' already means 'ask for': chiedo il conto."],
  telefonare: ["chiamare", "Telefonare a… is already 'to phone' — no second verb."],
};
const strip = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "");

/** Two tiles the learner must reject: a wrong form of the same verb, and an English-thinking trap. */
export function trapsFor(verb: Verb, item: BuildItem): Trap[] {
  const words = new Set(strip(item.it).split(/\s+/));
  const right = verb.forms[item.idx] ?? "";
  const out: Trap[] = [];
  for (const k of [1, 2, 0, 3, 5]) {
    const f = verb.forms[(item.idx + k) % 6];
    if (k && f && f !== right && !words.has(f)) { out.push({ tile: f, why: `'${f}' is the ${PRON[(item.idx + k) % 6]} form — this sentence needs '${right}' (${PRON[item.idx]}).` }); break; }
  }
  const ft = FOR_TRAP[verb.infinitive];
  const ing = /\b(am|is|are|'m|'re|'s)\b [a-z]+ing\b/i.test(item.en) && !["essere", "stare"].includes(verb.infinitive);
  if (ft && !words.has(ft[0])) out.push({ tile: ft[0], why: ft[1] });
  else if (ing && !words.has(BE_IT[item.idx]!)) out.push({ tile: BE_IT[item.idx]!, why: `No 'to be' here: '${right}' already means '${item.en.match(/\b(am|is|are|'m|'re|'s) [a-z]+ing/i)?.[0] ?? "is doing"}'.` });
  else if (!words.has(PRON[item.idx]!)) out.push({ tile: PRON[item.idx]!, why: `Italians drop '${PRON[item.idx]}' — the ending of '${right}' already says who.` });
  return out;
}

const PROPER = /^(Marco|Anna|Luca|Giulia|Paola|Sara|Marta|Paolo|Roma|Milano|Napoli|Firenze|Ciao|Come)$/;
/** Lowercase the first block for the tile bank unless it starts with a name. */
export function tileCase(b: string) {
  return PROPER.test(b.split(" ")[0]!) ? b : b.charAt(0).toLowerCase() + b.slice(1);
}
export const normalizeIt = (s: string) => strip(s).replace(/[’`]/g, "'").replace(/\s+/g, " ").trim();
