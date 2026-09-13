export interface Infusion {
  drug: string;
  /** Safe diluent(s) */
  diluent: string;
  /** How to draw it up: drug dose into total volume */
  drawUp: string;
  /** Concentration in micrograms per mL (or units per mL when unit is "units") */
  concentrationPerMl: number;
  concentrationLabel: string;
  /** Dosing unit for the range */
  unit: "micrograms/kg/min" | "micrograms/kg/h" | "micrograms/min" | "units/min" | "units/h" | "units/kg/h" | "mg/kg/h";
  startDose: number;
  minDose: number;
  maxDose: number;
  /** true if the dose is weight-based (per kg) */
  perKg: boolean;
  notes?: string;
  topicIds?: string[];
}

export interface InfusionGroup {
  id: string;
  title: string;
  blurb: string;
  infusions: Infusion[];
}

/**
 * Standard adult ICU infusion recipes. Concentrations are common UK practice
 * and must be checked against local critical care guidelines and smart-pump
 * drug libraries before use.
 */
export const icuInfusionGroups: InfusionGroup[] = [
  {
    id: "vasopressors",
    title: "Vasopressors",
    blurb: "Catecholamine infusions should run through a central line where possible; peripheral use requires a large proximal vein and frequent site checks. Titrate to a target MAP (usually 65–75 mmHg).",
    infusions: [
      {
        drug: "Noradrenaline (norepinephrine)",
        diluent: "5% glucose or 0.9% sodium chloride (5% glucose preferred — oxidation in saline over time)",
        drawUp: "8 mg in 50 mL (4 mg/4 mL ampoules made up to 50 mL)",
        concentrationPerMl: 160,
        concentrationLabel: "160 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.01,
        maxDose: 1,
        perKg: true,
        notes: "First-line vasopressor in septic shock. Predominant α₁ effect with some β₁; watch for reflex bradycardia, limb and gut ischaemia at high doses.",
        topicIds: ["vasoactive-agents", "sepsis", "circulatory-failure"],
      },
      {
        drug: "Adrenaline (epinephrine)",
        diluent: "5% glucose or 0.9% sodium chloride",
        drawUp: "4 mg in 50 mL",
        concentrationPerMl: 80,
        concentrationLabel: "80 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.01,
        maxDose: 0.5,
        perKg: true,
        notes: "Second-line inotrope/vasopressor; causes tachycardia, hyperlactataemia (β₂ effect) and hyperglycaemia. Also used undiluted 1:10,000 in cardiac arrest.",
        topicIds: ["vasoactive-agents", "anaphylaxis"],
      },
      {
        drug: "Vasopressin",
        diluent: "5% glucose or 0.9% sodium chloride",
        drawUp: "20 units in 20 mL (1 unit/mL)",
        concentrationPerMl: 1,
        concentrationLabel: "1 unit/mL",
        unit: "units/min",
        startDose: 0.03,
        minDose: 0.01,
        maxDose: 0.04,
        perKg: false,
        notes: "Fixed (non-weight-based) dose; do not titrate above 0.04 units/min — coronary, splanchnic and digital ischaemia. Second agent in vasodilatory shock per Surviving Sepsis guidance.",
        topicIds: ["vasoactive-agents", "sepsis"],
      },
      {
        drug: "Metaraminol",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "10 mg in 50 mL",
        concentrationPerMl: 200,
        concentrationLabel: "200 micrograms/mL",
        unit: "micrograms/min",
        startDose: 20,
        minDose: 8,
        maxDose: 100,
        perKg: false,
        notes: "Predominantly α₁ agonist with indirect action. Usual infusion 0.5–5 mg/h (≈8–83 micrograms/min), i.e. 2.5–25 mL/h of this bag. Often run peripherally short-term; handy bridge while central access is established. Also given as 0.5–1 mg boluses.",
        topicIds: ["vasoactive-agents"],
      },
      {
        drug: "Phenylephrine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "10 mg in 50 mL",
        concentrationPerMl: 200,
        concentrationLabel: "200 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.5,
        minDose: 0.2,
        maxDose: 5,
        perKg: true,
        notes: "Pure α₁ agonist — useful when tachycardia limits other agents, and in vasoplegia after cardiac surgery. May drop cardiac output by reflex bradycardia and afterload rise.",
        topicIds: ["vasoactive-agents"],
      },
      {
        drug: "Dopamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "200 mg in 50 mL (4 mg/mL)",
        concentrationPerMl: 4000,
        concentrationLabel: "4 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 5,
        minDose: 2,
        maxDose: 20,
        perKg: true,
        notes: "Largely superseded by noradrenaline for shock (more arrhythmia). 'Renal-dose' dopamine has no evidence base and should not be used.",
        topicIds: ["vasoactive-agents"],
      },
    ],
  },
  {
    id: "inotropes",
    title: "Inotropes",
    blurb: "Inotropes increase contractility at the cost of myocardial oxygen demand and arrhythmia. Central access is preferred, and titrate to cardiac output/perfusion markers rather than blood pressure alone.",
    infusions: [
      {
        drug: "Dobutamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "250 mg in 50 mL (5 mg/mL)",
        concentrationPerMl: 5000,
        concentrationLabel: "5 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 5,
        minDose: 2,
        maxDose: 20,
        perKg: true,
        notes: "β₁-predominant; causes vasodilatation and tachycardia — may need co-infusion of noradrenaline to support MAP. Standard inotrope for low-output heart failure.",
        topicIds: ["vasoactive-agents", "heart-failure-icu"],
      },
      {
        drug: "Milrinone",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "20 mg in 50 mL (400 micrograms/mL)",
        concentrationPerMl: 400,
        concentrationLabel: "400 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.375,
        minDose: 0.125,
        maxDose: 0.75,
        perKg: true,
        notes: "PDE-3 inhibitor; inodilator useful in pulmonary hypertension/right ventricular failure. Long half-life — accumulates in renal failure; often started without a loading dose in ICU to avoid hypotension.",
        topicIds: ["vasoactive-agents", "pulmonary-hypertension"],
      },
      {
        drug: "Levosimendan",
        diluent: "5% glucose only",
        drawUp: "12.5 mg in 500 mL (25 micrograms/mL)",
        concentrationPerMl: 25,
        concentrationLabel: "25 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.1,
        minDose: 0.05,
        maxDose: 0.2,
        perKg: true,
        notes: "Calcium sensitiser given as a 24 h infusion; active metabolite persists ~7 days. Skip the loading bolus in hypotensive patients. Avoid in severe renal/hepatic failure.",
        topicIds: ["vasoactive-agents", "heart-failure-icu"],
      },
    ],
  },
  {
    id: "sedation-analgesia",
    title: "Sedation and analgesia",
    blurb: "Analgesia first, then sedative titrated to a target score (e.g. RASS 0 to −2) with daily review. Infusion rates below are adult starting points — obesity, age and organ failure all change requirements.",
    infusions: [
      {
        drug: "Propofol 1%",
        diluent: "Undiluted (supplied as 1% or 2% lipid emulsion)",
        drawUp: "Neat — 50 mL vial of 1% (10 mg/mL)",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL (1%)",
        unit: "mg/kg/h",
        startDose: 1,
        minDose: 0.3,
        maxDose: 4,
        perKg: true,
        notes: "Keep under ~4 mg/kg/h and review after 48 h: propofol-related infusion syndrome (lactic acidosis, rhabdomyolysis, hypertriglyceridaemia). Lipid load ~1.1 kcal/mL.",
        topicIds: ["icu-sedation-delirium", "intravenous-anaesthetics"],
      },
      {
        drug: "Midazolam",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "50 mg in 50 mL (1 mg/mL)",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/h",
        startDose: 30,
        minDose: 20,
        maxDose: 120,
        perKg: true,
        notes: "Accumulates with prolonged infusion (context-sensitive half-time rises), especially in renal failure and obesity — not ideal beyond 48–72 h. Status epilepticus doses are higher.",
        topicIds: ["icu-sedation-delirium", "benzodiazepines"],
      },
      {
        drug: "Dexmedetomidine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "400 micrograms (4 mL of 100 micrograms/mL) in 48 mL → 50 mL total",
        concentrationPerMl: 8,
        concentrationLabel: "8 micrograms/mL",
        unit: "micrograms/kg/h",
        startDose: 0.7,
        minDose: 0.2,
        maxDose: 1.4,
        perKg: true,
        notes: "α₂ agonist producing 'rousable' sedation without respiratory depression; bradycardia and hypotension are dose-limiting. Do not give a loading bolus on ICU.",
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Fentanyl",
        diluent: "Undiluted, or dilute in 0.9% sodium chloride or 5% glucose",
        drawUp: "2500 micrograms (50 mL of 50 micrograms/mL) neat, or 1000 micrograms in 50 mL",
        concentrationPerMl: 50,
        concentrationLabel: "50 micrograms/mL (neat)",
        unit: "micrograms/kg/h",
        startDose: 1,
        minDose: 0.5,
        maxDose: 4,
        perKg: true,
        notes: "Lipophilic with marked accumulation on prolonged infusion; wean gradually after days of therapy to avoid withdrawal.",
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Alfentanil",
        diluent: "Undiluted, or dilute in 0.9% sodium chloride or 5% glucose",
        drawUp: "25 mg in 50 mL (500 micrograms/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 micrograms/mL",
        unit: "micrograms/kg/h",
        startDose: 30,
        minDose: 10,
        maxDose: 100,
        perKg: true,
        notes: "Useful in renal failure (inactive metabolites); still accumulates with very long infusions but less than fentanyl.",
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Remifentanil",
        diluent: "0.9% sodium chloride, 5% glucose or water for injection",
        drawUp: "5 mg in 50 mL (100 micrograms/mL)",
        concentrationPerMl: 100,
        concentrationLabel: "100 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.02,
        maxDose: 0.2,
        perKg: true,
        notes: "Esterase-metabolised — no accumulation and predictable offset (context-sensitive half-time ~4 min) whatever the infusion length. Plan post-stop analgesia before discontinuing.",
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Ketamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "500 mg (10 mL of 50 mg/mL) in 50 mL total",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL",
        unit: "mg/kg/h",
        startDose: 0.5,
        minDose: 0.1,
        maxDose: 2,
        perKg: true,
        notes: "Adjunct for analgosedation, especially with opioid tolerance or severe bronchospasm. Analgesic (opioid-sparing) doses are 0.1–0.3 mg/kg/h; sedative doses 0.5–2 mg/kg/h. Psychotomimetic effects less prominent at infusion rates.",
        topicIds: ["icu-sedation-delirium", "intravenous-anaesthetics"],
      },
    ],
  },
  {
    id: "other",
    title: "Other common ICU infusions",
    blurb: "Frequently run continuous infusions in neurocritical care, endocrine emergencies and anticoagulation.",
    infusions: [
      {
        drug: "Insulin (Actrapid)",
        diluent: "0.9% sodium chloride",
        drawUp: "50 units in 50 mL (1 unit/mL)",
        concentrationPerMl: 1,
        concentrationLabel: "1 unit/mL",
        unit: "units/h",
        startDose: 2,
        minDose: 0.5,
        maxDose: 15,
        perKg: false,
        notes: "Titrate to a written blood-glucose protocol (commonly target 6–10 mmol/L on ICU; tighter ranges intra-operatively). Flush the line first — insulin adsorbs to plastic.",
        topicIds: ["diabetic-emergencies"],
      },
      {
        drug: "Heparin (unfractionated)",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "25,000 units in 50 mL (500 units/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 units/mL",
        unit: "units/kg/h",
        startDose: 18,
        minDose: 12,
        maxDose: 30,
        perKg: true,
        notes: "Weight-based nomogram with aPTT (or anti-Xa) monitoring 6-hourly after changes. Stop and check platelets if HIT is suspected.",
        topicIds: ["anticoagulants", "transfusion-coagulation"],
      },
      {
        drug: "Epoprostenol (prostacyclin)",
        diluent: "Supplied glycine buffer only (never 0.9% saline or glucose)",
        drawUp: "500 micrograms vial reconstituted and made to 50 mL with buffer (10 micrograms/mL)",
        concentrationPerMl: 10,
        concentrationLabel: "10 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.005,
        minDose: 0.002,
        maxDose: 0.02,
        perKg: true,
        notes: "Inhaled/IV pulmonary vasodilator also used as extracorporeal-circuit anticoagulant. Very short half-life — interruptions cause rebound pulmonary hypertension; hypotension limits IV use.",
        topicIds: ["pulmonary-hypertension", "rrt-icu"],
      },
    ],
  },
];

export const icuInfusionCount = icuInfusionGroups.reduce(
  (n, g) => n + g.infusions.length,
  0,
);

/**
 * mL per hour for a given dose index value and patient weight.
 * rate (unit/kg/min) → mL/h = rate × 60 × weight / concentration (unit/mL)
 * rate (unit/kg/h)  → mL/h = rate × weight / concentration
 * non-weight-based mcg/min or units/min → × 60 / concentration
 */
export function mlPerHour(infusion: Infusion, dose: number, weightKg: number): number {
  const perMinute =
    infusion.unit === "micrograms/kg/min" ||
    infusion.unit === "micrograms/min" ||
    infusion.unit === "units/min";
  // concentrationPerMl is in micrograms (or units) per mL — convert mg doses
  let amount = infusion.perKg ? dose * weightKg : dose;
  if (infusion.unit === "mg/kg/h") amount *= 1000;
  const perHour = perMinute ? amount * 60 : amount;
  return perHour / infusion.concentrationPerMl;
}

export function formatMlPerHour(value: number): string {
  if (value >= 20) return value.toFixed(0);
  if (value >= 2) return value.toFixed(1);
  return value.toFixed(2);
}
