import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sources & Method — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "How this drug reference is built and maintained: sources including the BNF, BNF for Children, product SPCs and national guidelines." },
      { property: "og:title", content: "Sources & Method — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "How this drug reference is built and maintained: sources including the BNF, BNF for Children, product SPCs and national guidelines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceAbout,
});

import { useState } from "react";
import { Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { cachedMonographCount, clearDrugReferenceCache } from "@/features/drugReference/cache";
import { useDrugList } from "@/features/drugReference/useDrugReference";

function DrugReferenceAbout() {
  const { drugs } = useDrugList();
  const [saved, setSaved] = useState(cachedMonographCount());

  return (
    <ReferenceAppLayout
      title="Sources & How This Reference Works | Drug Reference"
      description="How the anaesthetics and critical care drug reference is sourced from the BNF, BNF for Children, product SPCs and national guidelines, and how to use it offline."
      canonicalPath="/reference/about"
    >
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
          Sources and how this reference works
        </h1>

        <section className="mt-6 space-y-3 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">Why there are no drug photographs</h2>
          <p>
            Each monograph carries a written <strong className="text-foreground">How it looks</strong>{" "}
            summary — form, container, the strength printed on the label, and storage — taken from
            the manufacturer&apos;s product information. Photographs are deliberately not included:
            a picture of one manufacturer&apos;s ampoule can look nothing like the one on your
            trolley, and relying on colour or shape to identify a drug is a recognised cause of
            administration error.
          </p>
          <p className="text-foreground">If you do want photographs, source them safely:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Photograph the stock your own department actually holds, and re-check the pictures
              whenever the supplier or pack design changes.
            </li>
            <li>
              Use images from the manufacturer&apos;s Summary of Product Characteristics or patient
              information leaflet on the electronic Medicines Compendium, within their terms of use.
            </li>
            <li>
              Never use images found through a general web search, an image library or an AI image
              generator — the strength, label and pack may be wrong, or from another country.
            </li>
            <li>
              Keep patient details, names and any handwriting out of frame, and label every photo
              with the drug, strength and the date it was taken.
            </li>
            <li>
              Treat photographs as an aid to familiarisation only. The label on the ampoule in your
              hand is the identification check, every time.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">Where the information comes from</h2>
          <p>
            Every monograph carries its own source list, shown at the bottom of the drug page. The
            primary sources are the British National Formulary and BNF for Children, the
            manufacturer&apos;s Summary of Product Characteristics on the electronic Medicines
            Compendium, and national guidance — for example NICE, the Intensive Care Society, the
            Association of Anaesthetists, the Resuscitation Council UK, and UK laboratory medicine
            standards for blood level monitoring.
          </p>
          <p>
            Standard dilutions and pump rates reflect common UK critical care practice.
            Concentrations vary between hospitals, so they are presented as worked recipes to check
            against your own smart-pump drug library, not as a substitute for it.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">What is included</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>{drugs.length || "200+"} anaesthetic and critical care drug monographs.</li>
            <li>Presentation, preparation, adult dosing and infusion ranges.</li>
            <li>Mechanism, pharmacokinetics, adverse effects, contraindications and interactions.</li>
            <li>
              Blood level monitoring where relevant: targets, sampling timing, toxicity thresholds
              and actions, sampling practicalities and dose adjustment.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">Using it offline</h2>
          <p>
            Drugs you open are saved on this device for 30 days so they stay readable without a
            signal. On a phone, use your browser&apos;s <em>Add to Home Screen</em> option to launch
            it in its own window like an installed app.
          </p>
          <p>
            Currently saved on this device: <strong className="text-foreground">{saved}</strong>{" "}
            monographs.{" "}
            <button
              type="button"
              onClick={() => {
                clearDrugReferenceCache();
                setSaved(0);
              }}
              className="underline hover:text-foreground"
            >
              Clear saved copies
            </button>
          </p>
        </section>

        <section className="mt-8 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-serif text-lg text-foreground">Safety</h2>
          <p>
            This is an educational reference for trained clinicians. It does not replace clinical
            judgement, prescribing checks or local protocols. Verify every dose, dilution and
            monitoring target before administration, and report anything that looks wrong so it can
            be corrected.
          </p>
          <p>
            <Link to="/drugs" className="text-primary underline">
              Back to the drug library
            </Link>
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
