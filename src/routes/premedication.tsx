import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";

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
    <ReferenceAppLayout
      title="Anaesthetic Premedication | Drug Reference"
      description="Practical guidance on anaesthetic premedication in children and adults: oral and buccal midazolam, oral clonidine, and oral and intranasal dexmedetomidine."
      canonicalPath="/premedication"
    >
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
                dose: "1–2 micrograms/kg via mucosal atomiser (split between nostrils)",
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
