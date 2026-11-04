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
          "Clinically reviewed by Robert Coe, UK anaesthetist, 4 November 2026. Scope of this adult UK drug reference and what the review does and does not cover.",
      },
      { property: "og:title", content: "Source Review Status — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Clinically reviewed by Robert Coe, UK anaesthetist, 4 November 2026 — a user-provided review by the app owner, not an independent certification.",
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
          Clinically reviewed by Robert Coe, UK anaesthetist, 4 November 2026 —{" "}
          <strong className="text-foreground">&ldquo;Review complete &mdash; approved for
          release&rdquo;</strong>. This is a user-provided review by the app owner. It is not an
          independent certification by a royal college, regulator or other external body, and it is
          not a guarantee that every statement is free from error.
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
              The review compared individual statements in the adult monographs, the static infusion
              preparations and the topic and premedication pages against named, current sources. It
              was carried out in passes by the reviewer.
            </li>
            <li>
              The review is the app owner&rsquo;s own clinical review, provided by Robert Coe. It is
              not an independent certification, and no part of this app is certified or guaranteed
              accurate.
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
            <li>
              Infusion cards show a numeric starting dose or range only where a specific cited
              source supports it; other cards send the reader to the full monograph and local
              protocol. Sources listed on a recipe are those held for it and its monograph; their
              presence is not certification.
            </li>
            <li>
              The reviewed content is the snapshot in this release. Individual statements may still
              be corrected in a later update, so a statement that matters clinically should be
              checked at source.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Review record</h2>
          <dl className="divide-y divide-border overflow-hidden rounded-md border border-border">
            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Reviewer
              </dt>
              <dd className="text-foreground">Robert Coe, UK anaesthetist (app owner)</dd>
            </div>
            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </dt>
              <dd className="text-foreground">4 November 2026</dd>
            </div>
            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Outcome
              </dt>
              <dd className="text-foreground">
                &ldquo;Review complete &mdash; approved for release&rdquo;
              </dd>
            </div>
            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Covered
              </dt>
              <dd className="text-foreground">
                Adult (18+) UK monographs, static infusion preparations and dilutions, and the
                topic, premedication and blood-level monitoring pages.
              </dd>
            </div>
            <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 px-3 py-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Not covered
              </dt>
              <dd className="text-foreground">
                Independent external certification; verification of every statement against every
                listed source; paediatric use, which is out of scope.
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Before you act on a dose</h2>
          <p>
            Always check doses, dilutions and monitoring targets against the BNF, the product SPC
            for the brand your department stocks, your smart-pump drug library and local protocols
            before administration. Guidance is revised regularly &mdash; where a dose or threshold
            matters, open the source and confirm the current version.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Reporting a problem</h2>
          <p>
            If something looks wrong, do not use it &mdash; check the original source and your local
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
