// Original Parlami lesson: greetings, goodbyes and polite replies.

export type Register = "formal" | "neutral" | "casual";

export interface Phrase {
  it: string;
  en: string;
  say: string; // simple sound guide
  literal?: string;
  when: string;
  register: Register;
  watch?: string; // pronunciation or culture trap
}

export interface PhraseGroup {
  id: string;
  title: string;
  intro: string;
  phrases: Phrase[];
}

export const GROUPS: PhraseGroup[] = [
  {
    id: "arrive",
    title: "Arriving: saying hello",
    intro: "What you say when you walk in or meet someone. The time of day decides the word.",
    phrases: [
      { it: "Buongiorno", en: "Good morning / Good day", say: "bwon-JOR-no", literal: "good day", register: "neutral",
        when: "From morning until mid or late afternoon, when you arrive or pass someone.",
        watch: "Say both vowels: bu-on, not 'bon'. 'Gio' is like the English 'jo' in 'jog', never a French 'zh'. In quick speech people often just say 'Giorno!'" },
      { it: "Buon pomeriggio", en: "Good afternoon", say: "bwon po-meh-REED-jo", register: "neutral",
        when: "Correct, but not used much. Most Italians keep saying buongiorno until evening.",
        watch: "Double G gives a stronger 'j' sound." },
      { it: "Buonasera", en: "Good evening", say: "bwo-na-SEH-ra", literal: "good evening", register: "neutral",
        when: "From late afternoon on. Use the full form when meeting someone properly.",
        watch: "When popping into a busy shop or café, people shorten it to a quick 'Sera!'" },
      { it: "Ciao", en: "Hi / Bye", say: "chow", register: "casual",
        when: "Only with friends, family, children (and pets). Not with shop staff or strangers.",
        watch: "Using ciao with someone you don't know can sound too familiar." },
    ],
  },
  {
    id: "leave",
    title: "Leaving: wishing people well",
    intro: "Italians often say goodbye by wishing you a good rest of the day or evening.",
    phrases: [
      { it: "Buona giornata", en: "Have a good day", say: "BWO-na jor-NA-ta", register: "neutral",
        when: "When you leave during the day. Buongiorno is for arriving; buona giornata is for leaving.",
        watch: "A very natural, easy alternative to arrivederci." },
      { it: "Buona serata", en: "Have a good evening", say: "BWO-na seh-RA-ta", register: "neutral",
        when: "When you leave in the evening: a restaurant, a shop, a dinner with friends." },
      { it: "Buonanotte", en: "Good night", say: "bwo-na-NOT-teh", register: "neutral",
        when: "Only when someone is actually going to bed.",
        watch: "Leaving a restaurant at 11pm? The staff are still working, so say buona serata, not buonanotte." },
    ],
  },
  {
    id: "bye",
    title: "Goodbye and see you",
    intro: "Most 'see you' phrases are a + a time: a presto, a domani. The 'a' means 'until'.",
    phrases: [
      { it: "Arrivederci", en: "Goodbye", say: "ar-ree-veh-DER-chee", literal: "until we see each other again", register: "neutral",
        when: "Any time you part from people, e.g. leaving a shop.",
        watch: "Roll the double R a little. The final -ci means 'each other'." },
      { it: "ArrivederLa", en: "Goodbye (formal, to one person)", say: "ar-ree-veh-DER-la", literal: "until I see You again", register: "formal",
        when: "Polite goodbye to one person you address as Lei: a doctor, a hotel receptionist.",
        watch: "The capital L shows it refers to formal Lei." },
      { it: "A presto", en: "See you soon", say: "a PRES-to", register: "neutral",
        when: "You expect to meet again, but don't know exactly when." },
      { it: "A più tardi", en: "See you later", say: "a pyoo TAR-dee", register: "neutral",
        when: "You'll see them again later today, e.g. your B&B host." },
      { it: "A domani", en: "See you tomorrow", say: "a do-MA-nee", register: "neutral",
        when: "You'll meet tomorrow. Works with days too: a martedì = see you Tuesday." },
      { it: "Ci vediamo", en: "See you (around)", say: "chee veh-DYA-mo", literal: "we see each other", register: "casual",
        when: "Friendly; good with people you see often, like your local barista. Skip it when being very formal." },
    ],
  },
  {
    id: "thanks",
    title: "Saying thank you",
    intro: "The most useful word in Italy. Say it fully.",
    phrases: [
      { it: "Grazie", en: "Thank you / Thanks", say: "GRAHT-tsyeh", register: "neutral",
        when: "Everywhere, all the time.",
        watch: "The final E is always there: GRA-tsye, never 'gra-tsee'. In fast speech it softens, but it's still said." },
      { it: "Grazie mille", en: "Thanks a lot", say: "GRAHT-tsyeh MEEL-leh", literal: "a thousand thanks", register: "neutral",
        when: "When you want to thank someone warmly." },
      { it: "Grazie a Lei", en: "Thank you (to you)", say: "GRAHT-tsyeh a lay", literal: "thanks to You", register: "formal",
        when: "To thank someone back after they thank you, politely." },
    ],
  },
  {
    id: "reply",
    title: "Answering 'grazie'",
    intro: "Prego is the standard answer, but Italians have several more. Mix them to sound natural.",
    phrases: [
      { it: "Prego", en: "You're welcome", say: "PREH-go", register: "neutral",
        when: "The standard reply to grazie. It does not mean 'welcome to my home'." },
      { it: "Altrettanto", en: "Same to you / Likewise", say: "al-tret-TAN-to", register: "neutral",
        when: "When someone wishes you something (buona serata!) or pays you a compliment." },
      { it: "Di niente", en: "It's nothing / No worries", say: "dee NYEN-teh", literal: "of nothing", register: "neutral",
        when: "Easy, friendly reply: there's nothing to thank me for." },
      { it: "Non c'è di che", en: "Don't mention it", say: "non cheh dee keh", literal: "there's no reason for which", register: "neutral",
        when: "Very common with natives, rarely heard from learners. Polite and warm." },
      { it: "Si figuri", en: "Not at all / Of course", say: "see fee-GOO-ree", literal: "don't even imagine it (formal)", register: "formal",
        when: "When you really helped someone (picked up something they dropped). Formal, so not with friends." },
    ],
  },
];

export interface Scenario {
  situation: string;
  options: string[];
  answer: string;
  why: string;
}

export const SCENARIOS: Scenario[] = [
  { situation: "You walk into a bakery at 9am.", options: ["Buongiorno", "Buonanotte", "Ciao"], answer: "Buongiorno",
    why: "Morning arrival with a stranger: buongiorno. Ciao is only for friends." },
  { situation: "You leave a restaurant at 11pm. What do you say to the waiter?", options: ["Buonanotte", "Buona serata", "Buongiorno"], answer: "Buona serata",
    why: "The staff aren't going to bed, so wish them a good evening: buona serata." },
  { situation: "You leave a shop at lunchtime and want to wish them well.", options: ["Buona giornata", "Buongiorno", "Buonasera"], answer: "Buona giornata",
    why: "Buongiorno is for arriving; buona giornata is for leaving during the day." },
  { situation: "Your host family is going to sleep.", options: ["Buona serata", "Buonanotte", "A presto"], answer: "Buonanotte",
    why: "Buonanotte is only for going to bed — exactly this case." },
  { situation: "Saying goodbye politely to the doctor (one person, Lei).", options: ["Ciao", "Ci vediamo", "ArrivederLa"], answer: "ArrivederLa",
    why: "ArrivederLa is the formal goodbye to one person." },
  { situation: "You'll see your B&B host again this evening.", options: ["A più tardi", "A domani", "Buonanotte"], answer: "A più tardi",
    why: "Later the same day: a più tardi." },
  { situation: "You pick up a lady's scarf. She says 'Grazie!'", options: ["Si figuri", "Altrettanto", "Ciao"], answer: "Si figuri",
    why: "You did a real favour for someone you address formally: si figuri." },
  { situation: "The waiter says 'Buona serata!' to you.", options: ["Prego", "Altrettanto", "Arrivederla"], answer: "Altrettanto",
    why: "Wishing the same back: altrettanto = same to you." },
  { situation: "A friend thanks you for a coffee. Reply casually.", options: ["Si figuri", "Di niente", "Buonasera"], answer: "Di niente",
    why: "Di niente is friendly. Si figuri is too formal for a friend." },
  { situation: "You'll meet your classmate again tomorrow.", options: ["A domani", "A presto", "Buonanotte"], answer: "A domani",
    why: "Domani = tomorrow, so a domani." },
];

export const isCorrectScenario = (s: Scenario, choice: string) => s.answer === choice;
