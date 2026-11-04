import { icuInfusionGroups } from "@/data/icuInfusions";
import type { DrugDilution, InfusionUnit } from "./types";

/**
 * Infusion recipe drug name -> monograph slug in the `drugs` table.
 * Names that have no monograph map to null so the recipe still displays.
 */
const SLUG_BY_INFUSION_NAME: Record<string, string | null> = {
  "Noradrenaline (4 mg/50 mL)": "noradrenaline",
  "Noradrenaline (8 mg/50 mL)": "noradrenaline",
  "Noradrenaline (16 mg/50 mL)": "noradrenaline",
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
  "Remifentanil (ventilated adult ICU)": "remifentanil",
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
  "Tranexamic acid (major trauma)": "tranexamic-acid",
};

/** All standard infusion recipes, flattened and slug-tagged. Static display data only — no rate arithmetic. */
export const drugDilutions: DrugDilution[] = icuInfusionGroups.flatMap((group) =>
  group.infusions.map((infusion) => ({
    slug: SLUG_BY_INFUSION_NAME[infusion.drug] ?? null,
    drug: infusion.drug,
    diluent: infusion.diluent,
    drawUp: infusion.drawUp,
    concentrationLabel: infusion.concentrationLabel,
    unit: infusion.unit as InfusionUnit,
    startDose: infusion.startDose,
    minDose: infusion.minDose,
    maxDose: infusion.maxDose,
    perKg: infusion.perKg,
    notes: infusion.notes,
    sources: infusion.sources,
    group: group.title,
  })),
);

export function dilutionsForSlug(slug: string): DrugDilution[] {
  return drugDilutions.filter((d) => d.slug === slug);
}

/** Display text for a recipe's dose range (formatting only, no arithmetic). */
export function rangeText(d: Pick<DrugDilution, "minDose" | "maxDose" | "unit">): string {
  return d.minDose === undefined
    ? `Up to ${d.maxDose} ${d.unit}`
    : d.minDose === d.maxDose
      ? `${d.maxDose} ${d.unit} (fixed)`
      : `${d.minDose}–${d.maxDose} ${d.unit}`;
}

/** Display text for a recipe's starting dose, or a protocol pointer when none is sourced. */
export function startText(d: Pick<DrugDilution, "startDose" | "unit">): string {
  return d.startDose === undefined ? "Per local protocol" : `${d.startDose} ${d.unit}`;
}
