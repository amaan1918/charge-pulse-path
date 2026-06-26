import { createFileRoute, Link } from "@tanstack/react-router";
import { Battery, Calendar, Heart, History, Zap, TrendingUp, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { stations } from "@/lib/stations";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EVChargeHub" },
      { name: "description", content: "Your bookings, favorite stations, charging history and battery insights." },
      { property: "og:title", content: "EV Dashboard — EVChargeHub" },
      { property: "og:description", content: "Bookings, favorites, history and insights." },
    ],
  }),
  component: Dashboard,
});

const usage = [
  { day: "Mon", kWh: 32 }, { day: "Tue", kWh: 18 }, { day: "Wed", kWh: 45 },
  { day: "Thu", kWh: 28 }, { day: "Fri", kWh: 60 }, { day: "Sat", kWh: 22 }, { day: "Sun", kWh: 38 },
];

const bookings = [
  { id: "b1", stationId: "EV001", date: "Today · 4:00 PM", duration: "45 min", code: "EVX-9F7K2" },
  { id: "b2", stationId: "EV007", date: "Sat · 9:30 AM", duration: "30 min", code: "EVX-2H8M1" },
];
const history = [
  { id: "h1", stationId: "EV006", date: "2 days ago", kWh: 48, cost: 1056 },
  { id: "h2", stationId: "EV004", date: "5 days ago", kWh: 32, cost: 512 },
  { id: "h3", stationId: "EV010", date: "Last week", kWh: 60, cost: 1080 },
];
const favorites = ["EV001", "EV006", "EV010"];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <BackButton />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</span>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Welcome back, Alex</h1>
          <p className="mt-1 text-muted-foreground">Here's a snapshot of your charging activity.</p>
        </div>
        <Button asChild className="shadow-glow"><Link to="/book"><Zap /> New booking</Link></Button>
      </div>



      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={<Battery />} label="Battery health" value="98%" trend="+1.2%" />
        <KPI icon={<Zap />} label="This week" value="243 kWh" trend="+18%" />
        <KPI icon={<TrendingUp />} label="CO₂ saved" value="412 kg" trend="this month" />
        <KPI icon={<Calendar />} label="Sessions" value="27" trend="last 30 days" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Energy used</h3>
              <p className="text-xs text-muted-foreground">Past 7 days</p>
            </div>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">243 kWh total</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usage}>
                <defs>
                  <linearGradient id="a" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.22 145)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.82 0.22 145)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                <Area type="monotone" dataKey="kWh" stroke="oklch(0.82 0.22 145)" strokeWidth={2} fill="url(#a)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming</h3>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {bookings.map((b) => {
              const s = stations.find((x) => x.id === b.stationId)!;
              return (
                <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{s.name}</div>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">{b.code}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.date} · {b.duration}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{s.city}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Favorite stations</h3>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {favorites.map((id) => {
              const s = stations.find((x) => x.id === id)!;
              return (
                <Link to="/stations/$id" params={{ id: s.id }} key={id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-primary/30">
                  <img src={s.image} className="h-12 w-12 rounded-lg object-cover" alt="" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{s.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.city}, {s.state} · {s.type}</div>
                  </div>
                  <span className="text-xs text-primary">★ {s.rating}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Charging history</h3>
            <History className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 space-y-3">
            {history.map((h) => {
              const s = stations.find((x) => x.id === h.stationId)!;
              return (
                <div key={h.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{h.date} · {h.kWh} kWh</div>
                  </div>
                  <span className="font-semibold text-primary">₹{h.cost.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">{icon}</span>
        <span className="text-xs text-muted-foreground">{trend}</span>
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}