import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { readCache, writeCache } from "./cache";
import type { DrugReferenceRow, DrugSource, DrugTdm } from "./types";

const LIST_COLUMNS =
  "slug,name,drug_class,synonyms,indication_oneliner,key_warning,requires_tdm";

const FULL_COLUMNS = `${LIST_COLUMNS},adult_bolus_dose,infusion_range,presentation,mechanism_of_action,pharmacokinetics,preparation,dosing,monitoring,side_effects,contraindications,interactions,tdm,sources`;

export type DrugListItem = Pick<
  DrugReferenceRow,
  "slug" | "name" | "drug_class" | "synonyms" | "indication_oneliner" | "key_warning" | "requires_tdm"
>;

function asSources(value: unknown): DrugSource[] {
  return Array.isArray(value) ? (value as DrugSource[]) : [];
}

function asTdm(value: unknown): DrugTdm | null {
  if (!value || typeof value !== "object") return null;
  const tdm = value as DrugTdm;
  return Array.isArray(tdm.targets) && tdm.targets.length > 0 ? tdm : null;
}

function normalise(row: Record<string, unknown>): DrugReferenceRow {
  return {
    ...(row as unknown as DrugReferenceRow),
    sources: asSources(row["sources"]),
    tdm: asTdm(row["tdm"]),
  };
}

/** Loads the whole library index (name, class, one-liner, monitoring flag). */
export function useDrugList() {
  const cached = readCache<DrugListItem[]>("list");
  const [drugs, setDrugs] = useState<DrugListItem[]>(cached?.data ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(Boolean(cached));

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("drugs")
        .select(LIST_COLUMNS)
        .order("name");
      if (!active) return;
      if (err) {
        if (!readCache<DrugListItem[]>("list")) setError(err.message);
      } else {
        const rows = (data ?? []) as DrugListItem[];
        setDrugs(rows);
        setFromCache(false);
        writeCache("list", rows);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { drugs, loading, error, fromCache };
}

/** Loads one full monograph, including sources and monitoring data. */
export function useDrugEntry(slug: string | undefined) {
  const cached = slug ? readCache<DrugReferenceRow>(`drug:${slug}`) : null;
  const [drug, setDrug] = useState<DrugReferenceRow | null>(cached?.data ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    const local = readCache<DrugReferenceRow>(`drug:${slug}`);
    setDrug(local?.data ?? null);
    setLoading(!local);
    (async () => {
      const { data, error: err } = await supabase
        .from("drugs")
        .select(FULL_COLUMNS)
        .eq("slug", slug)
        .maybeSingle();
      if (!active) return;
      if (err) {
        if (!local) setError(err.message);
      } else if (data) {
        const row = normalise(data as Record<string, unknown>);
        setDrug(row);
        writeCache(`drug:${slug}`, row);
      } else if (!local) {
        setDrug(null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  return { drug, loading, error };
}

/** Loads every monograph that needs blood level monitoring, with full TDM data. */
export function useMonitoredDrugs() {
  const cached = readCache<DrugReferenceRow[]>("monitored");
  const [drugs, setDrugs] = useState<DrugReferenceRow[]>(cached?.data ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: err } = await supabase
        .from("drugs")
        .select(FULL_COLUMNS)
        .eq("requires_tdm", true)
        .order("name");
      if (!active) return;
      if (err) {
        if (!readCache<DrugReferenceRow[]>("monitored")) setError(err.message);
      } else {
        const rows = (data ?? []).map((row) => normalise(row as Record<string, unknown>));
        setDrugs(rows);
        writeCache("monitored", rows);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { drugs, loading, error };
}

/**
 * Downloads every monograph and stores it locally so the whole reference
 * works with no connection. Fetched in pages to keep memory modest.
 */
export async function downloadAllMonographs(
  onProgress?: (done: number, total: number) => void,
): Promise<{ saved: number; total: number }> {
  const PAGE = 40;
  const { count, error: countError } = await supabase
    .from("drugs")
    .select("slug", { count: "exact", head: true });
  if (countError) throw new Error(countError.message);
  const total = count ?? 0;
  let saved = 0;
  let seen = 0;
  const list: DrugListItem[] = [];
  const monitored: DrugReferenceRow[] = [];

  for (let from = 0; from < total; from += PAGE) {
    const { data, error: err } = await supabase
      .from("drugs")
      .select(FULL_COLUMNS)
      .order("name")
      .range(from, from + PAGE - 1);
    if (err) throw new Error(err.message);
    for (const raw of data ?? []) {
      const row = normalise(raw as Record<string, unknown>);
      seen += 1;
      // A refused write means the device storage is full — stop and report honestly
      // rather than claiming a complete offline copy.
      if (!writeCache(`drug:${row.slug}`, row)) {
        throw new Error(
          `This device ran out of storage after saving ${saved} of ${total} monographs. Free up space in your browser and try again.`,
        );
      }
      saved += 1;
      list.push({
        slug: row.slug,
        name: row.name,
        drug_class: row.drug_class,
        synonyms: row.synonyms,
        indication_oneliner: row.indication_oneliner,
        key_warning: row.key_warning,
        requires_tdm: row.requires_tdm,
      });
      if (row.requires_tdm) monitored.push(row);
    }
    onProgress?.(saved, total);
    if (seen >= total) break;
  }

  writeCache("list", list);
  writeCache("monitored", monitored);
  return { saved, total };
}

