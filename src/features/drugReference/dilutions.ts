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
  Clonidine: "clonidine",
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
  })),
);

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

  return {
    doseLabel: `${dose} ${dilution.unit}${dilution.perKg ? "" : " (fixed dose)"}`,
    perHour,
    perHourLabel,
    mlPerHour,
    mlPerDay: mlPerHour * 24,
    syringeHours: mlPerHour > 0 ? 50 / mlPerHour : null,
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
