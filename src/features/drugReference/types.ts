/**
 * Types for the standalone Anaesthetics & Critical Care Drug Reference.
 *
 * This folder is deliberately self-contained (only Supabase client + these
 * files) so the whole reference can be lifted into a separate app.
 */

export interface DrugSource {
  title: string;
  publisher: string;
  url: string;
  accessed?: string | undefined;
}

export interface TdmTarget {
  label: string;
  value: string;
  note?: string | undefined;
}

export interface TdmToxicity {
  threshold: string;
  features: string;
  action: string;
}

export interface DrugTdm {
  matrix?: string | undefined;
  indication?: string | undefined;
  targets?: TdmTarget[] | undefined;
  timing?: string[] | undefined;
  toxicity?: TdmToxicity[] | undefined;
  sampling?: string[] | undefined;
  adjustment?: string[] | undefined;
  sources?: DrugSource[] | undefined;
}

/** A drug monograph row as stored in the backend `drugs` table. */
export interface DrugReferenceRow {
  slug: string;
  name: string;
  drug_class: string;
  synonyms: string[];
  indication_oneliner: string;
  key_warning: string;
  adult_bolus_dose: string;
  infusion_range: string;
  presentation: string;
  mechanism_of_action: string;
  pharmacokinetics: string;
  preparation: string;
  dosing: string;
  monitoring: string;
  side_effects: string;
  contraindications: string;
  interactions: string;
  requires_tdm: boolean;
  tdm: DrugTdm | null;
  sources: DrugSource[];
}

/** Dosing unit used by the standard infusion recipes. */
export type InfusionUnit =
  | "nanograms/kg/min"
  | "micrograms/kg/min"
  | "micrograms/kg/h"
  | "micrograms/min"
  | "units/min"
  | "units/h"
  | "units/kg/h"
  | "mg/kg/h";

/** A practical, ready-to-draw-up infusion recipe. */
export interface DrugDilution {
  /** Slug of the matching monograph, when one exists. */
  slug: string | null;
  drug: string;
  diluent: string;
  drawUp: string;
  /** micrograms per mL, or units per mL when the unit family is "units". */
  concentrationPerMl: number;
  concentrationLabel: string;
  unit: InfusionUnit;
  startDose: number;
  minDose: number;
  maxDose: number;
  perKg: boolean;
  notes?: string | undefined;
  group: string;
}

export interface RateResult {
  /** Dose in the drug's native unit, echoed for display. */
  doseLabel: string;
  /** Amount delivered per hour in the base unit (micrograms or units). */
  perHour: number;
  perHourLabel: string;
  /** Pump rate in mL/h. */
  mlPerHour: number;
  /** Millilitres delivered in 24 hours at this rate. */
  mlPerDay: number;
  /** Hours a 50 mL syringe lasts at this rate (null when the rate is zero). */
  syringeHours: number | null;
}
