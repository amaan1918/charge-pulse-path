import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackButton({ to = "/", label = "Back" }: BackButtonProps) {
  return (
    <Link
      to={to as never}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  );
}
