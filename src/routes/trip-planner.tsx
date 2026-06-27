import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Route as RouteIcon,
  Zap,
  IndianRupee,
  Clock,
  Battery,
  Navigation,
  Share2,
  Download,
  Star,
  AlertTriangle,
  CloudSun,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackButton } from "@/components/BackButton";
import {
  EV_MODELS,
  SAMPLE_CITIES,
  planTrip,
  type RouteMode,
  type TripPlan,
} from "@/lib/trip-planner";
import { usePopup } from "@/components/popups/PopupProvider";
import type { WeatherData } from "@/components/popups/WeatherAlertPopup";

export const Route = createFileRoute("/trip-planner")({
  head: () => ({
    meta: [
      { title: "EV Road Trip Planner — EVChargeHub" },
      { name: "description", content: "Plan smarter EV road trips with intelligent charging stop recommendations, smart battery planning, and live station data." },
    ],
  }),
  component: TripPlannerPage,
});

const SAVED_KEY = "evhub_trips";

function TripPlannerPage() {
  const cities = Object.keys(SAMPLE_CITIES);
  const { showWeatherAlert } = usePopup();
  const [start, setStart] = useState("Ahmedabad, Gujarat");
  const [end, setEnd] = useState("Mumbai, Maharashtra");
  const [modelName, setModelName] = useState(EV_MODELS[0].name);
  const [batteryPct, setBatteryPct] = useState(80);
  const [batteryKwh, setBatteryKwh] = useState(EV_MODELS[0].defaultBatteryKwh);
  const [mode, setMode] = useState<RouteMode>("fastest");
  const [plan, setPlan] = useState<TripPlan | null>(null);

  const model = useMemo(() => EV_MODELS.find((m) => m.name === modelName)!, [modelName]);

  const onModelChange = (n: string) => {
    setModelName(n);
    const m = EV_MODELS.find((x) => x.name === n);
    if (m) setBatteryKwh(m.defaultBatteryKwh);
  };

  const compute = () => {
    const s = SAMPLE_CITIES[start];
    const e = SAMPLE_CITIES[end];
    if (!s || !e) {
      alert("Please pick valid Indian cities from the suggestions.");
      return;
    }
    const p = planTrip({
      startLabel: start,
      endLabel: end,
      startLat: s.lat,
      startLng: s.lng,
      endLat: e.lat,
      endLng: e.lng,
      model,
      batteryPct,
      batteryKwh,
      mode,
    });
    setPlan(p);
    // Simulated weather check based on destination — alert when conditions affect EV range
    const w = sampleWeather(end);
    if (w.condition !== "normal") showWeatherAlert(w);
  };

  const saveTrip = () => {
    if (!plan) return;
    try {
      const list = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      list.push({ savedAt: Date.now(), start, end, model: modelName, mode });
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
      alert("Trip saved to your history.");
    } catch {}
  };

  const shareTrip = async () => {
    if (!plan) return;
    const text = `EV Road Trip: ${start} → ${end} · ${plan.totalDistanceKm.toFixed(0)} km · ${plan.stops.length} stops · ETA ${formatMin(plan.etaMin)}`;
    try {
      if (navigator.share) await navigator.share({ title: "EV Road Trip", text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Trip summary copied to clipboard.");
      }
    } catch {}
  };

  const downloadTrip = () => {
    if (!plan) return;
    const lines = [
      `EVChargeHub Road Trip Summary`,
      `${start}  →  ${end}`,
      `Vehicle: ${modelName} (${batteryKwh} kWh)`,
      `Mode: ${mode}`,
      ``,
      `Total distance:    ${plan.totalDistanceKm.toFixed(0)} km`,
      `Driving time:      ${formatMin(plan.drivingTimeMin)}`,
      `Charging stops:    ${plan.stops.length}`,
      `Charging time:     ${formatMin(plan.totalChargingMin)}`,
      `Estimated cost:    ₹${plan.totalCost.toFixed(2)}`,
      `Energy needed:     ${plan.totalEnergyKwh.toFixed(1)} kWh`,
      `ETA:               ${formatMin(plan.etaMin)}`,
      ``,
      `Stops:`,
      ...plan.stops.map(
        (s, i) =>
          `  ${i + 1}. ${s.station.name} (${s.station.id})` +
          `\n     Distance: ${s.distanceFromStartKm.toFixed(0)} km · Arrive @ ${s.arrivalBatteryPct.toFixed(0)}%` +
          `\n     Charge to ${s.chargeToPct}% · +${s.energyAddedKwh.toFixed(1)} kWh · ${s.chargingDurationMin} min · ₹${s.cost.toFixed(2)}`
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ev-trip-${start.split(",")[0]}-to-${end.split(",")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BackButton to="/" label="Back home" />

      {/* HERO */}
      <section className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <RouteIcon className="h-3 w-3" /> EV Road Trip Planner
        </span>
        <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">
          <span className="gradient-text">Plan Smarter.</span>{" "}
          <span className="text-primary text-glow">Drive Further.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Discover the most efficient EV route with intelligent charging stop recommendations,
          real-time station availability, and smart battery planning.
        </p>
      </section>

      {/* FORM */}
      <section className="glass-strong mt-10 rounded-3xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label="From (start)">
            <Input
              list="in-cities"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="Ahmedabad, Gujarat"
            />
          </Field>
          <Field label="To (destination)">
            <Input
              list="in-cities"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="Mumbai, Maharashtra"
            />
          </Field>
          <datalist id="in-cities">
            {cities.map((c) => <option key={c} value={c} />)}
          </datalist>
          <Field label="EV Model">
            <select
              value={modelName}
              onChange={(e) => onModelChange(e.target.value)}
              className="h-10 w-full rounded-md border border-white/10 bg-background px-3 text-sm"
            >
              {EV_MODELS.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Battery %">
            <Input
              type="number"
              min={1}
              max={100}
              value={batteryPct}
              onChange={(e) => setBatteryPct(Math.max(1, Math.min(100, Number(e.target.value) || 0)))}
            />
          </Field>
          <Field label="Capacity (kWh)">
            <Input
              type="number"
              min={20}
              max={250}
              value={batteryKwh}
              onChange={(e) => setBatteryKwh(Math.max(20, Number(e.target.value) || 0))}
            />
          </Field>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(["fastest", "cheapest", "least-crowded", "efficient"] as RouteMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  mode === m ? "bg-primary text-primary-foreground shadow-glow" : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {m.replace("-", " ")}
              </button>
            ))}
          </div>
          <Button size="lg" className="shadow-glow" onClick={compute}>
            <RouteIcon className="h-4 w-4" /> Start Planning Your EV Journey
          </Button>
        </div>
      </section>

      {/* RESULTS */}
      {plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 space-y-6"
        >
          {plan.emergency && (
            <div className="flex items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Emergency mode — battery critically low</p>
                <p className="text-xs">Head to the nearest charging station before continuing.</p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard icon={Navigation} label="Total distance" value={`${plan.totalDistanceKm.toFixed(0)} km`} />
            <SummaryCard icon={IndianRupee} label="Total cost" value={`₹${plan.totalCost.toFixed(0)}`} />
            <SummaryCard icon={Zap} label="Energy" value={`${plan.totalEnergyKwh.toFixed(1)} kWh`} />
            <SummaryCard icon={Battery} label="Charging stops" value={String(plan.stops.length)} />
            <SummaryCard icon={Clock} label="ETA" value={formatMin(plan.etaMin)} accent />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="glass rounded-3xl p-6">
                <h2 className="text-xl font-semibold">Charging stops</h2>
                {plan.stops.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No stops needed — you can make it in one charge.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {plan.stops.map((s, i) => (
                      <StopRow key={s.station.id + i} index={i + 1} stop={s} />
                    ))}
                  </div>
                )}
              </div>

              <div className="glass rounded-3xl p-6">
                <h2 className="text-xl font-semibold">Battery prediction</h2>
                <div className="mt-3 space-y-2">
                  {plan.legs.map((leg, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{leg.fromLabel} → {leg.toLabel}</span>
                        <span className="text-muted-foreground">{leg.distanceKm.toFixed(0)} km</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60"
                          style={{ width: `${Math.max(0, leg.endBatteryPct)}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>Start {leg.startBatteryPct.toFixed(0)}%</span>
                        <span>Arrive {leg.endBatteryPct.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="glass-strong rounded-3xl p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Route map</h3>
                <div className="mt-3 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <RouteMapSVG plan={plan} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px]">
                  <Legend dot="bg-primary" label="Available" />
                  <Legend dot="bg-yellow-400" label="Limited" />
                  <Legend dot="bg-destructive" label="Busy" />
                </div>
              </div>

              <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CloudSun className="h-4 w-4 text-primary" /> Weather impact
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{plan.weather.condition}</p>
                <p className="mt-1 text-xs">
                  Estimated range impact:{" "}
                  <span className={plan.weather.rangeImpactPct < 0 ? "text-yellow-400" : "text-primary"}>
                    {plan.weather.rangeImpactPct}%
                  </span>
                </p>
              </div>

              <div className="glass rounded-3xl p-6">
                <h3 className="text-sm font-semibold">Trip actions</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button onClick={saveTrip} variant="outline" className="border-white/15"><Star className="h-3 w-3" /> Save</Button>
                  <Button onClick={shareTrip} variant="outline" className="border-white/15"><Share2 className="h-3 w-3" /> Share</Button>
                  <Button onClick={downloadTrip} variant="outline" className="border-white/15 col-span-2"><Download className="h-3 w-3" /> Download summary</Button>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }: { icon: typeof Zap; label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" /> {label}
      </div>
      <div className={`mt-2 text-2xl font-black ${accent ? "gradient-text" : ""}`}>{value}</div>
    </div>
  );
}

function StopRow({ index, stop }: { index: number; stop: import("@/lib/trip-planner").TripStop }) {
  const dot =
    stop.availabilityLevel === "green" ? "bg-primary"
    : stop.availabilityLevel === "yellow" ? "bg-yellow-400"
    : "bg-destructive";

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary/20 text-xs font-bold text-primary">{index}</div>
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className={`h-2 w-2 rounded-full ${dot}`} /> {stop.station.name}
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {stop.station.address}, {stop.station.city}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{stop.distanceFromStartKm.toFixed(0)} km from start</div>
          <div className="text-primary">Arrive @ {stop.arrivalBatteryPct.toFixed(0)}%</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
        <Mini label="Charger" value={stop.station.type} />
        <Mini label="Speed" value={`${stop.station.speedKw} kW`} />
        <Mini label="Price" value={`₹${stop.station.pricePerKwh}/kWh`} />
        <Mini label="Duration" value={`${stop.chargingDurationMin} min`} />
        <Mini label="Available" value={`${stop.station.available}/${stop.station.chargers}`} />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-semibold">{value}</div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
    </span>
  );
}

function RouteMapSVG({ plan }: { plan: TripPlan }) {
  const pts = [
    { lat: plan.input.startLat, lng: plan.input.startLng, kind: "start" as const },
    ...plan.stops.map((s) => ({ lat: s.station.lat, lng: s.station.lng, kind: s.availabilityLevel })),
    { lat: plan.input.endLat, lng: plan.input.endLng, kind: "end" as const },
  ];
  const lats = pts.map((p) => p.lat);
  const lngs = pts.map((p) => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const w = 300, h = 300, pad = 24;
  const project = (lat: number, lng: number) => {
    const x = pad + ((lng - minLng) / Math.max(0.0001, maxLng - minLng)) * (w - 2 * pad);
    const y = h - pad - ((lat - minLat) / Math.max(0.0001, maxLat - minLat)) * (h - 2 * pad);
    return { x, y };
  };
  const colorFor = (kind: string) =>
    kind === "start" ? "#fff"
    : kind === "end" ? "#fff"
    : kind === "green" ? "hsl(var(--primary))"
    : kind === "yellow" ? "#facc15"
    : "hsl(var(--destructive))";

  const start = project(plan.input.startLat, plan.input.startLng);
  const end = project(plan.input.endLat, plan.input.endLng);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
      <defs>
        <linearGradient id="route" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill="#000" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={0} x2={w} y1={(i * h) / 8} y2={(i * h) / 8} stroke="#ffffff10" />
      ))}
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="url(#route)" strokeWidth={3} strokeDasharray="6 4" />
      {pts.map((p, i) => {
        const { x, y } = project(p.lat, p.lng);
        return <circle key={i} cx={x} cy={y} r={p.kind === "start" || p.kind === "end" ? 6 : 5} fill={colorFor(p.kind)} stroke="#000" strokeWidth={2} />;
      })}
    </svg>
  );
}

function formatMin(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}