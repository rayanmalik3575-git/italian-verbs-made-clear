/** Deterministic Italian coach: grades sentences and runs roleplay replies with no network. */
import { DAILY_NOUNS, type DailyNoun } from "@/content/daily-nouns";
import { VERBS } from "@/data/verbs";

export type Verdict = "perfect" | "almost" | "backbone";
export type TokenMark = { word: string; ok: boolean };
export type Issue = { kind: string; text: string };
export type Feedback = { verdict: Verdict; tokens: TokenMark[]; issues: Issue[]; rule: string; native: string };

const norm = (s: string) => s.toLowerCase().replace(/[’`]/g, "'").replace(/[.,!?;:]/g, " ").replace(/\s+/g, " ").trim();
const deacc = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const words = (s: string) => norm(s).replace(/'/g, "' ").split(" ").filter(Boolean);
const ARTS = new Set(["il", "lo", "la", "l'", "i", "gli", "le", "un", "uno", "una", "un'"]);
const PRON = new Set(["io", "tu", "lui", "lei", "noi", "voi", "loro"]);
const ALL_FORMS = new Map<string, string>();
VERBS.forEach((v) => v.forms.forEach((f) => ALL_FORMS.set(f, v.infinitive)));
const isVerb = (w: string) => ALL_FORMS.has(w);
const sameStem = (a: string, b: string) => a.length > 2 && b.length > 2 && ALL_FORMS.get(a) !== undefined && ALL_FORMS.get(a) === ALL_FORMS.get(b);
const NOUN_SET = new Set(DAILY_NOUNS.map((n) => n.singular));

function lcs(a: string[], b: string[]) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--)
    dp[i][j] = deacc(a[i]) === deacc(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Set<number>(); let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (deacc(a[i]) === deacc(b[j])) { hit.add(i); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  return { score: dp[0][0], hit };
}

/** English-speaker traps that are wrong regardless of the target sentence. */
export function detectTraps(answer: string): Issue[] {
  const w = words(answer); const out: Issue[] = [];
  const raw = norm(answer);
  if (/\b(fai|fa|fate|faccio)\s+\w+(i|a|o|ate|ete|ite)\b/.test(raw) && w.length > 1 && isVerb(w[w.indexOf(w.find((x) => /^fa/.test(x))!) + 1] ?? ""))
    out.push({ kind: "do", text: "Italian has no 'do/does' helper. Drop fai/fa and use the verb itself: 'Parli inglese?'" });
  for (let i = 0; i < w.length - 1; i++) {
    if (["sono", "sei", "è", "siamo", "siete"].includes(w[i]) && isVerb(w[i + 1]) && !["sono", "è"].includes(w[i + 1]))
      out.push({ kind: "continuous", text: `'${w[i]} ${w[i + 1]}' copies English 'I am …ing'. Italian uses the verb alone: '${w[i + 1]}'.` });
    if (ALL_FORMS.get(w[i]) === "cercare" && w[i + 1] === "per")
      out.push({ kind: "per", text: "Cercare already means 'look for'. No 'per': 'Cerco la stazione'." });
    if (isVerb(w[i]) && w[i + 1] === "non")
      out.push({ kind: "non", text: "'Non' goes right before the verb, never after it." });
  }
  if (w.length > 1 && PRON.has(w[0]) && isVerb(w[1]))
    out.push({ kind: "pronoun", text: `The verb ending already says who. Natives drop '${w[0]}' unless they're contrasting.` });
  if (/qual'\s?è/.test(raw)) out.push({ kind: "qual", text: "Write 'qual è' with no apostrophe." });
  // bare noun after a verb ("prendo caffè")
  for (let i = 0; i < w.length - 1; i++) {
    if (isVerb(w[i]) && NOUN_SET.has(w[i + 1]) && !["lavoro", "tempo"].includes(w[i + 1]))
      out.push({ kind: "article", text: `You wrote '${w[i]} ${w[i + 1]}'. Italian nouns need their article: '${w[i]} ${articleFor(w[i + 1])}'.` });
  }
  return out;
}
function articleFor(s: string) { const n = DAILY_NOUNS.find((x) => x.singular === s); return n ? `${n.indefinite} / ${n.fullSingular}` : s; }

export function gradeSentence(answer: string, accepted: string[]): Feedback {
  const a = words(answer);
  const best = accepted.map((t) => ({ t, w: words(t), ...lcs(a, words(t)) })).sort((x, y) => y.score - x.score)[0];
  const tokens = a.map((word, i) => ({ word, ok: best.hit.has(i) }));
  const exact = accepted.some((t) => norm(t) === norm(answer));
  const accentOnly = !exact && accepted.some((t) => deacc(norm(t)) === deacc(norm(answer)));
  const issues: Issue[] = [];
  if (accentOnly) issues.push({ kind: "accent", text: "Right words — check the accent (è, perché, caffè)." });
  if (!exact && !accentOnly) {
    issues.push(...detectTraps(answer).filter((i) => i.kind !== "pronoun" || !best.w.includes(a[0])));
    const tw = best.w;
    // wrong verb ending
    for (const x of a) for (const y of tw) if (x !== y && sameStem(x, y)) issues.push({ kind: "ending", text: `'${x}' is the wrong person. Here the verb is '${y}'.` });
    // article
    const ta = tw.filter((x) => ARTS.has(x)); const aa = a.filter((x) => ARTS.has(x));
    if (ta.length > aa.length) issues.push({ kind: "article", text: `Missing article: Italian says '${ta.filter((x) => !aa.includes(x))[0] ?? ta[0]}' before the noun.` });
    else if (ta.length && aa.length && ta.join() !== aa.join()) {
      const bad = aa.find((x) => !ta.includes(x)); const good = ta.find((x) => !aa.includes(x));
      if (bad && good) issues.push({ kind: "gender", text: `'${bad}' doesn't match this noun — it takes '${good}'.` });
    }
    if (tw.includes("non") && !a.includes("non")) issues.push({ kind: "non", text: "This sentence needs 'non' right before the verb." });
    if (!issues.length) issues.push({ kind: "words", text: "Some words differ from the natural version — compare below." });
  }
  const dedup = issues.filter((x, i) => issues.findIndex((y) => y.text === x.text) === i);
  const verdict: Verdict = exact ? "perfect" : accentOnly || (dedup.length === 1 && best.score >= best.w.length - 1) ? "almost" : "backbone";
  return { verdict, tokens: exact ? tokens.map((t) => ({ ...t, ok: true })) : tokens, issues: exact ? [] : dedup, rule: ruleFor(dedup[0]?.kind), native: best.t };
}

function ruleFor(kind?: string): string {
  switch (kind) {
    case "do": return "Italian questions are just statements with a rising voice. There is no helper verb to add.";
    case "continuous": return "The present tense covers both 'I eat' and 'I am eating'. One verb, no 'essere'.";
    case "per": return "Some Italian verbs already contain the English preposition: cercare = look for, aspettare = wait for, guardare = look at.";
    case "non": return "'Non' always sits directly in front of the verb it negates.";
    case "pronoun": return "Italian is pro-drop: the ending -o, -i, -a already tells you who is speaking.";
    case "article": case "gender": return "In Italian a noun almost never stands alone: it travels with il, lo, la, l' (or un, una), matched to its gender and first letter.";
    case "ending": return "The verb ending is the subject: -o = I, -i = you, -a/-e = he/she, -iamo = we.";
    case "accent": return "Accents change meaning and pronunciation: e = and, è = is.";
    default: return "Native word order: who-does-what first, then details of time and place.";
  }
}

/* ---------------- Roleplay ---------------- */
export type Whisper = { tone: "praise" | "fix"; text: string };
export function whisper(msg: string): Whisper {
  const traps = detectTraps(msg);
  if (traps.length) return { tone: "fix", text: traps[0].text };
  const w = words(msg);
  const verbs = w.filter(isVerb); const nouns = w.filter((x) => NOUN_SET.has(x));
  if (verbs.length && nouns.length) return { tone: "praise", text: `Nice: '${verbs[0]}' with '${nouns[0]}' is exactly how a native says it.` };
  if (verbs.length) return { tone: "praise", text: `Good verb: '${verbs[0]}' — ending and person are right. Try adding a noun next time.` };
  if (w.length <= 2) return { tone: "fix", text: "Try a full little sentence with a verb, e.g. 'Prendo un caffè'." };
  return { tone: "praise", text: "Clear and understandable. Keep going." };
}

/** Questions the free coach asks, built from today's nouns. */
export function freeCoachPrompts(nouns: DailyNoun[]) {
  const pick = (i: number) => nouns[i % nouns.length];
  return [
    { it: `Parliamo di oggi. Cosa usi di più: ${pick(0).fullSingular} o ${pick(1).fullSingular}?`, en: `Let's talk about today. What do you use more: ${pick(0).english} or ${pick(1).english}?` },
    { it: `E ${pick(2).fullSingular}? Dimmi una frase con questa parola.`, en: `And ${pick(2).english}? Give me a sentence with this word.` },
    { it: "Adesso dimmi una cosa che non fai mai.", en: "Now tell me something you never do." },
  ];
}
export function usesNoun(msg: string, nouns: DailyNoun[], withArticle = false) {
  const n = norm(msg);
  return nouns.some((x) => withArticle ? n.includes(norm(x.fullSingular)) || n.includes(norm(x.indefinite)) || n.includes(norm(x.plural)) : n.includes(x.singular));
}
export const hasNegative = (msg: string) => /\bnon\b/.test(norm(msg));
