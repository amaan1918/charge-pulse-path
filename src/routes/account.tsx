import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Battery, Bell, Calendar, Heart, History, LogOut, MapPin, QrCode, Route as RouteIcon, User as UserIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { stations } from "@/lib/stations";
import { StationThumb } from "@/components/StationImage";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — EVChargeHub" }] }),
  component: AccountPage,
});

interface Profile { full_name: string | null; email: string | null; mobile: string | null; }

function AccountPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string | null; read: boolean; created_at: string }[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,email,mobile").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data));
    supabase.from("favorites").select("station_id").eq("user_id", user.id)
      .then(({ data }) => setFavoriteIds((data ?? []).map((r) => r.station_id)));
    supabase.from("notifications").select("id,title,body,read,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10)
      .then(({ data }) => setNotifications(data ?? []));
  }, [user?.id]);

  if (loading || !user) {
    return <div className="mx-auto max-w-5xl px-6 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  const favoriteStations = stations.filter((s) => favoriteIds.includes(s.id));
  const mockBookings = [
    { id: "b1", stationId: "EV001", date: "Today · 4:00 PM", duration: "45 min", code: "EVX-9F7K2" },
    { id: "b2", stationId: "EV007", date: "Sat · 9:30 AM", duration: "30 min", code: "EVX-2H8M1" },
  ];
  const mockHistory = [
    { id: "h1", stationId: "EV006", date: "2 days ago", kWh: 48, cost: 1056 },
    { id: "h2", stationId: "EV004", date: "5 days ago", kWh: 32, cost: 512 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold sm:text-3xl">👋 {profile?.full_name || user.email?.split("@")[0]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{profile?.email || user.email} {profile?.mobile ? `· ${profile.mobile}` : ""}</p>
          </div>
          <Button variant="outline" size="sm" onClick={async () => {
            await signOut();
            toast.success("Signed out");
            navigate({ to: "/" });
          }}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Bookings" value={mockBookings.length} />
        <StatCard icon={History} label="Sessions" value={mockHistory.length} />
        <StatCard icon={Heart} label="Favorites" value={favoriteStations.length} />
        <StatCard icon={Bell} label="Notifications" value={notifications.filter((n) => !n.read).length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Section icon={UserIcon} title="My Profile" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <Row label="Name" value={profile?.full_name || "—"} />
            <Row label="Email" value={profile?.email || user.email || "—"} />
            <Row label="Mobile" value={profile?.mobile || "—"} />
          </dl>
        </Section>

        <Section icon={Calendar} title="My Bookings" className="lg:col-span-2">
          <ul className="space-y-3">
            {mockBookings.map((b) => {
              const st = stations.find((s) => s.id === b.stationId);
              return (
                <li key={b.id} className="flex items-center gap-3 rounded-xl border border-white/5 p-3">
                  {st && <StationThumb src={st.image} alt={st.name} size="h-12 w-12 shrink-0 rounded-lg" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{st?.name}</p>
                    <p className="text-xs text-muted-foreground">{b.date} · {b.duration} · {b.code}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section icon={History} title="Charging History" className="lg:col-span-2">
          <ul className="space-y-3">
            {mockHistory.map((h) => {
              const st = stations.find((s) => s.id === h.stationId);
              return (
                <li key={h.id} className="flex items-center gap-3 rounded-xl border border-white/5 p-3">
                  {st && <StationThumb src={st.image} alt={st.name} size="h-12 w-12 shrink-0 rounded-lg" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{st?.name}</p>
                    <p className="text-xs text-muted-foreground">{h.date} · {h.kWh} kWh</p>
                  </div>
                  <span className="font-semibold text-primary">₹{h.cost}</span>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section icon={Heart} title="Favorite Stations" className="lg:col-span-1">
          {favoriteStations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No favorites yet. Tap ♥ on any station.</p>
          ) : (
            <ul className="space-y-2">
              {favoriteStations.map((s) => (
                <li key={s.id} className="flex items-center gap-3 rounded-xl border border-white/5 p-2">
                  <StationThumb src={s.image} alt={s.name} size="h-10 w-10 rounded-lg" />
                  <span className="truncate text-sm">{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section icon={RouteIcon} title="Saved Trips" className="lg:col-span-2">
          <p className="text-sm text-muted-foreground">No saved trips yet. <Link to="/trip-planner" className="text-primary hover:underline">Plan one →</Link></p>
        </Section>

        <Section icon={QrCode} title="QR Charging History" className="lg:col-span-1">
          <p className="text-sm text-muted-foreground">No QR sessions yet. <Link to="/scan" className="text-primary hover:underline">Scan to start →</Link></p>
        </Section>

        <Section icon={Bell} title="Notifications" className="lg:col-span-2">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications.</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className={`rounded-xl border p-3 ${n.read ? "border-white/5" : "border-primary/30 bg-primary/5"}`}>
                  <p className="font-medium">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: typeof Battery; label: string; value: number }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, className = "" }: { icon: typeof Battery; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`glass rounded-2xl p-5 ${className}`}>
      <header className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}