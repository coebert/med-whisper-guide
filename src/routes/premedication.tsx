import { createFileRoute, Link } from "@tanstack/react-router";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import {
  PREMED_FOOTNOTE,
  PREMED_INTRO,
  premedSections,
  type PremedRow,
} from "@/features/drugReference/premedication";
import { SourceChips } from "@/features/drugReference/references";

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

function DoseTable({ rows }: { rows: PremedRow[] }) {
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
          {PREMED_INTRO}
        </p>

        {premedSections.map((sec, i) => (
          <section
            key={sec.id}
            id={sec.id}
            className={`${i === 0 ? "mt-8" : "mt-6"} rounded-lg border border-border bg-card p-5`}
          >
            <h2 className="font-serif text-xl text-foreground">{sec.title}</h2>
            {sec.text && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sec.text}</p>
            )}
            {sec.cited && <SourceChips sources={sec.cited} label="Cited" />}
            {sec.rows && <DoseTable rows={sec.rows} />}
            {sec.items && (
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {sec.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {sec.links && (
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {sec.links.map((l) => (
                  <Link
                    key={l.slug}
                    to="/drugs/$slug"
                    params={{ slug: l.slug }}
                    className="text-primary underline"
                  >
                    {l.label}
                  </Link>
                ))}
              </p>
            )}
            {sec.lookups && <SourceChips sources={sec.lookups} label="Look up" />}
          </section>
        ))}

        <p className="mt-8 rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          {PREMED_FOOTNOTE}
        </p>
      </main>
    </ReferenceAppLayout>
  );
}
