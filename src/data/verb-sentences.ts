import { PRONOUNS, type Verb } from "./verbs";

/** One in-context practice item. `it` contains "_" where the verb form goes. */
export type ContextItem = { situation: string; it: string; en: string; tip?: string | undefined };

// Situations per person, used to train "the ending tells you who" without saying the pronoun.
export const WHO: string[] = [
  "Talking about yourself",
  "Talking to one friend",
  "Talking about one other person",
  "Talking about you + others",
  "Talking to a group",
  "Talking about other people",
];

type Row = [string, string, string?]; // [italian with _, english, tip]
const S: Record<string, Row[]> = {
  essere: [
    ["Ciao, _ Luca, piacere!", "Hi, I'm Luca, nice to meet you!", "No 'io' needed — 'sono' already means 'I am'."],
    ["Di dove _?", "Where are you from?", "Italians just ask 'Di dove sei?' — the ending -i means 'you'."],
    ["Marta _ molto simpatica.", "Marta is very nice."],
    ["_ in ritardo, scusa!", "We're late, sorry!"],
    ["Ragazzi, _ pronti?", "Guys, are you ready?"],
    ["I miei genitori _ a casa.", "My parents are at home."],
  ],
  avere: [
    ["_ fame, mangiamo?", "I'm hungry, shall we eat?", "Hunger is something you HAVE in Italian: ho fame."],
    ["Quanti anni _?", "How old are you?", "Age uses avere: literally 'how many years do you have?'"],
    ["Paolo _ due fratelli.", "Paolo has two brothers."],
    ["_ una domanda.", "We have a question."],
    ["_ sete? C'è dell'acqua.", "Are you all thirsty? There's water.", "Thirst also uses avere: avere sete."],
    ["_ una casa al mare.", "They have a house by the sea."],
  ],
  stare: [
    ["_ bene, grazie!", "I'm fine, thanks!", "Health and mood use stare, not essere."],
    ["Ciao Marco, come _?", "Hi Marco, how are you?"],
    ["La nonna _ a casa oggi.", "Grandma is staying home today."],
    ["_ arrivando!", "We're on our way!", "stare + -ando/-endo = 'right now, in progress'."],
    ["Come _, ragazzi?", "How are you, guys?"],
    ["I bambini _ dormendo.", "The kids are sleeping."],
  ],
  fare: [
    ["_ colazione alle otto.", "I have breakfast at eight.", "'Fare colazione' = to have breakfast."],
    ["Che lavoro _?", "What do you do for a living?"],
    ["Oggi _ caldo.", "It's hot today.", "Weather uses fare: fa caldo, fa freddo."],
    ["_ una passeggiata?", "Shall we go for a walk?"],
    ["Cosa _ stasera?", "What are you all doing tonight?"],
    ["_ la spesa il sabato.", "They do the grocery shopping on Saturdays."],
  ],
  andare: [
    ["_ al lavoro in bici.", "I go to work by bike."],
    ["Dove _ in vacanza?", "Where are you going on holiday?"],
    ["Tutto _ bene.", "Everything is going well."],
    ["_ al cinema stasera.", "We're going to the cinema tonight."],
    ["_ già via?", "Are you all leaving already?"],
    ["_ a scuola a piedi.", "They walk to school."],
  ],
  venire: [
    ["_ dall'India.", "I come from India."],
    ["_ alla festa sabato?", "Are you coming to the party on Saturday?"],
    ["L'autobus _ ogni dieci minuti.", "The bus comes every ten minutes."],
    ["_ subito!", "We're coming right away!"],
    ["_ con noi?", "Are you all coming with us?"],
    ["Gli amici _ a cena.", "Friends are coming to dinner."],
  ],
  volere: [
    ["_ un caffè, per favore.", "I'd like a coffee, please."],
    ["_ venire con me?", "Do you want to come with me?"],
    ["Anna _ imparare l'italiano.", "Anna wants to learn Italian."],
    ["_ andare in Italia.", "We want to go to Italy."],
    ["Cosa _ mangiare?", "What do you all want to eat?"],
    ["_ una pizza.", "They want a pizza."],
  ],
  potere: [
    ["_ entrare?", "May I come in?"],
    ["_ ripetere, per favore?", "Can you repeat, please?"],
    ["Non _ venire oggi.", "He/She can't come today."],
    ["_ pagare con la carta?", "Can we pay by card?"],
    ["_ sedervi qui.", "You can all sit here."],
    ["Non _ parlare adesso.", "They can't talk right now."],
  ],
  dovere: [
    ["_ andare, ciao!", "I have to go, bye!"],
    ["_ provare il tiramisù!", "You must try the tiramisu!"],
    ["Luca _ lavorare domani.", "Luca has to work tomorrow."],
    ["_ partire presto.", "We have to leave early."],
    ["_ studiare di più.", "You all need to study more."],
    ["_ prendere il treno.", "They have to catch the train."],
  ],
  sapere: [
    ["Non lo _.", "I don't know.", "Very common reply: 'Non lo so.'"],
    ["_ dov'è la stazione?", "Do you know where the station is?"],
    ["Maria _ cucinare benissimo.", "Maria can cook really well.", "sapere + verb = to know how to."],
    ["Non _ cosa fare.", "We don't know what to do."],
    ["_ nuotare?", "Do you all know how to swim?"],
    ["_ parlare tre lingue.", "They can speak three languages."],
  ],
  parlare: [
    ["_ un po' d'italiano.", "I speak a little Italian."],
    ["_ inglese?", "Do you speak English?"],
    ["Il professore _ piano.", "The teacher speaks slowly."],
    ["_ di tutto.", "We talk about everything."],
    ["_ troppo veloce!", "You all speak too fast!"],
    ["_ al telefono.", "They're talking on the phone."],
  ],
  capire: [
    ["Scusi, non _.", "Sorry, I don't understand."],
    ["_ quello che dico?", "Do you understand what I'm saying?"],
    ["Lei _ tutto.", "She understands everything."],
    ["_ benissimo.", "We understand perfectly."],
    ["_ la domanda?", "Do you all understand the question?"],
    ["Non _ il problema.", "They don't understand the problem."],
  ],
  mangiare: [
    ["_ sempre la frutta.", "I always eat fruit."],
    ["Cosa _ a pranzo?", "What do you eat for lunch?"],
    ["Il gatto _ tanto.", "The cat eats a lot."],
    ["Stasera _ fuori.", "Tonight we're eating out."],
    ["_ con noi?", "Are you all eating with us?"],
    ["In Italia _ tardi.", "In Italy they eat late."],
  ],
  bere: [
    ["_ un bicchiere d'acqua.", "I'm drinking a glass of water."],
    ["Cosa _?", "What are you drinking?"],
    ["Papà _ il caffè senza zucchero.", "Dad drinks coffee without sugar."],
    ["_ qualcosa insieme?", "Shall we have a drink together?"],
    ["_ vino rosso?", "Do you all drink red wine?"],
    ["_ troppo caffè.", "They drink too much coffee."],
  ],
  prendere: [
    ["_ un cappuccino.", "I'll have a cappuccino.", "At a bar, 'prendo' = 'I'll have'."],
    ["Cosa _?", "What will you have?"],
    ["Giulia _ l'autobus.", "Giulia takes the bus."],
    ["_ un taxi?", "Shall we take a taxi?"],
    ["_ il dolce?", "Will you all have dessert?"],
    ["_ il treno delle nove.", "They're taking the nine o'clock train."],
  ],
  abitare: [
    ["_ a Milano.", "I live in Milan."],
    ["Dove _?", "Where do you live?"],
    ["Mia sorella _ a Londra.", "My sister lives in London."],
    ["_ vicino al centro.", "We live near the centre."],
    ["_ in campagna?", "Do you all live in the countryside?"],
    ["_ al terzo piano.", "They live on the third floor."],
  ],
  lavorare: [
    ["_ in un ufficio.", "I work in an office."],
    ["Dove _?", "Where do you work?"],
    ["Marco _ in banca.", "Marco works at a bank."],
    ["_ insieme.", "We work together."],
    ["_ anche il sabato?", "Do you all work on Saturdays too?"],
    ["_ da casa.", "They work from home."],
  ],
  studiare: [
    ["_ italiano ogni giorno.", "I study Italian every day."],
    ["Cosa _ all'università?", "What do you study at university?"],
    ["Lei _ medicina.", "She studies medicine."],
    ["_ per l'esame.", "We're studying for the exam."],
    ["_ in biblioteca?", "Do you all study in the library?"],
    ["_ la sera.", "They study in the evening."],
  ],
  chiamare: [
    ["Ti _ dopo.", "I'll call you later."],
    ["Mi _ domani?", "Will you call me tomorrow?"],
    ["Il capo _ ogni mattina.", "The boss calls every morning."],
    ["_ un taxi.", "We'll call a taxi."],
    ["_ la mamma?", "Are you all calling mum?"],
    ["Ci _ stasera.", "They're calling us tonight."],
  ],
  dormire: [
    ["_ otto ore.", "I sleep eight hours."],
    ["_ bene?", "Do you sleep well?"],
    ["Il bambino _.", "The baby is sleeping."],
    ["Stanotte _ in albergo.", "Tonight we're sleeping in a hotel."],
    ["_ troppo poco!", "You all sleep too little!"],
    ["_ fino a tardi.", "They sleep in late."],
  ],
};

/** Six in-context items for a verb, in PRONOUNS order. Falls back to a situational prompt. */
export function contextFor(verb: Verb): ContextItem[] {
  const rows = S[verb.infinitive];
  return PRONOUNS.map((_, i) => {
    const r = rows?.[i];
    if (r) return { situation: WHO[i]!, it: r[0], en: r[1], tip: r[2] };
    return { situation: WHO[i]!, it: "_.", en: capital(verb.en[i] ?? "") + ".", tip: undefined };
  });
}

export function hasContext(infinitive: string) {
  return infinitive in S;
}

function capital(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Fill the blank, capitalising if the sentence starts with it. */
export function fill(it: string, form: string) {
  const idx = it.indexOf("_");
  const f = idx === 0 ? capital(form) : form;
  return it.replace("_", f);
}
