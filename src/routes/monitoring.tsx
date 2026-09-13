import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/monitoring")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Therapeutic Drug Level Monitoring — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Therapeutic drug monitoring reference: target ranges, sampling timing, toxicity thresholds and actions, and dose adjustment guidance for anaesthetic and critical care drugs." },
      { property: "og:title", content: "Therapeutic Drug Level Monitoring — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Therapeutic drug monitoring reference: target ranges, sampling timing, toxicity thresholds and actions, and dose adjustment guidance for anaesthetic and critical care drugs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceMonitoring,
});

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Search } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useMonitoredDrugs } from "@/features/drugReference/useDrugReference";

function DrugReferenceMonitoring() {
  const { drugs, loading, error } = useMonitoredDrugs();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return drugs;
    return drugs.filter(
      (d) =>
        d.name.toLowerCase().includes(needle) ||
        d.drug_class.toLowerCase().includes(needle) ||
        (d.tdm?.matrix ?? "").toLowerCase().includes(needle),
    );
  }, [drugs, query]);

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
          Therapeutic drug level monitoring
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Every drug in the library that needs blood levels, with the target range, when to sample,
          the thresholds that signal toxicity and what to do, plus dose-adjustment guidance. Assay
          methods and reference ranges vary between laboratories — always confirm locally.
        </p>

        <label className="relative mt-6 block">
          <span className="sr-only">Search monitored drugs</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drug, class or sample type…"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {loading && !drugs.length
            ? "Loading monitoring data…"
            : `${filtered.length} of ${drugs.length} monitored drugs`}
        </p>

        {error && !drugs.length && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            Monitoring data could not be loaded. Check your connection and try again.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {filtered.map((d) => (
            <article key={d.slug} className="rounded-lg border border-border bg-card p-4">
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold text-foreground">
                  <Link to="/drugs/$slug" params={{ slug: d.slug }} className="hover:underline">
                    {d.name}
                  </Link>
                </h2>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {d.drug_class}
                </span>
              </header>

              {d.tdm?.matrix && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Sample: {d.tdm.matrix}
                  {d.tdm.indication ? ` · ${d.tdm.indication}` : ""}
                </p>
              )}

              {d.tdm?.targets && d.tdm.targets.length > 0 && (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {d.tdm.targets.map((t, i) => (
                    <div key={`${t.label}-${i}`} className="rounded-md border border-border bg-background p-3">
                      <dt className="text-xs text-muted-foreground">{t.label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-foreground">{t.value}</dd>
                      {t.note && (
                        <dd className="mt-1 text-xs text-muted-foreground">{t.note}</dd>
                      )}
                    </div>
                  ))}
                </dl>
              )}

              {d.tdm?.timing && d.tdm.timing.length > 0 && (
                <section className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    When to sample
                  </h3>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {d.tdm.timing.map((line, i) => (
                      <li key={`${line}-${i}`}>{line}</li>
                    ))}
                  </ul>
                </section>
              )}

              {d.tdm?.toxicity && d.tdm.toxicity.length > 0 && (
                <section className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Toxicity thresholds and actions
                  </h3>
                  <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
                    {d.tdm.toxicity.map((t, i) => (
                      <li key={`${t.threshold}-${i}`} className="rounded-md border border-border p-2.5">
                        <span className="font-medium text-foreground">{t.threshold}</span> —{" "}
                        {t.features}
                        <span className="mt-1 block">
                          <strong className="text-foreground">Action:</strong> {t.action}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {d.tdm?.sampling && d.tdm.sampling.length > 0 && (
                <section className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sampling practicalities
                  </h3>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {d.tdm.sampling.map((line, i) => (
                      <li key={`${line}-${i}`}>{line}</li>
                    ))}
                  </ul>
                </section>
              )}

              {d.tdm?.adjustment && d.tdm.adjustment.length > 0 && (
                <section className="mt-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Dose adjustment
                  </h3>
                  <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {d.tdm.adjustment.map((line, i) => (
                      <li key={`${line}-${i}`}>{line}</li>
                    ))}
                  </ul>
                </section>
              )}

              {(d.tdm?.sources ?? []).length > 0 && (
                <footer className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {(d.tdm?.sources ?? []).map((s, i) => (
                    <a
                      key={`${s.title}-${s.url}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline hover:text-foreground"
                    >
                      {s.title}
                      <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </a>
                  ))}
                </footer>
              )}
            </article>
          ))}
        </div>
      </main>
    </ReferenceAppLayout>
  );
}
