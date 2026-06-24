import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Clock, Zap, Star, ShieldCheck, Coffee, Wifi, Store, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { findStation, reviews as allReviews } from "@/lib/stations";

import mapBg from "@/assets/map-bg.jpg";

export const Route = createFileRoute("/stations/$id")({
  loader: ({ params }) => {
    const s = findStation(params.id);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — EVChargeHub` },
          { name: "description", content: `${loaderData.type} at ${loaderData.address}, ${loaderData.city}. ${loaderData.chargers} chargers, ${loaderData.speedKw} kW, $${loaderData.pricePerKwh}/kWh.` },
          { property: "og:title", content: `${loaderData.name} — EVChargeHub` },
          { property: "og:description", content: `Book ${loaderData.type} in ${loaderData.city}.` },
          { property: "og:image", content: loaderData.image },
        ]
      : [],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-16 text-center">
      <h2 className="text-2xl font-bold">Station not found</h2>
      <Button asChild className="mt-4"><Link to="/stations">Back to stations</Link></Button>
    </div>
  ),
  component: StationDetail,
});

const amenityIcon: Record<string, typeof Wifi> = { "Wi-Fi": Wifi, Cafe: Coffee, Shop: Store, Lounge: ShieldCheck, Restroom: ShieldCheck };

function StationDetail() {
  const s = Route.useLoaderData();
  const reviews = allReviews.filter((r) => r.stationId === s.id);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BackButton to="/stations" label="Back to stations" />

      <div className="grid gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2">
          <div className="glass overflow-hidden rounded-3xl">
            <div className="relative h-80">
              <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute left-5 top-5 flex gap-2">
                <Badge className="border-0 bg-primary/20 text-primary backdrop-blur">{s.type}</Badge>
                <Badge variant="outline" className="border-white/20 bg-black/40 text-white backdrop-blur">{s.speedKw} kW</Badge>
              </div>
              <div className="absolute bottom-5 left-5">
                <h1 className="text-3xl font-black sm:text-4xl">{s.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-white/80"><MapPin className="h-4 w-4" /> {s.address}, {s.city}, {s.state}</p>
              </div>
              <div className="absolute right-5 top-5 flex gap-2">
                <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"><Heart className="h-4 w-4" /></button>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
              <Stat label="Available" value={`${s.available}/${s.chargers}`} accent />
              <Stat label="Speed" value={`${s.speedKw} kW`} />
              <Stat label="Price" value={`$${s.pricePerKwh.toFixed(2)}/kWh`} />
              <Stat label="Rating" value={`★ ${s.rating}`} />
            </div>
          </div>

          <div className="glass mt-6 rounded-3xl p-6">
            <h2 className="text-xl font-semibold">About this station</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Conveniently located in the heart of {s.city}, this {s.type.toLowerCase()} station offers {s.chargers} bays with peak power up to {s.speedKw} kW. Open {s.hours}.
            </p>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Amenities</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.amenities.map((a: string) => {
                const Icon = amenityIcon[a] ?? ShieldCheck;
                return (
                  <span key={a} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {a}
                  </span>
                );
              })}
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hours</h3>
            <p className="mt-2 flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-primary" /> {s.hours}</p>
          </div>

          <div className="glass mt-6 rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <span className="text-sm text-muted-foreground">{s.reviews} total · ★ {s.rating}</span>
            </div>
            <div className="mt-4 space-y-4">
              {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet. Be the first.</p>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-primary">{r.user[0]}</span>
                      <div>
                        <div className="text-sm font-semibold">{r.user}</div>
                        <div className="text-xs text-muted-foreground">{r.date}</div>
                      </div>
                    </div>
                    <div className="flex text-primary">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary" />)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-foreground/90">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="glass-strong sticky top-24 rounded-3xl p-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated cost</div>
            <div className="mt-1 text-4xl font-black"><span className="gradient-text">${(s.pricePerKwh * 60).toFixed(2)}</span></div>
            <div className="text-xs text-muted-foreground">for a full 60 kWh charge</div>

            <div className="mt-5 space-y-3 text-sm">
              <Row label="Charger type" value={s.type} />
              <Row label="Peak speed" value={`${s.speedKw} kW`} />
              <Row label="Price" value={`$${s.pricePerKwh.toFixed(2)}/kWh`} />
              <Row label="Status" value={s.available > 0 ? `${s.available} available` : "Currently full"} highlight={s.available > 0} />
            </div>

            <Button asChild size="lg" disabled={s.available === 0} className="mt-5 w-full shadow-glow">
              <Link to="/book" search={{ stationId: s.id } as never}><Zap /> Reserve a slot</Link>
            </Button>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <img src={mapBg} alt="Map" className="h-32 w-full object-cover" />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">{s.distanceKm < 1000 ? `${s.distanceKm.toFixed(1)} km away` : "Long distance"}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-bold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}