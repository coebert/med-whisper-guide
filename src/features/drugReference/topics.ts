/**
 * Topic groupings for the standalone drug reference app.
 *
 * Topics are derived from the `drug_class` string on each monograph so the
 * reference stays a single dataset — no per-drug curation needed. Matching is
 * ordered: the first topic whose patterns match a class wins, and anything left
 * over falls into "Other agents".
 *
 * Deliberately dependency-free so this folder can be lifted into its own app.
 */

import { CITE } from "./citations";
import type { DrugSource } from "./types";

/** A bedside point, optionally with direct citations for the statement. */
export type KeyPoint = string | { text: string; sources: DrugSource[] };

export function keyPointText(p: KeyPoint): string {
  return typeof p === "string" ? p : p.text;
}

export function keyPointSources(p: KeyPoint): DrugSource[] {
  return typeof p === "string" ? [] : p.sources;
}

export interface ReferenceTopic {
  slug: string;
  title: string;
  /** One-line description used on cards and in page metadata. */
  blurb: string;
  /** Practical bedside points shown at the top of the topic page. */
  keyPoints: KeyPoint[];
  /** Lower-case substrings matched against `drug_class`. */
  patterns: string[];
}

export const referenceTopics: ReferenceTopic[] = [
  {
    slug: "vasoactive-support",
    title: "Vasopressors, inotropes & vasodilators",
    blurb: "Circulatory support agents with standard dilutions.",
    keyPoints: [
      "Give peripheral vasopressor only as a bridge through a large, well-sited cannula with frequent site checks under local policy; move to central access as soon as it is safe.",
      "Titrate to a mean arterial pressure target set for the patient, not to a fixed rate, and reassess volume state and cardiac output before adding a second agent.",
      "Double-strength bags exist for fluid-restricted patients — always confirm the concentration on the syringe label against the pump library before handover.",
      "Vasodilator infusions need continuous arterial pressure monitoring; stop rather than titrate down when pressure falls abruptly.",
    ],
    patterns: ["vasopressor", "inotrope", "vasodilator", "vasopressin analogue", "pulmonary vasodilator"],
  },
  {
    slug: "sedation-anaesthesia",
    title: "Sedation & anaesthesia",
    blurb: "Induction agents, volatiles, sedative infusions and their antagonists.",
    keyPoints: [
      "Set a sedation target (for example RASS −1 to 0) and assess it at least once a nursing shift; daily interruption shortens ventilation where it is safe.",
      "Watch cumulative propofol dose, triglycerides and lactate for propofol-related infusion syndrome in prolonged high-dose use.",
      "Sedative effects may be prolonged by drug accumulation and organ impairment. Unexpected failure to wake requires prompt assessment for drug effects and other causes, including hypoxia, metabolic disturbance and neurological pathology; do not assume accumulation is the explanation.",
      "Sedation is not analgesia: treat pain first, then add sedation only if a target is still unmet.",
    ],
    patterns: [
      "induction agent",
      "sedative",
      "volatile anaesthetic",
      "benzodiazepine antagonist",
      "barbiturate",
    ],
  },
  {
    slug: "analgesia",
    title: "Opioids & analgesia",
    blurb: "Opioids, NSAIDs and adjuncts, with equivalence and safety limits.",
    keyPoints: [
      "Use multimodal analgesia — paracetamol plus an NSAID where safe reduces opioid need and opioid-related adverse effects.",
      {
        text: "Morphine and its active metabolites can accumulate in renal impairment. Choose the opioid and adjust the dose and/or lengthen the dosing interval using renal guidance; oxycodone also requires caution and dose adjustment. Monitor closely for sedation and respiratory depression.",
        sources: [CITE.ouhRenalAnalgesia, CITE.oxycodoneSpc],
      },
      "Convert between opioids using published equivalence, then reduce by 25–50% for incomplete cross-tolerance and re-titrate.",
      "After more than a week of opioid or alpha-2 agonist infusion, plan a taper — abrupt discontinuation causes agitation, tachycardia and diarrhoea.",
    ],
    patterns: ["opioid", "nsaid", "analgesic", "opioid antagonist"],
  },
  {
    slug: "neuromuscular-blockade",
    title: "Neuromuscular blockers & reversal",
    blurb: "Depolarising and non-depolarising blockers with reversal agents.",
    keyPoints: [
      "Never give a neuromuscular blocker without a secured or immediately securable airway and a working means of ventilation.",
      "Monitor depth with a nerve stimulator whenever a blocker is infused; aim for a documented train-of-four target.",
      "Ensure adequate sedation and analgesia before paralysis — paralysis hides awareness and pain.",
      "Suxamethonium is contraindicated where hyperkalaemia is likely (burns beyond 24 hours, prolonged immobility, denervation, established critical illness).",
    ],
    patterns: ["nmba", "nmba reversal"],
  },
  {
    slug: "local-anaesthetics",
    title: "Local anaesthetics & toxicity rescue",
    blurb: "Dose limits, adjuncts and lipid emulsion rescue.",
    keyPoints: [
      "Check the drug-specific maximum dose in the product information and local guidance before drawing up, and state it during the block checklist.",
      "Aspirate and inject incrementally with continuous verbal contact; early signs are perioral tingling, tinnitus, metallic taste and agitation.",
      {
        text: "For suspected severe local anaesthetic systemic toxicity, stop local anaesthetic administration, summon help, support oxygenation and ventilation, and follow the current Association of Anaesthetists emergency algorithm. Its initial 20% lipid regimen is 1.5 mL/kg IV over 2–3 minutes followed by 15 mL/kg/h; follow the algorithm for repeat doses and escalation, without exceeding a cumulative 12 mL/kg.",
        sources: [CITE.qrhLast],
      },
      "Continue resuscitation well beyond the usual duration — recovery after bupivacaine arrest can take over an hour.",
    ],
    patterns: ["local anaesthetic", "la toxicity rescue"],
  },
  {
    slug: "cardiac-rhythm",
    title: "Antiarrhythmics & rate control",
    blurb: "Rhythm and rate control agents, including beta-blockade.",
    keyPoints: [
      "Correct potassium, magnesium, hypoxia, pain and hypovolaemia before escalating antiarrhythmic drugs — new atrial fibrillation in critical illness is usually secondary.",
      "In an unstable tachyarrhythmia, synchronised cardioversion comes before any drug.",
      {
        text: "For a regular narrow-complex tachyarrhythmia without life-threatening features, follow the current RCUK algorithm: vagal manoeuvres, then adenosine if there is no pre-excitation, using 6 mg, 12 mg and 18 mg rapid IV boluses if preceding doses are unsuccessful, with continuous ECG monitoring and appropriate resuscitation facilities. This is guideline dosing and may differ from the product licence; check contraindications and patient-specific dose adjustments.",
        sources: [CITE.rcukTachy],
      },
      "Amiodarone by peripheral vein causes phlebitis — use central access for anything beyond a single loading dose.",
    ],
    patterns: ["antiarrhythmic", "β-blocker", "α/β-blocker", "blocker"],
  },
  {
    slug: "coagulation",
    title: "Anticoagulation, antiplatelets & reversal",
    blurb: "Thromboprophylaxis, treatment doses, thrombolysis and reversal agents.",
    keyPoints: [
      "Confirm the indication and the target (prophylaxis versus treatment) before prescribing — the doses differ several-fold.",
      "Low molecular weight heparin needs dose reduction and, in some settings, anti-Xa monitoring in renal impairment and extremes of weight.",
      "Know the reversal pathway for every agent you start: protamine, vitamin K with prothrombin complex, idarucizumab or andexanet.",
      "Record the last dose time before any neuraxial procedure and apply the published interval — this is the commonest avoidable harm.",
    ],
    patterns: ["anticoagulant", "antiplatelet", "thrombolytic", "antifibrinolytic"],
  },
  {
    slug: "fluids-electrolytes",
    title: "Fluids, blood products & electrolytes",
    blurb: "Crystalloids, colloids, blood components, diuretics and electrolyte replacement.",
    keyPoints: [
      "Prescribe fluid as a named indication (resuscitation, replacement or maintenance) with a volume and a rate, then reassess after each bolus.",
      "Balanced crystalloid is the default resuscitation fluid; large-volume 0.9% sodium chloride causes hyperchloraemic acidosis.",
      "Give concentrated potassium only by a monitored central route at an agreed maximum rate; correct magnesium at the same time.",
      "Blood components need a documented threshold or bleeding indication, positive patient identification and observation for the first 15 minutes.",
    ],
    patterns: [
      "crystalloid",
      "colloid",
      "blood product",
      "electrolyte",
      "buffer",
      "osmotic agent",
      "diuretic",
    ],
  },
  {
    slug: "antimicrobials",
    title: "Antimicrobials & antifungals",
    blurb: "Antibacterials, antifungals and antivirals with level monitoring where needed.",
    keyPoints: [
      {
        text: "Take appropriate microbiological samples before antibiotics where this will not delay urgent treatment. For adults at high risk of severe illness or death from suspected sepsis, give IV antibiotics within 1 hour under NICE NG253. Moderate- and low-risk presentations require the guideline's risk-stratified assessment and treatment timings.",
        sources: [CITE.niceNg253],
      },
      "Dose by mechanism — time-dependent agents need frequent or extended infusions, concentration-dependent agents need adequate peak doses.",
      "Loading and maintenance dose changes in renal impairment are drug-specific — check the product information and local antimicrobial guidance for each agent.",
      "Review at 48–72 hours against culture results and set a stop or step-down date at the time of prescribing.",
    ],
    patterns: ["antimicrobial", "antifungal", "antiviral"],
  },
  {
    slug: "respiratory",
    title: "Respiratory drugs",
    blurb: "Bronchodilators, methylxanthines and respiratory stimulants.",
    keyPoints: [
      "Give nebulised or inhaled bronchodilator by the route that reaches the airway — in ventilated patients use an in-circuit device and check the dose reaching the patient.",
      "Repeated beta-2 agonist causes tachycardia, tremor, hypokalaemia and lactataemia; recheck potassium after back-to-back nebulisers.",
      "Magnesium sulfate is an adjunct in severe acute asthma, not a first-line bronchodilator.",
      "Aminophylline and theophylline have a narrow therapeutic window and need blood level monitoring.",
    ],
    patterns: ["bronchodilator", "respiratory stimulant", "methylxanthine"],
  },
  {
    slug: "gastrointestinal",
    title: "Antiemetics & gastrointestinal drugs",
    blurb: "Antiemetics, acid suppression, prokinetics and splanchnic agents.",
    keyPoints: [
      "Combine antiemetics from different receptor classes rather than repeating the same class for breakthrough nausea.",
      "Check the QT interval and other QT-prolonging drugs before repeated ondansetron, droperidol or metoclopramide.",
      {
        text: "Use stress-ulcer prophylaxis for critically ill adults with relevant bleeding risk factors. Enteral feeding alone is not a reason to stop it while those risk factors persist. Review daily and discontinue when the critical illness or relevant risk factors resolve, unless another indication remains.",
        sources: [CITE.sccmSup],
      },
      "Prokinetics are a short trial for feed intolerance — review at 48 hours and stop if ineffective.",
    ],
    patterns: [
      "antiemetic",
      "ppi",
      "antacid",
      "h2 antagonist",
      "prokinetic",
      "somatostatin analogue",
    ],
  },
  {
    slug: "endocrine-metabolic",
    title: "Endocrine & metabolic drugs",
    blurb: "Insulin, corticosteroids and other hormonal agents.",
    keyPoints: [
      "Run variable-rate insulin against an agreed glucose target with hourly monitoring; avoid tight control, which causes hypoglycaemia.",
      "Never stop long-acting basal insulin in type 1 diabetes, even when the patient is nil by mouth.",
      {
        text: "Assess the risk of adrenal insufficiency in patients receiving or recently exposed to glucocorticoids. Those with adrenal insufficiency or clinically significant adrenal suppression need an agreed perioperative steroid plan, in addition to their usual treatment; requirements depend on exposure and surgical stress.",
        sources: [CITE.periopSteroids],
      },
      "Check the steroid indication and duration — low-dose hydrocortisone in septic shock is a defined course, not an open-ended prescription.",
    ],
    patterns: ["endocrine", "corticosteroid", "hypoglycaemic", "mood stabiliser"],
  },
  {
    slug: "neurological",
    title: "Anticonvulsants & neurological drugs",
    blurb: "Status epilepticus and maintenance anticonvulsants, several needing blood levels.",
    keyPoints: [
      "In status epilepticus give a benzodiazepine first, twice at most, then a second-line agent — levetiracetam, phenytoin or sodium valproate — and plan anaesthesia if seizures continue.",
      "Phenytoin needs a rate limit, cardiac monitoring during loading and level monitoring corrected for albumin.",
      "Look for and treat the cause alongside the drug: glucose, sodium, calcium, eclampsia, drug withdrawal, infection and structural lesions.",
      "Continue established anticonvulsants through critical illness, converting to an equivalent parenteral dose where one exists.",
    ],
    patterns: ["anticonvulsant"],
  },
  {
    slug: "antidotes",
    title: "Antidotes & emergency drugs",
    blurb: "Antidotes, anticholinergics and rescue agents kept for emergencies.",
    keyPoints: [
      "Know where the malignant hyperthermia, cyanide and lipid emulsion boxes are kept and who reconstitutes them — dantrolene needs several pairs of hands.",
      "Give the antidote alongside supportive care, never instead of it: airway, oxygen, circulation and decontamination come first.",
      "Contact the national poisons service early for any unfamiliar or mixed overdose.",
      "Check antidote stock and expiry as part of the routine emergency equipment check.",
    ],
    patterns: ["antidote", "anticholinergic"],
  },
  {
    slug: "obstetric",
    title: "Obstetric drugs",
    blurb: "Uterotonics and prostaglandins for postpartum haemorrhage.",
    keyPoints: [
      "Escalate through the uterotonic ladder while treating the other causes of postpartum haemorrhage — tone, tissue, trauma and thrombin.",
      "Oxytocin bolus causes vasodilatation and tachycardia: give slowly, and follow with an infusion rather than repeated boluses.",
      "Ergometrine is contraindicated in hypertension and pre-eclampsia; carboprost is contraindicated in asthma.",
      {
        text: "Postpartum haemorrhage (separate from the trauma regimen): for clinically diagnosed PPH, give tranexamic acid 1 g IV over 10 minutes as soon as possible and within 3 hours of birth, alongside standard haemorrhage care. A second 1 g dose may be given if bleeding continues after 30 minutes or restarts within 24 hours.",
        sources: [CITE.whoTxaPph, CITE.whoPph],
      },
    ],
    patterns: ["uterotonic"],
  },
  {
    slug: "immunosuppression",
    title: "Immunosuppressants",
    blurb: "Transplant immunosuppression; several agents need blood level monitoring.",
    keyPoints: [
      "Never omit or delay transplant immunosuppression without transplant team advice — rejection risk outweighs most perioperative concerns.",
      "Calcineurin inhibitors interact heavily through CYP3A4: check every new antifungal, macrolide and antiepileptic against them.",
      "Take trough levels immediately before the dose and record the exact sampling and dosing times on the request.",
      "Watch renal function, magnesium, potassium, glucose and blood pressure while levels are being adjusted.",
    ],
    patterns: ["immunosuppressant", "antimetabolite", "calcineurin", "mtor"],
  },
];

export const OTHER_TOPIC: ReferenceTopic = {
  slug: "other-agents",
  title: "Other agents",
  blurb: "Remaining monographs that do not sit inside a single topic.",
  keyPoints: [
    "Each monograph lists its sources — check the dose against the BNF or product SPC and your local protocol before use.",
  ],
  patterns: [],
};

/** Returns the topic slug for a drug class, or the "other" topic. */
export function topicForClass(drugClass: string): ReferenceTopic {
  const needle = (drugClass ?? "").toLowerCase();
  const match = referenceTopics.find((t) => t.patterns.some((p) => needle.includes(p)));
  return match ?? OTHER_TOPIC;
}

export function topicBySlug(slug: string | undefined): ReferenceTopic | undefined {
  if (!slug) return undefined;
  return slug === OTHER_TOPIC.slug ? OTHER_TOPIC : referenceTopics.find((t) => t.slug === slug);
}

export const allReferenceTopics: ReferenceTopic[] = [...referenceTopics, OTHER_TOPIC];
