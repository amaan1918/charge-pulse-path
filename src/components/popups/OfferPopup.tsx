import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Sparkles, Clock, MapPin, IndianRupee, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassDialog } from "./GlassDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onViewStations: () => void;
  onClaim: () => void;
}

export function OfferPopup({ open, onClose, onViewStations, onClaim }: Props) {
  const expiry = new Date();
  expiry.setHours(23, 59, 0, 0);
  const expiryLabel = expiry.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <GlassDialog open={open} onClose={onClose} size="md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="text-center"
      >
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-emerald-500/10 to-transparent" />

        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 shadow-glow"
        >
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </motion.div>

        <h2 className="mt-4 text-2xl font-black tracking-tight">
          <span aria-hidden>🎉</span> Exclusive Charging Offer
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Charge smarter and save more! Enjoy special discounts at selected EV charging stations today.
        </p>

        {/* Offer card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mt-5 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-5 text-left"
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-primary">Today's deal</div>
              <div className="text-lg font-black">10% OFF on DC Fast Charging</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <Row icon={<Tag className="h-3.5 w-3.5" />} label="Validity" value="Today only" />
            <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Stations" value="12 participating" />
            <Row icon={<IndianRupee className="h-3.5 w-3.5" />} label="Est. savings" value="₹80 – ₹250" />
            <Row icon={<Clock className="h-3.5 w-3.5" />} label="Expires at" value={expiryLabel} />
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="flex-1 shadow-glow" size="lg">
            <Link to="/stations" onClick={onClaim}>
              <Sparkles className="h-4 w-4" /> Claim Offer
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/10"
            size="lg"
          >
            <Link to="/stations" onClick={onViewStations}>
              Eligible Stations
            </Link>
          </Button>
        </div>
        <button
          onClick={onClose}
          className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Maybe later
        </button>
        <p className="mt-4 text-[10px] uppercase tracking-wider text-muted-foreground/70">
          Terms &amp; Conditions Apply
        </p>
      </motion.div>
    </GlassDialog>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}