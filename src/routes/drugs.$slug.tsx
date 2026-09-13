import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/drugs/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Drug Monograph — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Full drug monograph: presentation, preparation, dosing, dilutions, pharmacokinetics, adverse effects, interactions, monitoring and sources." },
      { property: "og:title", content: "Drug Monograph — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Full drug monograph: presentation, preparation, dosing, dilutions, pharmacokinetics, adverse effects, interactions, monitoring and sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceEntry,
});

import { useMemo, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ExternalLink, Eye } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useDrugEntry } from "@/features/drugReference/useDrugReference";
import { topicForClass } from "@/features/drugReference/topics";
import {
  calculateRate,
  dilutionsForSlug,
  formatRate,
  isUnitDrug,
  round,
} from "@/features/drugReference/dilutions";
import type { DrugDilution, DrugSource } from "@/features/drugReference/types";
import { SourceChips, sectionSources } from "@/features/drugReference/references";
import { APPEARANCE_CAUTION, describeAppearance } from "@/features/drugReference/appearance";

function AppearancePanel({ presentation }: { presentation?: string | null }) {
  const summary = useMemo(() => describeAppearance(presentation), [presentation]);
  if (!summary) return null;

  const rows: Array<[string, string]> = [];
  if (summary.colour) rows.push(["Colour / clarity", summary.colour]);
  if (summary.form) rows.push(["Form", summary.form]);
  if (summary.containers.length) rows.push(["Container", summary.containers.join(", ")]);
  if (summary.strengths.length) rows.push(["Label states", summary.strengths.join(" · ")]);
  if (summary.storage.length) rows.push(["Storage", summary.storage.join(" · ")]);

  return (
    <div className="mb-4 rounded-md border border-border bg-background/60 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
        How it looks
      </h3>
      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" aria-hidden="true" />
        <span>{APPEARANCE_CAUTION}</span>
      </p>
    </div>
  );
}

function Prose({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  return (
    <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
      {lines.map((line, i) => (
        <p key={i}>{line.replace(/^[•\-]\s*/, "• ")}</p>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
  id,
  refs,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
  refs?: DrugSource[];
}) {
  return (
    <section id={id} className="rounded-lg border border-border bg-card p-5">
      <h2 className="font-serif text-xl text-foreground">{title}</h2>
      <div className="mt-3">{children}</div>
      {refs && <SourceChips sources={refs} />}
    </section>
  );
}

function DilutionCard({ dilution, weightKg }: { dilution: DrugDilution; weightKg: number }) {
  const [dose, setDose] = useState(dilution.startDose);
  const result = useMemo(() => calculateRate(dilution, dose, weightKg), [dilution, dose, weightKg]);
  const start = calculateRate(dilution, dilution.startDose, weightKg);
  const min = calculateRate(dilution, dilution.minDose, weightKg);
  const max = calculateRate(dilution, dilution.maxDose, weightKg);
  const unitDrug = isUnitDrug(dilution.unit);

  return (
    <div className="rounded-md border border-border bg-background p-4">
      <p className="font-semibold text-foreground">{dilution.drug}</p>
      <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Draw up</dt>
          <dd className="text-foreground">{dilution.drawUp}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Safe diluent</dt>
          <dd className="text-foreground">{dilution.diluent}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Final concentration</dt>
          <dd className="text-foreground">{dilution.concentrationLabel}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Dose range</dt>
          <dd className="text-foreground">
            {dilution.minDose}–{dilution.maxDose} {dilution.unit} (start {dilution.startDose})
          </dd>
        </div>
      </dl>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <caption className="sr-only">
            Pump rates for {dilution.drug} at {weightKg} kg
          </caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-1.5 pr-3">
                Point
              </th>
              <th scope="col" className="py-1.5 pr-3">
                Dose
              </th>
              <th scope="col" className="py-1.5 pr-3">
                Per hour
              </th>
              <th scope="col" className="py-1.5">
                Pump rate
              </th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {[
              { label: "Minimum", dose: dilution.minDose, r: min },
              { label: "Starting", dose: dilution.startDose, r: start },
              { label: "Maximum", dose: dilution.maxDose, r: max },
            ].map((row) => (
              <tr key={row.label} className="border-b border-border/60 last:border-0">
                <td className="py-1.5 pr-3">{row.label}</td>
                <td className="py-1.5 pr-3">
                  {row.dose} {dilution.unit}
                </td>
                <td className="py-1.5 pr-3">{row.r.perHourLabel}</td>
                <td className="py-1.5 font-medium">{formatRate(row.r.mlPerHour)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-md bg-muted/50 p-3">
        <label className="block text-xs font-medium text-muted-foreground" htmlFor={`dose-${dilution.drug}`}>
          Work out a rate — dose in {dilution.unit}
        </label>
        <input
          id={`dose-${dilution.drug}`}
          type="number"
          min={0}
          step="any"
          value={Number.isFinite(dose) ? dose : ""}
          onChange={(e) => setDose(Number(e.target.value))}
          className="mt-1 w-32 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-2 text-sm text-foreground">
          <span className="font-semibold">{formatRate(result.mlPerHour)}</span> — delivers{" "}
          {result.perHourLabel}
          {dilution.perKg ? ` at ${weightKg} kg` : ""}. {round(result.mlPerDay, 1)} mL in 24 h
          {result.syringeHours ? `; a 50 mL syringe lasts ${round(result.syringeHours, 1)} h` : ""}.
        </p>
        {unitDrug && (
          <p className="mt-1 text-xs text-muted-foreground">
            Dosed in units — never convert units to milligrams.
          </p>
        )}
      </div>

      {dilution.notes && <p className="mt-3 text-sm text-muted-foreground">{dilution.notes}</p>}
    </div>
  );
}

function DrugReferenceEntry() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const { drug, loading, error } = useDrugEntry(slug);
  const [weightKg, setWeightKg] = useState(70);
  const dilutions = slug ? dilutionsForSlug(slug) : [];

  if (loading) {
    return (
      <ReferenceAppLayout
        title="Loading drug… | Drug Reference"
        description="Anaesthetic and critical care drug monograph."
        canonicalPath={`/reference/drugs/${slug ?? ""}`}
      >
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <p className="text-sm text-muted-foreground">Loading the drug entry…</p>
        </main>
      </ReferenceAppLayout>
    );
  }

  if (error || !drug) {
    return (
      <ReferenceAppLayout
        title="Drug not found | Drug Reference"
        description="Anaesthetic and critical care drug monograph."
        canonicalPath={`/reference/drugs/${slug ?? ""}`}
      >
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <h1 className="font-serif text-2xl text-foreground">Drug not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We could not find that entry. Return to the{" "}
            <Link className="underline" to="/drugs">
              drug reference library
            </Link>
            .
          </p>
        </main>
      </ReferenceAppLayout>
    );
  }

  const tdm = drug.tdm;

  return (
    <ReferenceAppLayout
      title={`${drug.name} — dosing, dilutions & monitoring | Drug Reference`}
      description={`${drug.name}: ${drug.indication_oneliner} Presentation, preparation, dosing, standard dilutions and pump rates, pharmacokinetics, adverse effects, interactions${
        drug.requires_tdm ? " and therapeutic drug level monitoring" : ""
      }, with referenced sources.`}
      canonicalPath={`/reference/drugs/${drug.slug}`}
    >
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link
            to="/drugs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Drug reference library
          </Link>
          <h1 className="mt-3 font-serif text-3xl text-foreground">{drug.name}</h1>
          <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">
            {drug.drug_class}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Topic:{" "}
            <Link
              className="text-primary underline"
              to="/topics/$slug" params={{ slug: topicForClass(drug.drug_class).slug }}
            >
              {topicForClass(drug.drug_class).title}
            </Link>
          </p>
          {drug.synonyms?.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              Also known as: {drug.synonyms.join(", ")}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-foreground">{drug.indication_oneliner}</p>
          {drug.key_warning && (
            <p className="mt-3 flex gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
              <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{drug.key_warning}</span>
            </p>
          )}
          <SourceChips sources={sectionSources(drug.sources, "overview")} label="Referenced from" />
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6">
        <Section title="Dosing" refs={sectionSources(drug.sources, "dosing")}>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Adult bolus</dt>
              <dd className="text-sm text-foreground">{drug.adult_bolus_dose}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Infusion range
              </dt>
              <dd className="text-sm text-foreground">{drug.infusion_range}</dd>
            </div>
          </dl>
          <div className="mt-3">
            <Prose text={drug.dosing} />
          </div>
        </Section>

        {dilutions.length > 0 && (
          <Section
            title="Standard dilutions and pump rates"
            id="dilutions"
            refs={sectionSources(drug.sources, "dilutions")}
          >
            <div className="rounded-md bg-muted/50 p-3">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="weight">
                Patient weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                min={1}
                max={250}
                value={Number.isFinite(weightKg) ? weightKg : ""}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 block w-28 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="mt-3 space-y-4">
              {dilutions.map((d) => (
                <DilutionCard key={d.drug} dilution={d} weightKg={weightKg || 70} />
              ))}
            </div>
          </Section>
        )}

        <Section title="Presentation" refs={sectionSources(drug.sources, "presentation")}>
          <AppearancePanel presentation={drug.presentation} />
          <Prose text={drug.presentation} />
        </Section>

        <Section
          title="Preparation and administration"
          refs={sectionSources(drug.sources, "preparation")}
        >
          <Prose text={drug.preparation} />
        </Section>

        {tdm && (
          <Section
            title="Therapeutic drug level monitoring"
            id="monitoring-levels"
            refs={
              tdm.sources && tdm.sources.length > 0
                ? tdm.sources
                : sectionSources(drug.sources, "tdm")
            }
          >
            {tdm.indication && <p className="text-sm text-foreground">{tdm.indication}</p>}
            {tdm.matrix && (
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Sample: </span>
                {tdm.matrix}
              </p>
            )}

            {tdm.targets && tdm.targets.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Target ranges</h3>
                <ul className="mt-2 space-y-2">
                  {tdm.targets.map((t) => (
                    <li key={t.label} className="rounded-md border border-border bg-background p-3 text-sm">
                      <span className="text-muted-foreground">{t.label}</span>
                      <span className="mt-0.5 block font-semibold text-foreground">{t.value}</span>
                      {t.note && <span className="mt-1 block text-muted-foreground">{t.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tdm.timing && tdm.timing.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">When to take the sample</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {tdm.timing.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {tdm.toxicity && tdm.toxicity.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Toxicity thresholds and what to do
                </h3>
                <ul className="mt-2 space-y-2">
                  {tdm.toxicity.map((t) => (
                    <li
                      key={t.threshold}
                      className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm"
                    >
                      <span className="font-semibold text-foreground">{t.threshold}</span>
                      <span className="mt-1 block text-muted-foreground">{t.features}</span>
                      <span className="mt-1 block text-foreground">Action: {t.action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tdm.sampling && tdm.sampling.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Sampling practicalities</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {tdm.sampling.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {tdm.adjustment && tdm.adjustment.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground">Dose adjustment</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {tdm.adjustment.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        <Section title="Mechanism of action" refs={sectionSources(drug.sources, "mechanism")}>
          <Prose text={drug.mechanism_of_action} />
        </Section>

        <Section title="Pharmacokinetics" refs={sectionSources(drug.sources, "pharmacokinetics")}>
          <Prose text={drug.pharmacokinetics} />
        </Section>

        <Section title="Monitoring" refs={sectionSources(drug.sources, "monitoring")}>
          <Prose text={drug.monitoring} />
        </Section>

        <Section title="Adverse effects" refs={sectionSources(drug.sources, "side_effects")}>
          <Prose text={drug.side_effects} />
        </Section>

        <Section
          title="Contraindications and cautions"
          refs={sectionSources(drug.sources, "contraindications")}
        >
          <Prose text={drug.contraindications} />
        </Section>

        <Section title="Interactions" refs={sectionSources(drug.sources, "interactions")}>
          <Prose text={drug.interactions} />
        </Section>

        <Section title="Sources" id="sources">
          <ul className="space-y-2 text-sm">
            {[...drug.sources, ...(tdm?.sources ?? [])].map((s) => (
              <li key={`${s.title}-${s.url}`}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1 text-foreground underline decoration-muted-foreground/50 hover:decoration-foreground"
                >
                  <span>
                    {s.title} — <span className="text-muted-foreground">{s.publisher}</span>
                  </span>
                  <ExternalLink aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm">
            <Link to="/sources" className="text-primary underline">
              See the full list of clinical sources (BNF, SPC, NICE, RCoA)
            </Link>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Educational reference for trained clinicians. Always confirm doses, dilutions and
            monitoring targets against the BNF, the product SPC, your smart-pump drug library and
            local protocols before administration.
          </p>
        </Section>
      </main>
    </ReferenceAppLayout>
  );
}
