import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { drugDilutions } from "@/features/drugReference/dilutions";
import { classifySource, sourceKindLabel, standardRefs } from "@/features/drugReference/references";
import { readCache, writeCache } from "@/features/drugReference/cache";
import type { DrugSource } from "@/features/drugReference/types";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/references")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dose References — every monograph and recipe | Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "The specific guideline, BNF or product-licence reference behind each drug monograph dose and each infusion recipe, with links to the original documents.",
      },
      { property: "og:title", content: "Dose References | Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Drug-by-drug and recipe-by-recipe list of the sources used, each linking to the original guideline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DoseReferencesPage,
});

type DrugRefs = { slug: string; name: string; drug_class: string; sources: DrugSource[] };

function useAllDrugSources() {
  const cached = readCache<DrugRefs[]>("sources-index");
  const [rows, setRows] = useState<DrugRefs[]>(cached?.data ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("drugs")
        .select("slug,name,drug_class,sources")
        .order("name");
      if (!active) return;
      if (err) {
        if (!cached) setError(err.message);
      } else {
        const next = (data ?? []).map((r) => ({
          slug: r.slug,
          name: r.name,
          drug_class: r.drug_class,
          sources: Array.isArray(r.sources) ? (r.sources as unknown as DrugSource[]) : [],
        }));
        setRows(next);
        writeCache("sources-index", next);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rows, loading, error };
}

function SourceList({ sources }: { sources: DrugSource[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {sources.map((s) => (
        <li key={s.url + s.title} className="flex items-start gap-2 text-sm">
          <span className="mt-0.5 shrink-0 rounded border border-border bg-background px-1.5 py-px text-[10px] uppercase tracking-wide text-muted-foreground">
            {sourceKindLabel[classifySource(s)]}
          </span>
          <span className="min-w-0">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline break-words"
            >
              {s.title}
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
            </a>
            <span className="block text-xs text-muted-foreground">{s.publisher}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function DoseReferencesPage() {
  const { rows, loading, error } = useAllDrugSources();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const bySlug = useMemo(() => new Map(rows.map((r) => [r.slug, r])), [rows]);

  const drugs = useMemo(
    () =>
      rows.filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.drug_class.toLowerCase().includes(q) ||
          r.sources.some((s) => `${s.title} ${s.publisher}`.toLowerCase().includes(q)),
      ),
    [rows, q],
  );

  const recipes = useMemo(
    () =>
      drugDilutions.filter(
        (d) => !q || d.drug.toLowerCase().includes(q) || d.group.toLowerCase().includes(q),
      ),
    [q],
  );

  const totalRefs = rows.reduce((n, r) => n + r.sources.length, 0);

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Dose references</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The reference behind every monograph dose and every infusion recipe, drug by drug.
          {rows.length > 0 && (
            <>
              {" "}
              {rows.length} monographs citing {totalRefs} references, and {drugDilutions.length}{" "}
              recipes.
            </>
          )}{" "}
          Guidance changes — open the source and confirm the current version before acting on a
          dose. For the master list of publishers see{" "}
          <Link to="/sources" className="text-primary underline">
            Clinical sources
          </Link>
          .
        </p>

        <label className="mt-5 block">
          <span className="sr-only">Filter by drug, class or source</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by drug, class or source…"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <nav aria-label="Sections" className="mt-4 flex flex-wrap gap-2">
          <a href="#monographs" className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
            Monographs
          </a>
          <a href="#recipes" className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
            Infusion recipes
          </a>
        </nav>

        <section id="monographs" className="mt-8 scroll-mt-24">
          <h2 className="font-serif text-lg text-foreground">Monograph doses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sources stored with each monograph. Adult doses follow the BNF, paediatric doses the
            BNF for Children, and presentation, dilution and licensed wording the product SPC.
          </p>
          {loading && rows.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">Loading references…</p>
          )}
          {error && rows.length === 0 && (
            <p className="mt-4 text-sm text-destructive">Could not load references: {error}</p>
          )}
          {!loading && drugs.length === 0 && rows.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No monographs match “{query}”.</p>
          )}
          <ul className="mt-4 space-y-3">
            {drugs.map((d) => (
              <li key={d.slug} id={`ref-${d.slug}`} className="rounded-lg border border-border bg-card p-4 scroll-mt-24">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <Link
                    to="/drugs/$slug"
                    params={{ slug: d.slug }}
                    className="font-medium text-foreground hover:underline"
                  >
                    {d.name}
                  </Link>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {d.drug_class}
                  </span>
                </div>
                {d.sources.length > 0 ? (
                  <SourceList sources={d.sources} />
                ) : (
                  <SourceList sources={standardRefs(d.name)} />
                )}
              </li>
            ))}
          </ul>
        </section>

        <section id="recipes" className="mt-10 scroll-mt-24">
          <h2 className="font-serif text-lg text-foreground">Infusion recipes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Recipe concentrations reflect common UK critical care practice and must match your
            local smart-pump library. Dose ranges are checked against the linked monograph&apos;s
            sources; where a recipe has no monograph, the standard BNF, BNFC and SPC lookups are
            given.
          </p>
          {recipes.length === 0 && (
            <p className="mt-4 text-sm text-muted-foreground">No recipes match “{query}”.</p>
          )}
          <ul className="mt-4 space-y-3">
            {recipes.map((r) => {
              const mono = r.slug ? bySlug.get(r.slug) : undefined;
              const sources = mono && mono.sources.length > 0 ? mono.sources : standardRefs(r.drug);
              return (
                <li key={r.drug} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-medium text-foreground">{r.drug}</span>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {r.group}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.drawUp} — {r.concentrationLabel}; {r.minDose}–{r.maxDose} {r.unit}
                    {r.slug && (
                      <>
                        {" "}
                        ·{" "}
                        <Link to="/drugs/$slug" params={{ slug: r.slug }} className="text-primary underline">
                          monograph
                        </Link>
                      </>
                    )}
                  </p>
                  <SourceList sources={sources} />
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
