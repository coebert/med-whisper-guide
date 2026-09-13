/**
 * Derives a short "how it looks" summary from the manufacturer-sourced
 * presentation text already held on each monograph.
 *
 * Nothing here invents new facts: every value returned is a phrase lifted
 * from the presentation string (which comes from the SPC / BNF entry).
 * Pack design, label colour and cap colour vary between manufacturers and
 * change over time, so the UI always shows the "read the label" caution
 * alongside this summary.
 */

export type AppearanceSummary = {
  colour?: string | undefined;
  form?: string | undefined;
  containers: string[];
  strengths: string[];
  storage: string[];
};

const COLOUR_PATTERNS: RegExp[] = [
  /\b(clear,?\s+colourless(?:\s+(?:and\s+)?(?:sterile\s+)?(?:aqueous\s+)?(?:solution|liquid))?)/i,
  /\b(colourless to (?:pale |light )?yellow(?:ish)?)/i,
  /\b(white to off-white)/i,
  /\b(yellowish-white)/i,
  /\b(pale|light|dark)?\s?\b(white|yellow|amber|blue|green|pink|red|brown|opalescent|milky|straw-coloured)\b/i,
];

const FORM_PATTERNS: Array<[RegExp, string]> = [
  [/lyophilis(?:ed|ed)\s+powder|freeze-dried powder/i, "Lyophilised powder for reconstitution"],
  [/powder for (?:solution|reconstitution|injection|infusion)|powder for/i, "Powder for reconstitution"],
  [/concentrate for (?:solution for )?infusion/i, "Concentrate for infusion — must be diluted"],
  [/emulsion/i, "Emulsion for injection"],
  [/solution for injection(?:\/infusion)?(?: or infusion)?/i, "Solution for injection"],
  [/solution for infusion|infusion bag|premixed/i, "Ready-diluted solution for infusion"],
  [/volatile liquid|inhalation vapour/i, "Volatile liquid for vaporiser"],
  [/metered-dose inhaler|pMDI|nebulis/i, "Inhaled / nebulised preparation"],
  [/suppositor/i, "Suppositories"],
  [/(?:gastro-resistant |dispersible |modified-release |prolonged-release )?tablets?|capsules?/i, "Oral tablets or capsules"],
  [/oral (?:solution|suspension|syrup)/i, "Oral liquid"],
  [/patch|transdermal/i, "Transdermal patch"],
  [/gel|cream|ointment|topical/i, "Topical preparation"],
];

const CONTAINER_PATTERNS: Array<[RegExp, string]> = [
  [/\bglass ampoule/i, "Glass ampoule"],
  [/\bampoules?\b/i, "Ampoule"],
  [/\bglass vial/i, "Glass vial"],
  [/single-use vial|single-dose vial/i, "Single-use vial"],
  [/\bvials?\b/i, "Vial"],
  [/pre-?filled syringe/i, "Pre-filled syringe"],
  [/viaflo|freeflex|polyfusor|infusion bag|\bbags?\b/i, "Infusion bag"],
  [/\bbottles?\b/i, "Bottle"],
  [/\bsachets?\b/i, "Sachet"],
  [/nebules?|respules?/i, "Nebuliser unit-dose vial"],
];

const STORAGE_PATTERNS: Array<[RegExp, string]> = [
  [/2\s?[–-]\s?8\s?°?C|refrigerat/i, "Keep refrigerated (2–8°C)"],
  [/protect(?:ed)? from light|amber/i, "Protect from light"],
  [/do not freeze/i, "Do not freeze"],
  [/controlled drug|\bCD\b|schedule [2345]/i, "Controlled drug storage"],
  [/hygroscopic/i, "Hygroscopic — keep dry"],
];

/** Strengths/volumes as printed on the label, e.g. "10 mg/mL", "500 mg", "1 mL". */
function extractStrengths(text: string): string[] {
  const out: string[] = [];
  const re =
    /\b\d+(?:[.,]\d+)?\s?(?:%|mg\/mL|micrograms?\/mL|nanograms?\/mL|units?\/mL|g\/mL|mmol\/mL|mg|micrograms?|nanograms?|units?|g|mL|L)\b(?:\s?\/\s?\d+(?:[.,]\d+)?\s?mL)?/gi;
  for (const m of text.match(re) ?? []) {
    const v = m.replace(/\s+/g, " ").trim();
    if (!out.some((x) => x.toLowerCase() === v.toLowerCase())) out.push(v);
  }
  return out.slice(0, 6);
}

function firstMatch(text: string, patterns: Array<[RegExp, string]>): string | undefined {
  for (const [re, label] of patterns) if (re.test(text)) return label;
  return undefined;
}

function allMatches(text: string, patterns: Array<[RegExp, string]>, limit = 4): string[] {
  const out: string[] = [];
  for (const [re, label] of patterns) {
    if (re.test(text) && !out.includes(label)) out.push(label);
    if (out.length >= limit) break;
  }
  return out;
}

function extractColour(text: string): string | undefined {
  for (const re of COLOUR_PATTERNS) {
    const m = text.match(re);
    if (m) {
      const phrase = (m[1] ?? m[0]).replace(/\s+/g, " ").trim();
      if (phrase.length > 2) return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }
  }
  return undefined;
}

export function describeAppearance(presentation?: string | null): AppearanceSummary | null {
  const text = (presentation ?? "").trim();
  if (text.length < 8) return null;

  const summary: AppearanceSummary = {
    colour: extractColour(text),
    form: firstMatch(text, FORM_PATTERNS),
    containers: allMatches(text, CONTAINER_PATTERNS, 3),
    strengths: extractStrengths(text),
    storage: allMatches(text, STORAGE_PATTERNS, 4),
  };

  const hasSomething =
    summary.colour || summary.form || summary.containers.length > 0 || summary.strengths.length > 0;
  return hasSomething ? summary : null;
}

export const APPEARANCE_CAUTION =
  "Appearance is taken from the manufacturer's product information. Pack design, label and cap colour vary between manufacturers and change without notice — identify every drug by reading the label on the ampoule or vial in your hand, never by its colour or shape.";
