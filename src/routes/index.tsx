import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Zap, MapPin, Calendar, Calculator, Leaf, Smartphone, Search, ArrowRight, Star, Sparkles, Gauge, BatteryCharging, ScanLine, Route as RouteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StationCard } from "@/components/StationCard";
import { stations } from "@/lib/stations";
import heroImg from "@/assets/hero-ev.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EVChargeHub — Charge Smarter. Drive Further." },
      { name: "description", content: "Find and reserve EV charging stations in seconds. Real-time availability, fast charging, cost & range calculators." },
      { property: "og:title", content: "EVChargeHub — Charge Smarter. Drive Further." },
      { property: "og:description", content: "Find and reserve EV charging stations in seconds." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Gauge, title: "Real-Time Availability", desc: "Live charger status across 500+ stations." },
  { icon: BatteryCharging, title: "Ultra-Fast Charging", desc: "350 kW DC fast chargers — 80% in 18 min." },
  { icon: Calendar, title: "Reserve in Seconds", desc: "Book your slot ahead of time, skip the wait." },
  { icon: Calculator, title: "Cost Estimation", desc: "Know exactly what your charge will cost." },
  { icon: MapPin, title: "Smart Route Planning", desc: "AI suggests the best stations along your trip." },
  { icon: Smartphone, title: "Mobile-First", desc: "Built to work beautifully on any device." },
];

const stats = [
  { value: "500+", label: "Charging Stations" },
  { value: "10,000+", label: "Registered Drivers" },
  { value: "50,000+", label: "Sessions Completed" },
  { value: "99.9%", label: "Network Uptime" },
];

const testimonials = [
  { name: "Alex Chen", role: "Tesla Model 3 owner", rating: 5, text: "EVChargeHub turned road trips from anxiety into adventure. Bookings work flawlessly." },
  { name: "Maria González", role: "Polestar 2 driver", rating: 5, text: "The cost calculator alone saved me hundreds. Beautiful, fast, no nonsense." },
  { name: "Ravi Patel", role: "Rivian R1T owner", rating: 5, text: "Real-time availability is a game changer. I never pull up to a full station anymore." },
];

function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="EV charging" width={1920} height={1080} className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 sm:pt-28 lg:pt-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> New: AI-powered station recommendations
            </span>
            <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="gradient-text">Charge Smarter.</span>
              <br />
              <span className="text-glow text-primary">Drive Further.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
              Power your journey with smart EV charging. Find and reserve charging stations in seconds — real-time availability, transparent pricing, zero surprises.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-glow">
                <Link to="/scan"><ScanLine /> ⚡ Scan & Charge</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/5 px-6 text-base backdrop-blur hover:bg-white/10">
                <Link to="/locator"><MapPin /> Find Station</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/5 px-6 text-base backdrop-blur hover:bg-white/10">
                <Link to="/trip-planner"><RouteIcon /> Plan Trip</Link>
              </Button>
            </div>

            {/* Quick search */}
            <div className="glass mt-10 flex items-center gap-2 rounded-2xl p-2 sm:max-w-xl">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search by city, zip, or station name"
                  className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button asChild className="shadow-glow">
                <Link to="/stations">Search</Link>
              </Button>
            </div>
          </div>

          {/* Floating status card */}
          <div className="glass-strong absolute right-6 top-32 hidden w-72 rounded-2xl p-5 lg:block">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Nearby station</span>
              <span className="flex items-center gap-1 text-xs text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live</span>
            </div>
            <h3 className="mt-2 text-lg font-semibold">Pulse Hub — Downtown</h3>
            <p className="text-xs text-muted-foreground">120 Market St · 1.2 km away</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-white/5 p-2"><div className="text-muted-foreground">Available</div><div className="mt-1 font-semibold text-primary">7 / 12</div></div>
              <div className="rounded-lg bg-white/5 p-2"><div className="text-muted-foreground">Speed</div><div className="mt-1 font-semibold">250 kW</div></div>
            </div>
            <Button asChild size="sm" className="mt-4 w-full shadow-glow">
              <Link to="/stations/$id" params={{ id: "EV001" }}>Reserve now <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative mx-auto -mt-16 max-w-7xl px-6">
        <div className="glass-strong grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="gradient-text text-4xl font-black sm:text-5xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why EVChargeHub</span>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Everything you need to power your drive</h2>
          <p className="mt-4 text-muted-foreground">From discovery to reservation to payment — one seamless experience.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED STATIONS */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Trending stations</span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Popular near you</h2>
          </div>
          <Button asChild variant="ghost" className="hover:bg-white/5">
            <Link to="/stations">View all <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stations.slice(0, 3).map((s) => <StationCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Drivers love it</span>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">Trusted by thousands of EV drivers</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary" />)}
              </div>
              <blockquote className="mt-4 text-foreground/90">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-primary text-sm font-semibold text-primary-foreground">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-32 max-w-7xl px-6">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-4xl font-black sm:text-5xl">
                Start your <span className="text-primary">eco-friendly</span> journey today.
              </h2>
              <p className="mt-4 text-muted-foreground">Join 10,000+ drivers powering their cars with the smartest charging network.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" className="h-12 px-8 shadow-glow">
                <Link to="/stations"><Zap /> Get started — it's free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-white/5 backdrop-blur hover:bg-white/10">
                <Link to="/dashboard"><Leaf /> View dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
