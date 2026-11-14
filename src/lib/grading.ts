export type Grade = "correct" | "partial" | "incorrect";

const clean = (s: string) => s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");
const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/'/g, "");

/** Exact match = correct; right letters but missing/wrong accent = partial. */
export function grade(answer: string, expected: string): Grade {
  const a = clean(answer).replace(/^e'$/, "è");
  const e = clean(expected);
  if (a === e) return "correct";
  if (a && stripAccents(a) === stripAccents(e)) return "partial";
  return "incorrect";
}

/** Grade a reply where the learner may also type the subject pronoun ("io torno"). */
export function gradeWithPronoun(answer: string, expected: string, pronoun: string): Grade {
  const a = clean(answer);
  const prefixes = pronoun.split("/").map((p) => clean(p) + " ");
  const hit = prefixes.find((p) => a.startsWith(p));
  return grade(hit ? a.slice(hit.length) : a, expected);
}
