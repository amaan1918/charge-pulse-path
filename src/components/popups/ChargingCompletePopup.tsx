import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";

export interface ChargingSession {
  energyKwh: number;
  durationMin: number;
  totalCost: number;
  batteryLevel: number;
  co2SavedKg: number;
  stationName?: string;
}

export function ChargingCompletePopup({
  open,
  onClose,
  session,
}: {
  open: boolean;
  onClose: () => void;
  session: ChargingSession | null;
}) {
  const download = () => {
    if (!session) return;
    const text =
`EVChargeHub Charging Receipt
================================
Station: ${session.stationName ?? "—"}
Energy delivered: ${session.energyKwh.toFixed(2)} kWh
Charging time: ${session.durationMin} min
Battery level: ${session.batteryLevel}%
Total cost: ₹${session.totalCost.toFixed(2)}
CO2 saved: ${session.co2SavedKg.toFixed(2)} kg

Thank you for choosing EVChargeHub.
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evchargehub-receipt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <div className="text-center">
        {/* Battery + glow check */}
        <div className="relative mx-auto h-24 w-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-16 w-32 rounded-xl border-2 border-primary/70 p-1 shadow-glow">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${session?.batteryLevel ?? 100}%` }}
                transition={{ duration: 1.6, ease: "easeOut" }}
                className="h-full rounded-md bg-gradient-to-r from-primary/80 to-primary"
              />
              <div className="absolute -right-2 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-r bg-primary/70" />
            </div>
          </div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 12 }}
            className="absolute right-2 top-0 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"
          >
            <Check className="h-5 w-5" />
          </motion.div>
        </div>

        <h2 className="mt-5 text-2xl font-black tracking-tight">
          <span aria-hidden>🎉</span> Charging Complete
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your EV has been charged successfully. Thank you for choosing EVChargeHub.
          Have a safe and eco-friendly journey!
        </p>

        {session && (
          <div className="mt-5 grid grid-cols-2 gap-3 text-left text-xs">
            <Field label="Energy" value={`${session.energyKwh.toFixed(1)} kWh`} accent />
            <Field label="Time" value={`${session.durationMin} min`} />
            <Field label="Cost" value={`₹${session.totalCost.toFixed(2)}`} />
            <Field label="Battery" value={`${session.batteryLevel}%`} accent />
            <Field label="CO₂ saved" value={`${session.co2SavedKg.toFixed(2)} kg`} />
            <Field label="Station" value={session.stationName ?? "—"} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={download} className="flex-1 shadow-glow" size="lg">
            <Download className="h-4 w-4" /> Download Receipt
          </Button>
          <Button asChild variant="outline" className="flex-1 border-white/20 bg-white/5 hover:bg-white/10" size="lg">
            <Link to="/stations" onClick={onClose}>
              <MapPin className="h-4 w-4" /> Find Another
            </Link>
          </Button>
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    </GlassDialog>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate font-semibold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}