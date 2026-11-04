/**
 * Direct citations for statements revised in the source-level correction pass.
 * Only URLs supplied with the reviewed findings are listed here.
 */
import type { DrugSource } from "./types";

const c = (label: string, title: string, publisher: string, url: string): DrugSource => ({
  label,
  title,
  publisher,
  url,
});

export const CITE = {
  ouhRenalAnalgesia: c(
    "OUH renal guide",
    "Oral analgesic dose adjustments in renal impairment",
    "Oxford University Hospitals",
    "https://ouh.quris.com/hospital-guidelines/pain-guidelines/body-systems/special-populations/renal-failure/oral-analgesic-dose-adjustments-in-renal-impairment/",
  ),
  oxycodoneSpc: c(
    "SmPC",
    "Oxycodone — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/7677/smpc",
  ),
  rcukTachy: c(
    "RCUK 2026",
    "Adult tachyarrhythmia algorithm (V2, January 2026)",
    "Resuscitation Council UK",
    "https://www.resus.org.uk/sites/default/files/2026-01/Adult%20tachyarrhythmia%20algorithm%20V2%20January%202026.pdf",
  ),
  qrhLast: c(
    "QRH 3-10",
    "Quick Reference Handbook 3-10: Local anaesthetic toxicity (v2, June 2023)",
    "Association of Anaesthetists",
    "https://anaesthetists.org/Portals/0/PDFs/QRH/QRH_3-10_Local_anaesthetic_toxicity_v2_June%202023.pdf?ver=2023-06-23-141010-760",
  ),
  whoTxaPph: c(
    "WHO 2017",
    "WHO recommendation on tranexamic acid for the treatment of postpartum haemorrhage",
    "World Health Organization",
    "https://iris.who.int/bitstream/handle/10665/259379/WHO-RHR-17.21-eng.pdf",
  ),
  whoPph: c(
    "WHO PPH",
    "WHO recommendations for the prevention and treatment of postpartum haemorrhage",
    "World Health Organization",
    "https://www.who.int/publications/i/item/9789241550154",
  ),
  sccmSup: c(
    "SCCM/ASHP 2024",
    "Guideline for the prevention of upper gastrointestinal bleeding in critically ill adults",
    "SCCM / ASHP",
    "https://www.sccm.org/clinical-resources/guidelines/guidelines/sccm-ashp-guideline-prevention-of-ugib",
  ),
  niceNg253: c(
    "NICE NG253",
    "Suspected sepsis — managing suspected sepsis",
    "NICE",
    "https://www.nice.org.uk/guidance/NG253/chapter/managing-suspected-sepsis",
  ),
  periopSteroids: c(
    "Anaesthesia 2020",
    "Guidelines for the management of glucocorticoids during the peri-operative period",
    "Anaesthesia (Association of Anaesthetists)",
    "https://doi.org/10.1111/anae.14963",
  ),
  ivLidocaineConsensus: c(
    "Anaesthesia 2020",
    "International consensus statement on the peri-operative use of intravenous lidocaine",
    "Anaesthesia (Association of Anaesthetists)",
    "https://onlinelibrary.wiley.com/doi/10.1111/anae.15270",
  ),
  dexmedSpc: c(
    "SmPC",
    "Dexmedetomidine — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/4783/smpc",
  ),
  veletriSpc: c(
    "Veletri SmPC",
    "Veletri (epoprostenol) — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/3112/smpc",
  ),
  heparinSpc: c(
    "SmPC",
    "Heparin sodium — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/1682/smpc",
  ),
  niceNg133: c(
    "NICE NG133",
    "Hypertension in pregnancy: diagnosis and management",
    "NICE",
    "https://www.nice.org.uk/guidance/ng133/chapter/recommendations",
  ),
  noradSpc: c(
    "SmPC",
    "Noradrenaline — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/13172/smpc",
  ),
  argipressinSpc1: c(
    "SmPC 4117",
    "Argipressin 20 IU/mL — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/4117/smpc",
  ),
  argipressinSpc2: c(
    "SmPC 10362",
    "Argipressin 20 IU/mL — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/10362/smpc",
  ),
  highlandVasopressin: c(
    "NHS Highland",
    "Vasopressin (argipressin) for septic shock — critical care formulary",
    "NHS Highland (Right Decisions)",
    "https://www.rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/formularies/ancillary-formularies/critical-care-formulary/vasopressin-argipressin-for-septic-shock-critical-care-formulary/",
  ),
  propofolSpc: c(
    "SmPC",
    "Propofol 10 mg/mL (1%) emulsion — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/11295/smpc",
  ),
  dexamethasoneSpc: c(
    "SmPC",
    "Dexamethasone injection — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/9378/smpc",
  ),
  rchtPonv: c(
    "RCHT PONV",
    "Post-operative nausea and vomiting clinical guideline",
    "Royal Cornwall Hospitals NHS Trust",
    "https://doclibrary-rcht.cornwall.nhs.uk/DocumentsLibrary/RoyalCornwallHospitalsTrust/Clinical/Anaesthetics/PostOperativeNauseaAndVomitingClinicalGuideline.pdf",
  ),
  emlaSpc: c(
    "EMLA SmPC",
    "EMLA cream — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/871/smpc",
  ),
  niceNg180: c(
    "NICE NG180",
    "Perioperative care in adults — recommendations",
    "NICE",
    "https://www.nice.org.uk/guidance/ng180/chapter/Recommendations",
  ),
  mhraGabapentin: c(
    "MHRA DSU",
    "Gabapentin (Neurontin): risk of severe respiratory depression",
    "MHRA Drug Safety Update",
    "https://www.gov.uk/drug-safety-update/gabapentin-neurontin-risk-of-severe-respiratory-depression",
  ),
  mhraDsuFeb2021: c(
    "MHRA DSU Feb 2021",
    "Drug Safety Update, February 2021 (PDF)",
    "MHRA",
    "https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/962557/Feb-2021-DSU-PDF_final.pdf",
  ),
  pregabalinSpc: c(
    "Pregabalin SmPC",
    "Pregabalin 75 mg capsules — Summary of Product Characteristics (emc product 15628)",
    "emc",
    "https://www.medicines.org.uk/emc/product/15628/smpc",
  ),
  clonidineSpc: c(
    "SmPC",
    "Summary of Product Characteristics (emc product 9616)",
    "emc",
    "https://www.medicines.org.uk/emc/product/9616/smpc",
  ),
  niceNg39: c(
    "NICE NG39",
    "Major trauma: assessment and initial management — recommendations",
    "NICE",
    "https://www.nice.org.uk/guidance/ng39/chapter/recommendations",
  ),
  crash2: c(
    "CRASH-2 trial",
    "CRASH-2: tranexamic acid in bleeding trauma patients (Lancet 2010) — trial, not a guideline",
    "CRASH-2 collaborators, LSHTM",
    "https://crash2.lshtm.ac.uk/CRASH2_Lancet.pdf",
  ),
  fentanylIvSpc: c(
    "SmPC",
    "Fentanyl 50 micrograms/mL solution for injection — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/3387/smpc",
  ),
  alfentanilSpc: c(
    "SmPC",
    "Rapifen (alfentanil) — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/6427/smpc",
  ),
  btsSignAsthma: c(
    "BTS/SIGN 158",
    "BTS/SIGN British guideline on the management of asthma (SIGN 158, 2019)",
    "British Thoracic Society / SIGN",
    "https://www.brit-thoracic.org.uk/document-library/guidelines/asthma/btssign-guideline-for-the-management-of-asthma-2019-sign-158/",
  ),
  aminophyllineSpc: c(
    "SmPC",
    "Aminophylline injection — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/6560/smpc",
  ),
  remifentanilSpc: c(
    "SmPC",
    "Remifentanil — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/14262/smpc",
  ),
  hemabateSpc: c(
    "SmPC",
    "Hemabate (carboprost) — Summary of Product Characteristics",
    "emc",
    "https://www.medicines.org.uk/emc/product/1084/smpc",
  ),
  dexmedIntranasalRct: c(
    "Adult RCT (context only)",
    "Intranasal dexmedetomidine premedication in adults: randomised trial (PLOS ONE 2016) — trial context, not a UK recommendation",
    "PLOS ONE",
    "https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0154192",
  ),
  periopDiabetes2026: c(
    "UK/Ireland consensus 2026",
    "Perioperative management of adults with diabetes — UK and Ireland consensus (Anaesthesia, 2026)",
    "Association of Anaesthetists",
    "https://associationofanaesthetists-publications.onlinelibrary.wiley.com/doi/10.1111/anae.70181",
  ),
} satisfies Record<string, DrugSource>;
