import { Link, useLocation } from "@tanstack/react-router";
import { ScanLine } from "lucide-react";

export function ScanFAB() {
  const { pathname } = useLocation();
  if (pathname === "/scan") return null;
  return (
    <Link
      to="/scan"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-110 md:hidden"
      aria-label="Scan & Charge"
    >
      <ScanLine className="h-6 w-6" />
    </Link>
  );
}