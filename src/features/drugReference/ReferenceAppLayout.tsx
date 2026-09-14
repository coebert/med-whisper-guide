import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Droplets,
  Home,
  MoreHorizontal,
  Pill,
  Search as SearchIcon,
  WifiOff,
  X,
} from "lucide-react";

interface Props {
  children: ReactNode;
}

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/search", label: "Search" },
  { to: "/drugs", label: "Drugs" },
  { to: "/compare", label: "Compare" },
  { to: "/topics", label: "Topics" },
  { to: "/premedication", label: "Premed" },
  { to: "/monitoring", label: "Levels" },
  { to: "/infusions", label: "Infusions" },
  { to: "/calculator", label: "Calculator" },
  { to: "/sources", label: "Sources" },
  { to: "/references", label: "References" },
  { to: "/offline", label: "Offline" },
  { to: "/about", label: "About" },
] as const;

/** Thumb-reach tabs on phones: the four screens used at the bedside, plus everything else. */
const TABS = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/search", label: "Search", icon: SearchIcon },
  { to: "/drugs", label: "Drugs", icon: Pill },
  { to: "/infusions", label: "Infusions", icon: Droplets },
] as const;

/** Links that are not on the bottom bar, shown in the "More" sheet. */
const MORE = NAV.filter((item) => !TABS.some((tab) => tab.to === item.to));

/**
 * Shell for the standalone Anaesthesia & Critical Care Drugs reference app.
 * Deliberately independent chrome so the whole app behaves as its own product.
 */
export default function ReferenceAppLayout({ children }: Props) {
  const [offline, setOffline] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2 text-foreground">
            <Pill aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate font-serif text-[15px] leading-tight sm:text-lg">
              Anaesthesia &amp; Critical Care Drugs
            </span>
          </Link>
          {offline && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <WifiOff aria-hidden="true" className="h-3 w-3" />
              <span className="hidden sm:inline">Offline — saved copy</span>
              <span className="sm:hidden">Offline</span>
            </span>
          )}
        </div>
        {/* Full nav from tablet up; phones use the bottom bar instead. */}
        <nav aria-label="Drug reference" className="hidden border-t border-border md:block">
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 sm:px-4 lg:px-6">
            {NAV.map((item) => (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: "exact" in item ? item.exact : false }}
                  activeProps={{
                    className: "border-primary text-foreground",
                  }}
                  inactiveProps={{
                    className: "border-transparent text-muted-foreground hover:text-foreground",
                  }}
                  className="inline-block border-b-2 px-3 py-2 text-sm font-medium transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted-foreground sm:px-6 lg:px-8">
          <p>
            Educational reference for trained clinicians. Always check doses, dilutions and
            monitoring targets against the BNF, the product SPC, your smart-pump drug library and
            local protocols before administration.
          </p>
          <p className="mt-2">
            <Link to="/about" className="underline hover:text-foreground">
              Sources and how this reference is built
            </Link>
          </p>
        </div>
      </footer>

      {/* Spacer so the bottom bar never covers the last line of content on phones. */}
      <div aria-hidden="true" className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />

      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-card pb-[calc(5rem+env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <h2 className="font-serif text-lg text-foreground">More</h2>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                aria-label="Close menu"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <ul className="px-3">
              {MORE.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    activeProps={{ className: "text-primary" }}
                    inactiveProps={{ className: "text-foreground" }}
                    className="block rounded-lg px-3 py-3 text-base font-medium active:bg-muted"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="grid grid-cols-5">
          {TABS.map((tab) => (
            <li key={tab.to}>
              <Link
                to={tab.to}
                activeOptions={{ exact: "exact" in tab ? tab.exact : false }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="flex h-[4.25rem] flex-col items-center justify-center gap-1 text-[11px] font-medium"
              >
                <tab.icon aria-hidden="true" className="h-5 w-5" />
                {tab.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={`flex h-[4.25rem] w-full flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                moreOpen ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
