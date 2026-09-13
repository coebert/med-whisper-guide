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

export function writeCache<T>(key: string, data: T): void {
  try {
    const envelope: Envelope<T> = { savedAt: Date.now(), data };
    localStorage.setItem(PREFIX + key, JSON.stringify(envelope));
  } catch {
    // Storage full or unavailable (private mode) — caching is best-effort.
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
