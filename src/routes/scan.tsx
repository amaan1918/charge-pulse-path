import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, ScanLine } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { QRScanner } from "@/components/QRScanner";
import { stations, findStation, type Station } from "@/lib/stations";
import { usePopup } from "@/components/popups/PopupProvider";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan & Charge — EVChargeHub" },
      { name: "description", content: "Scan a station QR code to instantly start your EV charging session." },
    ],
  }),
  component: ScanPage,
});

const ALIASES: Record<string, string> = {
  EV001: "evx-001",
  EV002: "evx-002",
  EV003: "evx-003",
  EV004: "evx-004",
};

function resolveStation(code: string): Station | null {
  const trimmed = code.trim();
  const id = ALIASES[trimmed.toUpperCase()] ?? trimmed.toLowerCase();
  return findStation(id) ?? null;
}

function ScanPage() {
  const navigate = useNavigate();
  const { showScanSuccess } = usePopup();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const handleResult = (text: string) => {
    setError("");
    const station = resolveStation(text);
    if (!station) {
      setError(`Invalid QR code — no station found for "${text}".`);
      setScanning(false);
      return;
    }
    setScanning(false);
    showScanSuccess(station);
    setTimeout(() => navigate({ to: "/stations/$id", params: { id: station.id } }), 200);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <BackButton to="/" label="Back home" />
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Scan & Charge</span>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          One Scan. <span className="text-primary">Instant Charge.</span> Endless Journey.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Point your camera at the QR code on any EVChargeHub charging station.
        </p>
      </div>

      <div className="glass mt-8 rounded-3xl p-6">
        {scanning ? (
          <QRScanner onResult={handleResult} onError={setError} />
        ) : (
          <div className="grid place-items-center py-10 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-primary/15 text-primary shadow-glow">
              <ScanLine className="h-10 w-10" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Tap below to launch your camera and scan a station QR code.
            </p>
            <Button size="lg" className="mt-5 shadow-glow" onClick={() => { setError(""); setScanning(true); }}>
              <Zap className="h-4 w-4" /> Start Scanning
            </Button>
          </div>
        )}
        {error && !scanning && (
          <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-center text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="glass mt-6 rounded-3xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sample station codes
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.keys(ALIASES).map((code) => (
            <button
              key={code}
              onClick={() => handleResult(code)}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            >
              {code}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Tap any code to simulate a successful scan — useful for testing without a printed QR.
        </p>
      </div>

      <div className="mt-6 grid gap-3 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold text-foreground">How it works</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Arrive at a station</li>
            <li>Open EVChargeHub & tap Scan & Charge</li>
            <li>Scan the station QR code</li>
            <li>Station details load instantly</li>
            <li>Tap Start Charging</li>
          </ol>
        </div>
        <div className="glass rounded-2xl p-4">
          <h3 className="font-semibold text-foreground">Available stations</h3>
          <ul className="mt-2 space-y-1">
            {stations.slice(0, 4).map((s) => (
              <li key={s.id} className="flex justify-between"><span>{s.name}</span><span className="text-primary">{s.id.toUpperCase()}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}