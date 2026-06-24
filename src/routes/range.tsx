import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gauge, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/range")({
  head: () => ({
    meta: [
      { title: "EV Range Calculator — EVChargeHub" },
      { name: "description", content: "Estimate how far you can drive on your current battery." },
      { property: "og:title", content: "EV Range Calculator — EVChargeHub" },
      { property: "og:description", content: "Estimate how far you can drive on your current battery." },
    ],
  }),
  component: RangePage,
});

function RangePage() {
  const [battery, setBattery] = useState(72);
  const [capacity, setCapacity] = useState(75);
  const [efficiency, setEfficiency] = useState(6.2);

  const data = useMemo(() => {
    const usable = (capacity * battery) / 100;
    const range = usable * efficiency;
    const points = Array.from({ length: 11 }).map((_, i) => {
      const pct = i * 10;
      const dist = (capacity * pct / 100) * efficiency;
      return { pct: `${pct}%`, km: Math.round(dist) };
    });
    return { usable, range, points };
  }, [battery, capacity, efficiency]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <BackButton />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Range</span>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">How far can you go?</h1>
      <p className="mt-2 text-muted-foreground">Estimate your remaining range and travel distance.</p>



      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass space-y-6 rounded-3xl p-6">
          <Slider label="Battery level" value={battery} onChange={setBattery} min={0} max={100} unit="%" />
          <Slider label="Battery capacity" value={capacity} onChange={setCapacity} min={20} max={150} unit="kWh" />
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Efficiency</label>
              <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">{efficiency.toFixed(1)} km/kWh</span>
            </div>
            <input type="range" min={3} max={10} step={0.1} value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Usable energy</div>
              <div className="mt-1 text-2xl font-bold">{data.usable.toFixed(1)} <span className="text-sm text-muted-foreground">kWh</span></div>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <div className="text-xs uppercase tracking-wider text-primary">Estimated range</div>
              <div className="mt-1 text-2xl font-bold text-primary">{Math.round(data.range)} <span className="text-sm">km</span></div>
            </div>
          </div>

          <Button className="w-full shadow-glow"><Navigation /> Find stations along route</Button>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Range vs battery</h3>
          </div>
          <p className="text-xs text-muted-foreground">Projected distance at {efficiency.toFixed(1)} km/kWh</p>

          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.points}>
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.22 145)" />
                    <stop offset="100%" stopColor="oklch(0.6 0.18 150)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="pct" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                <Line type="monotone" dataKey="km" stroke="url(#g)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.82 0.22 145)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Reachable cities</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              {[{ c: "Local", d: 50 }, { c: "Regional", d: 200 }, { c: "Long-haul", d: 400 }].map((x) => {
                const ok = data.range >= x.d;
                return (
                  <div key={x.c} className={`rounded-lg p-2 ${ok ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                    <div className="font-semibold">{x.c}</div>
                    <div>{x.d}+ km</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, unit }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; unit: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">{value} {unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-primary" />
    </div>
  );
}