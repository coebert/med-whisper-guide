import { icuInfusionGroups } from "@/data/icuInfusions";
import type { DrugDilution, InfusionUnit, RateResult } from "./types";

/**
 * Infusion recipe drug name -> monograph slug in the `drugs` table.
 * Names that have no monograph map to null so the recipe still displays.
 */
const SLUG_BY_INFUSION_NAME: Record<string, string | null> = {
  "Noradrenaline (norepinephrine)": "noradrenaline",
  "Adrenaline (epinephrine)": "adrenaline",
  Vasopressin: "vasopressin",
  Metaraminol: "metaraminol",
  Phenylephrine: "phenylephrine",
  Dopamine: "dopamine",
  Dobutamine: "dobutamine",
  Milrinone: "milrinone",
  Levosimendan: "levosimendan",
  "Propofol 1%": "propofol",
  Midazolam: "midazolam",
  Dexmedetomidine: "dexmedetomidine",
  "Clonidine (1500 micrograms/50 mL)": "clonidine",
  "Clonidine (750 micrograms/50 mL)": "clonidine",
  Fentanyl: "fentanyl",
  Alfentanil: "alfentanil",
  Remifentanil: "remifentanil",
  Ketamine: "ketamine",
  "Insulin (Actrapid)": "insulin-actrapid",
  "Heparin (unfractionated)": "unfractionated-heparin",
  "Epoprostenol (prostacyclin)": "epoprostenol",
  Rocuronium: "rocuronium",
  Atracurium: "atracurium",
  Cisatracurium: "cisatracurium",
  Vecuronium: "vecuronium",
  "Glyceryl trinitrate (GTN)": "glyceryl-trinitrate",
  "Sodium nitroprusside": "sodium-nitroprusside",
  Labetalol: "labetalol",
  Esmolol: "esmolol",
  Hydralazine: "hydralazine",
  Morphine: "morphine",
  "Lidocaine (IV analgesia)": "lidocaine",
  "Magnesium sulphate": "magnesium-sulphate",
  Salbutamol: "salbutamol",
  Aminophylline: "aminophylline",
  Oxytocin: "oxytocin",
  "Tranexamic acid": "tranexamic-acid",
};

/**
 * Total prepared volume of a recipe, read from its draw-up text.
 * Prefers "made up to N mL" / "N mL total", then "in N mL" / "N mL vial";
 * falls back to a 50 mL syringe.
 */
export function volumeFromDrawUp(drawUp: string): number {
  const first = drawUp.split(/\.\s|—\s*If|\bIf using\b/)[0] ?? drawUp;
  const patterns = [
    /made\s+(?:up\s+)?to\s+([\d.]+)\s*mL/i,
    /([\d.]+)\s*mL\s+total/i,
    /in\s+(?:a\s+)?([\d.]+)\s*mL/i,
    /([\d.]+)\s*mL\s+vial/i,
  ];
  for (const re of patterns) {
    const m = first.match(re);
    if (m && m[1]) {
      const v = Number(m[1]);
      if (Number.isFinite(v) && v > 0) return v;
    }
  }
  return 50;
}

/** All standard infusion recipes, flattened and slug-tagged. */
export const drugDilutions: DrugDilution[] = icuInfusionGroups.flatMap((group) =>
  group.infusions.map((infusion) => ({
    slug: SLUG_BY_INFUSION_NAME[infusion.drug] ?? null,
    drug: infusion.drug,
    diluent: infusion.diluent,
    drawUp: infusion.drawUp,
    concentrationPerMl: infusion.concentrationPerMl,
    concentrationLabel: infusion.concentrationLabel,
    unit: infusion.unit as InfusionUnit,
    startDose: infusion.startDose,
    minDose: infusion.minDose,
    maxDose: infusion.maxDose,
    perKg: infusion.perKg,
    notes: infusion.notes,
    group: group.title,
    volumeMl: volumeFromDrawUp(infusion.drawUp),
  })),
);

/** Human label for a concentration held in micrograms/mL (or units/mL). */
export function formatConcentration(perMl: number, unit: InfusionUnit): string {
  if (isUnitDrug(unit)) return `${round(perMl, 3)} units/mL`;
  if (perMl >= 1000) return `${round(perMl / 1000, 3)} mg/mL`;
  return `${round(perMl, 3)} micrograms/mL`;
}

export function dilutionsForSlug(slug: string): DrugDilution[] {
  return drugDilutions.filter((d) => d.slug === slug);
}

/** True when the recipe is measured in units (insulin, heparin, vasopressin). */
export function isUnitDrug(unit: InfusionUnit): boolean {
  return unit.startsWith("units");
}

/**
 * Convert a dose in the recipe's native unit into an hourly amount in the
 * concentration's base unit (micrograms, or units for unit-based drugs).
 */
export function amountPerHour(unit: InfusionUnit, dose: number, weightKg: number): number {
  switch (unit) {
    case "nanograms/kg/min":
      // ng -> micrograms, because concentrations are held in micrograms/mL.
      return (dose * weightKg * 60) / 1000;
    case "micrograms/kg/min":
      return dose * weightKg * 60;
    case "micrograms/kg/h":
      return dose * weightKg;
    case "micrograms/min":
      return dose * 60;
    case "mg/kg/h":
      // mg -> micrograms, because concentrations are held in micrograms/mL.
      return dose * weightKg * 1000;
    case "mg/h":
      return dose * 1000;
    case "units/min":
      return dose * 60;
    case "units/kg/h":
      return dose * weightKg;
    case "units/h":
      return dose;
    default:
      return 0;
  }
}

export function calculateRate(
  dilution: DrugDilution,
  dose: number,
  weightKg: number,
): RateResult {
  const perHour = amountPerHour(dilution.unit, dose, weightKg);
  const mlPerHour = dilution.concentrationPerMl > 0 ? perHour / dilution.concentrationPerMl : 0;
  const units = isUnitDrug(dilution.unit);
  const perHourLabel = units
    ? `${round(perHour, 2)} units/h`
    : perHour >= 1000
      ? `${round(perHour / 1000, 2)} mg/h`
      : `${round(perHour, 1)} micrograms/h`;

  const volumeMl = dilution.volumeMl > 0 ? dilution.volumeMl : 50;
  return {
    doseLabel: `${dose} ${dilution.unit}${dilution.perKg ? "" : " (fixed dose)"}`,
    perHour,
    perHourLabel,
    mlPerHour,
    mlPerDay: mlPerHour * 24,
    syringeHours: mlPerHour > 0 ? volumeMl / mlPerHour : null,
    volumeMl,
  };
}

export function round(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}

/** Formats a pump rate with sensible precision for the bedside. */
export function formatRate(mlPerHour: number): string {
  if (mlPerHour === 0) return "0 mL/h";
  if (mlPerHour < 1) return `${round(mlPerHour, 2)} mL/h`;
  if (mlPerHour < 10) return `${round(mlPerHour, 1)} mL/h`;
  return `${Math.round(mlPerHour)} mL/h`;
}
