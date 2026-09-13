import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/topics/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Drug Topic — Anaesthesia & Critical Care Drugs" },
      { name: "description", content: "Bedside points plus every monograph in this drug group with presentations, dosing, standard dilutions, pump rates, safety and blood level monitoring." },
      { property: "og:title", content: "Drug Topic — Anaesthesia & Critical Care Drugs" },
      { property: "og:description", content: "Bedside points plus every monograph in this drug group with presentations, dosing, standard dilutions, pump rates, safety and blood level monitoring." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugReferenceTopic,
});

import { useMemo } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, FlaskConical, Syringe } from "lucide-react";

import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import { useDrugList } from "@/features/drugReference/useDrugReference";
import { drugDilutions } from "@/features/drugReference/dilutions";
import { topicBySlug, topicForClass } from "@/features/drugReference/topics";

function DrugReferenceTopic() {
  const { slug } = useParams({ strict: false }) as { slug?: string };
  const topic = topicBySlug(slug);
  const { drugs, loading } = useDrugList();

  const slugsWithRecipes = useMemo(
    () => new Set(drugDilutions.map((d) => d.slug)),
    [],
  );

  const members = useMemo(() => {
    if (!topic) return [];
    return drugs
      .filter((d) => topicForClass(d.drug_class).slug === topic.slug)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [drugs, topic]);

  if (!topic) {
    return (
      <ReferenceAppLayout>
        <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-serif text-2xl text-foreground">Topic not found</h1>
          <Link className="mt-4 inline-block text-sm text-primary underline" to="/topics">
            Back to all topics
          </Link>
        </main>
      </ReferenceAppLayout>
    );
  }

  const monitored = members.filter((d) => d.requires_tdm).length;

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/topics"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All topics
        </Link>

        <h1 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">{topic.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.blurb}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
          {loading ? "Loading…" : `${members.length} drugs`}
          {monitored > 0 && ` · ${monitored} need blood level monitoring`}
        </p>

        <section className="mt-6 rounded-lg border border-border bg-card p-4 sm:p-5">
          <h2 className="font-serif text-lg text-foreground">Bedside points</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {topic.keyPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-lg text-foreground">Drugs in this topic</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {members.map((d) => (
              <li key={d.slug}>
                <Link
                  to="/drugs/$slug" params={{ slug: d.slug }}
                  className="flex h-full flex-col rounded-lg border border-border bg-card p-4 transition hover:border-primary hover:shadow-sm"
                >
                  <span className="font-semibold text-foreground">{d.name}</span>
                  <span className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
                    {d.drug_class}
                  </span>
                  <span className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {d.indication_oneliner}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {d.requires_tdm && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                        <FlaskConical aria-hidden="true" className="h-3 w-3" /> Levels
                      </span>
                    )}
                    {slugsWithRecipes.has(d.slug) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                        <Syringe aria-hidden="true" className="h-3 w-3" /> Infusion
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {!loading && members.length === 0 && (
            <p className="mt-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              No drugs are currently filed under this topic.
            </p>
          )}
        </section>

        <aside className="mt-10 flex gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Educational reference for trained clinicians. Bedside points summarise common UK practice
            and do not replace the BNF, the product SPC or your local critical care protocols.
          </p>
        </aside>
      </main>
    </ReferenceAppLayout>
  );
}
