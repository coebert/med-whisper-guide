import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { SourceChips, standardRefs } from "@/features/drugReference/references";
import type { DrugSource } from "@/features/drugReference/types";

const nicePaedSedation: DrugSource = {
  title: "Sedation in under 19s: using sedation for diagnostic and therapeutic procedures (CG112)",
  publisher: "NICE",
  url: "https://www.nice.org.uk/guidance/cg112",
};

const apaGuidelines: DrugSource = {
  title: "Clinical guidelines and resources",
  publisher: "Association of Paediatric Anaesthetists of Great Britain and Ireland",
  url: "https://www.apagbi.org.uk/guidelines",
};

const rcoaGpas: DrugSource = {
  title: "Guidelines for the Provision of Anaesthesia Services (GPAS)",
  publisher: "Royal College of Anaesthetists",
  url: "https://rcoa.ac.uk/gpas",
};

export const Route = createFileRoute("/premedication")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Anaesthetic Premedication — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Practical guidance on anaesthetic premedication in children and adults: oral and buccal midazolam, oral clonidine, and oral and intranasal dexmedetomidine, with doses, timing and cautions." },
      { property: "og:title", content: "Anaesthetic Premedication — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Practical guidance on anaesthetic premedication in children and adults: oral and buccal midazolam, oral clonidine, and oral and intranasal dexmedetomidine, with doses, timing and cautions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferencePremedication,
});

function DoseTable({
  rows,
}: {
  rows: { group: string; dose: string; timing: string }[];
}) {
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
          Anaesthetic premedication
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Premedication is given before induction to reduce anxiety, ease separation from parents or
          carers, and smooth the induction itself. It is used selectively — most fit adults need none —
          and is most valuable in anxious children, patients with learning difficulties or autism, and
          those who have had a traumatic previous experience. Doses below are common UK practice;
          several uses are off-label and should follow local paediatric sedation and premedication
          guidelines.
        </p>

        <section className="mt-8 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">General principles</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              Choose the agent to match the goal: anxiolysis and amnesia (midazolam) versus calm,
              rousable sedation with analgesic sparing (clonidine, dexmedetomidine).
            </li>
            <li>
              Non-pharmacological measures come first in children — preparation, play therapy,
              distraction and parental presence at induction often remove the need for a drug.
            </li>
            <li>
              Anyone given a sedative premed needs documented monitoring (SpO₂, respiratory rate,
              level of consciousness) and a named person responsible until handover to the
              anaesthetic team. Flumazenil must be immediately available when midazolam is used.
            </li>
            <li>
              Reduce doses in the elderly, the frail, obstructive sleep apnoea, and significant
              cardiac, respiratory, hepatic or renal impairment.
            </li>
            <li>
              Avoid routine sedative premedication where a rapid wake-up is needed, in airway
              obstruction risk, and in raised intracranial pressure.
            </li>
          </ul>
          <SourceChips sources={[nicePaedSedation, apaGuidelines, rcoaGpas]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link to="/drugs/$slug" params={{ slug: "midazolam" }} className="hover:underline">
              Midazolam — oral and buccal
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Benzodiazepine giving anxiolysis and anterograde amnesia. The commonest premed in
            children; the IV solution is used for oral and buccal dosing, usually mixed with a small
            volume of flavoured syrup or juice to mask the bitter taste. Onset 15–30 minutes.
          </p>
          <DoseTable
            rows={[
              {
                group: "Child — oral",
                dose: "0.5 mg/kg (max 15–20 mg), as IV solution in syrup/juice",
                timing: "20–30 min before induction",
              },
              {
                group: "Child — buccal",
                dose: "0.3–0.5 mg/kg (max 10 mg) between gum and cheek",
                timing: "15–30 min before; useful when oral refused",
              },
              {
                group: "Adult — oral",
                dose: "7.5–15 mg (oral solution/tablet); halve in elderly or frail",
                timing: "30–60 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Paradoxical agitation or disinhibition occurs in a minority of children — observe, do not re-dose automatically.</li>
            <li>Buccal route has faster onset than swallowed oral dosing; do not combine both.</li>
            <li>Caution with other CNS depressants (opioids, antihistamines); recovery may be delayed after day-case surgery.</li>
          </ul>
          <SourceChips sources={[...standardRefs("Midazolam"), nicePaedSedation]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link to="/drugs/$slug" params={{ slug: "clonidine" }} className="hover:underline">
              Clonidine — oral
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            α₂-agonist giving calm sedation without respiratory depression, with reduced anaesthetic
            and opioid requirements and less emergence agitation. Slower onset than midazolam, so it
            suits planned rather than last-minute premedication.
          </p>
          <DoseTable
            rows={[
              {
                group: "Child — oral",
                dose: "4 micrograms/kg (max 150–200 micrograms)",
                timing: "60–90 min before induction",
              },
              {
                group: "Adult — oral",
                dose: "150–300 micrograms",
                timing: "60–90 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Bradycardia and hypotension are the main effects — avoid or reduce dose in conduction disease, hypovolaemia or with other negative chronotropes.</li>
            <li>Reduces volatile and opioid requirements; plan induction and analgesia doses accordingly.</li>
            <li>Longer sedation than midazolam — allow for a slower recovery in day-case pathways.</li>
          </ul>
          <SourceChips sources={[...standardRefs("Clonidine"), apaGuidelines]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">
            <Link to="/drugs/$slug" params={{ slug: "dexmedetomidine" }} className="hover:underline">
              Dexmedetomidine — oral and intranasal
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Highly selective α₂-agonist producing sedation resembling natural sleep, with minimal
            respiratory depression and reduced emergence delirium. Off-label by these routes; the IV
            solution (100 micrograms/mL) is used undiluted for intranasal dosing via an atomiser or
            dropwise, and given orally diluted or swallowed.
          </p>
          <DoseTable
            rows={[
              {
                group: "Child — intranasal",
                dose: "2–3 micrograms/kg via mucosal atomiser (split between nostrils); maximum 3 micrograms/kg",
                timing: "30–45 min before induction",
              },
              {
                group: "Child — oral/buccal",
                dose: "2.5–4 micrograms/kg",
                timing: "45–60 min before induction",
              },
              {
                group: "Adult — intranasal (selected cases)",
                dose: "1–1.5 micrograms/kg",
                timing: "30–45 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Intranasal bioavailability is good and onset more predictable than oral; oral dosing has slower, more variable absorption.</li>
            <li>Bradycardia and hypotension occur — avoid in heart block, severe ventricular dysfunction and hypovolaemia, and use caution with other rate-slowing drugs.</li>
            <li>Particularly useful where midazolam has failed or caused paradoxical reactions, and in children with neurodevelopmental disorders.</li>
          </ul>
          <SourceChips sources={[...standardRefs("Dexmedetomidine"), apaGuidelines]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Melatonin — oral</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Chronobiotic used as a gentle anxiolytic premed, particularly in children with autism or
            learning disability and in the elderly where sedatives risk delirium. Off-label for this
            indication; immediate-release preparations are used.
          </p>
          <DoseTable
            rows={[
              {
                group: "Child — oral",
                dose: "0.5 mg/kg (commonly 2–6 mg; max 10 mg)",
                timing: "45–60 min before induction",
              },
              {
                group: "Adult — oral",
                dose: "3–6 mg immediate-release",
                timing: "60–90 min before induction",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Anxiolysis is milder than midazolam but with no respiratory depression and quicker recovery.</li>
            <li>Effect is inconsistent — have a plan if the child is still distressed at induction.</li>
          </ul>
          <p className="mt-2 text-sm">
            <Link to="/drugs/$slug" params={{ slug: "melatonin" }} className="text-primary underline">
              Melatonin monograph
            </Link>
          </p>
          <SourceChips sources={[...standardRefs("Melatonin"), nicePaedSedation, apaGuidelines]} />

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
            Given pre-operatively to reduce opioid requirements and the risk of chronic
            post-surgical pain, mainly in major or nerve-injury-prone surgery. Routine use in
            day-case and elderly patients is discouraged because of sedation and dizziness.
          </p>
          <DoseTable
            rows={[
              { group: "Adult — gabapentin", dose: "300–600 mg oral", timing: "1–2 h before surgery" },
              { group: "Adult — pregabalin", dose: "75–150 mg oral", timing: "1–2 h before surgery" },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Avoid or halve the dose in the elderly, obstructive sleep apnoea and renal impairment (both are renally cleared).</li>
            <li>Additive sedation and respiratory depression with opioids — a recognised cause of post-operative desaturation.</li>
          </ul>
          <SourceChips sources={[...standardRefs("Pregabalin"), rcoaGpas]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Pre-emptive simple analgesia</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Oral paracetamol and an NSAID given with the pre-operative sip of water reduce
            post-operative pain scores and opioid use, and are the backbone of most enhanced
            recovery pathways.
          </p>
          <DoseTable
            rows={[
              {
                group: "Adult — paracetamol",
                dose: "1 g oral (500 mg–1 g if under 50 kg: 15 mg/kg)",
                timing: "1–2 h before surgery",
              },
              {
                group: "Child — paracetamol",
                dose: "15–20 mg/kg oral (max 1 g)",
                timing: "1–2 h before induction",
              },
              {
                group: "Adult — ibuprofen",
                dose: "400 mg oral (omit if NSAIDs contraindicated)",
                timing: "1–2 h before surgery",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Record the pre-operative dose clearly so the total 24-hour paracetamol limit is not exceeded in theatre or recovery.</li>
            <li>Avoid NSAIDs in renal impairment, active peptic ulceration, significant bleeding risk, severe asthma with known sensitivity and some bowel and bone-graft surgery.</li>
          </ul>
          <p className="mt-2 text-sm">
            <Link to="/drugs/$slug" params={{ slug: "paracetamol" }} className="text-primary underline">
              Paracetamol monograph
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "ibuprofen" }} className="text-primary underline">
              Ibuprofen monograph
            </Link>
          </p>
          <SourceChips sources={standardRefs("Paracetamol")} />
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
                dose: "40 mg (adult); 0.5–1 mg/kg in children",
                timing: "Evening before and/or 2–4 h pre-op",
              },
              {
                group: "Ranitidine — oral",
                dose: "150 mg (where still stocked locally)",
                timing: "Evening before and 2 h pre-op",
              },
              {
                group: "Sodium citrate 0.3 M — oral",
                dose: "30 mL",
                timing: "Immediately before induction (obstetric RSI)",
              },
              {
                group: "Metoclopramide — oral/IV",
                dose: "10 mg (adult)",
                timing: "30–60 min before induction",
              },
            ]}
          />
          <p className="mt-2 text-sm">
            <Link to="/drugs/$slug" params={{ slug: "omeprazole" }} className="text-primary underline">
              Omeprazole
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "sodium-citrate" }} className="text-primary underline">
              Sodium citrate
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "metoclopramide" }} className="text-primary underline">
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
                dose: "4 mg IV at induction, or 8 mg oral (child 0.1 mg/kg IV, max 4 mg)",
                timing: "Oral 1 h pre-op; IV at induction",
              },
              {
                group: "Dexamethasone",
                dose: "3.3–8 mg IV (child 150 micrograms/kg, max 8 mg)",
                timing: "At induction, not on the ward",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Ondansetron prolongs the QT interval — avoid combining with other QT-prolonging drugs and correct electrolytes.</li>
            <li>Warn the patient that dexamethasone commonly causes a brief perineal burning sensation if given awake, and check the glucose in diabetes.</li>
          </ul>
          <p className="mt-2 text-sm">
            <Link to="/drugs/$slug" params={{ slug: "ondansetron" }} className="text-primary underline">
              Ondansetron
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "dexamethasone" }} className="text-primary underline">
              Dexamethasone
            </Link>
          </p>
          <SourceChips sources={[...standardRefs("Ondansetron"), rcoaGpas]} />
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="font-serif text-xl text-foreground">Topical local anaesthetic for cannulation</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Applied on the ward to two potential cannulation sites; the single most effective
            "premed" for most children having an intravenous induction.
          </p>
          <DoseTable
            rows={[
              {
                group: "EMLA (lidocaine 2.5% + prilocaine 2.5%)",
                dose: "Thick blob under an occlusive dressing; licensed from birth in term infants but under 3 months: max one application per 24 h, ≤1 g, ≤1 h (methaemoglobinaemia risk)",
                timing: "Apply 60 min before, lasts up to 5 h",
              },
              {
                group: "Ametop (tetracaine 4% gel)",
                dose: "Contents of one tube under an occlusive dressing; from 1 month",
                timing: "Apply 30–45 min before; remove after 45 min",
              },
            ]}
          />
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>EMLA causes vasoconstriction and can make veins harder to see; tetracaine causes vasodilatation and mild erythema, which usually helps.</li>
            <li>Do not apply to broken skin, mucous membranes or the eye, and remove tetracaine on time to avoid blistering.</li>
          </ul>
          <p className="mt-2 text-sm">
            <Link to="/drugs/$slug" params={{ slug: "emla-lidocaine-prilocaine" }} className="text-primary underline">
              EMLA monograph
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "tetracaine" }} className="text-primary underline">
              Tetracaine (Ametop) monograph
            </Link>{" "}
            ·{" "}
            <Link to="/drugs/$slug" params={{ slug: "lidocaine" }} className="text-primary underline">
              Lidocaine monograph
            </Link>
          </p>
          <SourceChips sources={[...standardRefs("Lidocaine with prilocaine"), apaGuidelines]} />

        </section>

        <p className="mt-8 rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          This guidance summarises common practice and is not a substitute for local paediatric
          sedation policies, the BNF for Children, or the product literature. Several regimens are
          off-label; prescribing remains the responsibility of the attending clinician.
        </p>
      </main>
    </ReferenceAppLayout>
  );
}
