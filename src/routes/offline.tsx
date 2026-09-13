import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudDownload, RefreshCw, Trash2, WifiOff, CheckCircle2 } from "lucide-react";
import ReferenceAppLayout from "@/features/drugReference/ReferenceAppLayout";
import {
  cacheLastUpdated,
  cacheSizeKb,
  cachedMonographCount,
  clearDrugReferenceCache,
} from "@/features/drugReference/cache";
import { downloadAllMonographs } from "@/features/drugReference/useDrugReference";

export const Route = createFileRoute("/offline")({
  ssr: false,
  component: OfflinePage,
  head: () => ({
    meta: [
      { title: "Offline access — Anaesthesia & Critical Care Drugs" },
      {
        name: "description",
        content:
          "Save every drug monograph, infusion recipe and blood level target to this device so the reference works with no connection.",
      },
      { property: "og:title", content: "Offline access — Anaesthesia & Critical Care Drugs" },
      {
        property: "og:description",
        content: "Download the whole drug reference to this device for use without a signal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function formatWhen(ts: number | null): string {
  if (!ts) return "not yet";
  return new Date(ts).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OfflinePage() {
  const [saved, setSaved] = useState(0);
  const [sizeKb, setSizeKb] = useState(0);
  const [updated, setUpdated] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const refresh = () => {
    setSaved(cachedMonographCount());
    setSizeKb(cacheSizeKb());
    setUpdated(cacheLastUpdated());
  };

  useEffect(refresh, []);

  const download = async () => {
    setBusy(true);
    setError(null);
    setDone(false);
    setProgress({ done: 0, total: 0 });
    try {
      await downloadAllMonographs((d, total) => setProgress({ done: d, total }));
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
      refresh();
    }
  };

  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <ReferenceAppLayout>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Use offline</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Save every drug monograph, infusion recipe and blood level target onto this device. Once
          saved, the whole reference opens with no signal — useful in theatres, lifts and basements.
        </p>

        <section className="mt-6 rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? (
                <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <CloudDownload aria-hidden="true" className="h-4 w-4" />
              )}
              {busy ? "Saving…" : saved > 0 ? "Update saved copy" : "Download everything"}
            </button>
            {saved > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearDrugReferenceCache();
                  setDone(false);
                  refresh();
                }}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground disabled:opacity-60"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" /> Remove saved copy
              </button>
            )}
          </div>

          {busy && (
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {progress?.total
                  ? `Saved ${progress.done} of ${progress.total} monographs`
                  : "Preparing…"}
              </p>
            </div>
          )}

          {done && !busy && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-foreground">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" /> Everything is
              saved on this device.
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm text-destructive">
              {error}
            </p>
          )}

          <dl className="mt-5 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Monographs saved
              </dt>
              <dd className="mt-1 font-medium text-foreground">{saved}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Space used</dt>
              <dd className="mt-1 font-medium text-foreground">{sizeKb} KB</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">Last saved</dt>
              <dd className="mt-1 font-medium text-foreground">{formatWhen(updated)}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-6 rounded-xl border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
          <h2 className="inline-flex items-center gap-2 text-base font-medium text-foreground">
            <WifiOff aria-hidden="true" className="h-4 w-4" /> Good to know
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              The saved copy lives in this browser on this device. Use the same browser when you are
              offline, and avoid private browsing, which is cleared when you close it.
            </li>
            <li>
              Infusion recipes, the rate calculator and the premedication guidance are built into
              the app and always work offline.
            </li>
            <li>
              Saved content expires after 30 days. Tap “Update saved copy” from time to time so you
              always have the latest corrections.
            </li>
            <li>
              Add the app to your home screen (Share → Add to Home Screen) for quick access without
              the browser bar.
            </li>
          </ul>
          <p className="mt-3">
            <Link to="/about" className="underline hover:text-foreground">
              How this reference is built and sourced
            </Link>
          </p>
        </section>
      </main>
    </ReferenceAppLayout>
  );
}
