import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/drugs/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Drug Library — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Searchable anaesthetic and critical care drug reference: presentation, dosing, standard dilutions and pump rates, pharmacokinetics, safety, and therapeutic drug monitoring with BNF and SPC sources." },
      { property: "og:title", content: "Drug Library — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Searchable anaesthetic and critical care drug reference: presentation, dosing, standard dilutions and pump rates, pharmacokinetics, safety, and therapeutic drug monitoring with BNF and SPC sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceLibrary,
});

import { useMemo, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";
import { AlertTriangle, FlaskConical, Search, Syringe } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useDrugList } from "@/features/drugReference/useDrugReference";
import { drugDilutions } from "@/features/drugReference/dilutions";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const slugsWithRecipes = new Set(drugDilutions.map((d) => d.slug).filter(Boolean) as string[]);

function DrugReferenceLibrary() {
  const { drugs, loading, error } = useDrugList();
  const params = useSearch({ strict: false }) as Record<string, string | undefined>;
  const [query, setQuery] = useState(params.q ?? "");
  const [letter, setLetter] = useState<string | null>(null);
  const [drugClass, setDrugClass] = useState<string | null>(null);
  const [onlyMonitored, setOnlyMonitored] = useState(false);
  const [onlyInfusions, setOnlyInfusions] = useState(false);

  const classes = useMemo(
    () => Array.from(new Set(drugs.map((d) => d.drug_class))).sort(),
    [drugs],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return drugs.filter((d) => {
      if (letter && !d.name.toUpperCase().startsWith(letter)) return false;
      if (drugClass && d.drug_class !== drugClass) return false;
      if (onlyMonitored && !d.requires_tdm) return false;
      if (onlyInfusions && !slugsWithRecipes.has(d.slug)) return false;
      if (!needle) return true;
      return (
        d.name.toLowerCase().includes(needle) ||
        d.drug_class.toLowerCase().includes(needle) ||
        d.indication_oneliner.toLowerCase().includes(needle) ||
        (d.synonyms ?? []).some((s) => s.toLowerCase().includes(needle))
      );
    });
  }, [drugs, query, letter, drugClass, onlyMonitored, onlyInfusions]);

  const monitoredCount = useMemo(() => drugs.filter((d) => d.requires_tdm).length, [drugs]);
  const hasFilters = Boolean(query || letter || drugClass || onlyMonitored || onlyInfusions);

  return (
    <ReferenceAppLayout
      title="Drug Reference — Anaesthesia &amp; Critical Care | AnaesthesiaCore"
      description="Searchable anaesthetic and critical care drug reference: presentation, dosing, standard dilutions and pump rates, pharmacokinetics, safety, and therapeutic drug monitoring with BNF and SPC sources."
      canonicalPath="/reference/drugs"
    >
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Drug reference library
          </p>
          <h1 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
            Anaesthetics &amp; Critical Care Drug Reference
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Every drug monograph in one searchable library: presentation and preparation, adult and
            infusion dosing, standard dilutions with pump rates in mL/h, pharmacokinetics, adverse
            effects, interactions and — where relevant — full therapeutic drug level monitoring.
            Each entry lists its own sources (BNF, BNF for Children, the product SPC and national
            guidelines).
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Monographs</dt>
              <dd className="font-semibold text-foreground">{drugs.length || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">With blood level monitoring</dt>
              <dd className="font-semibold text-foreground">{monitoredCount || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Standard infusion recipes</dt>
              <dd className="font-semibold text-foreground">{drugDilutions.length}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-border bg-card p-4">
          <label className="relative block">
            <span className="sr-only">Search drugs</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, class or indication…"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlyMonitored((v) => !v)}
              aria-pressed={onlyMonitored}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                onlyMonitored
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Needs blood level monitoring
            </button>
            <button
              type="button"
              onClick={() => setOnlyInfusions((v) => !v)}
              aria-pressed={onlyInfusions}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                onlyInfusions
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Has an infusion recipe
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setLetter(null);
                  setDrugClass(null);
                  setOnlyMonitored(false);
                  setOnlyInfusions(false);
                }}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label="Jump to letter">
            {ALPHABET.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLetter(letter === l ? null : l)}
                aria-pressed={letter === l}
                className={`h-7 w-7 rounded text-xs font-semibold transition ${
                  letter === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {classes.length > 0 && (
            <div className="mt-3">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="drug-class">
                Drug class
              </label>
              <select
                id="drug-class"
                value={drugClass ?? ""}
                onChange={(e) => setDrugClass(e.target.value || null)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:max-w-sm"
              >
                <option value="">All classes ({drugs.length})</option>
                {classes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {loading
            ? "Loading the library…"
            : `${filtered.length} of ${drugs.length} drugs${hasFilters ? " match your filters" : ""}`}
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            The library could not be loaded just now. Please check your connection and try again.
          </p>
        )}

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <li key={d.slug}>
              <Link
                to="/drugs/$slug" params={{ slug: d.slug }}
                className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
              >
                <span className="font-semibold text-foreground">{d.name}</span>
                <span className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                  {d.drug_class}
                </span>
                <span className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {d.indication_oneliner}
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {d.requires_tdm && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                      <FlaskConical aria-hidden="true" className="h-3 w-3" /> Levels
                    </span>
                  )}
                  {slugsWithRecipes.has(d.slug) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                      <Syringe aria-hidden="true" className="h-3 w-3" /> Infusion
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {!loading && filtered.length === 0 && (
          <p className="mt-6 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No drugs match that search. Try a shorter search term, or clear the filters.
          </p>
        )}

        <aside className="mt-10 flex gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Educational reference for trained clinicians. Doses, dilutions and monitoring targets
            reflect common UK practice and must be checked against the BNF, the product SPC, your
            smart-pump drug library and local critical care and laboratory protocols before use.
          </p>
        </aside>
      </main>
    </ReferenceAppLayout>
  );
}
