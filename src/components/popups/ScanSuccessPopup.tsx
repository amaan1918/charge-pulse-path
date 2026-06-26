import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";
import type { Station } from "@/lib/stations";

export function ScanSuccessPopup({
  open,
  onClose,
  station,
}: {
  open: boolean;
  onClose: () => void;
  station: Station | null;
}) {
  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/20 shadow-glow"
        >
          <svg viewBox="0 0 52 52" className="h-12 w-12 text-primary">
            <motion.circle
              cx="26"
              cy="26"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M14 27 l9 9 l16-18"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
          </svg>
        </motion.div>
        <h2 className="mt-5 text-2xl font-black tracking-tight">
          <span aria-hidden>⚡</span> Station Connected Successfully
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You have successfully connected to the charging station. Review the station details below
          and start your charging session.
        </p>

        {station && (
          <div className="mt-5 grid grid-cols-2 gap-3 text-left text-xs">
            <Field label="Station" value={station.name} />
            <Field label="Station ID" value={station.id.toUpperCase()} />
            <Field label="Charger" value={station.type} />
            <Field label="Power" value={`${station.speedKw} kW`} />
            <Field label="Available" value={`${station.available}/${station.chargers}`} accent />
            <Field label="Price" value={`₹${station.pricePerKwh}/kWh`} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onClose} className="flex-1 shadow-glow" size="lg">
            <Zap className="h-4 w-4" /> Start Charging
          </Button>
          {station && (
            <Button asChild variant="outline" className="flex-1 border-white/20 bg-white/5 hover:bg-white/10" size="lg">
              <Link to="/stations/$id" params={{ id: station.id }} onClick={onClose}>
                <Eye className="h-4 w-4" /> View Details
              </Link>
            </Button>
          )}
        </div>
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