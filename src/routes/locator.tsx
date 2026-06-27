import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stations, type ChargerType } from "@/lib/stations";
import { GoogleMap } from "@/components/GoogleMap";
import { BackButton } from "@/components/BackButton";


export const Route = createFileRoute("/locator")({
  head: () => ({
    meta: [
      { title: "Locator — EVChargeHub" },
      { name: "description", content: "Find EV charging stations near you. Filter by city, state, charger type, and availability." },
      { property: "og:title", content: "Charging Station Locator — EVChargeHub" },
      { property: "og:description", content: "Find EV charging stations near you." },
    ],
  }),
  component: Locator,
});

const cities = ["All", ...Array.from(new Set(stations.map((s) => s.city)))];
const states = ["All", ...Array.from(new Set(stations.map((s) => s.state)))];
const types: ("All" | ChargerType)[] = ["All", "Tesla Supercharger", "Ultra Fast", "DC Fast", "Level 2 AC"];

function Locator() {
  const [city, setCity] = useState("All");
  const [state, setState] = useState("All");
  const [type, setType] = useState<"All" | ChargerType>("All");
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const list = useMemo(() => stations.filter((s) =>
    (city === "All" || s.city === city) &&
    (state === "All" || s.state === state) &&
    (type === "All" || s.type === type) &&
    (!onlyAvail || s.available > 0) &&
    (!q || `${s.name} ${s.city}`.toLowerCase().includes(q.toLowerCase())),
  ), [city, state, type, onlyAvail, q]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BackButton label="Back to home" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Locator</span>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Find a station near you</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Filter by city, state, charger type or availability.</p>


      <div className="mt-8 grid gap-6 lg:grid-cols-[400px_1fr]">
        <div className="glass space-y-4 rounded-2xl p-5">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or city" className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="City" value={city} onChange={setCity} options={cities} />
            <SelectField label="State" value={state} onChange={setState} options={states} />
          </div>
          <SelectField label="Charger Type" value={type} onChange={(v) => setType(v as ChargerType | "All")} options={types as readonly string[]} />
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm">
            <span>Available only</span>
            <input type="checkbox" checked={onlyAvail} onChange={(e) => setOnlyAvail(e.target.checked)} className="accent-primary" />
          </label>

          <div className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto pr-1">
            {list.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${selected === s.id ? "border-primary bg-primary/10 shadow-glow scale-[1.01]" : "border-white/10 bg-white/5 hover:border-white/20"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />{s.address}, {s.city}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">{s.speedKw}kW</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span><span className="text-primary">{s.available}</span>/{s.chargers} chargers</span>
                  <span>₹{s.pricePerKwh}/kWh</span>
                </div>
              </button>
            ))}
            {list.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No matches.</p>}
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-2xl">
          <GoogleMap stations={list} selectedId={selected} onSelect={setSelected} />

          {selected && (() => {
            const s = stations.find((x) => x.id === selected)!;
            return (
              <div className="glass-strong absolute bottom-4 left-4 right-4 rounded-2xl p-4 animate-scale-in">
                <div className="flex items-center gap-3">
                  <StationThumb src={s.image} alt={s.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold">{s.name}</h3>
                    <p className="truncate text-xs text-muted-foreground">{s.address}, {s.city} · {s.distanceKm < 1000 ? `${s.distanceKm.toFixed(1)} km` : "long distance"}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm" className="border-white/15 hover:bg-white/10"><Link to="/stations/$id" params={{ id: s.id }}>Details</Link></Button>
                    <Button asChild size="sm" className="shadow-glow"><Link to="/book" search={{ stationId: s.id } as never}><Navigation className="h-3 w-3" />Book</Link></Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary">
        {options.map((o) => <option key={o} value={o} className="bg-background">{o}</option>)}
      </select>
    </label>
  );
}