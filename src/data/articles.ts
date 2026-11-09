// Definite articles ("the"): il, lo, l', la, i, gli, le — original Parlami content.
export type Gender = "m" | "f";
export type Opening = "consonant" | "vowel" | "strong";

/** Strong openings that need lo/gli: s+consonant, z, x, y, gn, ps, pn. */
export function openingOf(word: string): Opening {
  const w = word.toLowerCase();
  if (/^[aeiouàèéìòù]/.test(w)) return "vowel";
  if (/^s[^aeiouàèéìòù]/.test(w) || /^(z|x|y|gn|ps|pn)/.test(w)) return "strong";
  return "consonant";
}

export function articleFor(word: string, gender: Gender, plural = false): string {
  const o = openingOf(word);
  if (gender === "f") return plural ? "le" : o === "vowel" ? "l'" : "la";
  if (plural) return o === "consonant" ? "i" : "gli";
  return o === "vowel" ? "l'" : o === "strong" ? "lo" : "il";
}

export function withArticle(word: string, gender: Gender, plural = false) {
  const a = articleFor(word, gender, plural);
  return a === "l'" ? `l'${word}` : `${a} ${word}`;
}

export function reasonFor(word: string, gender: Gender, plural = false): string {
  const o = openingOf(word);
  const a = articleFor(word, gender, plural);
  if (gender === "f") {
    if (plural) return `Feminine plural is always "le", whatever the first letter.`;
    if (o === "vowel") return `Feminine word starting with a vowel: "la" loses its a, so we get l'.`;
    if (o === "strong") return `It starts with a heavy sound, but it's feminine — lo/gli are only for masculine words. So: la.`;
    return `Ordinary feminine singular word: la.`;
  }
  if (plural) return a === "gli" ? `In the singular this word takes ${o === "vowel" ? "l'" : "lo"}, and both of those become "gli" in the plural.` : `Ordinary masculine plural: i — the same letter most masculine plurals end in.`;
  if (o === "vowel") return `Masculine word starting with a vowel: "lo" loses its o, so we get l'.`;
  if (o === "strong") return `It opens with a heavy cluster. "il" + that cluster is too many consonants in a row, so we use lo.`;
  return `Ordinary masculine singular word: il.`;
}

export type Noun = { it: string; pl: string; en: string; g: Gender };

export const STRONG_SOUNDS = [
  { cluster: "s + consonant", word: "studente", en: "student", note: "sp, st, sc, sb, sg…" },
  { cluster: "z", word: "zaino", en: "backpack", note: "both z sounds count" },
  { cluster: "gn", word: "gnomo", en: "gnome", note: "rare, but it happens" },
  { cluster: "ps / pn", word: "psicologo", en: "psychologist", note: "Greek-origin words" },
  { cluster: "x / y", word: "yogurt", en: "yoghurt", note: "mostly borrowed words" },
];

/** Practice deck: singular article → plural article + plural noun. */
export const DECK: Noun[] = [
  { it: "camera", pl: "camere", en: "room", g: "f" },
  { it: "portone", pl: "portoni", en: "main door", g: "m" },
  { it: "ascensore", pl: "ascensori", en: "lift", g: "m" },
  { it: "doccia", pl: "docce", en: "shower", g: "f" },
  { it: "asciugamano", pl: "asciugamani", en: "towel", g: "m" },
  { it: "sgabello", pl: "sgabelli", en: "stool", g: "m" },
  { it: "zanzara", pl: "zanzare", en: "mosquito", g: "f" },
  { it: "zaino", pl: "zaini", en: "backpack", g: "m" },
  { it: "straniero", pl: "stranieri", en: "foreigner", g: "m" },
  { it: "stadio", pl: "stadi", en: "stadium", g: "m" },
  { it: "storia", pl: "storie", en: "story", g: "f" },
  { it: "arancia", pl: "arance", en: "orange", g: "f" },
  { it: "insalata", pl: "insalate", en: "salad", g: "f" },
  { it: "yogurt", pl: "yogurt", en: "yoghurt", g: "m" },
  { it: "computer", pl: "computer", en: "computer", g: "m" },
  { it: "amico", pl: "amici", en: "friend", g: "m" },
];

const norm = (s: string) => s.trim().toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, " ");

/** Accepts "gli zaini". */
export function isCorrectPluralPhrase(n: Noun, answer: string) {
  return norm(answer) === norm(`${articleFor(n.it, n.g, true)} ${n.pl}`);
}
