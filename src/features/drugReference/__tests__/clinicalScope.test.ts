import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";

import { drugDilutions } from "../dilutions";
import { buildIosReferencePages } from "../iosExport";
import { adultSources, isInScope } from "../scope";
import { standardRefs } from "../references";
import { allReferenceTopics, keyPointText } from "../topics";

const recipe = (name: string) => {
  const r = drugDilutions.find((d) => d.drug === name);
  if (!r) throw new Error(`missing recipe ${name}`);
  return r;
};

describe("adult-only scope", () => {
  it("excludes caffeine citrate", () => {
    expect(isInScope("caffeine-citrate")).toBe(false);
    expect(isInScope("propofol")).toBe(true);
  });
  it("excludes inhaled nitric oxide (neonatal-only monograph)", () => {
    expect(isInScope("inhaled-nitric-oxide")).toBe(false);
  });
  it("drops BNF for Children sources", () => {
    const kept = adultSources([
      { title: "x", publisher: "BNF for Children (NICE)", url: "https://bnfc.nice.org.uk/x" },
      { title: "y", publisher: "British National Formulary", url: "https://bnf.nice.org.uk/y" },
    ]);
    expect(kept.map((s) => s.title)).toEqual(["y"]);
  });
  it("standard lookups contain no BNFC link and are marked as lookups", () => {
    const refs = standardRefs("Propofol");
    expect(refs.some((r) => r.url.includes("bnfc"))).toBe(false);
    expect(refs.every((r) => r.lookup)).toBe(true);
  });
  it("labetalol recipe has no paediatric dosing", () => {
    expect(recipe("Labetalol").notes ?? "").not.toMatch(/paediatric|BNFC/i);
  });
});

describe("recipe corrections", () => {
  it("IV lidocaine maximum is 1.5 mg/kg/h", () => {
    const r = recipe("Lidocaine (IV analgesia)");
    expect(r.maxDose).toBe(1.5);
    expect(r.startDose).toBeUndefined();
    expect(r.minDose).toBeUndefined();
    expect(r.notes).toContain("120 mg/h");
  });
  it("magnesium eclampsia maintenance is fixed 1000 mg/h", () => {
    const r = recipe("Magnesium sulphate");
    expect([r.unit, r.startDose, r.minDose, r.maxDose, r.perKg]).toEqual(["mg/h", 1000, 1000, 1000, false]);
  });
  it("trauma TXA maintenance is fixed 125 mg/h", () => {
    const r = recipe("Tranexamic acid (major trauma)");
    expect([r.unit, r.startDose, r.minDose, r.maxDose, r.perKg]).toEqual(["mg/h", 125, 125, 125, false]);
  });
  it("trauma TXA cites NICE NG39 and CRASH-2 (as a trial)", () => {
    const r = recipe("Tranexamic acid (major trauma)");
    const urls = (r.sources ?? []).map((s) => s.url);
    expect(urls).toContain("https://www.nice.org.uk/guidance/ng39/chapter/recommendations");
    expect(urls).toContain("https://crash2.lshtm.ac.uk/CRASH2_Lancet.pdf");
    expect(r.notes).not.toMatch(/citation pending/);
    expect(r.notes).not.toMatch(/CRASH-2 guideline/i);
  });
  it("heparin has no 45,000-unit ceiling claim", () => {
    expect(recipe("Heparin (unfractionated)").notes).not.toMatch(/should not exceed 45,000/);
  });
  it("vasopressin drops the 0.06 units/min SPC maximum", () => {
    expect(recipe("Vasopressin").notes).not.toContain("0.06");
  });
  it("epoprostenol has no generic concentration", () => {
    expect(recipe("Epoprostenol (prostacyclin)").concentrationLabel).toMatch(/Product-specific/);
  });
});

describe("topic corrections", () => {
  const all = allReferenceTopics.flatMap((t) => t.keyPoints.map(keyPointText)).join("\n");
  it("adenosine third dose is 18 mg", () => expect(all).toContain("6 mg, 12 mg and 18 mg"));
  it("LAST lipid bolus over 2–3 minutes", () => expect(all).toContain("1.5 mL/kg IV over 2–3 minutes"));
  it("PPH TXA timed from birth", () => expect(all).toContain("within 3 hours of birth"));
});

describe("iOS reference export", () => {
  const file = JSON.parse(readFileSync("public/ios-reference-pages.json", "utf8"));
  it("matches the app's current static source data (no drift)", () => {
    expect(file).toEqual(JSON.parse(JSON.stringify(buildIosReferencePages())));
  });
  it("contains no paediatric dosing or BNFC links", () => {
    const text = JSON.stringify(file);
    expect(text).not.toMatch(/bnfc|neonat|\bchild\b|infant/i);
  });
  it("exports lidocaine without a starting dose", () => {
    const text = JSON.stringify(file);
    expect(text).not.toMatch(/1 mg\/kg\/h/);
  });
});
