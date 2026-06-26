import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Zap, Calendar, Clock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import { toast } from "sonner";
import { stations, findStation, type ChargerType } from "@/lib/stations";



type SearchParams = { stationId?: string };

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Slot — EVChargeHub" },
      { name: "description", content: "Reserve your EV charging slot in seconds. Pick a station, time, and charger type." },
      { property: "og:title", content: "Book a Charging Slot — EVChargeHub" },
      { property: "og:description", content: "Reserve your EV charging slot in seconds." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({ stationId: typeof s.stationId === "string" ? s.stationId : undefined }),
  component: BookPage,
});

const slots = [
  "07:00 AM","08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM",
];

function BookPage() {
  const { stationId } = Route.useSearch();
  const initial = stationId ? findStation(stationId) : undefined;
  const [station, setStation] = useState(initial?.id ?? stations[0].id);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [chargerType, setChargerType] = useState<ChargerType>(initial?.type ?? "DC Fast");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00 AM");
  const [confirmed, setConfirmed] = useState<null | { code: string }>(null);

  const current = findStation(station)!;

  const code = useMemo(() => `EVX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, [confirmed]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleName.trim() || !vehicleNumber.trim()) {
      toast.error("Add your vehicle name and number to continue.");
      return;
    }
    setConfirmed({ code });
    toast.success("Booking confirmed! QR code generated.");
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="glass-strong rounded-3xl p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Booking confirmed</h1>
          <p className="mt-2 text-muted-foreground">A confirmation has been emailed to you. Show this QR at the station.</p>

          <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
            <img alt="QR Code" width={180} height={180} src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`https://evchargehub.app/booking/${confirmed.code}`)}`} />
          </div>
          <div className="mt-3 font-mono text-sm text-primary">{confirmed.code}</div>

          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            <Detail label="Station" value={current.name} />
            <Detail label="Charger" value={chargerType} />
            <Detail label="Date" value={date} />
            <Detail label="Time" value={time} />
            <Detail label="Vehicle" value={vehicleName} />
            <Detail label="Plate" value={vehicleNumber} />
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button asChild variant="outline" className="border-white/15"><Link to="/dashboard">View dashboard</Link></Button>
            <Button asChild className="shadow-glow"><Link to="/stations">Book another</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <BackButton to="/stations" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Booking</span>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Reserve a charging slot</h1>
      <p className="mt-2 text-muted-foreground">Pick a station, date and time. Instant confirmation with QR.</p>



      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="glass space-y-5 rounded-3xl p-6">
          <Field label="Vehicle name" icon={<Car className="h-4 w-4 text-primary" />}>
            <input value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="Tata Nexon EV" className="input-base" />
          </Field>
          <Field label="Vehicle number">
            <input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="GJ 01 AB 1234" className="input-base" />
          </Field>
          <Field label="Station">
            <select value={station} onChange={(e) => setStation(e.target.value)} className="input-base">
              {stations.map((s) => <option key={s.id} value={s.id} className="bg-background">{s.name} — {s.city}</option>)}
            </select>
          </Field>
          <Field label="Charger type">
            <select value={chargerType} onChange={(e) => setChargerType(e.target.value as ChargerType)} className="input-base">
              {["Tesla Supercharger", "Ultra Fast", "DC Fast", "Level 2 AC"].map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
            </select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Date" icon={<Calendar className="h-4 w-4 text-primary" />}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
            </Field>
            <Field label="Time slot" icon={<Clock className="h-4 w-4 text-primary" />}>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="input-base">
                {slots.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <aside className="glass-strong h-fit rounded-3xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Summary</h3>
          <div className="mt-3 overflow-hidden rounded-2xl">
            <img src={current.image} alt={current.name} className="h-32 w-full object-cover" />
          </div>
          <h4 className="mt-3 text-lg font-semibold">{current.name}</h4>
          <p className="text-xs text-muted-foreground">{current.address}, {current.city}</p>
          <div className="mt-4 space-y-2 text-sm">
            <Row label="Date" value={date} />
            <Row label="Time" value={time} />
            <Row label="Type" value={chargerType} />
            <Row label="Rate" value={`₹${current.pricePerKwh}/kWh`} />
          </div>
          <Button type="submit" size="lg" className="mt-5 w-full shadow-glow"><Zap /> Confirm booking</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Free cancellation up to 1 hour before</p>
        </aside>
      </form>
      <style>{`.input-base { width: 100%; border-radius: .75rem; border: 1px solid color-mix(in oklab, white 10%, transparent); background: color-mix(in oklab, white 5%, transparent); padding: .65rem .85rem; font-size: .875rem; outline: none; transition: border-color .2s; }
      .input-base:focus { border-color: var(--ev-green); }`}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">{icon}{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}