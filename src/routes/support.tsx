import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";

const SUPPORT_EMAIL = "support@anaesthesiacore.app";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Support for Anaesthesia & Critical Care Drugs, an adult (18+) UK professional drug reference. Contact support@anaesthesiacore.app.",
      },
      { property: "og:title", content: "Support — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content:
          "Help and contact details for the adult UK anaesthesia and critical care drug reference.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 text-sm leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Support</h1>

        <section className="mt-6 space-y-3">
          <h2 className="font-serif text-lg text-foreground">What this app is</h2>
          <p>
            Anaesthesia &amp; Critical Care Drugs is a reference for trained healthcare
            professionals caring for{" "}
            <strong className="text-foreground">adults aged 18 and over</strong>, based on UK
            guidance and UK product information. It is not for paediatric use and does not replace
            clinical judgement, prescribing checks or local protocols. It contains no dose
            calculators.
          </p>
          <p>
            <strong className="text-foreground">Users outside the UK:</strong> the app is available
            worldwide, but medicine licences, available products, strengths and protocols differ
            between countries. Always check your local licences, formulary and protocols before
            relying on any entry.
          </p>
          <p>
            Clinically reviewed by Robert Coe, UK anaesthetist, 4 November 2026 &mdash; a
            user-provided review by the app owner, not an independent certification. See{" "}
            <Link to="/review-status" className="text-primary underline">
              source review status
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="font-serif text-lg text-foreground">Contact</h2>
          <p>
            Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            for questions, problems, or to report content that looks wrong. Please name the page and
            the statement concerned, and include the source you are relying on if possible.
          </p>
          <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-foreground">
            Do not send identifiable patient information (names, dates of birth, NHS or hospital
            numbers, images or clinical details that could identify a person).
          </p>
          <p>
            Support cannot give advice about an individual patient. For urgent clinical questions
            use your local senior, pharmacy or medicines information service.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-serif text-lg text-foreground">Privacy</h2>
          <p>
            See the{" "}
            <Link to="/ios-privacy" className="text-primary underline">
              iOS app privacy policy
            </Link>
            .
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
