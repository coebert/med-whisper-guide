import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/compare")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    a: typeof search["a"] === "string" ? search["a"] : "",
    b: typeof search["b"] === "string" ? search["b"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Compare Drugs — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Pick any two anaesthetic or critical care drugs and compare their bolus doses, infusion rates, preparation, key warnings and referenced sources side by side.",
      },
      { property: "og:title", content: "Compare Drugs — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Side-by-side comparison of doses, infusion rates, preparation and sources for any two drugs in the reference.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ComparePage,
});

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, ExternalLink, Search, X } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import {
  useDrugEntry,
  useDrugList,
  type DrugListItem,
} from "@/features/drugReference/useDrugReference";
import { drugDilutions } from "@/features/drugReference/dilutions";
import { classifySource, sourceKindLabel } from "@/features/drugReference/references";
import type { DrugDilution, DrugReferenceRow } from "@/features/drugReference/types";

const ROWS: { key: keyof DrugReferenceRow; label: string }[] = [
  { key: "drug_class", label: "Class" },
  { key: "indication_oneliner", label: "Main use" },
  { key: "key_warning", label: "Key warning" },
  { key: "adult_bolus_dose", label: "Adult bolus dose" },
  { key: "infusion_range", label: "Infusion range" },
  { key: "presentation", label: "Presentation" },
  { key: "preparation", label: "Preparation" },
  { key: "dosing", label: "Dosing detail" },
  { key: "monitoring", label: "Monitoring" },
  { key: "contraindications", label: "Contraindications" },
  { key: "interactions", label: "Interactions" },
];

function matches(drug: DrugListItem, needle: string) {
  const n = needle.toLowerCase();
  return (
    drug.name.toLowerCase().includes(n) ||
    (drug.synonyms ?? []).some((s) => s.toLowerCase().includes(n)) ||
    drug.drug_class.toLowerCase().includes(n)
  );
}

/** Type-ahead picker for one side of the comparison. */
function DrugPicker({
  label,
  drugs,
  value,
  onPick,
}: {
  label: string;
  drugs: DrugListItem[];
  value: DrugListItem | undefined;
  onPick: (slug: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const suggestions = useMemo(() => {
    const needle = query.trim();
    if (!needle) return [];
    return drugs
      .filter((d) => matches(d, needle))
      .sort((a, b) => {
        const an = a.name.toLowerCase().startsWith(needle.toLowerCase()) ? 0 : 1;
        const bn = b.name.toLowerCase().startsWith(needle.toLowerCase()) ? 0 : 1;
        return an - bn || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [drugs, query]);

  if (value) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/50 bg-card px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="truncate font-semibold text-foreground">{value.name}</p>
          <p className="truncate text-xs text-muted-foreground">{value.drug_class}</p>
        </div>
        <button
          type="button"
          onClick={() => onPick("")}
          aria-label={`Clear ${label}`}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-autocomplete="list"
        aria-label={label}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && suggestions[0]) {
            e.preventDefault();
            onPick(suggestions[0].slug);
            setQuery("");
          } else if (e.key === "Escape") setOpen(false);
        }}
        placeholder={`${label}: type a drug name…`}
        className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          {suggestions.map((d) => (
            <li key={d.slug} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => {
                  onPick(d.slug);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full flex-col items-start px-4 py-2 text-left hover:bg-muted"
              >
                <span className="text-sm font-semibold text-foreground">{d.name}</span>
                <span className="text-xs text-muted-foreground">{d.drug_class}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div
      className={`whitespace-pre-line px-3 py-3 text-sm leading-relaxed ${
        muted ? "text-muted-foreground" : "text-foreground"
      }`}
    >
      {children}
    </div>
  );
}

function RecipeCell({ recipes }: { recipes: DrugDilution[] }) {
  if (recipes.length === 0) return <Cell muted>No standard recipe in this app</Cell>;
  return (
    <Cell>
      <ul className="space-y-2">
        {recipes.map((r) => (
          <li key={r.drug + r.drawUp}>
            <span className="font-medium">{r.drawUp}</span> in {r.diluent} ={" "}
            {r.concentrationLabel}
            <br />
            <span className="text-muted-foreground">
              {r.minDose}–{r.maxDose} {r.unit} (start {r.startDose})
            </span>
          </li>
        ))}
      </ul>
    </Cell>
  );
}

function SourcesCell({ drug }: { drug: DrugReferenceRow }) {
  if (drug.sources.length === 0) return <Cell muted>No sources listed</Cell>;
  return (
    <Cell>
      <ul className="space-y-1.5">
        {drug.sources.map((s) => (
          <li key={s.url + s.title}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-primary underline-offset-2 hover:underline"
            >
              <span className="mt-0.5 shrink-0 rounded border border-border px-1 text-[10px] uppercase text-muted-foreground no-underline">
                {sourceKindLabel[classifySource(s)]}
              </span>
              <span>
                {s.title}
                <ExternalLink aria-hidden="true" className="ml-1 inline h-3 w-3" />
              </span>
            </a>
            <span className="block text-xs text-muted-foreground">{s.publisher}</span>
          </li>
        ))}
      </ul>
    </Cell>
  );
}

function ComparePage() {
  const { drugs, loading } = useDrugList();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });

  const a = useDrugEntry(search.a || undefined);
  const b = useDrugEntry(search.b || undefined);

  const listA = drugs.find((d) => d.slug === search.a);
  const listB = drugs.find((d) => d.slug === search.b);

  const set = (patch: Partial<{ a: string; b: string }>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

  const recipesFor = (slug: string) => drugDilutions.filter((d) => d.slug === slug);

  const both = a.drug && b.drug;

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Compare two drugs</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick two drugs to see their doses, infusion rates, preparation and sources side by side.
        </p>

        <div className="mt-6 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <DrugPicker label="Drug A" drugs={drugs} value={listA} onPick={(slug) => set({ a: slug })} />
          <button
            type="button"
            onClick={() => set({ a: search.b, b: search.a })}
            disabled={!search.a && !search.b}
            aria-label="Swap drugs"
            className="mx-auto rounded-full border border-border p-2 text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeftRight aria-hidden="true" className="h-4 w-4" />
          </button>
          <DrugPicker label="Drug B" drugs={drugs} value={listB} onPick={(slug) => set({ b: slug })} />
        </div>

        {loading && drugs.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">Loading the library…</p>
        )}

        {!both && !loading && (
          <p className="mt-6 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {search.a || search.b
              ? (a.loading || b.loading)
                ? "Loading the monographs…"
                : "Choose a second drug to start the comparison."
              : "Choose two drugs above — for example noradrenaline and metaraminol, or fentanyl and remifentanil."}
          </p>
        )}

        {both && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-[minmax(6.5rem,0.6fr)_1fr_1fr] border-b border-border bg-muted/40">
              <div className="px-3 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                Field
              </div>
              {[a.drug!, b.drug!].map((d) => (
                <div key={d.slug} className="px-3 py-3">
                  <Link
                    to="/drugs/$slug"
                    params={{ slug: d.slug }}
                    className="font-semibold text-primary hover:underline"
                  >
                    {d.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{d.drug_class}</p>
                </div>
              ))}
            </div>

            {ROWS.map((row) => {
              const va = String(a.drug![row.key] ?? "");
              const vb = String(b.drug![row.key] ?? "");
              if (!va && !vb) return null;
              return (
                <div
                  key={row.key}
                  className="grid grid-cols-[minmax(6.5rem,0.6fr)_1fr_1fr] border-b border-border last:border-b-0"
                >
                  <div className="bg-muted/20 px-3 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </div>
                  <Cell muted={!va}>{va || "—"}</Cell>
                  <Cell muted={!vb}>{vb || "—"}</Cell>
                </div>
              );
            })}

            <div className="grid grid-cols-[minmax(6.5rem,0.6fr)_1fr_1fr] border-b border-border">
              <div className="bg-muted/20 px-3 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Infusion recipe
              </div>
              <RecipeCell recipes={recipesFor(a.drug!.slug)} />
              <RecipeCell recipes={recipesFor(b.drug!.slug)} />
            </div>

            <div className="grid grid-cols-[minmax(6.5rem,0.6fr)_1fr_1fr]">
              <div className="bg-muted/20 px-3 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sources
              </div>
              <SourcesCell drug={a.drug!} />
              <SourcesCell drug={b.drug!} />
            </div>
          </div>
        )}

        {both && (
          <p className="mt-4 text-xs text-muted-foreground">
            Guidance only — confirm against local policy and the linked sources before prescribing.
            Open the full monographs for pharmacokinetics, side effects and blood level targets.
          </p>
        )}
      </main>
    </ReferenceAppLayout>
  );
}
