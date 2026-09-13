import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    class: typeof search["class"] === "string" ? search["class"] : "",
    tdm: search["tdm"] === true || search["tdm"] === "true",
    infusion: search["infusion"] === true || search["infusion"] === "true",
  }),
  head: () => ({
    meta: [
      { title: "Search Drugs — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Type-ahead search across every anaesthetic and critical care drug monograph. Look up any drug by name, brand, class or indication and filter by infusion recipes or blood level monitoring.",
      },
      { property: "og:title", content: "Search Drugs — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Type-ahead search across every anaesthetic and critical care drug monograph, with filters for class, infusion recipes and blood level monitoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugSearchPage,
});

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { FlaskConical, Search, Syringe, X } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useDrugList, type DrugListItem } from "@/features/drugReference/useDrugReference";
import { drugDilutions } from "@/features/drugReference/dilutions";

const slugsWithRecipes = new Set(
  drugDilutions.map((d) => d.slug).filter(Boolean) as string[],
);

/** Ranks a drug against the search text; lower is better, -1 means no match. */
function score(drug: DrugListItem, needle: string): number {
  const name = drug.name.toLowerCase();
  if (name === needle) return 0;
  if (name.startsWith(needle)) return 1;
  const synonyms = (drug.synonyms ?? []).map((s) => s.toLowerCase());
  if (synonyms.some((s) => s.startsWith(needle))) return 2;
  if (name.includes(needle)) return 3;
  if (synonyms.some((s) => s.includes(needle))) return 4;
  if (drug.drug_class.toLowerCase().includes(needle)) return 5;
  if (drug.indication_oneliner.toLowerCase().includes(needle)) return 6;
  return -1;
}

function DrugSearchPage() {
  const { drugs, loading, error } = useDrugList();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const [query, setQuery] = useState(search.q);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the URL in step with what was typed, so searches are shareable.
  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== search.q) {
        navigate({ search: (prev) => ({ ...prev, q: query }), replace: true });
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, search.q, navigate]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const classes = useMemo(
    () => Array.from(new Set(drugs.map((d) => d.drug_class))).sort(),
    [drugs],
  );

  const passesFilters = (d: DrugListItem) => {
    if (search.class && d.drug_class !== search.class) return false;
    if (search.tdm && !d.requires_tdm) return false;
    if (search.infusion && !slugsWithRecipes.has(d.slug)) return false;
    return true;
  };

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = drugs.filter(passesFilters);
    if (!needle) return pool;
    return pool
      .map((d) => ({ d, s: score(d, needle) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.d.name.localeCompare(b.d.name))
      .map((r) => r.d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugs, query, search.class, search.tdm, search.infusion]);

  const suggestions = query.trim() ? results.slice(0, 8) : [];
  const showMenu = open && suggestions.length > 0;

  const go = (slug: string) => {
    setOpen(false);
    navigate({ to: "/drugs/$slug", params: { slug } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (suggestions.length ? (h + 1) % suggestions.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (suggestions.length ? (h - 1 + suggestions.length) % suggestions.length : 0));
    } else if (e.key === "Enter") {
      const pick = suggestions[highlight] ?? suggestions[0];
      if (showMenu && pick) {
        e.preventDefault();
        go(pick.slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const setFilter = (patch: Record<string, unknown>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const hasFilters = Boolean(query || search.class || search.tdm || search.infusion);

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Search the drug reference</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start typing a drug name, brand name, class or indication — suggestions appear as you type
          and Enter opens the monograph.
        </p>

        <div ref={boxRef} className="relative mt-6">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={showMenu}
            aria-controls="drug-suggestions"
            aria-autocomplete="list"
            aria-label="Search drugs by name"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="e.g. metaraminol, adrenaline, vancomycin…"
            className="w-full rounded-xl border border-input bg-card py-4 pl-12 pr-11 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}

          {showMenu && (
            <ul
              id="drug-suggestions"
              role="listbox"
              className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
            >
              {suggestions.map((d, i) => (
                <li key={d.slug} role="option" aria-selected={i === highlight}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => go(d.slug)}
                    className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition ${
                      i === highlight ? "bg-muted" : "bg-transparent"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground">{d.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {d.drug_class} — {d.indication_oneliner}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter by drug class"
            value={search.class}
            onChange={(e) => setFilter({ class: e.target.value })}
            className="rounded-full border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setFilter({ tdm: !search.tdm })}
            aria-pressed={search.tdm}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              search.tdm
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Needs blood levels
          </button>
          <button
            type="button"
            onClick={() => setFilter({ infusion: !search.infusion })}
            aria-pressed={search.infusion}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              search.infusion
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
                setFilter({ q: "", class: "", tdm: false, infusion: false });
              }}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          )}
        </div>

        <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
          {loading
            ? "Loading the library…"
            : `${results.length} of ${drugs.length} drugs${hasFilters ? " match" : ""}`}
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            The library could not be loaded just now. Please check your connection and try again.
          </p>
        )}

        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {results.slice(0, 120).map((d) => (
            <li key={d.slug}>
              <Link
                to="/drugs/$slug"
                params={{ slug: d.slug }}
                className="flex flex-col gap-0.5 px-4 py-3 transition hover:bg-muted"
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{d.name}</span>
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
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {d.drug_class}
                </span>
                <span className="text-sm text-muted-foreground">{d.indication_oneliner}</span>
              </Link>
            </li>
          ))}
        </ul>

        {!loading && results.length === 0 && (
          <p className="mt-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No drugs match that search. Try a shorter term or clear the filters.
          </p>
        )}

        {results.length > 120 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Showing the first 120 matches — keep typing to narrow the list.
          </p>
        )}
      </main>
    </ReferenceAppLayout>
  );
}
