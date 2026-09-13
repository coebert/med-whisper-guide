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
