import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Zap, Star, Navigation, Square, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassDialog } from "@/components/popups/GlassDialog";
import { usePopup } from "@/components/popups/PopupProvider";
import type { Station } from "@/lib/stations";

interface Props {
  open: boolean;
  onClose: () => void;
  station: Station | null;
}

export function StationDetailsModal({ open, onClose, station }: Props) {
  const [charging, setCharging] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [energyKwh, setEnergyKwh] = useState(0);
  const { showChargingComplete } = usePopup();

  useEffect(() => {
    if (!open) {
      setCharging(false);
      setElapsedSec(0);
      setEnergyKwh(0);
    }
  }, [open]);

  useEffect(() => {
    if (!charging || !station) return;
    const i = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
      setEnergyKwh((k) => +(k + station.speedKw / 3600).toFixed(3));
    }, 1000);
    return () => clearInterval(i);
  }, [charging, station]);

  if (!station) return null;

  const status =
    station.available === 0 ? { label: "Offline / Full", color: "text-destructive bg-destructive/15" }
    : station.available <= 2 ? { label: "Busy", color: "text-yellow-400 bg-yellow-500/15" }
    : { label: "Available", color: "text-primary bg-primary/15" };

  const cost = (energyKwh * station.pricePerKwh).toFixed(2);
  const estChargingTimeMin = Math.round((60 / station.speedKw) * 60); // est full session

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;

  const stop = () => {
    setCharging(false);
    showChargingComplete({
      energyKwh: Math.max(energyKwh, 1),
      durationMin: Math.max(1, Math.round(elapsedSec / 60)),
      totalCost: +cost,
      batteryLevel: Math.min(100, 20 + Math.round(energyKwh)),
      co2SavedKg: +(energyKwh * 0.4).toFixed(2),
      stationName: station.name,
    });
    onClose();
  };

  return (
    <GlassDialog open={open} onClose={onClose} size="lg">
      <div className="-m-7">
        <div className="relative h-44 overflow-hidden rounded-t-3xl">
          <img src={station.image} alt={station.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute left-5 top-5 flex gap-2">
            <Badge className={`${status.color} border-0`}>{status.label}</Badge>
            <Badge variant="outline" className="border-white/20 bg-black/40 text-white backdrop-blur">{station.type}</Badge>
          </div>
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-2xl font-black tracking-tight">{station.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" /> {station.address}, {station.city}, {station.state} — {station.pincode}
            </p>
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Cell label="Station ID" value={station.id} />
            <Cell label="Power" value={`${station.speedKw} kW`} accent />
            <Cell label="Chargers" value={`${station.available}/${station.chargers}`} />
            <Cell label="Price" value={`₹${station.pricePerKwh}/kWh`} />
            <Cell label="Hours" value={station.hours} />
            <Cell label="Est. time" value={`~${estChargingTimeMin} min`} />
            <Cell label="Rating" value={`★ ${station.rating} (${station.reviews})`} />
            <Cell label="Distance" value={station.distanceKm < 1000 ? `${station.distanceKm.toFixed(1)} km` : "Long"} />
          </div>

          {charging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-2xl border border-primary/30 bg-primary/10 p-5"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Live charging session
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                <Live label="Speed" value={`${station.speedKw} kW`} />
                <Live label="Delivered" value={`${energyKwh.toFixed(2)} kWh`} />
                <Live label="Cost" value={`₹${cost}`} />
              </div>
              <div className="mt-3 text-center text-xs text-muted-foreground">
                Elapsed {Math.floor(elapsedSec / 60)}m {elapsedSec % 60}s
              </div>
            </motion.div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {!charging ? (
              <Button onClick={() => setCharging(true)} disabled={station.available === 0} className="flex-1 shadow-glow">
                <Play className="h-4 w-4" /> Start Charging
              </Button>
            ) : (
              <Button onClick={stop} variant="destructive" className="flex-1">
                <Square className="h-4 w-4" /> Stop Charging
              </Button>
            )}
            <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" /> Directions
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10">
              <Link to="/stations/$id" params={{ id: station.id }} onClick={onClose}>Full page</Link>
            </Button>
            <Button asChild className="shadow-glow">
              <Link to="/book" search={{ stationId: station.id } as never} onClick={onClose}>
                <Zap className="h-4 w-4" /> Book Slot
              </Link>
            </Button>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {station.hours}</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {station.rating} · {station.reviews} reviews</span>
          </div>
        </div>
      </div>
    </GlassDialog>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate text-sm font-semibold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Live({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-bold text-primary">{value}</div>
    </div>
  );
}