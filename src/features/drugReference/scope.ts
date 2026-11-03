/**
 * Scope rules for the adult-only UK reference.
 *
 * Excluded monographs stay in the database but are never listed, searched,
 * compared, downloaded or shown.
 */
import type { DrugSource } from "./types";

/** Monographs outside the adult scope (e.g. neonatal-only indications). */
export const EXCLUDED_SLUGS: readonly string[] = ["caffeine-citrate"];

/** PostgREST filter value for `.not("slug", "in", ...)`. */
export const EXCLUDED_SLUG_FILTER = `(${EXCLUDED_SLUGS.join(",")})`;

export function isInScope(slug: string | null | undefined): boolean {
  return !!slug && !EXCLUDED_SLUGS.includes(slug);
}

function isPaediatricSource(s: DrugSource): boolean {
  const text = `${s.title} ${s.publisher} ${s.url}`.toLowerCase();
  return (
    text.includes("bnf for children") ||
    /\bbnfc\b/.test(text) ||
    text.includes("bnfc.nice.org.uk") ||
    text.includes("paediatric") ||
    text.includes("apagbi") ||
    text.includes("under 19") ||
    text.includes("under-19") ||
    text.includes("rcpch")
  );
}

/** Drops sources that imply paediatric coverage. */
export function adultSources(sources: DrugSource[] | null | undefined): DrugSource[] {
  return (sources ?? []).filter((s) => !isPaediatricSource(s));
}
