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
    expect([r.unit, r.startDose, r.minDose, r.maxDose, r.perKg]).toEqual([
      "mg/h",
      1000,
      1000,
      1000,
      false,
    ]);
  });
  it("trauma TXA maintenance is fixed 125 mg/h", () => {
    const r = recipe("Tranexamic acid (major trauma)");
    expect([r.unit, r.startDose, r.minDose, r.maxDose, r.perKg]).toEqual([
      "mg/h",
      125,
      125,
      125,
      false,
    ]);
  });
  it("trauma TXA cites NICE NG39 and CRASH-2 (as a trial)", () => {
    const r = recipe("Tranexamic acid (major trauma)");
    const urls = (r.sources ?? []).map((s) => s.url);
    expect(urls).toContain("https://www.nice.org.uk/guidance/ng39/chapter/recommendations");
    expect(urls).toContain("https://crash2.lshtm.ac.uk/CRASH2_Lancet.pdf");
    expect(r.notes).not.toMatch(/citation pending/);
    expect(r.notes).not.toMatch(/CRASH-2 guideline/i);
  });
  it("static recipes contain no pump-rate (mL/h) figures", () => {
    for (const d of drugDilutions) expect(`${d.drawUp} ${d.notes ?? ""}`).not.toMatch(/mL\/h/);
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
  it("LAST lipid bolus over 2–3 minutes", () =>
    expect(all).toContain("1.5 mL/kg IV over 2–3 minutes"));
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
    const sec = file
      .flatMap((p: { sections: { title: string }[] }) => p.sections)
      .find((x: { title: string }) => x.title === "Lidocaine (IV analgesia)");
    const text = JSON.stringify(sec);
    expect(text).toContain("Per local protocol");
    expect(text).toContain("120 mg/h");
    expect(text).not.toMatch(/[^.]1 mg\/kg\/h|0\.5/);
  });
});

describe("opioid, aminophylline and insulin corrections", () => {
  it("alfentanil ventilated maintenance is 30–60 micrograms/kg/h", () => {
    const r = recipe("Alfentanil");
    expect([r.minDose, r.maxDose, r.startDose]).toEqual([30, 60, undefined]);
    expect(r.notes).not.toMatch(/120|peaks/);
  });
  it("aminophylline maintenance is 0.5–0.7 mg/kg/h with no 12 h step-down", () => {
    const r = recipe("Aminophylline");
    expect([r.minDose, r.maxDose]).toEqual([0.5, 0.7]);
    expect(r.notes).not.toMatch(/12 h/);
  });
  it("remifentanil ICU recipe starts at 0.1 and tops at 0.74, not 2", () => {
    const r = recipe("Remifentanil (ventilated adult ICU)");
    expect([r.startDose, r.minDose, r.maxDose]).toEqual([0.1, 0.006, 0.74]);
  });
  it("insulin has no universal starting rate or intra-operative claim", () => {
    const r = recipe("Insulin (Actrapid)");
    expect(r.startDose).toBeUndefined();
    expect(r.notes).not.toMatch(/tighter ranges/);
  });
});

describe("carboprost, intranasal dexmedetomidine and insulin sources", () => {
  const all = allReferenceTopics.flatMap((t) => t.keyPoints.map(keyPointText)).join("\n");
  it("carboprost is not stated as absolutely contraindicated in asthma", () => {
    expect(all).not.toContain("carboprost is contraindicated in asthma");
    expect(all).toContain("Active pulmonary disease is contraindicated in the Hemabate SmPC");
  });
  it("intranasal dexmedetomidine has no standard dose row or atomiser recipe", async () => {
    const { premedSections } = await import("../premedication");
    const s = premedSections.find((x) => x.id === "dexmedetomidine-intranasal")!;
    expect(s.rows).toBeUndefined();
    expect(s.text).not.toMatch(/atomiser|1–1\.5/);
  });
  it("insulin cites the 2026 UK/Ireland consensus", () => {
    expect((recipe("Insulin (Actrapid)").sources ?? []).map((x) => x.url)).toContain(
      "https://associationofanaesthetists-publications.onlinelibrary.wiley.com/doi/10.1111/anae.70181",
    );
  });
});

describe("static recipe reconciliation", () => {
  const sourced = [
    "Alfentanil",
    "Remifentanil (ventilated adult ICU)",
    "Lidocaine (IV analgesia)",
    "Magnesium sulphate",
    "Tranexamic acid (major trauma)",
    "Aminophylline",
    "Dexmedetomidine",
    "Propofol 1%",
  ];
  it("only source-backed recipes keep a numeric range", () => {
    for (const d of drugDilutions)
      if (!sourced.includes(d.drug)) expect([d.drug, d.minDose, d.maxDose]).toEqual([d.drug, undefined, undefined]);
  });
  it("labetalol and oxytocin cards carry no numeric dose regimen", () => {
    for (const n of ["Labetalol", "Oxytocin"]) {
      const r = recipe(n);
      expect(r.startDose).toBeUndefined();
      expect(r.notes).not.toMatch(/\d+ (mg|units)\/h/);
    }
  });
  it("propofol keeps only the SmPC 0.3–4 mg/kg/h range, with no default start", () => {
    const r = recipe("Propofol 1%");
    expect([r.startDose, r.minDose, r.maxDose]).toEqual([undefined, 0.3, 4]);
  });
  it("oral clonidine and melatonin premeds have no universal dose rows", async () => {
    const { premedSections } = await import("../premedication");
    for (const id of ["clonidine-oral", "melatonin-oral"])
      expect(premedSections.find((s) => s.id === id)!.rows).toBeUndefined();
  });
  it("labetalol recipe links its monograph's SmPC", () => {
    expect((recipe("Labetalol").sources ?? []).map((s) => s.url)).toContain(
      "https://www.medicines.org.uk/emc/product/10831/smpc",
    );
  });
});

describe("source integrity pass (v8)", () => {
  it("unsourced premed regimens carry no dose rows", async () => {
    const { premedSections } = await import("../premedication");
    for (const id of ["midazolam-oral", "aspiration-prophylaxis"])
      expect(premedSections.find((s) => s.id === id)!.rows).toBeUndefined();
    const analgesia = premedSections.find((s) => s.id === "simple-analgesia")!;
    expect(analgesia.rows!.some((r) => /ibuprofen/i.test(r.group))).toBe(false);
  });
  it("no static source cites the sublingual fentanyl or 2% propofol SmPC", () => {
    const src = ["../monographSources.ts", "../citations.ts"]
      .map((f) => readFileSync(new URL(f, import.meta.url), "utf8"))
      .join("\n");
    expect(src).not.toContain("emc/product/10268/");
    expect(src).not.toContain("emc/product/15153/");
  });
  it("fentanyl and propofol 1% cards cite the verified IV / 1% products", () => {
    expect((recipe("Fentanyl").sources ?? []).map((s) => s.url)).toContain(
      "https://www.medicines.org.uk/emc/product/3387/smpc",
    );
    expect((recipe("Propofol 1%").sources ?? []).map((s) => s.url)).toContain(
      "https://www.medicines.org.uk/emc/product/11295/smpc",
    );
  });
  it("offline cache is at v9 with v8 purged", () => {
    const c = readFileSync(new URL("../cache.ts", import.meta.url), "utf8");
    expect(c).toContain('"drugref:v9:"');
    expect(c).toMatch(/LEGACY_PREFIXES = \[[^\]]*"drugref:v8:"/);
  });
});

describe("final consistency (v9)", () => {
  const verified = [
    "Alfentanil", "Remifentanil (ventilated adult ICU)", "Lidocaine (IV analgesia)",
    "Magnesium sulphate", "Tranexamic acid (major trauma)", "Aminophylline",
    "Dexmedetomidine", "Propofol 1%", "Vasopressin",
  ];
  const doseRate = /\d\s*(micrograms|mg|units|nanograms|g)(\/kg)?\/(min|h)\b/i;
  it("non-verified card notes carry no numeric dose rates", () => {
    for (const d of drugDilutions)
      if (!verified.includes(d.drug)) {
        expect([d.drug, doseRate.test(d.notes ?? "")]).toEqual([d.drug, false]);
        expect([d.drug, d.startDose, d.minDose, d.maxDose]).toEqual([d.drug, undefined, undefined, undefined]);
      }
  });
});
