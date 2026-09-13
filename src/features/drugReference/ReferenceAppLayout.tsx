import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Pill, WifiOff } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Accepted for compatibility; page metadata now lives in each route's head(). */
  title?: string;
  description?: string;
  canonicalPath?: string;
}

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/search", label: "Search" },
  { to: "/drugs", label: "Drugs" },
  { to: "/topics", label: "Topics" },
  { to: "/premedication", label: "Premed" },
  { to: "/monitoring", label: "Levels" },
  { to: "/infusions", label: "Infusions" },
  { to: "/sources", label: "Sources" },
  { to: "/offline", label: "Offline" },
  { to: "/about", label: "About" },
] as const;

/**
 * Shell for the standalone Anaesthesia & Critical Care Drugs reference app.
 * Deliberately independent chrome so the whole app behaves as its own product.
 */
export default function ReferenceAppLayout({ children }: Props) {
  const [offline, setOffline] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <Pill aria-hidden="true" className="h-5 w-5 text-primary" />
            <span className="font-serif text-base leading-tight sm:text-lg">
              Anaesthesia &amp; Critical Care Drugs
            </span>
          </Link>
          {offline && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              <WifiOff aria-hidden="true" className="h-3 w-3" /> Offline — saved copy
            </span>
          )}
        </div>
        <nav aria-label="Drug reference" className="border-t border-border">
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
    </div>
  );
}
