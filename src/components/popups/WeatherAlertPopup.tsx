import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CloudRain, Sun, Snowflake, CloudSun, Battery, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";

export type WeatherCondition = "hot" | "cold" | "rain" | "normal";

export interface WeatherData {
  tempC: number;
  condition: WeatherCondition;
  location?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  onDismissToday: () => void;
}

const COPY: Record<WeatherCondition, { label: string; icon: React.ReactNode; advice: string; impact: string; recBattery: string }> = {
  hot: {
    label: "High temperature",
    icon: <Sun className="h-8 w-8" />,
    advice: "☀️ High Temperature: Battery efficiency may decrease by up to 10%.",
    impact: "-8% to -12% range",
    recBattery: "≥ 85% before trip",
  },
  cold: {
    label: "Cold weather",
    icon: <Snowflake className="h-8 w-8" />,
    advice: "❄️ Cold Weather: Pre-condition your battery before driving.",
    impact: "-15% to -25% range",
    recBattery: "≥ 90% before trip",
  },
  rain: {
    label: "Heavy rain expected",
    icon: <CloudRain className="h-8 w-8" />,
    advice: "🌧 Heavy Rain: Drive carefully and allow extra charging time.",
    impact: "-5% to -10% range",
    recBattery: "≥ 80% before trip",
  },
  normal: {
    label: "Mild conditions",
    icon: <CloudSun className="h-8 w-8" />,
    advice: "Conditions look good. Enjoy the drive!",
    impact: "No significant impact",
    recBattery: "≥ 70% before trip",
  },
};

export function WeatherAlertPopup({ open, onClose, weather, onDismissToday }: Props) {
  if (!weather) return null;
  const c = COPY[weather.condition];

  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary/30 to-emerald-500/10 text-primary shadow-glow"
        >
          {c.icon}
        </motion.div>

        <h2 className="mt-4 text-2xl font-black tracking-tight">
          <span aria-hidden>🌦</span> Smart Weather Alert
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Weather conditions may affect your EV's driving range and charging efficiency.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-left text-xs">
          <Field label="Temperature" value={`${weather.tempC.toFixed(0)}°C`} accent />
          <Field label="Condition" value={c.label} />
          <Field label="Range impact" value={c.impact} />
          <Field label="Recommended battery" value={c.recBattery} />
          <div className="col-span-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-primary/90">
            <strong className="block text-primary">Suggested charging stop</strong>
            Top up at the next high-power DC station along your route before peak heat / rain hours.
          </div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
            {c.advice}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button onClick={onClose} className="shadow-glow" size="lg">
            <Navigation className="h-4 w-4" /> Plan My Trip
          </Button>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10" size="lg">
            <Link to="/locator" onClick={onClose}>
              <MapPin className="h-4 w-4" /> Find Nearby Charger
            </Link>
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            Dismiss
          </button>
          <button onClick={onDismissToday} className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Don't show this again today
          </button>
        </div>
      </motion.div>
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