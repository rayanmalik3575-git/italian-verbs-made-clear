import type { Verb } from "./verbs";
import { REPLY, REPLY_IDX } from "./verb-replies";

/**
 * Reflex training data for verbs: how the verb is built (blueprint),
 * question → answer "ping-pong" rounds, and the everyday chunks natives use.
 */

export type Blueprint = { stem: string; idea: string; singular: string; plural: string };
export type Round = { q: string; qEn: string; a: string; aEn: string; idx: number; why: string };
export type Chunk = { it: string; en: string };

// What each ending tells your ear, in PRONOUNS order.
export const EAR: { end: string; who: string }[] = [
  { end: "-o", who: "me (I)" },
  { end: "-i", who: "you, one friend" },
  { end: "-a / -e", who: "he, she, or formal you" },
  { end: "-iamo", who: "us (we)" },
  { end: "-ate / -ete / -ite", who: "you all" },
  { end: "-ano / -ono", who: "them (they)" },
];

const IRR: Record<string, Omit<Blueprint, "singular" | "plural"> & { singular?: string; plural?: string }> = {
  essere: { stem: "s- / e-", idea: "The most used verb, so it wore down over centuries. Learn it as sound, not rules: sono, sei, è all start short. Notice sono is both 'I am' and 'they are' — context tells you which." },
  avere: { stem: "h- (silent)", idea: "The h is never pronounced: ho = 'o', hai = 'ai', ha = 'a'. It's only there in writing to tell ho (I have) apart from o (or). Noi and voi go back to the full stem: abbiamo, avete." },
  stare: { stem: "st-", idea: "Works almost like a regular -are verb (sto, stai, sta). Use it for how you are (sto bene) and for 'right now' actions: sto mangiando = I'm eating." },
  fare: { stem: "fac- (from Latin facere)", idea: "The hidden stem is fac-. Once you see it, faccio and facciamo stop looking random. Fai, fa, fate, fanno are just the short, worn-down forms." },
  andare: { stem: "vad- / and-", idea: "Two stems in one verb. The forms you say about one person or 'they' use vad- (vado, vai, va, vanno). Noi and voi keep the infinitive: andiamo, andate." },
  venire: { stem: "veng- / vien- / ven-", idea: "Io and loro add a g (vengo, vengono). Tu and lui stretch the e into ie (vieni, viene). Noi and voi stay plain: veniamo, venite." },
  dire: { stem: "dic- (from Latin dicere)", idea: "Like fare, the real stem is hidden: dic-. That's why you get dico, diciamo, dicono. Only voi uses the short form: dite." },
  potere: { stem: "poss- / puo- / pot-", idea: "Posso and possono share 'poss-'. Puoi and può are short. Noi and voi are regular: possiamo, potete." },
  volere: { stem: "vogli- / vuo- / vol-", idea: "Voglio and vogliono share the 'gli' sound. Vuoi and vuole stretch o into uo. Noi and voi stay regular: vogliamo, volete." },
  dovere: { stem: "dev- / dobb- / dov-", idea: "Devo, devi, deve, devono use dev-. Noi is the odd one: dobbiamo. Voi stays regular: dovete." },
  sapere: { stem: "s- / sapp- / sap-", idea: "Very short in the singular: so, sai, sa. Noi becomes sappiamo. Remember 'Non lo so' — I don't know — you'll say it every day." },
  uscire: { stem: "esc- / usc-", idea: "When the stress falls on the first syllable the u turns into e: esco, esci, esce, escono. Noi and voi keep u: usciamo, uscite." },
  dare: { stem: "d-", idea: "Tiny forms: do, dai, dà, diamo, date, danno. The accent on dà (gives) separates it from da (from)." },
  bere: { stem: "bev- (from Latin bibere)", idea: "The stem is bev-, and then it's completely regular: bevo, bevi, beve, beviamo, bevete, bevono." },
  tenere: { stem: "teng- / tien- / ten-", idea: "Same pattern as venire: tengo/tengono with g, tieni/tiene with ie, teniamo/tenete plain." },
  rimanere: { stem: "rimang- / riman-", idea: "Io and loro add g: rimango, rimangono. Everything else is regular." },
};

export function blueprintOf(v: Verb): Blueprint {
  const f = v.forms;
  const singular = `${f[0]}, ${f[1]}, ${f[2]}`;
  const plural = `${f[3]}, ${f[4]}, ${f[5]}`;
  const hand = IRR[v.infinitive];
  if (hand) return { singular, plural, ...hand };
  const stem = v.infinitive.slice(0, -3);
  if (v.type === "irregular") {
    return { stem: `${stem}-`, singular, plural, idea: "This verb changes its stem. Say the six forms out loud twice: the singular group, then the plural group. Your ear learns the pattern faster than your eyes." };
  }
  const isc = (f[0] ?? "").endsWith("isco");
  return {
    stem: `${stem}-`,
    singular,
    plural,
    idea: isc
      ? `Keep "${stem}-", but io, tu, lui/lei and loro slip in -isc- (${f[0]}, ${f[5]}). Noi and voi don't: ${f[3]}, ${f[4]}.`
      : `Keep "${stem}-" and only the ending changes. The ending alone tells everyone who is doing it, so Italians drop io, tu, lui.`,
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Hand-made rounds: [question, question EN, answer with _, answer EN, form index, why]
type R = [string, string, string, string, number, string];
const ROUNDS: Record<string, R[]> = {
  essere: [
    ["Di dove sei?", "Where are you from?", "_ di Milano.", "I'm from Milan.", 0, "Asked with sei (you) → answer with sono (I)."],
    ["Siete italiani?", "Are you all Italian?", "Sì, _ italiani.", "Yes, we're Italian.", 3, "Siete (you all) → siamo (we)."],
    ["Sono a casa?", "Are they home?", "No, _ al lavoro.", "No, they're at work.", 5, "Same form: sono also means 'they are'."],
    ["Sono stanco.", "I'm tired.", "Anche tu _ stanco?", "Are you tired too?", 1, "Turning it back to a friend: sei."],
    ["Dov'è Marco?", "Where is Marco?", "_ in bagno.", "He's in the bathroom.", 2, "Lui → è, the same form you heard."],
    ["Siamo in ritardo?", "Are we late?", "Sì, ragazzi, _ in ritardo!", "Yes, guys, you're late!", 4, "Talking to the group: siete."],
  ],
  avere: [
    ["Hai un minuto?", "Have you got a minute?", "Sì, _ tempo, dimmi!", "Yes, I have time, tell me!", 0, "Hai → ho. The h is silent."],
    ["Quanti anni hai?", "How old are you?", "_ venticinque anni.", "I'm twenty-five.", 0, "Age uses avere: ho … anni."],
    ["Avete una prenotazione?", "Do you have a booking?", "Sì, _ un tavolo per due.", "Yes, we have a table for two.", 3, "Avete → abbiamo."],
    ["Anna ha un cane?", "Does Anna have a dog?", "Sì, _ un cane piccolo.", "Yes, she has a small dog.", 2, "Lei → ha (h is silent)."],
    ["Ho sete.", "I'm thirsty.", "Anche tu _ sete?", "Are you thirsty too?", 1, "Back to a friend: hai."],
    ["I tuoi amici hanno tempo?", "Do your friends have time?", "No, non _ tempo.", "No, they don't have time.", 5, "Loro → hanno."],
  ],
  fare: [
    ["Cosa fai stasera?", "What are you doing tonight?", "Stasera _ una pizza.", "Tonight I'm making pizza.", 0, "Fai → faccio (the fac- stem)."],
    ["Che lavoro fai?", "What do you do for work?", "_ l'insegnante.", "I'm a teacher.", 0, "Jobs use fare: faccio l'insegnante."],
    ["Cosa fate domenica?", "What are you all doing on Sunday?", "_ una gita al lago.", "We're taking a trip to the lake.", 3, "Fate → facciamo."],
    ["Che tempo fa?", "What's the weather like?", "_ freddo oggi.", "It's cold today.", 2, "Weather is always fa: fa freddo, fa caldo."],
    ["Faccio un caffè.", "I'm making a coffee.", "Ne _ uno anche per me?", "Will you make one for me too?", 1, "Back to a friend: fai."],
    ["I bambini fanno i compiti?", "Are the kids doing homework?", "Sì, _ i compiti adesso.", "Yes, they're doing homework now.", 5, "Loro → fanno."],
  ],
  andare: [
    ["Dove vai?", "Where are you going?", "_ al supermercato.", "I'm going to the supermarket.", 0, "Vai → vado (vad- stem)."],
    ["Come va?", "How's it going?", "_ bene, grazie!", "It's going well, thanks!", 2, "Va = it goes. 'Va bene' also means OK."],
    ["Andate al mare?", "Are you all going to the sea?", "Sì, _ al mare domani.", "Yes, we're going tomorrow.", 3, "Andate → andiamo (infinitive stem)."],
    ["Io vado a piedi.", "I'm walking.", "E tu, come _?", "And you, how are you going?", 1, "Back to a friend: vai."],
    ["Marco e Sara vanno via?", "Are Marco and Sara leaving?", "Sì, _ via presto.", "Yes, they're leaving early.", 5, "Loro → vanno."],
    ["Andiamo al cinema!", "Let's go to the cinema!", "_ anche voi?", "Are you all coming too?", 4, "To the group: andate."],
  ],
  stare: [
    ["Come stai?", "How are you?", "_ bene, grazie.", "I'm fine, thanks.", 0, "Stai → sto."],
    ["Come state?", "How are you all?", "_ benissimo!", "We're great!", 3, "State → stiamo."],
    ["Come sta tua madre?", "How's your mother?", "_ meglio, grazie.", "She's better, thanks.", 2, "Lei → sta."],
    ["Sto bene, e tu?", "I'm fine, and you?", "Come _ oggi?", "How are you today?", 1, "Back to a friend: stai."],
    ["Cosa fanno i bambini?", "What are the kids doing?", "_ dormendo.", "They're sleeping.", 5, "stare + -endo = right now: stanno dormendo."],
    ["Stiamo arrivando!", "We're on our way!", "Dove _ andando, ragazzi?", "Where are you going, guys?", 4, "To the group: state."],
  ],
  volere: [
    ["Cosa vuoi?", "What do you want?", "_ un gelato.", "I want an ice cream.", 0, "Vuoi → voglio."],
    ["Volete un caffè?", "Do you all want a coffee?", "Sì, _ due caffè.", "Yes, we want two coffees.", 3, "Volete → vogliamo."],
    ["Voglio uscire.", "I want to go out.", "Anche tu _ uscire?", "Do you want to go out too?", 1, "Back to a friend: vuoi."],
    ["Luca vuole venire?", "Does Luca want to come?", "No, non _ venire.", "No, he doesn't want to come.", 2, "Lui → vuole."],
    ["Cosa vogliono i clienti?", "What do the customers want?", "_ il conto.", "They want the bill.", 5, "Loro → vogliono."],
    ["Vogliamo partire.", "We want to leave.", "Quando _ partire?", "When do you all want to leave?", 4, "To the group: volete."],
  ],
  potere: [
    ["Puoi aiutarmi?", "Can you help me?", "Sì, certo, _ aiutarti.", "Yes, of course, I can help you.", 0, "Puoi → posso."],
    ["Potete venire sabato?", "Can you all come Saturday?", "Sì, _ venire.", "Yes, we can come.", 3, "Potete → possiamo."],
    ["Posso entrare?", "May I come in?", "Sì, _ entrare.", "Yes, you may come in.", 1, "Back to the person: puoi."],
    ["Il dottore può vedermi?", "Can the doctor see me?", "Sì, _ vederla alle tre.", "Yes, he can see you at three.", 2, "Lui → può."],
    ["I ragazzi possono restare?", "Can the kids stay?", "No, non _ restare.", "No, they can't stay.", 5, "Loro → possono."],
    ["Possiamo pagare con la carta?", "Can we pay by card?", "Sì, _ pagare con la carta.", "Yes, you all can pay by card.", 4, "To the group: potete."],
  ],
  abitare: [
    ["Dove abiti?", "Where do you live?", "_ a Roma, in centro.", "I live in Rome, downtown.", 0, "Abiti → abito. Swap -i for -o."],
    ["Abitate insieme?", "Do you two live together?", "Sì, _ insieme da un anno.", "Yes, we've lived together for a year.", 3, "Abitate → abitiamo."],
    ["Dove abita tuo fratello?", "Where does your brother live?", "_ a Milano.", "He lives in Milan.", 2, "Lui → abita."],
    ["Io abito a Firenze.", "I live in Florence.", "Ah sì? E in che zona _?", "Oh really? And which area do you live in?", 1, "Back to the person: abiti."],
    ["I tuoi genitori abitano qui?", "Do your parents live here?", "No, _ a Napoli.", "No, they live in Naples.", 5, "Loro → abitano."],
    ["Abitiamo vicino all'università.", "We live near the university.", "Ragazzi, anche voi _ lì?", "Guys, do you live there too?", 4, "To the group: abitate."],
  ],
  studiare: [
    ["Cosa studi all'università?", "What are you studying at university?", "_ economia a Bologna.", "I study economics in Bologna.", 0, "Studi → studio."],
    ["Ragazzi, cosa fate stasera?", "Guys, what are you doing tonight?", "_ per l'esame di domani.", "We're studying for tomorrow's exam.", 3, "Group of you → studiamo."],
    ["Dove studia Marco?", "Where does Marco study?", "_ sempre in biblioteca.", "He always studies in the library.", 2, "Lui → studia."],
    ["Studio medicina a Padova.", "I study medicine in Padua.", "Davvero? E da quanto _ lì?", "Really? And how long have you been studying there?", 1, "Back to the person: studi."],
    ["Le tue sorelle studiano?", "Do your sisters study?", "Sì, _ e lavorano.", "Yes, they study and work.", 5, "Loro → studiano."],
    ["Studiamo insieme stasera.", "We're studying together tonight.", "Ah sì? A che ora _?", "Oh yes? What time are you all studying?", 4, "To the group: studiate."],
  ],
  parlare: [
    ["Parli italiano?", "Do you speak Italian?", "Sì, _ un po' di italiano.", "Yes, I speak a little Italian.", 0, "Parli → parlo. Just swap -i for -o."],
    ["Parlate inglese?", "Do you all speak English?", "Sì, _ inglese.", "Yes, we speak English.", 3, "Parlate → parliamo."],
    ["Parlo troppo veloce?", "Am I speaking too fast?", "Sì, _ un po' veloce.", "Yes, you speak a bit fast.", 1, "Back to the person: parli."],
    ["Il cameriere parla inglese?", "Does the waiter speak English?", "Sì, _ inglese bene.", "Yes, he speaks English well.", 2, "Lui → parla."],
    ["I tuoi genitori parlano italiano?", "Do your parents speak Italian?", "No, _ solo spagnolo.", "No, they speak only Spanish.", 5, "Loro → parlano."],
    ["Parliamo dopo?", "Shall we talk later?", "Di cosa _, ragazzi?", "What are you talking about, guys?", 4, "To the group: parlate."],
  ],
};


export function roundsFor(v: Verb): Round[] {
  const hand = ROUNDS[v.infinitive];
  if (hand) return hand.slice(0, 4).map(([q, qEn, a, aEn, idx, why]) => ({ q, qEn, a, aEn, idx, why }));
  const r = REPLY[v.infinitive];
  if (!r) return [];
  return r.map((line, k) => {
    const [q = "", qEn = "", a = "", aEn = "", own] = line.split("|");
    const idx = own ? Number(own) : REPLY_IDX[k]!;
    const f = v.forms;
    const why = k === 0 ? `Asked with ${f[1]} (you) → answer ${f[0]} (I).` : k === 1 ? `Asked the group (${f[4]}) → answer for all of you: ${f[3]}.` : k === 2 || idx === 2 ? `About that person or thing → ${f[2]}.` : `Saying no: non goes right before ${f[0]}.`;
    return { q, qEn, a, aEn, idx, why };
  });
}

const CHUNKS: Record<string, Chunk[]> = {
  essere: [{ it: "sono di…", en: "I'm from… (city)" }, { it: "è vero", en: "it's true" }, { it: "è tardi", en: "it's late" }, { it: "sono d'accordo", en: "I agree" }, { it: "che ore sono?", en: "what time is it?" }],
  avere: [{ it: "avere fame / sete", en: "to be hungry / thirsty" }, { it: "avere … anni", en: "to be … years old" }, { it: "avere fretta", en: "to be in a hurry" }, { it: "avere ragione", en: "to be right" }, { it: "avere bisogno di", en: "to need" }],
  fare: [{ it: "fare colazione", en: "to have breakfast" }, { it: "fare la spesa", en: "to do grocery shopping" }, { it: "fare una doccia", en: "to take a shower" }, { it: "fare una passeggiata", en: "to go for a walk" }, { it: "fa caldo / freddo", en: "it's hot / cold" }],
  andare: [{ it: "va bene", en: "OK, fine" }, { it: "come va?", en: "how's it going?" }, { it: "andare a piedi", en: "to walk somewhere" }, { it: "andare via", en: "to leave" }, { it: "andiamo!", en: "let's go!" }],
  stare: [{ it: "sto bene", en: "I'm fine" }, { it: "stare zitto", en: "to be quiet" }, { it: "stare a casa", en: "to stay home" }, { it: "sto per…", en: "I'm about to…" }, { it: "sto mangiando", en: "I'm eating (right now)" }],
  volere: [{ it: "vorrei…", en: "I'd like… (polite)" }, { it: "voler dire", en: "to mean" }, { it: "cosa vuol dire?", en: "what does it mean?" }, { it: "ci vuole tempo", en: "it takes time" }],
  potere: [{ it: "posso?", en: "may I?" }, { it: "si può…?", en: "can one…? / is it allowed?" }, { it: "non ne posso più", en: "I can't take it anymore" }],
  sapere: [{ it: "non lo so", en: "I don't know" }, { it: "sai che…?", en: "do you know that…?" }, { it: "sapere di", en: "to taste of" }],
  parlare: [{ it: "parlare di", en: "to talk about" }, { it: "parlare con", en: "to talk to/with" }, { it: "parla più piano", en: "speak more slowly" }],
  dire: [{ it: "dimmi", en: "tell me" }, { it: "come si dice…?", en: "how do you say…?" }, { it: "dire di sì / di no", en: "to say yes / no" }],
  dare: [{ it: "dare una mano", en: "to give a hand" }, { it: "dare fastidio", en: "to bother" }, { it: "dare del tu", en: "to speak informally to someone" }],
  prendere: [{ it: "prendere un caffè", en: "to have a coffee" }, { it: "prendere il treno", en: "to take the train" }, { it: "prendo questo", en: "I'll take this one" }],
};

export function chunksFor(v: Verb): Chunk[] {
  return CHUNKS[v.infinitive] ?? v.examples;
}

export const fillBlank = (frame: string, form: string) =>
  frame.startsWith("_") ? frame.replace("_", cap(form)) : frame.replace("_", form);

const STATIVE = new Set(["be", "am", "have", "know", "can", "must", "want", "love", "understand", "remember", "prefer", "believe", "cost", "hope", "stay", "think"]);
const BE = ["I am", "you are", "he/she is", "we are", "you all are", "they are"];
const ing = (w: string) =>
  w === "die" ? "dying" : w.endsWith("ie") ? w.slice(0, -2) + "ying" : /[^aeiou]e$/.test(w) && w !== "be" ? w.slice(0, -1) + "ing" : /^(run|swim|get|win|sit|stop|shop|put|begin|forget)$/.test(w) ? w + w.slice(-1) + "ing" : w + "ing";

/** "you look for / you are looking for" — Italian present covers both. Undefined for stative verbs. */
export function continuousOf(v: Verb, i: number): string | undefined {
  const base = (v.en[0] ?? "").replace(/^I /, "");
  const [head, ...rest] = base.split(" ");
  if (!head || STATIVE.has(head)) return undefined;
  return `${v.en[i]} / ${BE[i]} ${[ing(head), ...rest].join(" ")}`;
}

/** One-line reminder for -care / -gare verbs, shown in the hint bar. */
export function hardSoundTip(v: Verb): string | undefined {
  if (!/[cg]are$/.test(v.infinitive)) return undefined;
  const k = v.infinitive.slice(-4, -3) === "c" ? "K" : "G";
  return `Watch out: 'tu ${v.forms[1]}' needs an H to keep the hard ${k} sound, but 'io ${v.forms[0]}' drops the H!`;
}

/** -care / -gare verbs need an h before -i / -iamo. Returns a note for tu & noi. */
export function spellingNote(v: Verb, i: number): string | undefined {
  if (!/[cg]are$/.test(v.infinitive) || (i !== 1 && i !== 3)) return undefined;
  return `Spelling note: add 'h' before -i or -iamo (${v.forms[1]} / ${v.forms[3]}) to keep the hard ${v.infinitive.slice(-4, -3).toUpperCase()} sound — but no 'h' for io ${v.forms[0]}.`;
}
