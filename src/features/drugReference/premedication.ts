/**
 * Adult anaesthetic premedication content — the single source rendered by the
 * /premedication page and exported to the native iOS reference JSON.
 * Static reference prose and tables only; no dose arithmetic.
 */
import { CITE } from "./citations";
import { standardRefs } from "./references";
import type { DrugSource } from "./types";

export const rcoaGpas: DrugSource = {
  title: "Guidelines for the Provision of Anaesthesia Services (GPAS)",
  publisher: "Royal College of Anaesthetists",
  url: "https://rcoa.ac.uk/gpas",
};

export interface PremedRow {
  group: string;
  dose: string;
  timing: string;
}

export interface PremedSection {
  id: string;
  title: string;
  /** Monographs linked from the section. */
  links?: { slug: string; label: string }[];
  text?: string;
  rows?: PremedRow[];
  items?: string[];
  /** Direct citations for statements in the section. */
  cited?: DrugSource[];
  /** Generic search lookups — a place to look, not evidence. */
  lookups?: DrugSource[];
}

export const PREMED_INTRO =
  "For adults aged 18 years and over. Premedication is given before induction to reduce anxiety and smooth the induction itself. It is used selectively — most fit adults need none. Doses below summarise common UK practice; several uses are off-label and should follow local policy. Clinical verification of this page is in progress.";

export const PREMED_FOOTNOTE =
  "Adult UK reference. Not for paediatric use. This page summarises common practice and is not a substitute for local policy or the product literature. Several regimens are off-label; prescribing remains the responsibility of the attending clinician.";

export const premedSections: PremedSection[] = [
  {
    id: "general-principles",
    title: "General principles",
    items: [
      "Choose the agent to match the goal: anxiolysis and amnesia (midazolam) versus rousable sedation with analgesic sparing (clonidine, dexmedetomidine).",
      "Anyone given a sedative premed needs documented monitoring (SpO₂, respiratory rate, level of consciousness) and a named person responsible until handover to the anaesthetic team. Flumazenil must be immediately available when midazolam is used.",
      "Reduce doses in older and frail adults, obstructive sleep apnoea, and significant cardiac, respiratory, hepatic or renal impairment.",
      "Avoid routine sedative premedication where a rapid wake-up is needed, in airway obstruction risk, and in raised intracranial pressure.",
      "In pregnancy and breastfeeding, check each drug's product information and local obstetric guidance before use.",
    ],
    lookups: [rcoaGpas],
  },
  {
    id: "midazolam-oral",
    title: "Midazolam — oral",
    links: [{ slug: "midazolam", label: "Midazolam monograph" }],
    text: "Benzodiazepine giving anxiolysis and anterograde amnesia. Onset 15–30 minutes.",
    rows: [
      {
        group: "Adult — oral",
        dose: "7.5–15 mg (oral solution/tablet); halve in older or frail adults",
        timing: "30–60 min before induction",
      },
    ],
    items: [
      "Paradoxical agitation or disinhibition can occur — observe, do not re-dose automatically.",
      "Caution with other CNS depressants (opioids, antihistamines); recovery may be delayed after day-case surgery.",
    ],
    lookups: standardRefs("Midazolam"),
  },
  {
    id: "clonidine-oral",
    title: "Clonidine — oral",
    links: [{ slug: "clonidine", label: "Clonidine monograph" }],
    text: "Alpha-2 agonist used off-label for sedative premedication. Bradycardia, hypotension and excessive sedation are important risks; appropriate airway and respiratory monitoring remain necessary. Slower onset than midazolam, so it suits planned rather than last-minute premedication.",
    rows: [
      { group: "Adult — oral", dose: "150–300 micrograms", timing: "60–90 min before induction" },
    ],
    items: [
      "Avoid or reduce the dose in conduction disease, hypovolaemia or with other negative chronotropes.",
      "Reduces volatile and opioid requirements; plan induction and analgesia doses accordingly.",
      "Longer sedation than midazolam — allow for a slower recovery in day-case pathways.",
    ],
    cited: [CITE.clonidineSpc],
    lookups: standardRefs("Clonidine"),
  },
  {
    id: "dexmedetomidine-intranasal",
    title: "Dexmedetomidine — intranasal",
    links: [{ slug: "dexmedetomidine", label: "Dexmedetomidine monograph" }],
    text: "Off-label specialist use only, under an agreed local protocol. The IV product SmPC does not support intranasal use, so this app gives no standard intranasal dose or preparation. Bradycardia and hypotension are important adverse effects; respiratory depression, airway obstruction and apnoea can also occur, so cardiac and respiratory monitoring are required.",
    items: [
      "Avoid in heart block, severe ventricular dysfunction and hypovolaemia, and use caution with other rate-slowing drugs.",
      "Context only: one adult randomised trial used 1 microgram/kg given 45–60 minutes before surgery. This is a trial regimen, not a general UK recommendation.",
    ],
    cited: [CITE.dexmedSpc, CITE.dexmedIntranasalRct],
    lookups: standardRefs("Dexmedetomidine"),
  },
  {
    id: "melatonin-oral",
    title: "Melatonin — oral",
    links: [{ slug: "melatonin", label: "Melatonin monograph" }],
    text: "Used off-label as a mild anxiolytic premedication; immediate-release preparations are used.",
    rows: [
      {
        group: "Adult — oral",
        dose: "3–6 mg immediate-release",
        timing: "60–90 min before induction",
      },
    ],
    items: [
      "Effect is inconsistent — have a plan if the patient is still anxious at induction. Monitor as for any sedative premedication.",
    ],
    lookups: standardRefs("Melatonin"),
  },
  {
    id: "gabapentinoids",
    title: "Gabapentinoids — gabapentin and pregabalin",
    links: [
      { slug: "gabapentin", label: "Gabapentin monograph" },
      { slug: "pregabalin", label: "Pregabalin monograph" },
    ],
    text: "Gabapentinoids are not a routine premedication choice. Potential analgesic benefit must be weighed against sedation, dizziness and respiratory depression; evidence does not establish a single optimal perioperative dose or timing. Use only an individualised plan under local guidance; prevention of chronic postsurgical pain is not established.",
    items: [
      "Assess whether use is appropriate in older or frail adults, sleep apnoea and respiratory disease. Adjust gabapentin or pregabalin using the medicine-specific renal-function dosing table and monitor sedation and breathing; a universal 50% dose reduction is not appropriate.",
      "Additive sedation and respiratory depression with opioids; severe respiratory depression has also been reported without opioids.",
    ],
    cited: [CITE.niceNg180, CITE.mhraGabapentin, CITE.mhraDsuFeb2021, CITE.gabapentinSpc],
  },
  {
    id: "simple-analgesia",
    title: "Pre-emptive simple analgesia",
    links: [
      { slug: "paracetamol", label: "Paracetamol monograph" },
      { slug: "ibuprofen", label: "Ibuprofen monograph" },
    ],
    text: "Oral paracetamol and an NSAID given with the pre-operative sip of water are part of most multimodal and enhanced recovery pathways.",
    rows: [
      {
        group: "Adult — paracetamol",
        dose: "Use the current oral product guidance and local adult weight/risk-adjusted regimen. Adults below 50 kg or with hepatic, nutritional or alcohol-related risk factors need an individualised dose and daily maximum",
        timing: "1–2 h before surgery",
      },
      {
        group: "Adult — ibuprofen",
        dose: "400 mg oral (omit if NSAIDs contraindicated)",
        timing: "1–2 h before surgery",
      },
    ],
    items: [
      "Count all oral, IV and combination-product paracetamol doses, and record the pre-operative dose clearly so the daily maximum is not exceeded.",
      "Avoid NSAIDs in renal impairment, active peptic ulceration, significant bleeding risk, severe asthma with known sensitivity and some bowel and bone-graft surgery. Check product information for use in pregnancy and breastfeeding.",
    ],
    cited: [CITE.niceNg180],
    lookups: standardRefs("Paracetamol"),
  },
  {
    id: "aspiration-prophylaxis",
    title: "Aspiration prophylaxis",
    links: [
      { slug: "omeprazole", label: "Omeprazole" },
      { slug: "sodium-citrate", label: "Sodium citrate" },
      { slug: "metoclopramide", label: "Metoclopramide" },
    ],
    text: "Used where the risk of regurgitation is raised: emergency surgery, obstetrics, reflux, hiatus hernia, obesity, gastroparesis and difficult-airway plans.",
    rows: [
      { group: "Omeprazole — oral", dose: "40 mg", timing: "Evening before and/or 2–4 h pre-op" },
      {
        group: "Sodium citrate 0.3 M — oral",
        dose: "30 mL",
        timing: "Immediately before induction (obstetric RSI)",
      },
      { group: "Metoclopramide — oral/IV", dose: "10 mg", timing: "30–60 min before induction" },
    ],
    lookups: [...standardRefs("Omeprazole"), rcoaGpas],
  },
  {
    id: "antiemetic-prophylaxis",
    title: "Antiemetic prophylaxis",
    links: [
      { slug: "ondansetron", label: "Ondansetron" },
      { slug: "dexamethasone", label: "Dexamethasone" },
    ],
    text: "Risk-scored prophylaxis (Apfel) is usually given at induction rather than as a true premed, but oral dosing on the ward is an option in high-risk patients and in those with severe previous post-operative nausea and vomiting.",
    rows: [
      {
        group: "Ondansetron",
        dose: "Adult 4 mg IV at induction, or 16 mg oral 1 h pre-op (BNF)",
        timing: "Oral 1 h pre-op; IV at induction",
      },
      {
        group: "Dexamethasone",
        dose: "Adult PONV prophylaxis: 3.3–6.6 mg dexamethasone base IV (equivalent to 4–8 mg dexamethasone phosphate), according to local protocol. Verify how the preparation and prescription express the dose",
        timing: "At induction, not on the ward",
      },
    ],
    items: [
      "Ondansetron prolongs the QT interval — avoid combining with other QT-prolonging drugs and correct electrolytes.",
      "Warn the patient that dexamethasone commonly causes a brief perineal burning sensation if given awake, and check the glucose in diabetes.",
    ],
    cited: [CITE.dexamethasoneSpc, CITE.rchtPonv],
    lookups: [...standardRefs("Ondansetron"), rcoaGpas],
  },
  {
    id: "topical-local-anaesthetic",
    title: "Topical local anaesthetic for cannulation",
    links: [
      { slug: "emla-lidocaine-prilocaine", label: "EMLA monograph" },
      { slug: "tetracaine", label: "Tetracaine (Ametop) monograph" },
      { slug: "lidocaine", label: "Lidocaine monograph" },
    ],
    text: "Can be applied on the ward to potential cannulation sites before intravenous induction.",
    rows: [
      {
        group: "EMLA (lidocaine 2.5% + prilocaine 2.5%)",
        dose: "Thick layer under an occlusive dressing, as specified in the product information",
        timing:
          "For intact-skin needle procedures, allow the application time in the product information; after a 1–2-hour application, anaesthesia usually persists for at least 2 hours after removal (shorter on the face)",
      },
      {
        group: "Ametop (tetracaine 4% gel)",
        dose: "Contents of one tube under an occlusive dressing",
        timing: "Apply 30–45 min before; remove after 45 min",
      },
    ],
    items: [
      "EMLA causes vasoconstriction and can make veins harder to see; tetracaine causes vasodilatation and mild erythema, which usually helps.",
      "Do not apply to broken skin, mucous membranes or the eye, and remove tetracaine on time to avoid blistering.",
    ],
    cited: [CITE.emlaSpc],
    lookups: standardRefs("Tetracaine"),
  },
];
