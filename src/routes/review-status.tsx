import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";

export const Route = createFileRoute("/review-status")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Source Review Status — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Scope of this adult UK drug reference and what the ongoing source-level clinical review covers. Clinical verification is in progress.",
      },
      { property: "og:title", content: "Source Review Status — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Scope of this adult UK drug reference and what the ongoing source-level clinical review covers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReviewStatusPage,
});

function ReviewStatusPage() {
  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 text-sm leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Source review status</h1>
        <p className="mt-3 rounded-md border border-primary/40 bg-primary/5 p-3 text-foreground">
          Clinical verification is in progress. Content has not been certified, and no part of this
          app should be treated as fully validated.
        </p>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Scope</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>Adult UK reference for adults aged 18 years and over. Not for paediatric use.</li>
            <li>
              Static reference only: the app does not calculate patient-specific doses, infusion
              rates or volumes.
            </li>
            <li>
              Adult cautions about pregnancy and breastfeeding are kept where they appear; check the
              product information and local obstetric guidance.
            </li>
            <li>For trained clinicians, alongside the BNF, product SmPC and local protocols.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">What the review means</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              A source-level review compares individual statements against named, current sources.
              It is being carried out in passes and is not complete.
            </li>
            <li>
              Statements revised in a review pass show a{" "}
              <strong className="text-foreground">Cited</strong> chip linking to the specific
              document used.
            </li>
            <li>
              <strong className="text-foreground">BNF search</strong> and{" "}
              <strong className="text-foreground">SmPC search</strong> chips are lookup links:
              places to check, not evidence that the statement next to them has been validated.
            </li>
            <li>
              Sources listed on a monograph are those stored with it. A listed source does not mean
              every statement on the page has been checked against it.
            </li>
            <li>Monograph text is being corrected separately and may change.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Known open items</h2>
          <p>
            Monograph and infusion source checks are still in progress. This is not a clinically
            approved release. The bedside point on prolonged sedation and failure to wake is a
            general, conservative safety statement.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Reporting a problem</h2>
          <p>
            If something looks wrong, do not use it — check the original source and your local
            guidance. See{" "}
            <Link to="/sources" className="text-primary underline">
              Clinical sources
            </Link>{" "}
            and{" "}
            <Link to="/references" className="text-primary underline">
              References
            </Link>
            .
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
