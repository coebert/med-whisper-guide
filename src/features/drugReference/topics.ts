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

export interface ReferenceTopic {
  slug: string;
  title: string;
  /** One-line description used on cards and in page metadata. */
  blurb: string;
  /** Practical bedside points shown at the top of the topic page. */
  keyPoints: string[];
  /** Lower-case substrings matched against `drug_class`. */
  patterns: string[];
}

export const referenceTopics: ReferenceTopic[] = [
  {
    slug: "vasoactive-support",
    title: "Vasopressors, inotropes & vasodilators",
    blurb: "Circulatory support agents with standard dilutions and mL/h pump rates.",
    keyPoints: [
      "Give peripheral vasopressor only as a bridge through a large, well-sited cannula that is checked hourly; move to central access as soon as it is safe.",
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
      "Sedation clears slowly in obesity, hepatic and renal failure — expect a delayed offset rather than an unexpected neurological problem.",
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
      "Renal impairment accumulates morphine metabolites: prefer fentanyl or oxycodone and reduce the dose interval rather than the drug.",
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
    blurb: "Maximum safe doses, adjuncts and lipid emulsion rescue.",
    keyPoints: [
      "Calculate the maximum dose in mg/kg on lean body weight before drawing up, and say the number out loud during the block checklist.",
      "Aspirate and inject incrementally with continuous verbal contact; early signs are perioral tingling, tinnitus, metallic taste and agitation.",
      "For local anaesthetic systemic toxicity, stop injecting, call for help, manage the airway and give lipid emulsion 20% 1.5 mL/kg over 1 minute then 15 mL/kg/h.",
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
      "Adenosine for regular narrow-complex tachycardia is 6 mg, then 12 mg, then 12 mg by rapid intravenous push with continuous ECG recording.",
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
      "Take cultures then give the first dose within an hour in suspected sepsis; do not delay for line access if a peripheral route is available.",
      "Dose by mechanism — time-dependent agents need frequent or extended infusions, concentration-dependent agents need adequate peak doses.",
      "Loading doses stay the same in renal failure; only the maintenance dose or interval changes.",
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
      "Prescribe stress ulcer prophylaxis only for patients with a risk factor, and stop it when enteral feeding is established.",
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
      "Patients on long-term steroids need perioperative supplementation; document the equivalent hydrocortisone dose.",
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
      "Give tranexamic acid 1 g early in obstetric haemorrhage — within 3 hours of onset.",
    ],
    patterns: ["uterotonic"],
  },
  {
    slug: "immunosuppression",
    title: "Immunosuppressants",
    blurb: "Transplant immunosuppression, almost all requiring blood level monitoring.",
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
    "Every monograph lists its own sources — check the dose against the BNF or product SPC and your local protocol before use.",
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
