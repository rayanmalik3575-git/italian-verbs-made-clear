# Verb Practice: fix "Reply reflex" + new "Real-life trigger"

Same card, colours, fonts and layout as today. Only the content and exercise logic change.

## 1. Tab 2 "Reply reflex" — real Italian every round
Today most verbs get 6 auto-made rounds built from one phrase ("Arrivi presto?", "Marco arriva presto?"), which repeat and sometimes sound odd.

- Every verb (all 106) gets 3 hand-written rounds, one of each type:
  1. tu question -> io reply (e.g. "Cerchi lavoro a Milano?" -> "Sì, ___ lavoro a Milano." = cerco)
  2. voi question -> noi reply (e.g. "Ragazzi, prendete un caffè?" -> "Sì, ___ un caffè al bar." = prendiamo)
  3. lui/lei question -> lui/lei reply (e.g. "Marco paga il conto?" -> "Sì, ___ lui stasera." = paga)
- Your examples used as given: cercare, prendere, fare ("Cosa fai stasera?" -> "Stasera ___ una pizza."), avere ("Hai un minuto?" -> "Sì, ___ tempo, dimmi!"), dire ("Dici davvero?" -> "Sì, ___ sul serio!").
- Verbs that already have good hand-made sets (essere, avere, fare, andare, stare, volere, potere, abitare, studiare, parlare) keep them, with your avere/fare/dire lines swapped in.
- Pro-drop always: no io/tu in replies unless it is contrast.
- -care / -gare verbs (cercare, pagare, giocare, dimenticare, spiegare...): the hint bar shows one line: "Watch out: 'tu cerchi' needs an H to keep the hard K sound, but 'io cerco' drops the H!" (wording adapts per verb).

## 2. Tab 3 becomes "Real-life trigger"
Tab label: "3. Real-life trigger", sub-label "React to real moments without translating in your head". The word-tile builder and the Tap/Type toggle are removed.

Each verb gets 3-4 moments covering io, tu, lui/lei and noi. Each round card:
- Top badge: "IMAGINE THIS MOMENT" with a small scene icon (key, coffee, suitcase, phone, plate, train...). Note: the app's design rule is Lucide icons, no emoji, so the icons are drawn icons, not emoji.
- One vivid situation line, e.g. "You're patting your pockets at the door — your keys are gone. Tell your friend:"
- The Italian line with the blank inline, e.g. "[ ____ ] le chiavi!", plus a tiny whisper under it for the missing word only ("I'm looking for").
- After checking: full English meaning ("I'm looking for the keys!"), audio plays the full sentence, verb + object shown in green ("Cerco le chiavi"), small badge "Brain-to-mouth combo unlocked!".
- Anti-trap tips (golden note, not marked wrong as a typo): catches English-style answers such as "cerco per", "sono cerco", "io sono...", "aspetto per", "ascolto a", "guardo a", "pago per". Example tip: "Native secret: 'cercare' already includes 'for'! Just say 'Cerco le chiavi' (never 'cerco per')."
- Accent keys, Next round, final score card — same as Tab 2.

Coverage: hand-written moments for all 106 verbs (about 370 situations). Every line written as real spoken Italian.

## 3. Tests
- Every verb has exactly one round of each Tab 2 type, and the blank answer equals the right verb form.
- Every verb has 3-4 Tab 3 moments covering io, tu, lui/lei, noi; each sentence has one blank.
- Trap checker: "cerco per" on cercare shows the cercare tip; "cerco" is accepted.
- -care/-gare reminder appears only for those verbs.

## Technical details
- New data file `src/data/verb-moments.ts` (Tab 3 moments + trap rules) ; `src/data/verb-reflex.ts` gets a full hand-written `REPLY` table replacing the `gen()` template and the `OBJ` list.
- `src/routes/verbs.tsx`: rename mode 3, replace `Builder` with a `Trigger` component; reuse existing `Feedback`, `ProgressBar`, `btn`, `speak`, `grade`.
- `src/data/verb-builder.ts` and its tests removed if nothing else uses them.
- Update `src/test/verb-practice-upgrade.test.ts`.
