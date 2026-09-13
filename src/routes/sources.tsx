import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";

export const Route = createFileRoute("/sources")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Clinical Sources — BNF, SPC, NICE & RCoA | Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "The clinical references behind every monograph: the BNF and BNF for Children, manufacturers' Summaries of Product Characteristics, NICE guidance, RCoA and Association of Anaesthetists standards, and UK critical care guidelines.",
      },
      {
        property: "og:title",
        content: "Clinical Sources — BNF, SPC, NICE & RCoA | Anaesthesia & Critical Care Drugs",
      },
      {
        property: "og:description",
        content:
          "Every reference used in this drug reference, grouped by formulary, product information, national guidance and laboratory standards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClinicalSourcesPage,
});

type Reference = {
  title: string;
  publisher: string;
  url: string;
  note: string;
};

type ReferenceGroup = {
  id: string;
  heading: string;
  intro: string;
  refs: Reference[];
};

const referenceGroups: ReferenceGroup[] = [
  {
    id: "formulary",
    heading: "Formularies",
    intro:
      "First call for adult and paediatric dosing, cautions, interactions and licensed indications. Where a monograph's dose differs from the formulary, the difference is stated in the text.",
    refs: [
      {
        title: "British National Formulary (BNF)",
        publisher: "NICE / BMJ / Royal Pharmaceutical Society",
        url: "https://bnf.nice.org.uk/",
        note: "Adult dosing, cautions, interactions and prescribing notes. Used as the default dosing source for every adult monograph.",
      },
      {
        title: "BNF for Children (BNFC)",
        publisher: "NICE / BMJ / RPS / RCPCH",
        url: "https://bnfc.nice.org.uk/",
        note: "Neonatal, infant and child dosing, including weight-based and unlicensed paediatric use.",
      },
      {
        title: "Injectable Medicines Guide (Medusa)",
        publisher: "NHS",
        url: "https://medusa.wales.nhs.uk/",
        note: "Reconstitution, dilution, compatibility and administration for injectable medicines. Local access may be required.",
      },
      {
        title: "Specialist Pharmacy Service (SPS)",
        publisher: "NHS England",
        url: "https://www.sps.nhs.uk/",
        note: "Medicines advice on compatibility, stability, administration via feeding tubes and use in pregnancy and renal failure.",
      },
    ],
  },
  {
    id: "spc",
    heading: "Manufacturers' product information (SPC)",
    intro:
      "The legally approved Summary of Product Characteristics for each product — the source for presentation, diluents, stability, storage and licensed dosing. Always check the SPC for the brand your department stocks.",
    refs: [
      {
        title: "electronic Medicines Compendium (emc)",
        publisher: "Datapharm",
        url: "https://www.medicines.org.uk/emc",
        note: "SPCs and patient information leaflets for medicines licensed in the UK.",
      },
      {
        title: "MHRA Products portal",
        publisher: "Medicines and Healthcare products Regulatory Agency",
        url: "https://products.mhra.gov.uk/",
        note: "Official UK public assessment reports, SPCs and licence details.",
      },
      {
        title: "Drug Safety Update",
        publisher: "MHRA",
        url: "https://www.gov.uk/drug-safety-update",
        note: "Monthly safety advice and warnings — the source for the safety alerts quoted in individual monographs.",
      },
    ],
  },
  {
    id: "national-guidance",
    heading: "NICE and national guidance",
    intro:
      "Where treatment choice, thresholds or monitoring are set nationally rather than by the product licence.",
    refs: [
      {
        title: "NICE guidance",
        publisher: "National Institute for Health and Care Excellence",
        url: "https://www.nice.org.uk/guidance",
        note: "Clinical guidelines, technology appraisals and the NICE British National Formulary treatment summaries.",
      },
      {
        title: "Sedation in under-19s (CG112)",
        publisher: "NICE",
        url: "https://www.nice.org.uk/guidance/cg112",
        note: "Underpins the paediatric premedication and sedation guidance in this app.",
      },
      {
        title: "NICE Clinical Knowledge Summaries",
        publisher: "NICE",
        url: "https://cks.nice.org.uk/",
        note: "Practical summaries used to cross-check indications and monitoring advice.",
      },
      {
        title: "Resuscitation Council UK guidelines",
        publisher: "Resuscitation Council UK",
        url: "https://www.resus.org.uk/library/2021-resuscitation-guidelines",
        note: "Cardiac arrest, peri-arrest and anaphylaxis drug doses.",
      },
    ],
  },
  {
    id: "specialty",
    heading: "RCoA and specialty standards",
    intro:
      "Anaesthesia and critical care standards that govern how these drugs are used in theatre and on the unit.",
    refs: [
      {
        title: "Guidelines for the Provision of Anaesthetic Services (GPAS)",
        publisher: "Royal College of Anaesthetists",
        url: "https://rcoa.ac.uk/safety-standards-quality/guidance-resources/guidelines-provision-anaesthetic-services",
        note: "Service standards for anaesthesia, including preoperative preparation and premedication.",
      },
      {
        title: "RCoA safety, standards and quality resources",
        publisher: "Royal College of Anaesthetists",
        url: "https://rcoa.ac.uk/safety-standards-quality",
        note: "Safety alerts, quality standards and the National Audit Projects.",
      },
      {
        title: "Association of Anaesthetists guidelines",
        publisher: "Association of Anaesthetists",
        url: "https://anaesthetists.org/Home/Resources-publications/Guidelines",
        note: "Safe practice guidance including drug administration, monitoring and total intravenous anaesthesia.",
      },
      {
        title: "Safe management of malignant hyperthermia",
        publisher: "Association of Anaesthetists / UK MH Investigation Unit",
        url: "https://anaesthetists.org/Home/Resources-publications/Guidelines/Malignant-hyperthermia-guideline",
        note: "Dantrolene dosing and the crisis drill.",
      },
      {
        title: "Intensive Care Society guidelines and standards",
        publisher: "Intensive Care Society",
        url: "https://ics.ac.uk/resource/guidelines-standards.html",
        note: "Critical care standards including sedation, analgesia and delirium practice.",
      },
      {
        title: "Faculty of Intensive Care Medicine",
        publisher: "FICM",
        url: "https://www.ficm.ac.uk/standards-research-revalidation/standards",
        note: "Standards for critical care services and organ support.",
      },
      {
        title: "APA — Association of Paediatric Anaesthetists",
        publisher: "APAGBI",
        url: "https://www.apagbi.org.uk/guidelines",
        note: "Paediatric anaesthesia guidance, including pain management and premedication.",
      },
      {
        title: "Management of severe local anaesthetic toxicity",
        publisher: "Association of Anaesthetists",
        url: "https://anaesthetists.org/Home/Resources-publications/Guidelines/Management-of-severe-local-anaesthetic-toxicity",
        note: "Maximum safe doses and lipid emulsion rescue.",
      },
    ],
  },
  {
    id: "labs",
    heading: "Blood levels and laboratory standards",
    intro:
      "Target ranges, sampling times and toxicity thresholds on the Levels pages come from these, alongside the product SPC.",
    refs: [
      {
        title: "Association for Laboratory Medicine",
        publisher: "LabMed UK (formerly ACB)",
        url: "https://www.labmed.org.uk/",
        note: "UK laboratory medicine standards for therapeutic drug monitoring and assay interpretation.",
      },
      {
        title: "UK Medicines Information (UKMi) medicines Q&As",
        publisher: "NHS Specialist Pharmacy Service",
        url: "https://www.sps.nhs.uk/articles/",
        note: "Evidence summaries on monitoring, dose adjustment and drug level interpretation.",
      },
      {
        title: "TOXBASE",
        publisher: "National Poisons Information Service",
        url: "https://www.toxbase.org/",
        note: "Toxicity thresholds and antidote management. NHS login required.",
      },
    ],
  },
];

function ClinicalSourcesPage() {
  return (
    <ReferenceAppLayout
      title="Clinical Sources — BNF, SPC, NICE and RCoA | Drug Reference"
      description="The clinical references behind every drug monograph in this reference: BNF, BNF for Children, product SPCs, NICE guidance, RCoA and Association of Anaesthetists standards, and UK laboratory standards."
      canonicalPath="/reference/sources"
    >
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Clinical sources</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every monograph carries its own citations, section by section. This page is the master
          list of the works those citations point to. Guidance is revised regularly — where a dose
          or threshold matters, open the source and confirm the current version before you act on
          it.
        </p>

        <nav aria-label="Sections" className="mt-5 flex flex-wrap gap-2">
          {referenceGroups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {g.heading}
            </a>
          ))}
        </nav>

        {referenceGroups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            className="mt-8 rounded-lg border border-border bg-card p-5 scroll-mt-24"
          >
            <h2 className="font-serif text-lg text-foreground">{group.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.intro}</p>
            <ul className="mt-4 space-y-4">
              {group.refs.map((r) => (
                <li key={r.url} className="border-l-2 border-border pl-4">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline"
                  >
                    {r.title}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {r.publisher}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.note}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-8 space-y-3 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">How to use these sources</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Dose queries: BNF or BNF for Children first, then the product SPC for the licensed
              wording.
            </li>
            <li>
              Dilution, diluent compatibility and stability: the SPC and the Injectable Medicines
              Guide, checked against your own smart-pump drug library.
            </li>
            <li>
              Treatment choice and thresholds: NICE and the relevant specialty guideline, not the
              product licence.
            </li>
            <li>Blood levels: your own laboratory&apos;s reported range takes precedence.</li>
          </ul>
          <p>
            <Link to="/about" className="text-primary underline">
              How this reference is built and maintained
            </Link>{" "}
            ·{" "}
            <Link to="/drugs" className="text-primary underline">
              Back to the drug library
            </Link>
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
