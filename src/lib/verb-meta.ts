import type { Verb } from "@/data/verbs";

export type Family = "-are" | "-ere" | "-ire";
/** Family by infinitive ending; contracted forms like porre/bere/dire map to their historical family. */
export function familyOf(v: Verb): Family {
  const i = v.infinitive;
  if (i.endsWith("are")) return "-are";
  if (i.endsWith("ire")) return "-ire";
  return "-ere";
}
export const isIrregular = (v: Verb) => v.type === "irregular";
export const isIsc = (v: Verb) => familyOf(v) === "-ire" && !isIrregular(v) && (v.forms[0] ?? "").endsWith("isco");

export function patternLabel(v: Verb): string {
  if (isIrregular(v)) return "Irregular";
  if (isIsc(v)) return "Regular -IRE · -ISC- pattern";
  return `Regular ${familyOf(v).toUpperCase()}`;
}
