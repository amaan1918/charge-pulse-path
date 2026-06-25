import { Link } from "@tanstack/react-router";
import { MapPin, Zap, Star, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Station } from "@/lib/stations";
import { StationDetailsModal } from "@/components/StationDetailsModal";

export function StationCard({ s }: { s: Station }) {
  const [open, setOpen] = useState(false);
  const status =
    s.available === 0 ? { label: "Full", className: "bg-destructive/15 text-destructive" }
    : s.available <= 2 ? { label: "Limited", className: "bg-yellow-500/15 text-yellow-400" }
    : { label: "Available", className: "bg-primary/15 text-primary" };

  return (
    <div className="group glass overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-40 overflow-hidden">
        <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className={`${status.className} border-0`}>{status.label}</Badge>
          <Badge variant="outline" className="border-white/20 bg-black/40 text-white backdrop-blur">{s.type}</Badge>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">
          <Star className="mr-1 inline h-3 w-3 fill-primary text-primary" />
          {s.rating} <span className="text-white/60">({s.reviews})</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{s.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {s.address}, {s.city}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-white/5 p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Zap className="h-3 w-3 text-primary" />Speed</div>
            <div className="mt-1 text-sm font-semibold">{s.speedKw} kW</div>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <div className="text-xs text-muted-foreground">Available</div>
            <div className="mt-1 text-sm font-semibold"><span className="text-primary">{s.available}</span>/{s.chargers}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-2">
            <div className="text-xs text-muted-foreground">Price</div>
            <div className="mt-1 text-sm font-semibold">${s.pricePerKwh.toFixed(2)}<span className="text-muted-foreground">/kWh</span></div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.hours}</span>
          <span>{s.distanceKm < 1000 ? `${s.distanceKm.toFixed(1)} km away` : `${(s.distanceKm/1000).toFixed(1)}k km`}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-white/15 hover:bg-white/5"
            onClick={() => setOpen(true)}
          >
            View Details
          </Button>
          <Button asChild className="flex-1 shadow-glow" disabled={s.available === 0}>
            <Link to="/book" search={{ stationId: s.id } as never}>Book Now</Link>
          </Button>
        </div>
      </div>
      <StationDetailsModal open={open} onClose={() => setOpen(false)} station={s} />
    </div>
  );
}