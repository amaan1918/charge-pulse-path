import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Station } from "@/lib/stations";
import { WelcomePopup } from "./WelcomePopup";
import { LocationPopup } from "./LocationPopup";
import { ScanSuccessPopup } from "./ScanSuccessPopup";
import { ChargingCompletePopup, type ChargingSession } from "./ChargingCompletePopup";

type State =
  | { kind: "none" }
  | { kind: "welcome" }
  | { kind: "location" }
  | { kind: "scan"; station: Station }
  | { kind: "charging"; session: ChargingSession };

interface Ctx {
  showScanSuccess: (s: Station) => void;
  showChargingComplete: (s: ChargingSession) => void;
  showLocation: () => void;
}

const PopupCtx = createContext<Ctx | null>(null);

export const usePopup = () => {
  const v = useContext(PopupCtx);
  if (!v) throw new Error("usePopup must be used inside PopupProvider");
  return v;
};

const VISITED_KEY = "evhub_visited_v1";

export function PopupProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ kind: "none" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const visited = localStorage.getItem(VISITED_KEY);
      if (!visited) {
        const t = setTimeout(() => setState({ kind: "welcome" }), 5000);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  const close = useCallback(() => setState({ kind: "none" }), []);

  const closeWelcome = useCallback(() => {
    try {
      localStorage.setItem(VISITED_KEY, "1");
    } catch {}
    setState({ kind: "location" });
  }, []);

  const value: Ctx = {
    showScanSuccess: (station) => setState({ kind: "scan", station }),
    showChargingComplete: (session) => setState({ kind: "charging", session }),
    showLocation: () => setState({ kind: "location" }),
  };

  return (
    <PopupCtx.Provider value={value}>
      {children}
      <WelcomePopup open={state.kind === "welcome"} onClose={closeWelcome} />
      <LocationPopup open={state.kind === "location"} onClose={close} />
      <ScanSuccessPopup
        open={state.kind === "scan"}
        onClose={close}
        station={state.kind === "scan" ? state.station : null}
      />
      <ChargingCompletePopup
        open={state.kind === "charging"}
        onClose={close}
        session={state.kind === "charging" ? state.session : null}
      />
    </PopupCtx.Provider>
  );
}