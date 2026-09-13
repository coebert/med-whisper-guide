/**
 * Tiny localStorage cache so the drug reference keeps working offline
 * (ward WiFi, lifts, basements) after a first successful load.
 *
 * Self-contained on purpose: no app-specific imports.
 */

const PREFIX = "drugref:v1:";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface Envelope<T> {
  savedAt: number;
  data: T;
}

export function readCache<T>(key: string): { data: T; savedAt: number } | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (!parsed || typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;
    return { data: parsed.data, savedAt: parsed.savedAt };
  } catch {
    return null;
  }
}

/** Returns false when the browser refused the write (storage full / private mode). */
export function writeCache<T>(key: string, data: T): boolean {
  try {
    const envelope: Envelope<T> = { savedAt: Date.now(), data };
    localStorage.setItem(PREFIX + key, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}


export function cachedMonographCount(): number {
  try {
    let count = 0;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${PREFIX}drug:`)) count += 1;
    }
    return count;
  } catch {
    return 0;
  }
}

/** Newest savedAt across everything stored, or null when nothing is saved. */
export function cacheLastUpdated(): number | null {
  try {
    let newest: number | null = null;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const savedAt = (JSON.parse(raw) as Envelope<unknown>).savedAt;
      if (typeof savedAt === "number" && (newest === null || savedAt > newest)) newest = savedAt;
    }
    return newest;
  } catch {
    return null;
  }
}

/** Rough size of the saved copy, in kilobytes. */
export function cacheSizeKb(): number {
  try {
    let chars = 0;
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      chars += (localStorage.getItem(key) ?? "").length + key.length;
    }
    return Math.round((chars * 2) / 1024);
  } catch {
    return 0;
  }
}

export function clearDrugReferenceCache(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
