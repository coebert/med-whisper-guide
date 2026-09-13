import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calculator")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Infusion Rate Calculator — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Calculate infusion pump rates in mL/h from dose and patient weight for standard critical care drug dilutions." },
      { property: "og:title", content: "Infusion Rate Calculator — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Calculate infusion pump rates in mL/h from dose and patient weight for standard critical care drug dilutions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceCalculator,
});

import { useMemo, useState } from "react";
import { Link, useSearch } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import {
  calculateRate,
  drugDilutions,
  formatRate,
  round,
} from "@/features/drugReference/dilutions";

function DrugReferenceCalculator() {
  const params = useSearch({ strict: false }) as Record<string, string | undefined>;
  const prefillDrug = params["drug"];
  const prefillWeight = Number(params["weight"]);

  const initialIndex = Math.max(
    0,
    drugDilutions.findIndex((d) => d.drug === prefillDrug),
  );
  const [index, setIndex] = useState(initialIndex);
  const [weight, setWeight] = useState(
    Number.isFinite(prefillWeight) && prefillWeight > 0 ? prefillWeight : 70,
  );
  const dilution = drugDilutions[index] ?? drugDilutions[0]!;
  const [dose, setDose] = useState(dilution.startDose);

  const result = useMemo(
    () => calculateRate(dilution, dose > 0 ? dose : 0, weight > 0 ? weight : 0),
    [dilution, dose, weight],
  );

  const outOfRange = dose > 0 && (dose < dilution.minDose || dose > dilution.maxDose);

  return (
    <ReferenceAppLayout
      title="Infusion Rate Calculator | Drug Reference"
      description="Convert a critical care infusion dose into a pump rate: enter the drug, weight and dose to get mL/h, millilitres per day and how long a 50 mL syringe lasts."
      canonicalPath="/reference/calculator"
    >
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Infusion rate calculator</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Pick a standard recipe, set the weight and the dose you want, and read off the pump rate.
          Always cross-check against the pump&apos;s own drug library before starting an infusion.
        </p>

        <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-4">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Drug and dilution</span>
            <select
              value={index}
              onChange={(e) => {
                const next = Number(e.target.value);
                setIndex(next);
                const next_d = drugDilutions[next];
                if (next_d) setDose(next_d.startDose);
              }}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {drugDilutions.map((d, i) => (
                <option key={`${d.drug}-${i}`} value={i}>
                  {d.drug} — {d.concentrationLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Weight (kg)</span>
              <input
                type="number"
                min={1}
                max={250}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                disabled={!dilution.perKg}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {!dilution.perKg && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  This recipe uses a fixed dose, not a weight-based dose.
                </span>
              )}
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">
                Dose ({dilution.unit})
              </span>
              <input
                type="number"
                min={0}
                step="any"
                value={dose}
                onChange={(e) => setDose(Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="mt-1 block text-xs text-muted-foreground">
                Usual range {dilution.minDose}–{dilution.maxDose} {dilution.unit}
              </span>
            </label>
          </div>

          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Preparation:</strong> {dilution.drawUp} in{" "}
            {dilution.diluent} ({dilution.concentrationLabel}).
          </p>
        </div>

        {outOfRange && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            That dose is outside the usual range for {dilution.drug}. Check the indication and your
            local guideline before using it.
          </p>
        )}

        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">Pump rate</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">
              {formatRate(result.mlPerHour)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">Delivered per hour</dt>
            <dd className="mt-1 text-2xl font-semibold text-foreground">{result.perHourLabel}</dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">Volume in 24 hours</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {round(result.mlPerDay, 1)} mL
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">A 50 mL syringe lasts</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {result.syringeHours ? `${round(result.syringeHours, 1)} h` : "—"}
            </dd>
          </div>
        </dl>

        {dilution.slug && (
          <p className="mt-6 text-sm">
            <Link to="/drugs/$slug" params={{ slug: dilution.slug }} className="text-primary underline">
              Open the {dilution.drug} monograph
            </Link>
          </p>
        )}
      </main>
    </ReferenceAppLayout>
  );
}
