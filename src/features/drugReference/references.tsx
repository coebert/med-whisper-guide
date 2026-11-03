/**
 * Reference plumbing for the drug reference app.
 *
 * Statements should be traceable to a citable source. Generic BNF/emc search
 * links are lookups only, not evidence for a specific claim. This module classifies the sources stored with each monograph,
 * maps them onto the individual monograph sections, and provides standard
 * reference builders for content that is not database-backed (infusion
 * recipes, premedication guidance).
 */

import { ExternalLink } from "lucide-react";

import { adultSources } from "./scope";
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
  dosing: ["bnf", "spc"],
  dilutions: ["spc", "bnf", "guideline"],
  monitoring: ["guideline", "bnf", "spc"],
  side_effects: ["spc", "bnf"],
  contraindications: ["spc", "bnf"],
  interactions: ["bnf", "spc"],
  tdm: ["guideline", "bnf"],
};

/**
 * Pick the sources that support a given section, in order of authority.
 * Falls back to every (adult-scope) source held for the drug.
 */
export function sectionSources(all: DrugSource[], section: SectionKey): DrugSource[] {
  const sources = adultSources(all);
  const wanted = sectionPreference[section];
  const picked = wanted
    .flatMap((kind) => sources.filter((s) => classifySource(s) === kind))
    .filter((s, i, arr) => arr.findIndex((o) => o.url === s.url) === i);
  return picked.length > 0 ? picked : sources;
}

const q = (name: string) => encodeURIComponent(name.toLowerCase().replace(/\s*\(.*?\)\s*/g, " ").trim());

/**
 * BNF and emc search links for any drug name. These are lookups — a place to
 * check — not evidence that a specific statement has been validated.
 */
export function standardRefs(drugName: string): DrugSource[] {
  return [
    {
      title: `Search the BNF for ${drugName}`,
      publisher: "British National Formulary (NICE)",
      url: `https://bnf.nice.org.uk/search/?q=${q(drugName)}`,
      label: "BNF search",
      lookup: true,
    },
    {
      title: `Search the emc for ${drugName} product information (SmPC)`,
      publisher: "electronic Medicines Compendium (emc), Datapharm",
      url: `https://www.medicines.org.uk/emc/search?q=${q(drugName)}`,
      label: "SmPC search",
      lookup: true,
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
  const shown = adultSources(sources);
  if (shown.length === 0) return null;
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <span className="uppercase tracking-wide">{label}:</span>
      {shown.map((s) => (
        <a
          key={s.url + s.title}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${s.title} — ${s.publisher}${s.lookup ? " (search link, not claim-level evidence)" : ""}`}
          className="inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-foreground/80 hover:text-foreground hover:border-foreground/40"
        >
          {s.label ?? sourceKindLabel[classifySource(s)]}
          <ExternalLink aria-hidden="true" className="h-3 w-3" />
        </a>
      ))}
    </p>
  );
}
