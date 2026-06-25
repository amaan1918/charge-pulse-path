import { Link } from "@tanstack/react-router";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/stations", label: "Stations" },
  { to: "/locator", label: "Locator" },
  { to: "/scan", label: "Scan" },
  { to: "/trip-planner", label: "Trip Planner" },
  { to: "/calculator", label: "Cost" },
  { to: "/range", label: "Range" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              EVCharge<span className="text-primary">Hub</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  activeProps={{ className: "rounded-lg px-3 py-2 text-sm text-foreground bg-white/5" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild variant="ghost" size="sm" className="text-foreground hover:bg-white/5">
              <Link to="/dashboard">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="shadow-glow">
              <Link to="/book">Book a slot</Link>
            </Button>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/5 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="glass mt-2 rounded-2xl p-3 md:hidden animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-1">
              <Button asChild size="sm" className="flex-1 shadow-glow">
                <Link to="/book" onClick={() => setOpen(false)}>Book a slot</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}