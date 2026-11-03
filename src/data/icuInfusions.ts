import { CITE } from "@/features/drugReference/citations";
import type { DrugSource } from "@/features/drugReference/types";

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
  unit:
    | "nanograms/kg/min"
    | "micrograms/kg/min"
    | "micrograms/kg/h"
    | "micrograms/min"
    | "units/min"
    | "units/h"
    | "units/kg/h"
    | "mg/kg/h"
    | "mg/h";
  /** Omitted when no source-backed starting dose exists. */
  startDose?: number;
  /** Omitted when only a ceiling is source-backed. */
  minDose?: number;
  maxDose: number;
  /** true if the dose is weight-based (per kg) */
  perKg: boolean;
  notes?: string;
  /** Direct citations for facts revised in the source-level correction pass. */
  sources?: DrugSource[];
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
    blurb:
      "Catecholamine infusions should run through a central line where possible; peripheral use requires a large proximal vein and frequent site checks. Titrate to a target MAP (usually 65–75 mmHg).",
    infusions: [
      {
        drug: "Noradrenaline (4 mg/50 mL)",
        diluent:
          "Use a diluent approved for the exact noradrenaline product and local preparation protocol; compatible diluents and stability vary by formulation. Confirm the labelled strength and prescribed dose are expressed as noradrenaline base.",
        sources: [CITE.noradSpc],
        drawUp: "4 mg (one 4 mg/4 mL ampoule) made up to 50 mL",
        concentrationPerMl: 80,
        concentrationLabel: "80 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.01,
        maxDose: 1.5,
        perKg: true,
        notes:
          "Single-strength syringe (80 micrograms/mL) — usual starting concentration; suits low to moderate doses and smaller patients. Double (8 mg/50 mL) and quadruple (16 mg/50 mL) strengths are listed separately for escalating requirements; label clearly and never mix strengths on one pump. First-line vasopressor in septic shock. Usual maintenance 0.05–1 micrograms/kg/min; rates above 1 micrograms/kg/min are high-dose and should prompt a second agent (vasopressin) and review. Watch for reflex bradycardia, limb and gut ischaemia at high doses.",
        topicIds: ["vasoactive-agents", "sepsis", "circulatory-failure"],
      },
      {
        drug: "Noradrenaline (8 mg/50 mL)",
        diluent:
          "Use a diluent approved for the exact noradrenaline product and local preparation protocol; compatible diluents and stability vary by formulation. Confirm the labelled strength and prescribed dose are expressed as noradrenaline base.",
        sources: [CITE.noradSpc],
        drawUp: "8 mg (two 4 mg/4 mL ampoules) made up to 50 mL",
        concentrationPerMl: 160,
        concentrationLabel: "160 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.01,
        maxDose: 1.5,
        perKg: true,
        notes:
          "Double-strength syringe (160 micrograms/mL) — the common ICU default. The same dose runs at half the mL/h of the 4 mg/50 mL syringe and twice that of 16 mg/50 mL; label clearly and never mix strengths on one pump. First-line vasopressor in septic shock. Usual maintenance 0.05–1 micrograms/kg/min; rates above 1 micrograms/kg/min are high-dose and should prompt a second agent (vasopressin) and review. Watch for reflex bradycardia, limb and gut ischaemia at high doses.",
        topicIds: ["vasoactive-agents", "sepsis", "circulatory-failure"],
      },
      {
        drug: "Noradrenaline (16 mg/50 mL)",
        diluent:
          "Use a diluent approved for the exact noradrenaline product and local preparation protocol; compatible diluents and stability vary by formulation. Confirm the labelled strength and prescribed dose are expressed as noradrenaline base.",
        sources: [CITE.noradSpc],
        drawUp: "16 mg (four 4 mg/4 mL ampoules) made up to 50 mL",
        concentrationPerMl: 320,
        concentrationLabel: "320 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.05,
        minDose: 0.01,
        maxDose: 1.5,
        perKg: true,
        notes:
          "Quadruple-strength syringe (320 micrograms/mL) for high-dose requirements or fluid restriction — the same dose runs at a quarter of the mL/h of the 4 mg/50 mL syringe. Central access essential; label clearly and never mix strengths on one pump. Rates above 1 micrograms/kg/min are high-dose and should prompt a second agent (vasopressin) and review. Watch for reflex bradycardia, limb and gut ischaemia at high doses.",
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
        maxDose: 1,
        perKg: true,
        notes:
          "Second-line inotrope/vasopressor; 0.01–0.1 micrograms/kg/min usual, up to 1 microgram/kg/min in critical care. Causes tachycardia, hyperlactataemia (β₂ effect) and hyperglycaemia. Also used undiluted 1:10,000 in cardiac arrest.",
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
        notes:
          "Fixed (non-weight-based) dose. Shock dosing is product- and protocol-specific: use the local critical-care vasopressin regimen; a common starting dose is 0.03 units/min. The UK argipressin 20 IU/mL products cited here are licensed for diabetes insipidus and oesophageal variceal bleeding, so shock use is off-label for those products. Higher rates cause coronary, splanchnic and digital ischaemia.",
        sources: [CITE.highlandVasopressin, CITE.argipressinSpc1, CITE.argipressinSpc2],
        topicIds: ["vasoactive-agents", "sepsis"],
      },
      {
        drug: "Metaraminol",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "20 mg in 40 mL (0.5 mg/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 micrograms/mL (0.5 mg/mL)",
        unit: "micrograms/min",
        startDose: 20,
        minDose: 8,
        maxDose: 83,
        perKg: false,
        notes:
          "Predominantly α₁ agonist with indirect action. Usual infusion 0.5–5 mg/h (≈8–83 micrograms/min), i.e. 1–10 mL/h of this 0.5 mg/mL syringe. Often run peripherally short-term; handy bridge while central access is established. Also given as 0.5–1 mg boluses.",
        topicIds: ["vasoactive-agents"],
      },
      {
        drug: "Phenylephrine",
        diluent: "0.9% sodium chloride (or 5% glucose)",
        drawUp: "10 mg in 100 mL",
        concentrationPerMl: 100,
        concentrationLabel: "100 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.5,
        minDose: 0.25,
        maxDose: 3,
        perKg: true,
        notes:
          "Pure α₁ agonist — useful when tachycardia limits other agents, and in vasoplegia after cardiac surgery. Common theatre dilution is 10 mg in 100 mL = 100 micrograms/mL. Usual range 0.25–3 micrograms/kg/min (≈18–210 micrograms/min at 70 kg) — which brackets the 35–180 micrograms/min quoted in the monograph; rates up to 6 micrograms/kg/min are described in refractory vasoplegia. At this concentration doses above ~1 micrograms/kg/min exceed 40 mL/h — use a more concentrated mix (e.g. 10 mg in 50 mL) or change to noradrenaline. May drop cardiac output by reflex bradycardia and afterload rise.",
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
        notes:
          "Largely superseded by noradrenaline for shock (more arrhythmia). 'Renal-dose' dopamine has no evidence base and should not be used.",
        topicIds: ["vasoactive-agents"],
      },
    ],
  },
  {
    id: "inotropes",
    title: "Inotropes",
    blurb:
      "Inotropes increase contractility at the cost of myocardial oxygen demand and arrhythmia. Central access is preferred, and titrate to cardiac output/perfusion markers rather than blood pressure alone.",
    infusions: [
      {
        drug: "Dobutamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "250 mg in 50 mL (5 mg/mL)",
        concentrationPerMl: 5000,
        concentrationLabel: "5 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 5,
        minDose: 2.5,
        maxDose: 20,
        perKg: true,
        notes:
          "β₁-predominant; causes vasodilatation and tachycardia — may need co-infusion of noradrenaline to support MAP. Standard inotrope for low-output heart failure.",
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
        minDose: 0.375,
        maxDose: 0.75,
        perKg: true,
        notes:
          "PDE-3 inhibitor; inodilator useful in pulmonary hypertension/right ventricular failure. Long half-life — accumulates in renal failure; often started without a loading dose in ICU to avoid hypotension.",
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
        notes:
          "Calcium sensitiser given as a 24 h infusion; active metabolite persists ~7 days. Skip the loading bolus in hypotensive patients. Avoid in severe renal/hepatic failure.",
        topicIds: ["vasoactive-agents", "heart-failure-icu"],
      },
    ],
  },
  {
    id: "sedation-analgesia",
    title: "Sedation and analgesia",
    blurb:
      "Analgesia first, then sedative titrated to a target score (e.g. RASS 0 to −2) with daily review. Infusion rates below are adult starting points — obesity, age and organ failure all change requirements.",
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
        notes:
          "For adult ICU sedation use the lowest effective rate within the product's recommended range, generally 0.3–4 mg/kg/h. Review continuously and monitor for propofol infusion syndrome (lactic acidosis, rhabdomyolysis, hypertriglyceridaemia); risk increases with higher doses and prolonged use, especially above 4 mg/kg/h for more than 48 hours. Suspected toxicity requires prompt action, not waiting until 48 hours. Lipid load ~1.1 kcal/mL.",
        sources: [CITE.propofolSpc],
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
        minDose: 30,
        maxDose: 200,
        perKg: true,
        notes:
          "Monograph range 0.03–0.2 mg/kg/h (30–200 micrograms/kg/h); BNF suggests 0.03–0.1 mg/kg/h under 60 years. Accumulates with prolonged infusion (context-sensitive half-time rises), especially in renal failure and obesity — not ideal beyond 48–72 h. Status epilepticus doses are higher.",
        topicIds: ["icu-sedation-delirium", "benzodiazepines"],
      },
      {
        drug: "Dexmedetomidine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "400 micrograms (4 mL of 100 micrograms/mL) made up to 50 mL total",
        concentrationPerMl: 8,
        concentrationLabel: "8 micrograms/mL",
        unit: "micrograms/kg/h",
        startDose: 0.7,
        minDose: 0.2,
        maxDose: 1.4,
        perKg: true,
        notes:
          "Alpha-2 agonist used for rousable sedation. Bradycardia and hypotension are important adverse effects; respiratory depression, airway obstruction and apnoea can also occur. Continuous cardiac monitoring and appropriate respiratory monitoring are required. A loading dose is not recommended for ICU sedation.",
        sources: [CITE.dexmedSpc],
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Clonidine (1500 micrograms/50 mL)",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "1500 micrograms (10 × 150 micrograms/mL ampoules) made up to 50 mL",
        concentrationPerMl: 30,
        concentrationLabel: "30 micrograms/mL",
        unit: "micrograms/kg/h",
        startDose: 0.5,
        minDose: 0.2,
        maxDose: 2,
        perKg: true,
        notes:
          "Standard-strength syringe (30 micrograms/mL). A half-strength 750 micrograms/50 mL syringe is also listed — check which your unit uses; the mL/h differs two-fold. α₂ agonist adjunct for sedation, withdrawal and agitation; useful in opioid/benzodiazepine weaning. Bradycardia and hypotension are dose-limiting — give loading doses slowly. Do not stop abruptly after prolonged use (rebound hypertension).",
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Clonidine (750 micrograms/50 mL)",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "750 micrograms (5 × 150 micrograms/mL ampoules) made up to 50 mL",
        concentrationPerMl: 15,
        concentrationLabel: "15 micrograms/mL",
        unit: "micrograms/kg/h",
        startDose: 0.5,
        minDose: 0.2,
        maxDose: 2,
        perKg: true,
        notes:
          "Half-strength syringe (15 micrograms/mL) — the same dose runs at twice the mL/h of the 1500 micrograms/50 mL syringe; never mix the two on one pump. Same indications and cautions as the standard-strength recipe: bradycardia and hypotension are dose-limiting, and avoid abrupt withdrawal after prolonged use.",
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Fentanyl",
        diluent: "Undiluted, or dilute in 0.9% sodium chloride or 5% glucose",
        drawUp: "2500 micrograms in 50 mL — neat (50 mL of 50 micrograms/mL ampoules)",
        concentrationPerMl: 50,
        concentrationLabel: "50 micrograms/mL (neat)",
        unit: "micrograms/kg/h",
        startDose: 1,
        minDose: 0.7,
        maxDose: 10,
        perKg: true,
        notes:
          "Rates shown are for the NEAT 50 micrograms/mL syringe. Critical care sedation 0.7–10 micrograms/kg/h; peri-operative analgesia 0.5–2 micrograms/kg/h. Some units run a diluted 1000 micrograms in 50 mL (20 micrograms/mL) syringe — the mL/h is then 2.5 times higher; never mix the two. Lipophilic with marked accumulation on prolonged infusion; wean gradually after days of therapy to avoid withdrawal.",
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
        maxDose: 120,
        perKg: true,
        notes:
          "Light analgesia from about 10 micrograms/kg/h; ventilated patients: 0.5–1 micrograms/kg/min equals 30–60 micrograms/kg/h; the upper end of the listed range is 2 micrograms/kg/min (120 micrograms/kg/h) — brief intra-operative peaks above this for intensely stimulating surgery are an anaesthetist-titrated bolus decision, not a maintenance rate. Useful in renal failure (inactive metabolites); still accumulates with very long infusions but less than fentanyl.",
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
        minDose: 0.006,
        maxDose: 2,
        perKg: true,
        notes:
          "ICU sedation 0.006–0.75 micrograms/kg/min; general anaesthesia 0.025–2 micrograms/kg/min. Esterase-metabolised — no accumulation and predictable offset (context-sensitive half-time ~4 min) whatever the infusion length. Plan post-stop analgesia before discontinuing.",
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
        minDose: 0.05,
        maxDose: 4.5,
        perKg: true,
        notes:
          "Adjunct for analgosedation, especially with opioid tolerance or severe bronchospasm. Analgesic (opioid-sparing) doses are 0.05–0.2 mg/kg/h; sedation and anaesthesia 0.5–4.5 mg/kg/h. Psychotomimetic effects less prominent at infusion rates.",
        topicIds: ["icu-sedation-delirium", "intravenous-anaesthetics"],
      },
    ],
  },
  {
    id: "other",
    title: "Other common ICU infusions",
    blurb:
      "Frequently run continuous infusions in neurocritical care, endocrine emergencies and anticoagulation.",
    infusions: [
      {
        drug: "Insulin (Actrapid)",
        diluent: "0.9% sodium chloride",
        drawUp: "50 units in 50 mL (1 unit/mL)",
        concentrationPerMl: 1,
        concentrationLabel: "1 unit/mL",
        unit: "units/h",
        startDose: 2,
        minDose: 0.1,
        maxDose: 10,
        perKg: false,
        notes:
          "Typical range 0.1–10 units/h (as low as 0.05 units/h in some protocols), titrated to a written blood-glucose protocol (commonly target 6–10 mmol/L on ICU; tighter ranges intra-operatively). Flush the line first — insulin adsorbs to plastic.",
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
        maxDose: 25,
        perKg: true,
        notes:
          "Adjust the infusion using the indication-specific local nomogram and aPTT or anti-Xa results. There is no universal 45,000-unit daily ceiling; unexpectedly high requirements need senior review for heparin resistance and monitoring problems. Assess urgently for HIT if suspected.",
        sources: [CITE.heparinSpc],
        topicIds: ["anticoagulants", "transfusion-coagulation"],
      },
      {
        drug: "Epoprostenol (prostacyclin)",
        diluent: "Brand-specific — follow the exact product's SmPC; do not interchange diluents",
        drawUp:
          "No generic recipe given. Preparation is brand-specific: follow the exact epoprostenol product's SmPC and specialist protocol",
        concentrationPerMl: 10,
        concentrationLabel: "Product-specific (see SmPC)",
        unit: "nanograms/kg/min",
        startDose: 5,
        minDose: 2,
        maxDose: 20,
        perKg: true,
        sources: [CITE.veletriSpc],
        notes:
          "Preparation is brand-specific. Veletri is reconstituted and further diluted with sterile water for injections or 0.9% sodium chloride; a glycine-buffer recipe must identify the matching product explicitly. Dosed in NANOGRAMS/kg/min (1 microgram = 1000 nanograms) — a common source of 1000-fold errors. Inhaled/IV pulmonary vasodilator also used as extracorporeal-circuit anticoagulant. Very short half-life — interruptions cause rebound pulmonary hypertension; hypotension limits IV use.",
        topicIds: ["pulmonary-hypertension", "rrt-icu"],
      },
    ],
  },
  {
    id: "neuromuscular-blockade",
    title: "Neuromuscular blockade",
    blurb:
      "Only ever run with adequate sedation and analgesia confirmed first, with train-of-four monitoring and a documented indication (severe ARDS, ventilator dyssynchrony, raised ICP, shivering during targeted temperature management). Review daily and stop at the earliest opportunity.",
    infusions: [
      {
        drug: "Rocuronium",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "500 mg (50 mL of 10 mg/mL) neat in a 50 mL syringe",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL (neat)",
        unit: "mg/kg/h",
        startDose: 0.3,
        minDose: 0.3,
        maxDose: 0.6,
        perKg: true,
        notes:
          "Aminosteroid NMBA; largely hepatic elimination so accumulates in liver failure and, to a lesser extent, renal failure. Sugammadex can reverse rocuronium block; the dose depends on block depth — follow the SmPC and confirm recovery with neuromuscular monitoring. Titrate to 1–2 twitches on train-of-four.",
        topicIds: ["neuromuscular-blockade", "icu-sedation-delirium"],
      },
      {
        drug: "Atracurium",
        diluent: "0.9% sodium chloride (do not use alkaline solutions)",
        drawUp: "250 mg (25 mL of 10 mg/mL) made up to 50 mL",
        concentrationPerMl: 5000,
        concentrationLabel: "5 mg/mL",
        unit: "mg/kg/h",
        startDose: 0.3,
        minDose: 0.3,
        maxDose: 0.9,
        perKg: true,
        notes:
          "Usual 0.3–0.6 mg/kg/h, up to 0.9 mg/kg/h if required. Hofmann elimination and ester hydrolysis — organ-independent, so the drug of choice in combined hepatic and renal failure. Histamine release can cause flushing and hypotension at higher doses. Store the ampoules in a fridge.",
        topicIds: ["neuromuscular-blockade", "icu-sedation-delirium"],
      },
      {
        drug: "Cisatracurium",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "100 mg (50 mL of 2 mg/mL) neat in a 50 mL syringe",
        concentrationPerMl: 2000,
        concentrationLabel: "2 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 3,
        minDose: 0.5,
        maxDose: 10,
        perKg: true,
        notes:
          "Isomer of atracurium with Hofmann elimination and no clinically significant histamine release; the usual choice for severe ARDS. Dosed in MICROGRAMS/kg/min — 3 micrograms/kg/min is roughly 0.18 mg/kg/h; ICU maintenance is often 0.5–2 micrograms/kg/min within an overall 0.5–10 range. Keep refrigerated.",
        topicIds: ["neuromuscular-blockade", "ards"],
      },
      {
        drug: "Vecuronium",
        diluent: "Water for injection to reconstitute, then 0.9% sodium chloride or 5% glucose",
        drawUp: "50 mg (5 × 10 mg vials) made up to 50 mL",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 1,
        minDose: 0.8,
        maxDose: 1.4,
        perKg: true,
        notes:
          "Aminosteroid with an active 3-desacetyl metabolite that accumulates in renal failure and can cause prolonged paralysis — avoid prolonged infusion in renal impairment. Reversible with sugammadex.",
        topicIds: ["neuromuscular-blockade"],
      },
    ],
  },
  {
    id: "cardiovascular-control",
    title: "Vasodilators and rate control",
    blurb:
      "Short-acting titratable agents for hypertensive emergencies, aortic and neurosurgical cases, and perioperative tachyarrhythmias. Invasive arterial monitoring is strongly advised for all of these.",
    infusions: [
      {
        drug: "Glyceryl trinitrate (GTN)",
        diluent:
          "0.9% sodium chloride or 5% glucose (use polyethylene or glass giving sets — GTN adsorbs to PVC)",
        drawUp: "50 mg in 50 mL (1 mg/mL)",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/min",
        startDose: 10,
        minDose: 10,
        maxDose: 200,
        perKg: false,
        notes:
          "Fixed-dose (not weight-based) infusion titrated to blood pressure or chest pain: start 10–20 micrograms/min, usual range 10–200 micrograms/min, with up to 400 micrograms/min for short periods. Predominantly venodilator at low rates; headache is common and tachyphylaxis develops within 24–48 h. Avoid with phosphodiesterase-5 inhibitors and in severe aortic stenosis or hypovolaemia.",
        topicIds: ["vasoactive-agents", "acute-coronary-syndrome"],
      },
      {
        drug: "Sodium nitroprusside",
        diluent: "5% glucose only",
        drawUp: "50 mg in 50 mL (1 mg/mL) — protect the syringe and line from light",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 0.5,
        minDose: 0.2,
        maxDose: 1.5,
        perKg: true,
        notes:
          "Immediate-onset arterial and venous dilator for hypertensive emergencies and controlled hypotension. BNF: start 0.5–1.5 micrograms/kg/min, increase in 500 nanograms/kg/min steps every 5 min; usual 0.5–8 micrograms/kg/min, maximum 8 (stop if no response within 10 min at maximum). Rates shown here are capped at 1.5 micrograms/kg/min — the controlled-hypotension ceiling and a sensible maintenance limit because cyanide toxicity rises with dose and duration; watch for unexplained metabolic acidosis and rising lactate. Discard if the solution discolours.",
        topicIds: ["vasoactive-agents", "hypertensive-emergency"],
      },
      {
        drug: "Labetalol",
        diluent: "5% glucose (or 0.9% sodium chloride)",
        drawUp: "250 mg (50 mL of 5 mg/mL) neat in a 50 mL syringe",
        concentrationPerMl: 5000,
        concentrationLabel: "5 mg/mL (neat)",
        unit: "mg/h",
        startDose: 20,
        minDose: 20,
        maxDose: 160,
        perKg: false,
        notes:
          "Combined α₁ and β blocker; first-line for hypertension in pre-eclampsia and aortic dissection. UK practice is a fixed rate: start 20 mg/h (4 mL/h of neat 5 mg/mL), doubling every 30 min to a usual maximum of 160 mg/h; the BNF regimen of 2 mg/min (120 mg/h) is for acute hypertensive emergencies. The BNF quotes a usual total dose of 50–200 mg (up to 300 mg) for the short infusion regimen; continuous infusions in dissection or pre-eclampsia run longer under senior review with continuous BP monitoring. Avoid in asthma, decompensated heart failure and heart block.",
        topicIds: ["vasoactive-agents", "obstetric-anaesthesia"],
      },
      {
        drug: "Esmolol",
        diluent: "0.9% sodium chloride or 5% glucose (10 mg/mL ready-diluted bags also available)",
        drawUp: "500 mg (5 mL of 100 mg/mL) made up to 50 mL",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL",
        unit: "micrograms/kg/min",
        startDose: 50,
        minDose: 25,
        maxDose: 200,
        perKg: true,
        notes:
          "Ultra-short-acting cardioselective β blocker (half-life ~9 min) — ideal when β blockade may need to be withdrawn quickly. Dosed in MICROGRAMS/kg/min, usual 25–200 with up to 300 for short periods in life-threatening situations. Hypotension is the main limitation; extravasation can cause skin necrosis.",
        topicIds: ["vasoactive-agents", "arrhythmias"],
      },
      {
        drug: "Hydralazine",
        diluent: "0.9% sodium chloride only (reacts with glucose)",
        drawUp: "20 mg (1 × 20 mg vial) made up to 40 mL (500 micrograms/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 micrograms/mL",
        unit: "micrograms/min",
        startDose: 200,
        minDose: 50,
        maxDose: 300,
        perKg: false,
        notes:
          "Direct arteriolar dilator used mainly in severe pre-eclampsia. Fixed-dose infusion: start 200–300 micrograms/min, maintenance usually 50–150 micrograms/min. Monitor maternal blood pressure and, where appropriate, fetal response. In the antenatal period, NICE advises considering up to 500 mL crystalloid before or with the first IV hydralazine dose. Avoid automatic fluid loading: severe pre-eclampsia requires careful fluid balance because of pulmonary oedema risk.",
        sources: [CITE.niceNg133],
        topicIds: ["vasoactive-agents", "obstetric-anaesthesia"],
      },
    ],
  },
  {
    id: "anaesthetic-adjuncts",
    title: "Anaesthetic and peri-operative adjuncts",
    blurb:
      "Infusions commonly started in theatre and continued into recovery or critical care. Prescribe the total dose limit as well as the rate — several of these have a ceiling dose per 24 hours.",
    infusions: [
      {
        drug: "Morphine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "50 mg in 50 mL (1 mg/mL)",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/h",
        startDose: 20,
        minDose: 10,
        maxDose: 100,
        perKg: true,
        notes:
          "Roughly 1–7 mg/h in an average adult (the monograph quotes 0.8–10 mg/h post-operatively; higher rates need senior review). The active metabolite morphine-6-glucuronide accumulates in renal impairment — reduce the rate and consider fentanyl or alfentanil instead. Nurse-controlled or patient-controlled analgesia is preferred where the patient can use it.",
        topicIds: ["opioids", "acute-pain"],
      },
      {
        drug: "Lidocaine (IV analgesia)",
        diluent: "0.9% sodium chloride",
        drawUp: "500 mg (25 mL of 2%) made up to 50 mL (10 mg/mL)",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL (1%)",
        unit: "mg/kg/h",
        maxDose: 1.5,
        perKg: true,
        notes:
          "Opioid-sparing intravenous lidocaine. Maximum 1.5 mg/kg/h using ideal body weight, with an absolute maximum of 120 mg/h; do not use in patients below 40 kg under the cited consensus. Limit to 24 hours with review. If a loading dose is used, no more than 1.5 mg/kg over 10 minutes. Follow local governance, dedicated infusion and monitoring requirements. Avoid overlapping other local anaesthetic interventions; the consensus specifies a 4-hour interval around nerve blocks. Stop if there are any signs of local anaesthetic systemic toxicity; lipid emulsion must be available.",
        sources: [CITE.ivLidocaineConsensus],
        topicIds: ["local-anaesthetics", "acute-pain"],
      },
      {
        drug: "Magnesium sulphate",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "10 g (20 mL of 50%) made up to 50 mL (200 mg/mL)",
        concentrationPerMl: 200000,
        concentrationLabel: "200 mg/mL (20%)",
        unit: "mg/h",
        startDose: 1000,
        minDose: 1000,
        maxDose: 1000,
        perKg: false,
        notes:
          "Eclampsia / severe pre-eclampsia (NICE): loading dose 4 g IV over 5–15 minutes (given separately), then a fixed maintenance infusion of 1 g/h (1000 mg/h) for 24 hours. Monitor patellar reflexes, respiratory rate and urine output, and adjust in renal impairment per local protocol. Calcium gluconate is the antidote for toxicity.",
        sources: [CITE.niceNg133],
        topicIds: ["obstetric-anaesthesia", "electrolytes"],
      },
      {
        drug: "Salbutamol",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "5 mg (5 mL of 1 mg/mL) made up to 50 mL (100 micrograms/mL)",
        concentrationPerMl: 100,
        concentrationLabel: "100 micrograms/mL",
        unit: "micrograms/min",
        startDose: 5,
        minDose: 3,
        maxDose: 20,
        perKg: false,
        notes:
          "Intravenous rescue in life-threatening asthma when nebulised therapy is failing. Fixed-dose infusion. Causes tachycardia, tremor, lactic acidosis and hypokalaemia — check potassium and lactate regularly.",
        topicIds: ["bronchospasm", "respiratory-failure"],
      },
      {
        drug: "Aminophylline",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "500 mg (20 mL of 25 mg/mL) made up to 50 mL (10 mg/mL)",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL",
        unit: "mg/kg/h",
        startDose: 0.5,
        minDose: 0.1,
        maxDose: 0.5,
        perKg: true,
        notes:
          "Give the 5 mg/kg loading dose over 20 min ONLY if the patient is not already on oral theophylline. Maintenance 0.5 mg/kg/h for the first 12 h, then 0.3 mg/kg/h; 0.1–0.3 mg/kg/h in the elderly, heart failure or liver disease. Narrow therapeutic index — check theophylline levels and watch for arrhythmias, vomiting and seizures.",
        topicIds: ["bronchospasm", "therapeutic-drug-monitoring"],
      },
      {
        drug: "Oxytocin",
        diluent: "0.9% sodium chloride or Hartmann's (avoid large volumes of glucose)",
        drawUp:
          "40 units made up to 40 mL (1 unit/mL). If using the alternative 40 units in 500 mL bag (0.08 units/mL), run at 125 mL/h — do not use the rates below",
        concentrationPerMl: 1,
        concentrationLabel: "1 unit/mL",
        unit: "units/h",
        startDose: 10,
        minDose: 5,
        maxDose: 10,
        perKg: false,
        notes:
          "Post-partum haemorrhage maintenance after the initial slow 5 unit bolus: 40 units over 4 h (10 units/h). Give boluses slowly — rapid injection causes profound vasodilatation, hypotension and tachycardia. Watch for hyponatraemia with prolonged high-volume infusions.",
        topicIds: ["obstetric-anaesthesia", "haemorrhage"],
      },
      {
        drug: "Tranexamic acid (major trauma)",
        diluent: "0.9% sodium chloride",
        drawUp:
          "Major trauma: 1 g IV over 10 minutes, then 1 g over 8 hours (prepared per local protocol, e.g. 1 g made up to 50 mL = 20 mg/mL)",
        concentrationPerMl: 20000,
        concentrationLabel: "20 mg/mL",
        unit: "mg/h",
        startDose: 125,
        minDose: 125,
        maxDose: 125,
        perKg: false,
        notes:
          "TRAUMA regimen (not postpartum haemorrhage — see the Obstetric topic for that regimen). Current UK guideline: NICE NG39 recommends IV tranexamic acid as soon as possible in major trauma with active or suspected active bleeding, and not more than 3 hours after injury unless there is evidence of hyperfibrinolysis. Dosing regimen: 1 g over 10 minutes then 1 g over 8 hours (fixed 125 mg/h maintenance), as used in the CRASH-2 randomised trial — a trial regimen, not itself a guideline; follow your local major-haemorrhage protocol. Reduce the dose in renal impairment. Never give by the intrathecal or epidural route — accidental spinal administration is fatal.",
        sources: [CITE.niceNg39, CITE.crash2],
        topicIds: ["transfusion-coagulation", "haemorrhage"],
      },
    ],
  },
];

export const icuInfusionCount = icuInfusionGroups.reduce((n, g) => n + g.infusions.length, 0);

// Static reference data only. The app deliberately performs no pump-rate,
// weight-based or dose arithmetic on these recipes.
