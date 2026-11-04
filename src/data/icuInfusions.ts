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
  /** Omitted when no source-backed range exists; readers are sent to the monograph. */
  maxDose?: number;
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
        perKg: true,
        notes:
          "Single-strength syringe (80 micrograms/mL). Double (8 mg/50 mL) and quadruple (16 mg/50 mL) strengths are listed separately; label clearly and never mix strengths on one pump. First-line vasopressor in septic shock. Dose range: see the full monograph and local protocol. Watch for reflex bradycardia and limb and gut ischaemia at high doses.",
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
        perKg: true,
        notes:
          "Double-strength syringe (160 micrograms/mL). Label clearly and never mix strengths on one pump. First-line vasopressor in septic shock. Dose range: see the full monograph and local protocol. Watch for reflex bradycardia and limb and gut ischaemia at high doses.",
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
        perKg: true,
        notes:
          "Quadruple-strength syringe (320 micrograms/mL) for high requirements or fluid restriction. Central access essential; label clearly and never mix strengths on one pump. Dose range: see the full monograph and local protocol. Watch for reflex bradycardia and limb and gut ischaemia at high doses.",
        topicIds: ["vasoactive-agents", "sepsis", "circulatory-failure"],
      },
      {
        drug: "Adrenaline (epinephrine)",
        diluent: "5% glucose or 0.9% sodium chloride",
        drawUp: "4 mg in 50 mL",
        concentrationPerMl: 80,
        concentrationLabel: "80 micrograms/mL",
        unit: "micrograms/kg/min",
        perKg: true,
        notes:
          "Second-line inotrope/vasopressor. Dose range: see the full monograph and local protocol. Causes tachycardia, hyperlactataemia and hyperglycaemia.",
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
        perKg: false,
        notes:
          "Predominantly alpha-1 agonist with indirect action. Infusion and bolus doses: see the full monograph and local protocol. Peripheral use only as permitted by local policy.",
        topicIds: ["vasoactive-agents"],
      },
      {
        drug: "Phenylephrine",
        diluent: "0.9% sodium chloride (or 5% glucose)",
        drawUp: "10 mg in 100 mL",
        concentrationPerMl: 100,
        concentrationLabel: "100 micrograms/mL",
        unit: "micrograms/kg/min",
        perKg: true,
        notes:
          "Alpha-1 agonist, useful when tachycardia limits other agents and in vasoplegia after cardiac surgery. Dose range: see the full monograph and local protocol. May reduce cardiac output through reflex bradycardia and increased afterload.",
        topicIds: ["vasoactive-agents"],
      },
      {
        drug: "Dopamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "200 mg in 50 mL (4 mg/mL)",
        concentrationPerMl: 4000,
        concentrationLabel: "4 mg/mL",
        unit: "micrograms/kg/min",
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
        perKg: true,
        notes:
          "Dose range: see the full monograph and local protocol. Accumulates with prolonged infusion, especially in renal failure and obesity. Status epilepticus dosing is different.",
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
        perKg: true,
        notes:
          "Standard-strength syringe (30 micrograms/mL). A half-strength 750 micrograms/50 mL syringe is also listed — check which your unit uses and label the strength clearly. α₂ agonist adjunct for sedation, withdrawal and agitation; useful in opioid/benzodiazepine weaning. Bradycardia and hypotension are dose-limiting — give loading doses slowly. Do not stop abruptly after prolonged use (rebound hypertension).",
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Clonidine (750 micrograms/50 mL)",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "750 micrograms (5 × 150 micrograms/mL ampoules) made up to 50 mL",
        concentrationPerMl: 15,
        concentrationLabel: "15 micrograms/mL",
        unit: "micrograms/kg/h",
        perKg: true,
        notes:
          "Half-strength syringe (15 micrograms/mL); never mix the two on one pump. Same indications and cautions as the standard-strength recipe: bradycardia and hypotension are dose-limiting, and avoid abrupt withdrawal after prolonged use.",
        topicIds: ["icu-sedation-delirium"],
      },
      {
        drug: "Fentanyl",
        diluent: "Undiluted, or dilute in 0.9% sodium chloride or 5% glucose",
        drawUp: "2500 micrograms in 50 mL — neat (50 mL of 50 micrograms/mL ampoules)",
        concentrationPerMl: 50,
        concentrationLabel: "50 micrograms/mL (neat)",
        unit: "micrograms/kg/h",
        perKg: true,
        notes:
          "This recipe is the neat 50 micrograms/mL syringe; some units use a diluted 1000 micrograms in 50 mL (20 micrograms/mL) syringe, so never mix the two strengths. Dose range: see the full monograph and local protocol. Accumulates markedly on prolonged infusion; wean gradually after days of therapy to avoid withdrawal.",
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Alfentanil",
        diluent: "Undiluted, or dilute in 0.9% sodium chloride or 5% glucose",
        drawUp: "25 mg in 50 mL (500 micrograms/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 micrograms/mL",
        unit: "micrograms/kg/h",
        minDose: 30,
        maxDose: 60,
        perKg: true,
        notes:
          "Ventilated adults (Rapifen UK SmPC): after a loading dose of 50–100 micrograms/kg over 10 minutes, maintain at 0.5–1 micrograms/kg/min (30–60 micrograms/kg/h) and titrate to response. Follow the product information and local protocol.",
        sources: [CITE.alfentanilSpc],
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Remifentanil (ventilated adult ICU)",
        diluent: "0.9% sodium chloride, 5% glucose or water for injection",
        drawUp: "5 mg in 50 mL (100 micrograms/mL)",
        concentrationPerMl: 100,
        concentrationLabel: "100 micrograms/mL",
        unit: "micrograms/kg/min",
        startDose: 0.1,
        minDose: 0.006,
        maxDose: 0.74,
        perKg: true,
        notes:
          "Ventilated adult ICU only (UK SmPC); general anaesthesia dosing is different and is not shown here. Start at 0.1–0.15 micrograms/kg/min and adjust in steps of 0.025 micrograms/kg/min no more often than every 5 minutes. If 0.2 micrograms/kg/min is reached without adequate sedation, add an appropriate sedative rather than increasing further. Rates of 0.006–0.74 micrograms/kg/min were used in ICU studies. No bolus doses in ICU. Use for more than 3 days is not recommended. Plan the next analgesia before stopping.",
        sources: [CITE.remifentanilSpc],
        topicIds: ["icu-sedation-delirium", "opioids"],
      },
      {
        drug: "Ketamine",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "500 mg (10 mL of 50 mg/mL) in 50 mL total",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL",
        unit: "mg/kg/h",
        perKg: true,
        notes:
          "Adjunct for analgosedation, especially with opioid tolerance or severe bronchospasm. Analgesic and sedative dose ranges differ: see the full monograph and local protocol.",
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
        perKg: false,
        notes:
          "There is no universal starting rate. Dose according to the written, indication-specific local protocol, including its blood glucose and potassium monitoring. Flush the line first — insulin adsorbs to plastic.",
        sources: [CITE.periopDiabetes2026],
        topicIds: ["diabetic-emergencies"],
      },
      {
        drug: "Heparin (unfractionated)",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "25,000 units in 50 mL (500 units/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 units/mL",
        unit: "units/kg/h",
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
        perKg: true,
        notes:
          "Dose range: see the full monograph and local protocol. Hofmann elimination and ester hydrolysis are organ-independent, so it is often chosen in combined hepatic and renal failure. Histamine release can cause flushing and hypotension. Store ampoules in a fridge.",
        topicIds: ["neuromuscular-blockade", "icu-sedation-delirium"],
      },
      {
        drug: "Cisatracurium",
        diluent: "0.9% sodium chloride or 5% glucose",
        drawUp: "100 mg (50 mL of 2 mg/mL) neat in a 50 mL syringe",
        concentrationPerMl: 2000,
        concentrationLabel: "2 mg/mL",
        unit: "micrograms/kg/min",
        perKg: true,
        notes:
          "Isomer of atracurium with Hofmann elimination and no clinically significant histamine release. Dosed in micrograms/kg/min; for the range, see the full monograph and local protocol. Keep refrigerated.",
        topicIds: ["neuromuscular-blockade", "ards"],
      },
      {
        drug: "Vecuronium",
        diluent: "Water for injection to reconstitute, then 0.9% sodium chloride or 5% glucose",
        drawUp: "50 mg (5 × 10 mg vials) made up to 50 mL",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/min",
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
        perKg: false,
        notes:
          "Fixed-dose (not weight-based) infusion titrated to blood pressure or chest pain. Dose range: see the full monograph and local protocol. Headache is common and tolerance develops with continuous use. Avoid with phosphodiesterase-5 inhibitors and in severe aortic stenosis or hypovolaemia.",
        topicIds: ["vasoactive-agents", "acute-coronary-syndrome"],
      },
      {
        drug: "Sodium nitroprusside",
        diluent: "5% glucose only",
        drawUp: "50 mg in 50 mL (1 mg/mL) — protect the syringe and line from light",
        concentrationPerMl: 1000,
        concentrationLabel: "1 mg/mL",
        unit: "micrograms/kg/min",
        perKg: true,
        notes:
          "Immediate-onset arterial and venous dilator for hypertensive emergencies and controlled hypotension. Dose range and maximum: see the full monograph and local protocol. Cyanide toxicity risk rises with dose and duration; watch for unexplained metabolic acidosis and rising lactate. Discard if the solution discolours.",
        topicIds: ["vasoactive-agents", "hypertensive-emergency"],
      },
      {
        drug: "Labetalol",
        diluent: "5% glucose (or 0.9% sodium chloride)",
        drawUp: "250 mg (50 mL of 5 mg/mL) neat in a 50 mL syringe",
        concentrationPerMl: 5000,
        concentrationLabel: "5 mg/mL (neat)",
        unit: "mg/h",
        perKg: false,
        notes:
          "Combined alpha-1 and beta blocker used in severe hypertension, including pre-eclampsia. Regimens are indication-specific: see the full labetalol monograph and local protocol. Use continuous blood pressure monitoring. Avoid in asthma, decompensated heart failure and heart block.",
        topicIds: ["vasoactive-agents", "obstetric-anaesthesia"],
      },
      {
        drug: "Esmolol",
        diluent: "0.9% sodium chloride or 5% glucose (10 mg/mL ready-diluted bags also available)",
        drawUp: "500 mg (5 mL of 100 mg/mL) made up to 50 mL",
        concentrationPerMl: 10000,
        concentrationLabel: "10 mg/mL",
        unit: "micrograms/kg/min",
        perKg: true,
        notes:
          "Ultra-short-acting cardioselective beta blocker, useful when beta blockade may need to be withdrawn quickly. Dosed in micrograms/kg/min; for the range, see the full monograph and local protocol. Hypotension is the main limitation; extravasation can cause skin necrosis.",
        topicIds: ["vasoactive-agents", "arrhythmias"],
      },
      {
        drug: "Hydralazine",
        diluent: "0.9% sodium chloride only (reacts with glucose)",
        drawUp: "20 mg (1 × 20 mg vial) made up to 40 mL (500 micrograms/mL)",
        concentrationPerMl: 500,
        concentrationLabel: "500 micrograms/mL",
        unit: "micrograms/min",
        perKg: false,
        notes:
          "Direct arteriolar dilator used mainly in severe pre-eclampsia. Dose regimen: see the full monograph and local protocol. Monitor maternal blood pressure and, where appropriate, fetal response. In the antenatal period, NICE advises considering up to 500 mL crystalloid before or with the first IV hydralazine dose. Avoid automatic fluid loading: severe pre-eclampsia requires careful fluid balance because of pulmonary oedema risk.",
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
        perKg: true,
        notes:
          "Dose range: see the full monograph and local protocol. Morphine and its active metabolites can accumulate in renal impairment; adjust using renal guidance and monitor closely for sedation and respiratory depression. Nurse- or patient-controlled analgesia is preferred where the patient can use it.",
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
        minDose: 0.5,
        maxDose: 0.7,
        perKg: true,
        notes:
          "BTS/SIGN acute asthma guideline: for refractory life-threatening asthma, only after senior review. If not already taking theophylline, load with 5 mg/kg over 20 minutes, then 0.5–0.7 mg/kg/h using ideal body weight. Guide by theophylline levels and clinical response. Use lower doses in older patients and in cardiac or hepatic impairment. Narrow therapeutic index — watch for arrhythmias, vomiting and seizures. The product SmPC uses a different loading dose (6 mg/kg); follow one protocol and do not combine them.",
        sources: [CITE.btsSignAsthma, CITE.aminophyllineSpc],
        topicIds: ["bronchospasm", "therapeutic-drug-monitoring"],
      },
      {
        drug: "Oxytocin",
        diluent: "0.9% sodium chloride or Hartmann's (avoid large volumes of glucose)",
        drawUp:
          "40 units made up to 40 mL (1 unit/mL). If using the alternative 40 units in 500 mL bag (0.08 units/mL), follow the local obstetric protocol",
        concentrationPerMl: 1,
        concentrationLabel: "1 unit/mL",
        unit: "units/h",
        perKg: false,
        notes:
          "Postpartum haemorrhage regimens are product- and protocol-specific: see the full oxytocin monograph and local obstetric protocol. Give boluses slowly, as rapid injection causes profound vasodilatation, hypotension and tachycardia. Watch for hyponatraemia with prolonged high-volume infusions.",
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
          "TRAUMA regimen (not postpartum haemorrhage — see the Obstetric topic for that regimen). Current UK guideline: NICE NG39 recommends IV tranexamic acid as soon as possible in major trauma with active or suspected active bleeding, and not more than 3 hours after injury unless there is evidence of hyperfibrinolysis. Dosing regimen: 1 g over 10 minutes then 1 g over 8 hours (fixed 125 mg/h maintenance), as used in the CRASH-2 randomised trial — a trial regimen, not itself a guideline; follow your local major-haemorrhage protocol. Adjust in renal impairment per the product information and local protocol. Never give by the intrathecal or epidural route — accidental spinal administration is fatal.",
        sources: [CITE.niceNg39, CITE.crash2],
        topicIds: ["transfusion-coagulation", "haemorrhage"],
      },
    ],
  },
];

export const icuInfusionCount = icuInfusionGroups.reduce((n, g) => n + g.infusions.length, 0);

// Static reference data only. The app deliberately performs no pump-rate,
// weight-based or dose arithmetic on these recipes.
