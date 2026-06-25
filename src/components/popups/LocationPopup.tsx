import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";

type Status = "idle" | "loading" | "granted" | "denied";

export function LocationPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<Status>("idle");

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        try {
          localStorage.setItem(
            "evhub_location",
            JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          );
        } catch {}
        setStatus("granted");
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 1200);
      },
      () => setStatus("denied"),
      { timeout: 10000 }
    );
  };

  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/20 text-primary shadow-glow">
          {status === "granted" ? <Check className="h-8 w-8" /> : <MapPin className="h-8 w-8" />}
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight">
          <span aria-hidden>📍</span> Enable Location
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Allow location access so we can find the nearest EV charging stations, estimate travel
          distance, and provide personalized charging recommendations.
        </p>

        {status === "denied" && (
          <p className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
            Location access is optional, but enabling it provides a better charging experience.
          </p>
        )}
        {status === "granted" && (
          <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
            Location enabled — you're all set.
          </p>
        )}

        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={requestLocation}
            disabled={status === "loading" || status === "granted"}
            className="flex-1 shadow-glow"
            size="lg"
          >
            <MapPin className="h-4 w-4" />
            {status === "loading" ? "Requesting…" : status === "granted" ? "Enabled" : "Allow Location"}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/10"
            size="lg"
          >
            Maybe Later
          </Button>
        </div>
      </div>
    </GlassDialog>
  );
}