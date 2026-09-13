import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Anaesthesia & Critical Care Drugs — Drug Reference" },
      { name: "description", content: "Bedside drug reference for anaesthesia and critical care: presentations, dosing, standard dilutions with pump rates, pharmacokinetics, safety and therapeutic drug monitoring, each monograph referenced." },
      { property: "og:title", content: "Anaesthesia & Critical Care Drugs — Drug Reference" },
      { property: "og:description", content: "Bedside drug reference for anaesthesia and critical care: presentations, dosing, standard dilutions with pump rates, pharmacokinetics, safety and therapeutic drug monitoring, each monograph referenced." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceHome,
});

import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calculator, Download, FlaskConical, Pill, Search, Syringe } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useDrugList } from "@/features/drugReference/useDrugReference";
import { drugDilutions } from "@/features/drugReference/dilutions";
import { cachedMonographCount } from "@/features/drugReference/cache";
import { allReferenceTopics, topicForClass } from "@/features/drugReference/topics";

function DrugReferenceHome() {
  const { drugs, loading } = useDrugList();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const monitoredCount = useMemo(() => drugs.filter((d) => d.requires_tdm).length, [drugs]);
  const savedCount = cachedMonographCount();

  const topicCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of drugs) {
      const slug = topicForClass(d.drug_class).slug;
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    return allReferenceTopics
      .map((t) => ({ topic: t, count: counts.get(t.slug) ?? 0 }))
      .filter(({ count }) => count > 0);
  }, [drugs]);

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return drugs
      .filter(
        (d) =>
          d.name.toLowerCase().includes(needle) ||
          (d.synonyms ?? []).some((s) => s.toLowerCase().includes(needle)) ||
          d.drug_class.toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [drugs, query]);

  return (
    <ReferenceAppLayout
      title="Anaesthetics & Critical Care Drug Reference | AnaesthesiaCore"
      description="Standalone anaesthetic and critical care drug reference: presentations, dosing, standard dilutions with pump rates, pharmacokinetics, safety and therapeutic drug level monitoring, each with BNF and SPC sources."
      canonicalPath="/reference"
    >
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
          Anaesthetics &amp; Critical Care Drug Reference
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          A bedside drug library you can use on its own: presentation and preparation, adult and
          infusion dosing, ready-to-draw-up dilutions with pump rates in mL/h, pharmacokinetics,
          adverse effects, interactions, and full blood level monitoring where it matters. Every
          monograph lists its own sources.
        </p>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const first = suggestions[0];
            if (first) navigate({ to: "/drugs/$slug", params: { slug: first.slug } });
            else navigate({ to: "/drugs", search: { q: query } });
          }}
        >
          <label className="relative block">
            <span className="sr-only">Search the drug reference</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a drug, brand name or class…"
              className="w-full rounded-md border border-input bg-background py-3 pl-9 pr-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </form>

        {suggestions.length > 0 && (
          <ul className="mt-2 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {suggestions.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/drugs/$slug" params={{ slug: d.slug }}
                  className="flex items-baseline justify-between gap-3 px-4 py-2.5 text-sm hover:bg-muted"
                >
                  <span className="font-medium text-foreground">{d.name}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {d.drug_class}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Monographs", value: loading && !drugs.length ? "—" : String(drugs.length) },
            { label: "With blood levels", value: monitoredCount ? String(monitoredCount) : "—" },
            { label: "Infusion recipes", value: String(drugDilutions.length) },
            { label: "Saved for offline", value: String(savedCount) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="mt-1 text-xl font-semibold text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-10 font-serif text-xl text-foreground">Where to go</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {([
            {
              to: "/drugs",
              icon: Pill,
              title: "Browse all drugs",
              body: "Search by name, brand, class or indication, or jump straight to a letter.",
            },
            {
              to: "/topics",
              icon: BookOpen,
              title: "Browse by topic",
              body: "Vasoactive support, sedation, analgesia, anticoagulation and more, each with bedside points.",
            },
            {
              to: "/monitoring",
              icon: FlaskConical,
              title: "Blood level monitoring",
              body: "Target ranges, sampling timing, toxicity thresholds and dose adjustment.",
            },
            {
              to: "/infusions",
              icon: Syringe,
              title: "Infusions and dilutions",
              body: "Standard diluents, how to draw each syringe up, and the resulting mL/h.",
            },
            {
              to: "/calculator",
              icon: Calculator,
              title: "Infusion rate calculator",
              body: "Enter weight and dose to get mL/h, mL/day and syringe run time.",
            },
          ] as const).map((card) => (
            <li key={card.to}>
              <Link
                to={card.to}
                className="flex h-full gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
              >
                <card.icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold text-foreground">{card.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{card.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-10 flex gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <Download aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Use it offline.</strong> Every drug you open is saved
            on this device for 30 days, so it stays readable with no signal. On a phone, use your
            browser&apos;s <em>Add to Home Screen</em> to open it like an app.
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
