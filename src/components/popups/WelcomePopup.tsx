import { Link } from "@tanstack/react-router";
import { Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";

export function WelcomePopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 text-primary shadow-glow">
          <Zap className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight">
          <span aria-hidden>👋</span> Welcome to <span className="text-primary">EVChargeHub</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Welcome to the future of EV charging. Find nearby charging stations, scan QR codes,
          book charging slots, and plan your EV journeys with a smarter and faster charging experience.
        </p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onClose} className="flex-1 shadow-glow" size="lg">
            <Zap className="h-4 w-4" /> Get Started
          </Button>
          <Button asChild variant="outline" className="flex-1 border-white/20 bg-white/5 hover:bg-white/10" size="lg">
            <Link to="/stations" onClick={onClose}>
              <MapPin className="h-4 w-4" /> Explore Stations
            </Link>
          </Button>
        </div>
      </div>
    </GlassDialog>
  );
}