import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { CITE } from "@/features/drugReference/citations";
import { SourceChips, standardRefs } from "@/features/drugReference/references";
import type { DrugSource } from "@/features/drugReference/types";

const rcoaGpas: DrugSource = {
  title: "Guidelines for the Provision of Anaesthesia Services (GPAS)",
  publisher: "Royal College of Anaesthetists",
  url: "https://rcoa.ac.uk/gpas",
};

export const Route = createFileRoute("/premedication")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Adult Anaesthetic Premedication — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Adult anaesthetic premedication reference: oral midazolam, oral clonidine, intranasal dexmedetomidine, analgesia, aspiration and antiemetic prophylaxis, with cautions and sources.",
      },
      {
        property: "og:title",
        content: "Adult Anaesthetic Premedication — Anaesthesia & Critical Care Drugs",
      },
      {
        property: "og:description",
        content:
          "Adult anaesthetic premedication reference: oral midazolam, oral clonidine, intranasal dexmedetomidine, analgesia, aspiration and antiemetic prophylaxis, with cautions and sources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferencePremedication,
});

function DoseTable({ rows }: { rows: { group: string; dose: string; timing: string }[] }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Group</th>
            <th className="py-2 pr-4 font-medium">Dose</th>
            <th className="py-2 font-medium">Timing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={`${r.group}-${r.dose}`}>
              <td className="py-2 pr-4 font-medium text-foreground">{r.group}</td>
              <td className="py-2 pr-4 text-muted-foreground">{r.dose}</td>
              <td className="py-2 text-muted-foreground">{r.timing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DrugReferencePremedication() {
  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
          Adult anaesthetic premedication
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          For adults aged 18 years and over. Premedication is given before induction to reduce
          anxiety and smooth the induction itself. It is used selectively — most fit adults need
          none. Doses below summarise common UK practice; several uses are off-label and should
          follow local policy. Clinical verification of this page is in progress.
        </p>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">General principles</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              Choose the agent to match the goal: anxiolysis and amnesia (midazolam) versus rousable
              sedation with analgesic sparing (clonidine, dexmedetomidine).
            </li>
            <li>
              Anyone given a sedative premed needs documented monitoring (SpO₂, respiratory rate,
              level of consciousness) and a named person responsible until handover to the
              anaesthetic team. Flumazenil must be immediately available when midazolam is used.
            </li>
            <li>
              Reduce doses in older and frail adults, obstructive sleep apnoea, and significant
              cardiac, respiratory, hepatic or renal impairment.
            </li>
            <li>
              Avoid routine sedative premedication where a rapid wake-up is needed, in airway
              obstruction risk, and in raised intracranial pressure.
            </li>
            <li>
              In pregnancy and breastfeeding, check each drug&apos;s product information and local
              obstetric guidance before use.
            </li>
          </ul>
          <SourceChips sources={[rcoaGpas]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link to="/drugs/$slug" params={{ slug: "midazolam" }} className="hover:underline">
              Midazolam — oral
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Benzodiazepine giving anxiolysis and anterograde amnesia. Onset 15–30 minutes.
          </p>
          <DoseTable
            rows={[
              {
                group: "Adult — oral",
                dose: "7.5–15 mg (oral solution/tablet); halve in older or frail adults",
                timing: "30–60 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Paradoxical agitation or disinhibition can occur — observe, do not re-dose
              automatically.
            </li>
            <li>
              Caution with other CNS depressants (opioids, antihistamines); recovery may be delayed
              after day-case surgery.
            </li>
          </ul>
          <SourceChips sources={standardRefs("Midazolam")} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link to="/drugs/$slug" params={{ slug: "clonidine" }} className="hover:underline">
              Clonidine — oral
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Alpha-2 agonist used off-label for sedative premedication. Bradycardia, hypotension and
            excessive sedation are important risks; appropriate airway and respiratory monitoring
            remain necessary. Slower onset than midazolam, so it suits planned rather than
            last-minute premedication.
          </p>
          <SourceChips sources={[CITE.clonidineSpc]} label="Cited" />
          <DoseTable
            rows={[
              {
                group: "Adult — oral",
                dose: "150–300 micrograms",
                timing: "60–90 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Avoid or reduce the dose in conduction disease, hypovolaemia or with other negative
              chronotropes.
            </li>
            <li>
              Reduces volatile and opioid requirements; plan induction and analgesia doses
              accordingly.
            </li>
            <li>
              Longer sedation than midazolam — allow for a slower recovery in day-case pathways.
            </li>
          </ul>
          <SourceChips sources={standardRefs("Clonidine")} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link
              to="/drugs/$slug"
              params={{ slug: "dexmedetomidine" }}
              className="hover:underline"
            >
              Dexmedetomidine — intranasal
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Selective alpha-2 agonist used off-label by this route. Bradycardia and hypotension are
            important adverse effects; respiratory depression, airway obstruction and apnoea can
            also occur, so cardiac and respiratory monitoring are required. The IV solution (100
            micrograms/mL) is used undiluted via an atomiser.
          </p>
          <SourceChips sources={[CITE.dexmedSpc]} label="Cited" />
          <DoseTable
            rows={[
              {
                group: "Adult — intranasal (selected cases)",
                dose: "1–1.5 micrograms/kg",
                timing: "30–45 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Avoid in heart block, severe ventricular dysfunction and hypovolaemia, and use caution
              with other rate-slowing drugs.
            </li>
          </ul>
          <SourceChips sources={standardRefs("Dexmedetomidine")} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Melatonin — oral</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Used off-label as a mild anxiolytic premedication; immediate-release preparations are
            used.
          </p>
          <DoseTable
            rows={[
              {
                group: "Adult — oral",
                dose: "3–6 mg immediate-release",
                timing: "60–90 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Effect is inconsistent — have a plan if the patient is still anxious at induction.
              Monitor as for any sedative premedication.
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <Link
              to="/drugs/$slug"
              params={{ slug: "melatonin" }}
              className="text-primary underline"
            >
              Melatonin monograph
            </Link>
          </p>
          <SourceChips sources={standardRefs("Melatonin")} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            Gabapentinoids —{" "}
            <Link to="/drugs/$slug" params={{ slug: "gabapentin" }} className="hover:underline">
              gabapentin
            </Link>{" "}
            and{" "}
            <Link to="/drugs/$slug" params={{ slug: "pregabalin" }} className="hover:underline">
              pregabalin
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Gabapentinoids are not a routine premedication choice. Potential analgesic benefit must
            be weighed against sedation, dizziness and respiratory depression; evidence does not
            establish a single optimal perioperative dose or timing. Use only an individualised plan
            under local guidance; prevention of chronic postsurgical pain is not established.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Assess whether use is appropriate in older or frail adults, sleep apnoea and
              respiratory disease. Adjust gabapentin or pregabalin using the medicine-specific
              renal-function dosing table and monitor sedation and breathing; a universal 50% dose
              reduction is not appropriate.
            </li>
            <li>
              Additive sedation and respiratory depression with opioids; severe respiratory
              depression has also been reported without opioids.
            </li>
          </ul>
          <SourceChips
            sources={[CITE.niceNg180, CITE.mhraGabapentin, CITE.mhraDsuFeb2021, CITE.gabapentinSpc]}
            label="Cited"
          />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Pre-emptive simple analgesia</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Oral paracetamol and an NSAID given with the pre-operative sip of water are part of most
            multimodal and enhanced recovery pathways.
          </p>
          <DoseTable
            rows={[
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
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Count all oral, IV and combination-product paracetamol doses, and record the
              pre-operative dose clearly so the daily maximum is not exceeded.
            </li>
            <li>
              Avoid NSAIDs in renal impairment, active peptic ulceration, significant bleeding risk,
              severe asthma with known sensitivity and some bowel and bone-graft surgery. Check
              product information for use in pregnancy and breastfeeding.
            </li>
          </ul>
          <SourceChips sources={[CITE.niceNg180]} label="Cited" />
          <p className="mt-2 text-sm">
            <Link
              to="/drugs/$slug"
              params={{ slug: "paracetamol" }}
              className="text-primary underline"
            >
              Paracetamol monograph
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "ibuprofen" }}
              className="text-primary underline"
            >
              Ibuprofen monograph
            </Link>
          </p>
          <SourceChips sources={standardRefs("Paracetamol")} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Aspiration prophylaxis</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Used where the risk of regurgitation is raised: emergency surgery, obstetrics, reflux,
            hiatus hernia, obesity, gastroparesis and difficult-airway plans.
          </p>
          <DoseTable
            rows={[
              {
                group: "Omeprazole — oral",
                dose: "40 mg",
                timing: "Evening before and/or 2–4 h pre-op",
              },
              {
                group: "Sodium citrate 0.3 M — oral",
                dose: "30 mL",
                timing: "Immediately before induction (obstetric RSI)",
              },
              {
                group: "Metoclopramide — oral/IV",
                dose: "10 mg",
                timing: "30–60 min before induction",
              },
            ]}
          />
          <p className="mt-2 text-sm">
            <Link
              to="/drugs/$slug"
              params={{ slug: "omeprazole" }}
              className="text-primary underline"
            >
              Omeprazole
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "sodium-citrate" }}
              className="text-primary underline"
            >
              Sodium citrate
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "metoclopramide" }}
              className="text-primary underline"
            >
              Metoclopramide
            </Link>
          </p>
          <SourceChips sources={[...standardRefs("Omeprazole"), rcoaGpas]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Antiemetic prophylaxis</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Risk-scored prophylaxis (Apfel) is usually given at induction rather than as a true
            premed, but oral dosing on the ward is an option in high-risk patients and in those with
            severe previous post-operative nausea and vomiting.
          </p>
          <DoseTable
            rows={[
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
            ]}
          />
          <SourceChips sources={[CITE.dexamethasoneSpc, CITE.rchtPonv]} label="Cited" />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              Ondansetron prolongs the QT interval — avoid combining with other QT-prolonging drugs
              and correct electrolytes.
            </li>
            <li>
              Warn the patient that dexamethasone commonly causes a brief perineal burning sensation
              if given awake, and check the glucose in diabetes.
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <Link
              to="/drugs/$slug"
              params={{ slug: "ondansetron" }}
              className="text-primary underline"
            >
              Ondansetron
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "dexamethasone" }}
              className="text-primary underline"
            >
              Dexamethasone
            </Link>
          </p>
          <SourceChips sources={[...standardRefs("Ondansetron"), rcoaGpas]} label="Look up" />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            Topical local anaesthetic for cannulation
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Can be applied on the ward to potential cannulation sites before intravenous induction.
          </p>
          <DoseTable
            rows={[
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
            ]}
          />
          <SourceChips sources={[CITE.emlaSpc]} label="Cited" />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>
              EMLA causes vasoconstriction and can make veins harder to see; tetracaine causes
              vasodilatation and mild erythema, which usually helps.
            </li>
            <li>
              Do not apply to broken skin, mucous membranes or the eye, and remove tetracaine on
              time to avoid blistering.
            </li>
          </ul>
          <p className="mt-2 text-sm">
            <Link
              to="/drugs/$slug"
              params={{ slug: "emla-lidocaine-prilocaine" }}
              className="text-primary underline"
            >
              EMLA monograph
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "tetracaine" }}
              className="text-primary underline"
            >
              Tetracaine (Ametop) monograph
            </Link>{" "}
            ·{" "}
            <Link
              to="/drugs/$slug"
              params={{ slug: "lidocaine" }}
              className="text-primary underline"
            >
              Lidocaine monograph
            </Link>
          </p>
          <SourceChips sources={standardRefs("Tetracaine")} label="Look up" />
        </section>

        <p className="mt-8 rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          Adult UK reference. Not for paediatric use. This page summarises common practice and is
          not a substitute for local policy or the product literature. Several regimens are
          off-label; prescribing remains the responsibility of the attending clinician.
        </p>
      </main>
    </ReferenceAppLayout>
  );
}
