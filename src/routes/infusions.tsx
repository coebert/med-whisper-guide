import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/infusions")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Infusion Recipes — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Standard infusion recipes for critical care: concentrations, diluents, starting doses and pump rates in mL/h, weight-adjusted." },
      { property: "og:title", content: "Infusion Recipes — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Standard infusion recipes for critical care: concentrations, diluents, starting doses and pump rates in mL/h, weight-adjusted." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceInfusions,
});

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import {
  calculateRate,
  drugDilutions,
  formatRate,
} from "@/features/drugReference/dilutions";
import { SourceChips, standardRefs } from "@/features/drugReference/references";

function DrugReferenceInfusions() {
  const [query, setQuery] = useState("");
  const [weight, setWeight] = useState(70);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matching = drugDilutions.filter(
      (d) =>
        !needle ||
        d.drug.toLowerCase().includes(needle) ||
        d.group.toLowerCase().includes(needle) ||
        d.diluent.toLowerCase().includes(needle),
    );
    const byGroup = new Map<string, typeof matching>();
    matching.forEach((d) => {
      const list = byGroup.get(d.group) ?? [];
      list.push(d);
      byGroup.set(d.group, list);
    });
    return Array.from(byGroup.entries());
  }, [query]);

  const safeWeight = weight > 0 ? weight : 70;
  const matchCount = groups.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
          Standard infusions and dilutions
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Practical draw-up recipes with the resulting concentration, a starting dose and dose range,
          and the pump rate those doses produce at the weight you set. Confirm against your unit&apos;s
          own concentrations and smart-pump library — concentrations differ between hospitals.
        </p>

        {/* Search and weight stay in view while scrolling so rates can be re-read one-handed. */}
        <div className="sticky top-[3.25rem] z-20 -mx-4 mt-6 grid gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:grid-cols-[1fr_auto] sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none md:top-[6.5rem]">
          <label className="relative block">
            <span className="sr-only">Search infusions</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search drug, group or diluent…"
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:py-2 sm:text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Weight
            <input
              type="number"
              inputMode="decimal"
              min={1}
              max={250}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-20 rounded-md border border-input bg-background px-2 py-2.5 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:py-2 sm:text-sm"
            />
            kg
          </label>
        </div>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {matchCount} of {drugDilutions.length} infusion recipes
        </p>

        {groups.map(([group, list]) => (
          <section key={group} className="mt-6">
            <h2 className="font-serif text-lg text-foreground">{group}</h2>
            <div className="mt-3 space-y-3">
              {list.map((d) => {
                const start = calculateRate(d, d.startDose, safeWeight);
                const min = calculateRate(d, d.minDose, safeWeight);
                const max = calculateRate(d, d.maxDose, safeWeight);
                return (
                  <article
                    key={`${d.drug}-${d.concentrationLabel}`}
                    className="rounded-lg border border-border bg-card p-4"
                  >
                    <header className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{d.drug}</h3>
                      <span className="text-xs text-muted-foreground">{d.concentrationLabel}</span>
                    </header>
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs text-muted-foreground">Diluent</dt>
                        <dd className="text-sm text-foreground">{d.diluent}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Draw up</dt>
                        <dd className="text-sm text-foreground">{d.drawUp}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Starting dose</dt>
                        <dd className="text-sm text-foreground">
                          {d.startDose} {d.unit} · {formatRate(start.mlPerHour)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Usual range</dt>
                        <dd className="text-sm text-foreground">
                          {d.minDose}–{d.maxDose} {d.unit} · {formatRate(min.mlPerHour)} to{" "}
                          {formatRate(max.mlPerHour)}
                        </dd>
                      </div>
                    </dl>
                    {d.notes && (
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{d.notes}</p>
                    )}
                    <SourceChips sources={standardRefs(d.drug)} label="Check against" />
                    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <Link
                        to="/calculator" search={{ drug: d.drug, weight: safeWeight }}
                        className="text-primary underline"
                      >
                        Calculate a rate
                      </Link>
                      {d.slug && (
                        <Link to="/drugs/$slug" params={{ slug: d.slug }} className="text-primary underline">
                          Full monograph
                        </Link>
                      )}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

        {matchCount === 0 && (
          <p className="mt-6 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No infusion recipe matches that search.
          </p>
        )}
      </main>
    </ReferenceAppLayout>
  );
}
