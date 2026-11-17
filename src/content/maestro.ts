/** AI Maestro content: daily verbs, verb+noun matches, translation challenges, roleplay missions. */
export const DAILY_VERBS: Record<number, string[]> = {
  1: ["prendere", "bere", "mangiare", "pagare", "volere", "essere", "avere", "fare", "comprare", "cercare"],
  2: ["andare", "prendere", "cercare", "comprare", "arrivare", "partire", "aspettare", "essere", "conoscere", "guardare"],
  3: ["cercare", "avere", "prendere", "aprire", "leggere", "usare", "essere", "trovare", "dormire", "chiudere"],
  4: ["lavorare", "fare", "avere", "essere", "andare", "partire", "guardare", "tornare", "finire", "cominciare"],
  5: ["chiamare", "aspettare", "conoscere", "parlare", "vedere", "abitare", "studiare", "essere", "avere", "andare"],
  6: ["comprare", "pagare", "cercare", "andare", "aprire", "chiudere", "costare", "prendere", "volere", "trovare"],
};

export type Match = { en: string; it: string; verb: string; noun: string };
export const MATCHES: Record<number, Match[]> = {
  1: [
    { en: "We pay the bill.", it: "Paghiamo il conto", verb: "paghiamo", noun: "conto" },
    { en: "I'm having a coffee.", it: "Prendo un caffè", verb: "prendo", noun: "caffè" },
    { en: "I drink the water.", it: "Bevo l'acqua", verb: "bevo", noun: "acqua" },
    { en: "We're looking for a table.", it: "Cerchiamo un tavolo", verb: "cerchiamo", noun: "tavolo" },
  ],
  2: [
    { en: "I'm looking for the hotel.", it: "Cerco l'albergo", verb: "cerco", noun: "albergo" },
    { en: "I'm taking the train.", it: "Prendo il treno", verb: "prendo", noun: "treno" },
    { en: "We buy the ticket.", it: "Compriamo il biglietto", verb: "compriamo", noun: "biglietto" },
    { en: "I'm waiting for the bus.", it: "Aspetto l'autobus", verb: "aspetto", noun: "autobus" },
  ],
  3: [
    { en: "I'm looking for the keys.", it: "Cerco le chiavi", verb: "cerco", noun: "chiave" },
    { en: "I open the door.", it: "Apro la porta", verb: "apro", noun: "porta" },
    { en: "I'm reading a book.", it: "Leggo un libro", verb: "leggo", noun: "libro" },
    { en: "You're taking the backpack.", it: "Prendi lo zaino", verb: "prendi", noun: "zaino" },
  ],
  4: [
    { en: "I work in the morning.", it: "Lavoro la mattina", verb: "lavoro", noun: "mattina" },
    { en: "Do you have time?", it: "Hai tempo", verb: "hai", noun: "tempo" },
    { en: "We're throwing a party.", it: "Facciamo una festa", verb: "facciamo", noun: "festa" },
    { en: "I'm looking for work.", it: "Cerco lavoro", verb: "cerco", noun: "lavoro" },
  ],
  5: [
    { en: "I call the waiter.", it: "Chiamo il cameriere", verb: "chiamo", noun: "cameriere" },
    { en: "I'm waiting for a friend.", it: "Aspetto un amico", verb: "aspetto", noun: "amico" },
    { en: "Do you know the neighbour?", it: "Conosci il vicino", verb: "conosci", noun: "vicino" },
    { en: "We see the family.", it: "Vediamo la famiglia", verb: "vediamo", noun: "famiglia" },
  ],
  6: [
    { en: "I'm looking for a pharmacy.", it: "Cerco una farmacia", verb: "cerco", noun: "farmacia" },
    { en: "I pay at the till.", it: "Pago alla cassa", verb: "pago", noun: "cassa" },
    { en: "Take the receipt!", it: "Prendi lo scontrino", verb: "prendi", noun: "scontrino" },
    { en: "The bank opens at nine.", it: "La banca apre alle nove", verb: "apre", noun: "banca" },
  ],
};

export type Kind = "Statement" | "Negative" | "Question" | "Reason";
export type Challenge = { kind: Kind; en: string; it: string[] };
export const CHALLENGES: Record<number, Challenge[]> = {
  1: [
    { kind: "Statement", en: "I'll have a coffee and a croissant.", it: ["Prendo un caffè e un cornetto."] },
    { kind: "Negative", en: "I don't drink wine.", it: ["Non bevo il vino.", "Non bevo vino."] },
    { kind: "Question", en: "Do you want an ice cream?", it: ["Vuoi un gelato?"] },
    { kind: "Reason", en: "I'm paying the bill because I'm in a hurry.", it: ["Pago il conto perché ho fretta."] },
  ],
  2: [
    { kind: "Statement", en: "I'm looking for the station.", it: ["Cerco la stazione."] },
    { kind: "Negative", en: "We don't take the bus.", it: ["Non prendiamo l'autobus."] },
    { kind: "Question", en: "When does the train leave?", it: ["Quando parte il treno?"] },
    { kind: "Reason", en: "I'm buying the ticket, but the train is late.", it: ["Compro il biglietto, ma il treno è in ritardo."] },
  ],
  3: [
    { kind: "Statement", en: "I'm looking for the keys.", it: ["Cerco le chiavi."] },
    { kind: "Negative", en: "I don't have the money.", it: ["Non ho i soldi.", "Non ho soldi."] },
    { kind: "Question", en: "Where is the phone?", it: ["Dov'è il telefono?", "Dove è il telefono?"] },
    { kind: "Reason", en: "The room is small, so I sleep well.", it: ["La camera è piccola, quindi dormo bene."] },
  ],
  4: [
    { kind: "Statement", en: "I work every day.", it: ["Lavoro tutti i giorni."] },
    { kind: "Negative", en: "I don't have time today.", it: ["Oggi non ho tempo.", "Non ho tempo oggi."] },
    { kind: "Question", en: "What are you doing at the weekend?", it: ["Cosa fai il fine settimana?", "Che fai il fine settimana?", "Che cosa fai il fine settimana?"] },
    { kind: "Reason", en: "We're going on holiday because we're tired.", it: ["Andiamo in vacanza perché siamo stanchi."] },
  ],
  5: [
    { kind: "Statement", en: "I'm waiting for a friend.", it: ["Aspetto un amico."] },
    { kind: "Negative", en: "I don't know the neighbour.", it: ["Non conosco il vicino."] },
    { kind: "Question", en: "Do you call the waiter?", it: ["Chiami il cameriere?"] },
    { kind: "Reason", en: "The teacher speaks slowly, so I understand.", it: ["Il professore parla piano, quindi capisco."] },
  ],
  6: [
    { kind: "Statement", en: "I'm looking for a pharmacy.", it: ["Cerco una farmacia."] },
    { kind: "Negative", en: "The shop doesn't open today.", it: ["Il negozio non apre oggi.", "Oggi il negozio non apre."] },
    { kind: "Question", en: "How much does it cost?", it: ["Quanto costa?"] },
    { kind: "Reason", en: "I pay at the till, but I don't take the receipt.", it: ["Pago alla cassa, ma non prendo lo scontrino."] },
  ],
};

export type MissionStep = { it: string; en: string; goal?: string; expect?: RegExp; hints: string[]; retry?: { it: string; en: string } };
export type Mission = { id: string; title: string; place: string; goals: { id: string; label: string }[]; steps: MissionStep[]; close: { it: string; en: string } };

export const MISSIONS: Mission[] = [
  {
    id: "bar", title: "Al bar a Milano", place: "A busy bar near the Duomo, 8 a.m.",
    goals: [{ id: "order", label: "Order a coffee and a cornetto" }, { id: "ask", label: "Ask a question" }, { id: "bill", label: "Ask for the bill" }],
    steps: [
      { it: "Buongiorno! Cosa prende?", en: "Good morning! What will you have?", goal: "order", expect: /(caff|cornett)/i, hints: ["Prendo un caffè…", "…e un cornetto", "Vorrei…"], retry: { it: "Allora, un caffè? Un cornetto?", en: "So, a coffee? A cornetto?" } },
      { it: "Perfetto. Altro?", en: "Perfect. Anything else?", goal: "ask", expect: /\?\s*$|^(dove|quanto|c'è|avete|come|quando|cosa|che)\b/i, hints: ["Avete…?", "Dov'è il bagno?", "C'è il Wi-Fi?"], retry: { it: "Ha una domanda? Mi chieda pure.", en: "Got a question? Go ahead and ask." } },
      { it: "Certo! Ecco a lei.", en: "Of course! Here you go.", goal: "bill", expect: /conto|quanto/i, hints: ["Il conto, per favore.", "Quanto pago?", "Pago alla cassa?"], retry: { it: "Quando vuole pagare, mi dica.", en: "When you'd like to pay, just say." } },
    ],
    close: { it: "Sono tre euro e cinquanta. Grazie, buona giornata!", en: "That's three fifty. Thanks, have a good day!" },
  },
  {
    id: "stazione", title: "Alla stazione di Roma", place: "Roma Termini ticket desk",
    goals: [{ id: "train", label: "Ask about the train to Florence" }, { id: "ticket", label: "Buy a ticket" }, { id: "time", label: "Ask what time it leaves" }],
    steps: [
      { it: "Buongiorno, mi dica.", en: "Good morning, how can I help?", goal: "train", expect: /firenze|treno/i, hints: ["C'è un treno per Firenze?", "Cerco il treno…", "Vado a Firenze."], retry: { it: "Per dove deve partire?", en: "Where do you need to go?" } },
      { it: "Sì, c'è un treno ogni ora.", en: "Yes, there's a train every hour.", goal: "ticket", expect: /bigliett|compro|vorrei|prendo/i, hints: ["Compro un biglietto.", "Un biglietto, per favore.", "Vorrei un biglietto…"], retry: { it: "Vuole il biglietto?", en: "Would you like the ticket?" } },
      { it: "Ecco il biglietto. Sono quaranta euro.", en: "Here's the ticket. That's forty euros.", goal: "time", expect: /(a che ora|quando|che ora)/i, hints: ["A che ora parte?", "Quando parte il treno?", "Da che binario?"], retry: { it: "Altre domande sul treno?", en: "Any other questions about the train?" } },
    ],
    close: { it: "Parte alle dieci e un quarto dal binario otto. Buon viaggio!", en: "It leaves at quarter past ten from platform eight. Have a good trip!" },
  },
  {
    id: "piacere", title: "Piacere! First meeting", place: "A friend's party in Bologna",
    goals: [{ id: "name", label: "Introduce yourself and your nationality" }, { id: "job", label: "Say what you do" }, { id: "ask2", label: "Ask two questions back" }],
    steps: [
      { it: "Ciao! Io sono Giulia. E tu?", en: "Hi! I'm Giulia. And you?", goal: "name", expect: /(mi chiamo|sono)/i, hints: ["Mi chiamo…", "Sono inglese.", "Piacere!"], retry: { it: "Come ti chiami? Di dove sei?", en: "What's your name? Where are you from?" } },
      { it: "Piacere! Cosa fai nella vita?", en: "Nice to meet you! What do you do?", goal: "job", expect: /(lavoro|studio|sono|faccio)/i, hints: ["Lavoro in…", "Studio…", "Faccio il/la…"], retry: { it: "Lavori o studi?", en: "Do you work or study?" } },
      { it: "Che bello! Io lavoro in un ristorante.", en: "How nice! I work in a restaurant.", goal: "ask2", expect: /\?/, hints: ["Ti piace?", "Di dove sei?", "Abiti qui?"], retry: { it: "E tu, vuoi sapere qualcosa di me?", en: "Want to know anything about me?" } },
    ],
    close: { it: "Sì, mi piace molto! Sono di Napoli, ma abito qui da due anni.", en: "Yes, I really like it! I'm from Naples, but I've lived here two years." },
  },
  {
    id: "free", title: "Daily free coach", place: "Your tutor interviews you with today's words",
    goals: [{ id: "n1", label: "Use one of today's nouns" }, { id: "n2", label: "Use a second noun with its article" }, { id: "neg", label: "Say one negative sentence" }],
    steps: [], // generated from today's words
    close: { it: "Bravissimo. Oggi hai usato le parole del giorno in frasi vere.", en: "Excellent. Today you used the words of the day in real sentences." },
  },
];
