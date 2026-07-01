import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Activity, BarChart3, Battery, Bell, Calendar, Car, IndianRupee, LogOut, MapPin, MessageSquare, Plug, Settings, Shield, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { stations } from "@/lib/stations";
import { signOut } from "@/hooks/use-auth";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";
import { verifyAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — EVChargeHub" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    try {
      await verifyAdmin();
    } catch {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminDashboard,
});

const dailyBookings = [
  { d: "Mon", v: 124 }, { d: "Tue", v: 168 }, { d: "Wed", v: 142 }, { d: "Thu", v: 201 },
  { d: "Fri", v: 256 }, { d: "Sat", v: 312 }, { d: "Sun", v: 278 },
];
const monthlyRevenue = [
  { m: "Jan", v: 412000 }, { m: "Feb", v: 458000 }, { m: "Mar", v: 503000 }, { m: "Apr", v: 549000 },
  { m: "May", v: 612000 }, { m: "Jun", v: 698000 },
];
const userGrowth = [
  { m: "Jan", v: 1240 }, { m: "Feb", v: 1820 }, { m: "Mar", v: 2410 }, { m: "Apr", v: 3120 },
  { m: "May", v: 4080 }, { m: "Jun", v: 5240 },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return navigate({ to: "/admin" });
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
      if (!role) {
        toast.error("Admin access required");
        return navigate({ to: "/admin" });
      }
      setChecked(true);
      const { count } = await supabase.from("profiles").select("id", { count: "exact", head: true });
      setUserCount(count ?? 0);
    })();
  }, [navigate]);

  if (!checked) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-muted-foreground">Verifying admin access…</div>;

  const totalChargers = stations.reduce((a, s) => a + s.chargers, 0);
  const available = stations.reduce((a, s) => a + s.available, 0);
  const popular = [...stations].sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-primary"><Shield className="h-5 w-5" /></span>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">EVChargeHub control center</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate({ to: "/admin" }); }}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat icon={Users} label="Total Users" value={userCount ?? "—"} accent="text-primary" />
        <Stat icon={MapPin} label="Stations" value={stations.length} />
        <Stat icon={Activity} label="Active Sessions" value={47} accent="text-emerald-400" />
        <Stat icon={Calendar} label="Bookings" value={1842} />
        <Stat icon={IndianRupee} label="Revenue" value="₹6.98L" accent="text-primary" />
        <Stat icon={Plug} label="Available" value={`${available}/${totalChargers}`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel icon={BarChart3} title="Daily Bookings">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyBookings}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="d" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0b0f14", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Bar dataKey="v" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel icon={IndianRupee} title="Monthly Revenue (₹)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="m" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0b0f14", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel icon={Users} title="User Growth">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowth}>
              <CartesianGrid stroke="#ffffff10" />
              <XAxis dataKey="m" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ background: "#0b0f14", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="v" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel icon={Star} title="Popular Charging Stations">
          <ul className="space-y-2">
            {popular.map((s, i) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-white/5 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.city} · {s.type}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold">★ {s.rating}</p>
                  <p className="text-muted-foreground">{s.reviews} reviews</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Management</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ModuleCard icon={Users} label="Manage Users" />
        <ModuleCard icon={MapPin} label="Charging Stations" />
        <ModuleCard icon={Calendar} label="Bookings" />
        <ModuleCard icon={Bell} label="Notifications" />
        <ModuleCard icon={Zap} label="Offers" />
        <ModuleCard icon={MessageSquare} label="Reviews & Ratings" />
        <ModuleCard icon={Car} label="EV Models" />
        <ModuleCard icon={Settings} label="Cities & States" />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent = "text-foreground" }: { icon: typeof Battery; label: string; value: number | string; accent?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-lg bg-primary/15 ${accent}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: typeof Battery; title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <header className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </header>
      {children}
    </section>
  );
}

function ModuleCard({ icon: Icon, label }: { icon: typeof Battery; label: string }) {
  return (
    <button
      type="button"
      onClick={() => toast("Coming soon", { description: `${label} module` })}
      className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition-transform hover:scale-[1.02]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-5 w-5" /></span>
      <span className="font-medium">{label}</span>
    </button>
  );
}