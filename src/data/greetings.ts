// Original Parlami lesson: greetings, goodbyes and polite replies.
// Text fields support **bold** markup for key words.

export type Register = "formal" | "neutral" | "casual";

export interface SceneLine { who: string; it: string; en: string }

export interface Phrase {
  it: string;
  en: string;
  syllables: string[]; // sound guide split into beats
  stress: number; // index of the stressed beat
  literal?: string;
  register: Register;
  hook: string; // one-line takeaway
  insight: string; // the "why" behind the habit
  shortcut?: { say: string; note: string }; // what natives actually say
  scene?: SceneLine[];
  trap?: string;
}

export interface PhraseGroup {
  id: string;
  title: string;
  intro: string;
  bigIdea: string;
  phrases: Phrase[];
}

export const GROUPS: PhraseGroup[] = [
  {
    id: "arrive",
    title: "Arriving: saying hello",
    intro: "What you say when you walk in or meet someone.",
    bigIdea: "In Italy, **walking into a shop in silence feels cold**. A greeting is how you say “I see you, I respect your space.” The **clock picks the word**, and the **relationship picks how formal** it is.",
    phrases: [
      { it: "Buongiorno", en: "Good morning / Good day", syllables: ["bwon", "JOR", "no"], stress: 1, literal: "good day", register: "neutral",
        hook: "Your safe, polite hello for **anyone**, from morning until after lunch.",
        insight: "Italians say it to the barista, the bus driver and the neighbour on the stairs. Notice where the **weight of the word falls: on “giorno” (day)**. “Buon” is said quickly, almost swallowed. That is exactly why, in fast daily speech, it disappears altogether.",
        shortcut: { say: "'Giorno!", note: "In everyday life many people **drop “buon” and just say “'Giorno!”**. The stressed part of the word survives and the unstressed start fades, the same way English “good morning” becomes just “morning!”. It's warm and friendly, not rude, but for a first meeting or an office, say the full word." },
        scene: [ { who: "You (entering a café)", it: "'Giorno! Un caffè, per favore.", en: "Morning! A coffee, please." }, { who: "Barista", it: "'Giorno! Subito.", en: "Morning! Right away." } ],
        trap: "Say **both vowels: bu-on**, not a flat “bon”. “Gio” sounds like **“jo” in “jog”**, never a soft French “zh”." },
      { it: "Buon pomeriggio", en: "Good afternoon", syllables: ["bwon", "po", "meh", "REED", "jo"], stress: 3, register: "neutral",
        hook: "Correct grammar, but **rarely heard** in real life.",
        insight: "Textbooks love it because English has “good afternoon”. Real Italians mostly **jump straight from buongiorno to buonasera**. The switch happens after lunch: around **2pm in much of the centre and south**, later in the north. You'll hear buon pomeriggio more from TV presenters and on formal phone lines.",
        trap: "Don't worry about it too much. **If in doubt after lunch, buonasera is never wrong.**" },
      { it: "Buonasera", en: "Good evening", syllables: ["bwo", "na", "SEH", "ra"], stress: 2, literal: "good evening", register: "neutral",
        hook: "Your hello from **mid-afternoon onwards**. It starts much earlier than English “good evening”.",
        insight: "To an English speaker, 4pm isn't evening, but to many Italians it is already “sera”. Arriving at a shop at 5pm with buonasera sounds **perfectly natural and well-mannered**.",
        shortcut: { say: "'Sera!", note: "Same pattern as 'Giorno: **the stressed part stays and the start drops**. You'll hear it when someone pops into a busy bar or shop." },
        scene: [ { who: "You (shop, 6pm)", it: "Buonasera!", en: "Good evening!" }, { who: "Shop owner", it: "Buonasera, mi dica.", en: "Good evening, how can I help?" } ] },
      { it: "Ciao", en: "Hi / Bye", syllables: ["CHOW"], stress: 0, register: "casual",
        hook: "Works for **hello and goodbye**, but **only with people you're close to**.",
        insight: "Ciao is for friends, family, children and people your age in relaxed settings. Saying ciao to an older shopkeeper is a bit like saying **“hey buddy” to a stranger**: not a disaster, but it shows you don't know the rules. **Let them say ciao first**, then you can too.",
        trap: "With strangers, staff or older people, **use buongiorno / buonasera instead**." },
    ],
  },
  {
    id: "leave",
    title: "Leaving: wishing people well",
    intro: "Italians often leave by wishing you a good rest of the day.",
    bigIdea: "One small letter changes everything. **-giorno / -sera are for arriving. -giornata / -serata are for leaving.** The longer word means “the whole stretch of day or evening still ahead of you”.",
    phrases: [
      { it: "Buona giornata", en: "Have a good day", syllables: ["BWO", "na", "jor", "NA", "ta"], stress: 3, register: "neutral",
        hook: "Said when you **leave** during the day. Buongiorno opens; buona giornata closes.",
        insight: "“Giornata” is the day **as something you live through**, with all its hours. So you're wishing them a good rest of it. This is often the **friendliest way to end any daytime exchange**, warmer than a plain goodbye.",
        scene: [ { who: "Pharmacist", it: "Ecco a Lei.", en: "Here you are." }, { who: "You (leaving)", it: "Grazie, buona giornata!", en: "Thanks, have a good day!" } ] },
      { it: "Buona serata", en: "Have a good evening", syllables: ["BWO", "na", "seh", "RA", "ta"], stress: 3, register: "neutral",
        hook: "**The** phrase for leaving a restaurant, a shop or a dinner in the evening.",
        insight: "Same logic: “serata” is **the evening still ahead**. This is what you should say to the waiter on your way out, even at midnight.",
        trap: "If someone wishes **you** buona serata, the perfect reply is **altrettanto** (same to you)." },
      { it: "Buonanotte", en: "Good night", syllables: ["bwo", "na", "NOT", "teh"], stress: 2, register: "neutral",
        hook: "**Only when someone is going to bed.**",
        insight: "Italian draws a sharp line: buonanotte means “**sleep well**”. Saying it to a waiter who still has three hours of work ahead sounds slightly odd, like telling them to go to sleep.",
        trap: "Leaving a restaurant at 11pm? **Buona serata, not buonanotte.**" },
    ],
  },
  {
    id: "bye",
    title: "Goodbye and see you",
    intro: "From formal goodbyes to “see you tomorrow”.",
    bigIdea: "Most “see you” phrases follow one pattern: **a + a time**. The little **“a” means “until”**, so a domani is literally “until tomorrow”. Learn the pattern once and you can make your own.",
    phrases: [
      { it: "Arrivederci", en: "Goodbye", syllables: ["ar", "ree", "veh", "DER", "chee"], stress: 3, literal: "until we see each other again", register: "neutral",
        hook: "The everyday goodbye that **fits almost everyone**.",
        insight: "Break it apart and it tells a little story: **a** (until) + **rivedere** (to see again) + **ci** (each other). You're literally saying you hope to meet again.",
        trap: "**Roll the double R** a little. The ending “-ci” sounds like **“chee”**." },
      { it: "ArrivederLa", en: "Goodbye (formal, to one person)", syllables: ["ar", "ree", "veh", "DER", "la"], stress: 3, literal: "until I see You again", register: "formal",
        hook: "The extra-polite goodbye to **one person you call Lei**.",
        insight: "“-ci” (each other) is swapped for **“La”, the formal “you”**. Use it with a doctor, a hotel receptionist or an older person you've just met. It's **a sign of good manners** that Italians notice.",
        trap: "The **capital L** is a written sign of respect. You can't hear it, but you'll see it in emails." },
      { it: "A presto", en: "See you soon", syllables: ["a", "PRES", "to"], stress: 1, register: "neutral",
        hook: "You'll meet again, but **you don't know when**.",
        insight: "Also the classic way to **end a message or email** to someone you like." },
      { it: "A più tardi", en: "See you later", syllables: ["a", "pyoo", "TAR", "dee"], stress: 2, register: "neutral",
        hook: "**Later today.**",
        insight: "“Più tardi” = more late. Perfect for your B&B host when you're going out for the afternoon." },
      { it: "A domani", en: "See you tomorrow", syllables: ["a", "do", "MA", "nee"], stress: 2, register: "neutral",
        hook: "**Tomorrow.** And the pattern works with any day.",
        insight: "Swap in a day and it still works: **a lunedì** (see you Monday), **a stasera** (see you tonight). One pattern, many phrases." },
      { it: "Ci vediamo", en: "See you (around)", syllables: ["chee", "veh", "DYA", "mo"], stress: 2, literal: "we see each other", register: "casual",
        hook: "Relaxed and friendly, for **people you see often**.",
        insight: "You can **stick a time on the end**: ci vediamo domani, ci vediamo dopo (see you after). It's what friends text each other all day long.",
        scene: [ { who: "Friend", it: "Allora, ci vediamo stasera?", en: "So, see you tonight?" }, { who: "You", it: "Sì, a stasera!", en: "Yes, see you tonight!" } ] },
    ],
  },
  {
    id: "thanks",
    title: "Saying thank you",
    intro: "The word you'll use most in Italy.",
    bigIdea: "Italians thank **often and out loud**: the barista, the bus driver, the person holding a door. Getting the **sound of grazie right** is one of the quickest ways to sound less like a tourist.",
    phrases: [
      { it: "Grazie", en: "Thank you / Thanks", syllables: ["GRAHT", "tsyeh"], stress: 0, register: "neutral",
        hook: "**Two beats, and the final E is always there.**",
        insight: "English speakers often say “gra-tsee”, which sounds like a different word. The ending is a short, clear **“-tsyeh”**. Even in fast speech, Italians still say it.",
        trap: "**GRAHT-tsyeh**, never “gra-tsee”." },
      { it: "Grazie mille", en: "Thanks a lot", syllables: ["GRAHT", "tsyeh", "MEEL", "leh"], stress: 2, literal: "a thousand thanks", register: "neutral",
        hook: "Thanks **a thousand times**: warm and very common.",
        insight: "Use it when someone has really helped you: directions, a recommendation, a kind gesture. Hold the **double L** a little longer: mil-le." },
      { it: "Grazie a Lei", en: "Thank YOU", syllables: ["GRAHT", "tsyeh", "a", "LAY"], stress: 3, literal: "thanks to You", register: "formal",
        hook: "Turning the thanks **back to them**, politely.",
        insight: "The **stress moves onto “Lei”**: you're stressing that *they* deserve thanks. With a friend, it becomes **grazie a te**." },
    ],
  },
  {
    id: "reply",
    title: "Answering 'grazie'",
    intro: "Go beyond prego and sound like a native.",
    bigIdea: "Learners answer every grazie with prego. Natives **change their reply to fit the moment**: how big the favour was, and how close they are to the person. Having **3 or 4 replies ready** makes you sound fluent fast.",
    phrases: [
      { it: "Prego", en: "You're welcome", syllables: ["PREH", "go"], stress: 0, register: "neutral",
        hook: "The standard, always-correct reply.",
        insight: "Prego is a hard-working little word. It also means **“please, go ahead”** (holding a door) and **“how can I help?”** when a shop assistant looks up at you." },
      { it: "Altrettanto", en: "Same to you / Likewise", syllables: ["al", "tret", "TAN", "to"], stress: 2, register: "neutral",
        hook: "When someone **wishes you** something, give it **straight back**.",
        insight: "Buona serata → **altrettanto!** Buon appetito → **altrettanto!** One word saves you from repeating the whole phrase.",
        scene: [ { who: "Waiter", it: "Buona serata!", en: "Have a good evening!" }, { who: "You", it: "Grazie, altrettanto!", en: "Thanks, you too!" } ] },
      { it: "Di niente", en: "It's nothing / No worries", syllables: ["dee", "NYEN", "teh"], stress: 1, literal: "of nothing", register: "neutral",
        hook: "Easy and friendly: **it was nothing**.",
        insight: "Good for small favours, like passing the salt or giving directions. A close cousin is **figurati** (don't mention it), which friends use all the time." },
      { it: "Non c'è di che", en: "Don't mention it", syllables: ["non", "CHEH", "dee", "keh"], stress: 1, literal: "there's nothing to thank for", register: "neutral",
        hook: "Very natural for natives, **rarely heard from learners**.",
        insight: "Using it is a quiet signal that **your Italian goes beyond the textbook**. Polite enough for strangers, warm enough for friends." },
      { it: "Si figuri", en: "Not at all / Of course", syllables: ["see", "fee", "GOO", "ree"], stress: 2, literal: "don't even imagine it (formal)", register: "formal",
        hook: "The **formal** “don't even mention it”, for a **real favour**.",
        insight: "You picked up a lady's scarf, or helped someone with a heavy bag. It's the **Lei** form; with a friend, you'd say **figurati**.",
        trap: "Formal only. **With friends, say figurati.**" },
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
