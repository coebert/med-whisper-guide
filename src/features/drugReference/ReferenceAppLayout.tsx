import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Pill, WifiOff } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Page title used for the browser tab. */
  title: string;
  description: string;
  canonicalPath: string;
}

const NAV = [
  { to: "/reference", label: "Home", end: true },
  { to: "/reference/drugs", label: "Drugs" },
  { to: "/reference/topics", label: "Topics" },
  { to: "/reference/monitoring", label: "Levels" },
  { to: "/reference/infusions", label: "Infusions" },
  { to: "/reference/about", label: "Sources" },
];

/**
 * Shell for the standalone Anaesthetics & Critical Care Drug Reference.
 * Deliberately independent of the main site chrome so the whole /reference
 * area behaves — and can be lifted out — as its own app.
 */
export default function ReferenceAppLayout({ children, title, description, canonicalPath }: Props) {
  const [offline, setOffline] = useState(() => typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://anaesthesiacore.app${canonicalPath}`} />
        <link rel="manifest" href="/drug-reference.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
      </Helmet>

      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/reference" className="flex items-center gap-2 text-foreground">
            <Pill aria-hidden="true" className="h-5 w-5 text-primary" />
            <span className="font-serif text-base leading-tight sm:text-lg">Drug Reference</span>
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
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-block border-b-2 px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
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
            <Link to="/reference/about" className="underline hover:text-foreground">
              Sources and how this reference is built
            </Link>
            <span aria-hidden="true"> · </span>
            <Link to="/" className="underline hover:text-foreground">
              Back to AnaesthesiaCore
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
