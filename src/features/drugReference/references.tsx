/**
 * Reference plumbing for the drug reference app.
 *
 * Every statement in the app should be traceable to a citable, verifiable
 * source. This module classifies the sources stored with each monograph,
 * maps them onto the individual monograph sections, and provides standard
 * reference builders for content that is not database-backed (infusion
 * recipes, premedication guidance).
 */

import { ExternalLink } from "lucide-react";

import type { DrugSource } from "./types";

export type SourceKind = "bnf" | "bnfc" | "spc" | "guideline";

export function classifySource(source: DrugSource): SourceKind {
  const p = `${source.publisher} ${source.title}`.toLowerCase();
  if (p.includes("bnf for children") || p.includes("bnfc")) return "bnfc";
  if (p.includes("british national formulary") || p.includes("bnf")) return "bnf";
  if (
    p.includes("medicines compendium") ||
    p.includes("datapharm") ||
    p.includes("summary of product characteristics") ||
    p.includes("spc")
  )
    return "spc";
  return "guideline";
}

export const sourceKindLabel: Record<SourceKind, string> = {
  bnf: "BNF",
  bnfc: "BNFC",
  spc: "SPC",
  guideline: "Guideline",
};

/** Monograph sections that carry their own citations. */
export type SectionKey =
  | "overview"
  | "presentation"
  | "mechanism"
  | "pharmacokinetics"
  | "preparation"
  | "dosing"
  | "dilutions"
  | "monitoring"
  | "side_effects"
  | "contraindications"
  | "interactions"
  | "tdm";

const sectionPreference: Record<SectionKey, SourceKind[]> = {
  overview: ["bnf", "guideline"],
  presentation: ["spc", "bnf"],
  mechanism: ["spc", "guideline"],
  pharmacokinetics: ["spc", "bnf"],
  preparation: ["spc", "bnf"],
  dosing: ["bnf", "bnfc", "spc"],
  dilutions: ["spc", "bnf", "guideline"],
  monitoring: ["guideline", "bnf", "spc"],
  side_effects: ["spc", "bnf"],
  contraindications: ["spc", "bnf"],
  interactions: ["bnf", "spc"],
  tdm: ["guideline", "bnf"],
};

/**
 * Pick the sources that support a given section, in order of authority.
 * Falls back to every source held for the drug so no section is left
 * without a verifiable reference.
 */
export function sectionSources(sources: DrugSource[], section: SectionKey): DrugSource[] {
  const wanted = sectionPreference[section];
  const picked = wanted
    .flatMap((kind) => sources.filter((s) => classifySource(s) === kind))
    .filter((s, i, arr) => arr.findIndex((o) => o.url === s.url) === i);
  return picked.length > 0 ? picked : sources;
}

const q = (name: string) => encodeURIComponent(name.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").trim());

/** BNF / BNFC / SPC lookups for any drug name — always resolvable. */
export function standardRefs(drugName: string): DrugSource[] {
  return [
    {
      title: `${drugName} — BNF monograph`,
      publisher: "British National Formulary (NICE)",
      url: `https://bnf.nice.org.uk/search/?q=${q(drugName)}`,
    },
    {
      title: `${drugName} — BNF for Children monograph`,
      publisher: "BNF for Children (NICE)",
      url: `https://bnfc.nice.org.uk/search/?q=${q(drugName)}`,
    },
    {
      title: `${drugName} — Summary of Product Characteristics`,
      publisher: "electronic Medicines Compendium (emc), Datapharm",
      url: `https://www.medicines.org.uk/emc/search?q=${q(drugName)}`,
    },
  ];
}

/** Compact, inline citation chips shown under a block of content. */
export function SourceChips({
  sources,
  label = "Sources",
}: {
  sources: DrugSource[];
  label?: string;
}) {
  if (sources.length === 0) return null;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="uppercase tracking-wide">{label}:</span>
      {sources.map((s) => (
        <a
          key={s.url + s.title}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${s.title} — ${s.publisher}`}
          className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-foreground/80 hover:text-foreground hover:border-foreground/40"
        >
          {sourceKindLabel[classifySource(s)]}
          <ExternalLink aria-hidden="true" className="h-3 w-3" />
        </a>
      ))}
    </p>
  );
}
