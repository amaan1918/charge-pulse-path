import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { StationCard } from "@/components/StationCard";
import { stations, type ChargerType } from "@/lib/stations";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/stations")({
  head: () => ({
    meta: [
      { title: "Charging Stations — EVChargeHub" },
      { name: "description", content: "Browse all EV charging stations with real-time availability, pricing, and instant booking." },
      { property: "og:title", content: "All Charging Stations — EVChargeHub" },
      { property: "og:description", content: "Browse all EV charging stations with real-time availability." },
    ],
  }),
  component: StationsPage,
});

const types: ("All" | ChargerType)[] = ["All", "Tesla Supercharger", "Ultra Fast", "DC Fast", "Level 2 AC"];

function StationsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"All" | ChargerType>("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const list = useMemo(() => {
    return stations.filter((s) => {
      if (type !== "All" && s.type !== type) return false;
      if (onlyAvailable && s.available === 0) return false;
      if (q && !`${s.name} ${s.city} ${s.state} ${s.address}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, type, onlyAvailable]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">All stations</span>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Charging Stations</h1>
          <p className="mt-2 text-muted-foreground">{list.length} stations match your filters</p>
        </div>
        <Button asChild variant="outline" className="border-white/15 hover:bg-white/5">
          <Link to="/locator"><Filter className="h-4 w-4" /> Map view</Link>
        </Button>
      </div>

      <div className="glass mt-8 flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stations, cities..." className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} onClick={() => setType(t)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${type === t ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}>
              {t}
            </button>
          ))}
          <button onClick={() => setOnlyAvailable((v) => !v)} className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${onlyAvailable ? "border-primary bg-primary/15 text-primary" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}>
            Available only
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => <StationCard key={s.id} s={s} />)}
      </div>
      {list.length === 0 && (
        <div className="glass mt-10 rounded-2xl p-16 text-center">
          <p className="text-muted-foreground">No stations match your filters.</p>
        </div>
      )}
    </div>
  );
}