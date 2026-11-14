import type { Verb } from "./verbs";
import { MOMENTS, MOMENT_IDX } from "./verb-moments-data";

export type MomentIcon = "key" | "coffee" | "bag" | "phone" | "food" | "train" | "home" | "book" | "music" | "shop" | "heart" | "sun" | "car" | "mail" | "users" | "clock" | "work" | "party" | "map" | "door";
export type Moment = { icon: MomentIcon; situation: string; it: string; whisper: string; en: string; idx: number };

export function momentsFor(v: Verb): Moment[] {
  return (MOMENTS[v.infinitive] ?? []).map((line, k) => {
    const [icon = "users", situation = "", it = "", whisper = "", en = ""] = line.split("|");
    return { icon: icon as MomentIcon, situation, it, whisper, en, idx: MOMENT_IDX[k]! };
  });
}

const norm = (s: string) => s.toLowerCase().normalize("NFC").replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();

// Verbs whose English needs a preposition Italian doesn't use.
const BUILT_IN: Record<string, [string[], string]> = {
  cercare: [["per"], "'cercare' already includes 'for'"],
  aspettare: [["per"], "'aspettare' already includes 'for'"],
  pagare: [["per"], "'pagare' already includes 'for' (pago il caffè)"],
  ascoltare: [["a"], "'ascoltare' already includes 'to'"],
  guardare: [["a"], "'guardare' already includes 'at'"],
  chiedere: [["per"], "'chiedere' already includes 'for' (chiedo il conto)"],
};

/** Returns a friendly tip when the answer copies an English pattern; undefined otherwise. */
export function trapTip(v: Verb, m: Moment, answer: string): string | undefined {
  const a = norm(answer);
  const form = v.forms[m.idx] ?? "";
  const words = a.split(" ");
  const b = BUILT_IN[v.infinitive];
  if (b && words.includes(form) && words.some((w) => b[0].includes(w))) {
    return `Native secret: ${b[1]}! Just say '${form} …' — never '${form} ${b[0][0]}'.`;
  }
  const be = ["sono", "sei", "è", "siamo", "siete", "sto", "stai", "sta", "stiamo"];
  if (v.infinitive !== "essere" && v.infinitive !== "stare" && words.length > 1 && be.includes(words[0]!) && words.includes(form)) {
    return `Native secret: Italian has no extra 'am / are' here. '${form}' already means "${m.whisper}".`;
  }
  if (["io", "tu", "noi", "lui", "lei"].includes(words[0]!) && words[1] === form) {
    return `Native secret: Italians drop the pronoun. The ending already says who — just '${form}'.`;
  }
  return undefined;
}

/** Correct only when the answer is exactly the verb form (accents and case forgiven by grade()). */
export const isMomentForm = (v: Verb, m: Moment, answer: string) => norm(answer) === norm(v.forms[m.idx] ?? "");
