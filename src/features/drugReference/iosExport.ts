/**
 * Builds the native iOS reference-page export from the same static data the
 * web pages render (topics, infusion recipes, premedication), so the two can
 * never drift. Static prose and tables only — no derived calculations.
 */
import { icuInfusionGroups } from "@/data/icuInfusions";

import { SLUG_BY_INFUSION_NAME, rangeText, startText } from "./dilutions";
import { withMonographSources } from "./monographSources";
import { PREMED_FOOTNOTE, PREMED_INTRO, premedSections } from "./premedication";
import { adultSources } from "./scope";
import { allReferenceTopics, keyPointSources, keyPointText } from "./topics";
import type { DrugSource } from "./types";

export interface IosSource {
  title: string;
  url: string;
  accessed: string;
}
export interface IosSection {
  title: string;
  text?: string;
  items?: string[];
  rows?: { label: string; value: string }[];
  sources?: IosSource[];
}
export interface IosPage {
  id: string;
  title: string;
  category: string;
  summary: string;
  sections: IosSection[];
  sources?: IosSource[];
}

/** Access dates are not recorded for these sources; never invent one. */
const NOT_RECORDED = "not recorded";

function toIos(sources: DrugSource[] | undefined): IosSource[] {
  return adultSources(sources).map((s) => ({
    title: s.lookup
      ? `Lookup only (not claim-level evidence): ${s.title}`
      : `${s.title} — ${s.publisher}`,
    url: s.url,
    accessed: s.accessed ?? NOT_RECORDED,
  }));
}

function dedupe(sources: IosSource[]): IosSource[] {
  return sources.filter((s, i, a) => a.findIndex((o) => o.url === s.url) === i);
}

function withSources<T extends object>(
  obj: T,
  sources: IosSource[],
): T & { sources?: IosSource[] } {
  return sources.length ? { ...obj, sources } : obj;
}

function topicPages(): IosPage[] {
  return allReferenceTopics.map((t) => {
    const items = t.keyPoints.map(keyPointText);
    const sources = dedupe(t.keyPoints.flatMap((p) => toIos(keyPointSources(p))));
    return withSources(
      {
        id: `topic-${t.slug}`,
        title: t.title,
        category: "Topic",
        summary: t.blurb,
        sections: [withSources({ title: "Key points", items }, sources)],
      },
      sources,
    );
  });
}

function infusionPages(): IosPage[] {
  return icuInfusionGroups.map((g) => {
    const sections: IosSection[] = g.infusions.map((inf) => {
      const unit = inf.unit;
      const rows = [
        { label: "Diluent", value: inf.diluent },
        { label: "Draw up", value: inf.drawUp },
        { label: "Final concentration", value: inf.concentrationLabel },
        { label: "Starting dose", value: startText({ startDose: inf.startDose, unit }) },
        {
          label: "Usual adult range",
          value: rangeText({ minDose: inf.minDose, maxDose: inf.maxDose, unit }),
        },
      ];
      const section: IosSection = { title: inf.drug, rows };
      if (inf.notes) section.text = inf.notes;
      return withSources(
        section,
        toIos(withMonographSources(inf.sources, SLUG_BY_INFUSION_NAME[inf.drug] ?? null)),
      );
    });
    const sources = dedupe(sections.flatMap((s) => s.sources ?? []));
    return withSources(
      {
        id: `infusions-${g.id}`,
        title: `Infusions — ${g.title}`,
        category: "Infusions",
        summary: g.blurb,
        sections,
      },
      sources,
    );
  });
}

function premedPage(): IosPage {
  const sections: IosSection[] = premedSections.map((sec) => {
    const out: IosSection = { title: sec.title };
    if (sec.text) out.text = sec.text;
    if (sec.items) out.items = sec.items;
    if (sec.rows)
      out.rows = sec.rows.map((r) => ({ label: r.group, value: `${r.dose}. Timing: ${r.timing}` }));
    return withSources(out, dedupe([...toIos(sec.cited), ...toIos(sec.lookups)]));
  });
  sections.push({ title: "Scope", text: PREMED_FOOTNOTE });
  const sources = dedupe(sections.flatMap((s) => s.sources ?? []));
  return withSources(
    {
      id: "premedication-adult",
      title: "Adult anaesthetic premedication",
      category: "Premedication",
      summary: PREMED_INTRO,
      sections,
    },
    sources,
  );
}

export function buildIosReferencePages(): IosPage[] {
  return [...topicPages(), ...infusionPages(), premedPage()];
}
