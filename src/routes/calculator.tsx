import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calculator")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Patient Infusion Calculator — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Enter weight, age and drug to get the pump rate in mL/h and the exact dilution to draw up, with paediatric and adult checks.",
      },
      { property: "og:title", content: "Patient Infusion Calculator — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Enter weight, age and drug to get the pump rate in mL/h and the exact dilution to draw up, with paediatric and adult checks.",
      },
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
  formatConcentration,
  formatRate,
  round,
} from "@/features/drugReference/dilutions";
import { SourceChips, standardRefs } from "@/features/drugReference/references";

type AgeUnit = "years" | "months";

type AgeBand = {
  key: "neonate" | "infant" | "child" | "adolescent" | "adult" | "older";
  label: string;
  note: string;
};

/** Age in whole months, from the entered number and unit. */
function ageInMonths(value: number, unit: AgeUnit): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return unit === "years" ? value * 12 : value;
}

function bandFor(months: number): AgeBand {
  if (months < 1)
    return {
      key: "neonate",
      label: "Neonate (under 1 month)",
      note: "Neonatal doses, fluid volumes and drug handling differ substantially. Use a neonatal guideline and a syringe pump with a low-volume line.",
    };
  if (months < 12)
    return {
      key: "infant",
      label: "Infant (1–11 months)",
      note: "Use a paediatric-strength dilution so the pump runs at a readable rate, and keep total fluid volume in mind.",
    };
  if (months < 144)
    return {
      key: "child",
      label: "Child (1–11 years)",
      note: "Weight-based dosing throughout. Check the dose against BNF for Children and your local paediatric chart.",
    };
  if (months < 216)
    return {
      key: "adolescent",
      label: "Adolescent (12–17 years)",
      note: "Adult recipes are usually appropriate, but cap doses at the adult maximum.",
    };
  if (months < 780)
    return { key: "adult", label: "Adult (18–64 years)", note: "Standard adult recipes apply." };
  return {
    key: "older",
    label: "Older adult (65 years and over)",
    note: "Start at the lower end of the range: sedatives, opioids and vasodilators all have exaggerated effects, and renal and hepatic clearance fall with age.",
  };
}

/** APLS-style weight estimate, for when the patient has not been weighed. */
function estimatedWeight(months: number): number | null {
  if (months <= 0) return null;
  const years = months / 12;
  if (years < 1) return round(0.5 * months + 4, 1);
  if (years <= 5) return round(2 * years + 8, 1);
  if (years <= 12) return round(3 * years + 7, 1);
  return null;
}

function DrugReferenceCalculator() {
  const params = useSearch({ strict: false }) as Record<string, string | undefined>;
  const prefillDrug = params["drug"];
  const prefillWeight = Number(params["weight"]);

  const wanted = prefillDrug?.toLowerCase();
  const initialIndex = Math.max(
    0,
    drugDilutions.findIndex(
      (d) => d.drug.toLowerCase() === wanted || (d.slug !== null && d.slug === wanted),
    ),
  );
  const [index, setIndex] = useState(initialIndex);
  const [weight, setWeight] = useState(
    Number.isFinite(prefillWeight) && prefillWeight > 0 ? prefillWeight : 70,
  );
  const [age, setAge] = useState(40);
  const [ageUnit, setAgeUnit] = useState<AgeUnit>("years");
  const dilution = drugDilutions[index] ?? drugDilutions[0]!;
  const [dose, setDose] = useState(dilution.startDose);

  const months = ageInMonths(age, ageUnit);
  const band = bandFor(months);
  const paediatric = months >= 0 && months < 216;
  const weightEstimate = estimatedWeight(months);

  const result = useMemo(
    () => calculateRate(dilution, dose > 0 ? dose : 0, weight > 0 ? weight : 0),
    [dilution, dose, weight],
  );

  const outOfRange = dose > 0 && (dose < dilution.minDose || dose > dilution.maxDose);

  // A child on an adult-strength recipe often lands below the pump's reliable range.
  const needsWeakerMix = paediatric && dilution.perKg && result.mlPerHour > 0 && result.mlPerHour < 1;
  const dilutedRate = result.mlPerHour * 10;

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Patient infusion calculator</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter the patient&apos;s weight and age, pick the drug, and read off the dilution to draw up
          and the pump rate. Always cross-check against the pump&apos;s own drug library and your local
          guideline before starting an infusion.
        </p>

        <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Weight (kg)</span>
              <input
                type="number"
                min={0.5}
                max={250}
                step="any"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                disabled={!dilution.perKg}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {!dilution.perKg ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  This recipe uses a fixed dose, not a weight-based dose.
                </span>
              ) : weightEstimate ? (
                <button
                  type="button"
                  onClick={() => setWeight(weightEstimate)}
                  className="mt-1 text-xs text-primary underline"
                >
                  Not weighed? Use the age estimate ({weightEstimate} kg)
                </button>
              ) : null}
            </label>

            <div className="block">
              <span className="text-xs font-medium text-muted-foreground">Age</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={ageUnit === "years" ? 120 : 24}
                  step="any"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <select
                  value={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value as AgeUnit)}
                  className="rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Age unit"
                >
                  <option value="years">years</option>
                  <option value="months">months</option>
                </select>
              </div>
              <span className="mt-1 block text-xs text-muted-foreground">{band.label}</span>
            </div>
          </div>

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

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Dose ({dilution.unit})</span>
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

          <SourceChips sources={standardRefs(dilution.drug)} label="Check against" />
        </div>

        <p className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">{band.label}:</strong> {band.note}
        </p>

        {outOfRange && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
            That dose is outside the usual range for {dilution.drug}. Check the indication and your
            local guideline before using it.
          </p>
        )}

        <section className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-4">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Dilution to draw up
          </h2>
          <p className="mt-2 text-lg font-semibold text-foreground">{dilution.drawUp}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Made up in {dilution.diluent} — final concentration {dilution.concentrationLabel}.
          </p>
          {dilution.notes && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{dilution.notes}</p>
          )}
        </section>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
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
            <dt className="text-xs text-muted-foreground">
              The {result.volumeMl} mL {result.volumeMl > 60 ? "bag" : "syringe"} lasts
            </dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">
              {result.syringeHours ? `${round(result.syringeHours, 1)} h` : "—"}
            </dd>
          </div>
        </dl>

        {needsWeakerMix && (
          <p className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm leading-relaxed text-foreground">
            At {formatRate(result.mlPerHour)} this adult-strength mix runs below the rate most pumps
            deliver reliably. One option is a ten-fold weaker mix (one tenth of the drug in the same
            total volume, giving {formatConcentration(dilution.concentrationPerMl / 10, dilution.unit)}
            ) run at {formatRate(dilutedRate)} — but this is a generic suggestion only. Use your
            unit&apos;s paediatric infusion chart (weight-banded or &quot;rule of six&quot; recipes),
            which also accounts for fluid-volume limits in small infants and drug-specific practice.
          </p>
        )}

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
