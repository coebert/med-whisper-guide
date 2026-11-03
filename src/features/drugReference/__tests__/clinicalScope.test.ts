import { describe, expect, it } from "vitest";

import { drugDilutions } from "../dilutions";
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
    expect(r.startDose).toBeLessThanOrEqual(1.5);
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
