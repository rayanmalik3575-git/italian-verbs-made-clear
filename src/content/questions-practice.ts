import type { Translate } from "@/content/review-extras";

/** English → Italian question translations that mix questions with articles, plurals, negatives and verbs. */
export type QTranslate = Translate & { skill: "Articles" | "Plurals" | "Negatives" | "Verbs" | "Yes / no" };

export const Q_TRANSLATE: QTranslate[] = [
  { id: "qt1", skill: "Yes / no", english: "Do you speak Italian?", answers: ["Parli italiano?"], why: "No 'do' in Italian. Same words as the statement, your voice lifts at the end." },
  { id: "qt2", skill: "Articles", english: "Where is the station?", answers: ["Dov'è la stazione?", "Dove è la stazione?"], why: "Dove + è joins into dov'è. Stazione is feminine: la." },
  { id: "qt3", skill: "Plurals", english: "Where are the keys?", answers: ["Dove sono le chiavi?"], why: "Plural subject, so sono, not è. Chiave → chiavi, feminine plural le." },
  { id: "qt4", skill: "Negatives", english: "Why aren't you eating?", answers: ["Perché non mangi?"], why: "Non sits right before the verb, just like in a statement." },
  { id: "qt5", skill: "Plurals", english: "How many sisters do you have?", answers: ["Quante sorelle hai?"], why: "Quante matches sorelle: feminine plural." },
  { id: "qt6", skill: "Verbs", english: "What are you doing tonight?", answers: ["Cosa fai stasera?", "Che fai stasera?", "Che cosa fai stasera?"], why: "Fare covers 'do'. Fai already means 'you do', so no tu." },
  { id: "qt7", skill: "Articles", english: "Who are the students?", answers: ["Chi sono gli studenti?"], why: "Studente starts with s + consonant: lo studente, plural gli studenti." },
  { id: "qt8", skill: "Negatives", english: "Aren't you coming to the party?", answers: ["Non vieni alla festa?"], why: "A yes/no question with non in front of the verb. A + la = alla." },
  { id: "qt9", skill: "Verbs", english: "Where are you from?", answers: ["Di dove sei?", "Da dove vieni?"], why: "Di dove sei? is the everyday way. Da dove vieni? also works." },
  { id: "qt10", skill: "Plurals", english: "How many coffees do you drink?", answers: ["Quanti caffè bevi?"], why: "Caffè ends in an accent, so it never changes. Quanti shows the plural." },
  { id: "qt11", skill: "Articles", english: "What is your name?", answers: ["Come ti chiami?", "Qual è il tuo nome?"], why: "Italians usually say Come ti chiami? Qual è has no apostrophe." },
  { id: "qt12", skill: "Negatives", english: "Why don't we speak Italian?", answers: ["Perché non parliamo italiano?", "Perché non parliamo in italiano?"], why: "'Don't' is just non. Parliamo already means 'we speak'." },
  { id: "qt13", skill: "Verbs", english: "When does the train leave?", answers: ["Quando parte il treno?"], why: "Question word → verb → subject. The subject goes after the verb." },
  { id: "qt14", skill: "Plurals", english: "Which pizzas do you prefer?", answers: ["Quali pizze preferisci?", "Quali pizze preferite?"], why: "Quali is the plural of quale. Pizza → pizze." },
];
