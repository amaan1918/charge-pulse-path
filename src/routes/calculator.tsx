import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calculator, Zap, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";


export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Charging Cost Calculator — EVChargeHub" },
      { name: "description", content: "Estimate the cost, energy and time required to charge your EV." },
      { property: "og:title", content: "EV Charging Cost Calculator — EVChargeHub" },
      { property: "og:description", content: "Estimate the cost, energy and time required to charge your EV." },
    ],
  }),
  component: CostCalculator,
});

function CostCalculator() {
  const [capacity, setCapacity] = useState(75);
  const [from, setFrom] = useState(20);
  const [to, setTo] = useState(90);
  const [rate, setRate] = useState(0.34);
  const [chargerKw, setChargerKw] = useState(150);

  const result = useMemo(() => {
    const pct = Math.max(0, to - from);
    const units = (capacity * pct) / 100;
    const cost = units * rate;
    const hours = units / chargerKw;
    const minutes = Math.round(hours * 60);
    return { units, cost, minutes };
  }, [capacity, from, to, rate, chargerKw]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Calculator</span>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Charging cost calculator</h1>
      <p className="mt-2 text-muted-foreground">Plug in your numbers — we'll do the math.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="glass space-y-6 rounded-3xl p-6">
          <Slider label="Battery capacity" value={capacity} onChange={setCapacity} min={20} max={150} unit="kWh" />
          <Slider label="Current battery" value={from} onChange={setFrom} min={0} max={100} unit="%" />
          <Slider label="Target battery" value={to} onChange={setTo} min={0} max={100} unit="%" />
          <Slider label="Charger speed" value={chargerKw} onChange={setChargerKw} min={7} max={350} unit="kW" />
          <div>
            <label className="text-xs text-muted-foreground">Electricity rate ($/kWh)</label>
            <input type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <aside className="glass-strong h-fit rounded-3xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimated result</h3>
          <div className="mt-4 space-y-4">
            <Result icon={<Zap />} label="Units required" value={`${result.units.toFixed(2)} kWh`} />
            <Result icon={<DollarSign />} label="Charging cost" value={`$${result.cost.toFixed(2)}`} highlight />
            <Result icon={<Clock />} label="Charging time" value={result.minutes < 60 ? `${result.minutes} min` : `${(result.minutes/60).toFixed(1)} h`} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Charge added</div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${Math.min(100, (to - from))}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{from}%</span><span>{to}%</span></div>
          </div>

          <Button className="mt-6 w-full shadow-glow"><Calculator /> Save estimate</Button>
        </aside>
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
function Result({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`text-lg font-bold ${highlight ? "gradient-text" : ""}`}>{value}</span>
    </div>
  );
}