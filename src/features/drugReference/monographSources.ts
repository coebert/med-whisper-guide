/**
 * Specific (non-search) source URLs stored with each linked drug monograph,
 * copied read-only from the current monograph records. Attached to infusion
 * recipes so readers can reach the monograph's own sources. A listed source is
 * not certification that every recipe statement has been checked against it.
 */
import type { DrugSource } from "./types";

const URLS: Record<string, string[]> = {
  adrenaline: [
    "https://doi.org/10.1097/CCM.0000000000005337",
    "https://www.resus.org.uk/media/337/download?attachment=",
  ],
  alfentanil: ["https://fpm.ac.uk/opioids-aware", "https://www.medicines.org.uk/emc/product/6427/smpc"],
  aminophylline: [
    "https://www.medicines.org.uk/emc/product/6560/smpc",
    "https://www.brit-thoracic.org.uk/document-library/guidelines/asthma/btssign-guideline-for-the-management-of-asthma-2019-sign-158/",
  ],
  dexmedetomidine: ["https://www.medicines.org.uk/emc/product/4783/smpc"],
  dobutamine: ["https://doi.org/10.1097/CCM.0000000000005337"],
  dopamine: ["https://doi.org/10.1097/CCM.0000000000005337"],
  epoprostenol: ["https://bnf.nice.org.uk/drugs/epoprostenol/"],
  fentanyl: ["https://fpm.ac.uk/opioids-aware", "https://www.medicines.org.uk/emc/product/10268/smpc"],
  "glyceryl-trinitrate": ["https://www.medicines.org.uk/emc/product/6296/smpc"],
  "insulin-actrapid": [
    "https://www.diabetes.org.uk/sites/default/files/2023-03/JBDS%2002%20DKA%20Guideline%20with%20qr%20code.pdf",
  ],
  labetalol: ["https://www.medicines.org.uk/emc/product/10831/smpc"],
  levosimendan: [
    "https://doi.org/10.1097/CCM.0000000000005337",
    "https://docetp.mpa.se/LMF/Simdax%20concentrate%20for%20solution%20for%20infusion%20ENG%20SmPC_09001bee807a76cd.pdf",
  ],
  lidocaine: [
    "https://associationofanaesthetists-publications.onlinelibrary.wiley.com/doi/epdf/10.1111/anae.15270",
  ],
  "magnesium-sulphate": ["https://medicines.kentpharma.co.uk/wp-content/uploads/2023/01/uk-spc-50-clean.pdf"],
  metaraminol: [
    "https://doi.org/10.1097/CCM.0000000000005337",
    "https://www.medicines.org.uk/emc/product/7111/smpc",
  ],
  midazolam: ["https://www.medicines.org.uk/emc/product/15365/smpc"],
  milrinone: ["https://doi.org/10.1097/CCM.0000000000005337"],
  morphine: ["https://fpm.ac.uk/opioids-aware"],
  noradrenaline: ["https://doi.org/10.1097/CCM.0000000000005337"],
  oxytocin: ["https://www.medicines.org.uk/emc/product/13359/smpc"],
  phenylephrine: ["https://doi.org/10.1097/CCM.0000000000005337"],
  propofol: ["https://www.medicines.org.uk/emc/product/11295/smpc"],
  remifentanil: ["https://fpm.ac.uk/opioids-aware", "https://www.medicines.org.uk/emc/product/794/smpc"],
  rocuronium: ["https://www.medicines.org.uk/emc/product/13173/smpc"],
  salbutamol: [
    "https://www.medicines.org.uk/emc/product/10257/smpc",
    "https://www.medicines.org.uk/emc/product/10256/smpc",
    "https://www.medicines.org.uk/emc/product/853/smpc",
  ],
  "tranexamic-acid": [
    "https://www.medicines.org.uk/emc/product/1077/smpc",
    "https://www.nice.org.uk/guidance/ng39/chapter/Recommendations",
  ],
  "unfractionated-heparin": ["https://www.nice.org.uk/guidance/ng89"],
  vasopressin: ["https://doi.org/10.1097/CCM.0000000000005337"],
};

export function monographSources(slug: string | null): DrugSource[] {
  if (!slug) return [];
  return (URLS[slug] ?? []).map((url) => ({
    label: "Monograph source",
    title: `Source listed on the ${slug.replace(/-/g, " ")} monograph`,
    publisher: new URL(url).hostname.replace(/^www\./, ""),
    url,
  }));
}

/** Recipe citations first, then the monograph's own sources, deduplicated by URL. */
export function withMonographSources(
  sources: DrugSource[] | undefined,
  slug: string | null,
): DrugSource[] | undefined {
  const all = [...(sources ?? []), ...monographSources(slug)];
  const seen = new Set<string>();
  const out = all.filter((s) => {
    const k = s.url.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return out.length ? out : undefined;
}
