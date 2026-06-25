# EVChargeHub: Popups, Details Modal, QR Scanner, Trip Planner

A large delivery split into 4 focused parts. All UI keeps the existing dark/green Tesla-inspired glassmorphism look using Framer Motion for animations.

## 1. Premium Popup System

A single global `PopupProvider` mounted in `__root.tsx`, with a reusable `<GlassDialog>` shell (framer-motion fade+scale, backdrop blur, green/white/dark tokens).

- **Welcome popup** — shown 5s after first visit (flag in `localStorage: evhub_visited`). Buttons: Get Started (closes), Explore Stations (→ `/stations`).
- **Location permission** — opens automatically after Welcome closes. Calls `navigator.geolocation.getCurrentPosition`. On denial, shows the secondary message. "Maybe Later" dismisses.
- **QR Scan Success** — opened imperatively via `usePopup().showScanSuccess(station)`. Animated green check (SVG stroke draw). Shows station fields + Start Charging / View Details.
- **Charging Complete** — opened via `showChargingComplete(session)`. Battery-fill animation (0→100%) + glowing check. Energy, time, cost, battery %, CO₂ saved. Download Receipt (generates simple text/blob), Find Another Station, Close.

Files:
- `src/components/popups/PopupProvider.tsx` (context + state machine)
- `src/components/popups/GlassDialog.tsx`
- `src/components/popups/WelcomePopup.tsx`
- `src/components/popups/LocationPopup.tsx`
- `src/components/popups/ScanSuccessPopup.tsx`
- `src/components/popups/ChargingCompletePopup.tsx`

## 2. Station Details Modal (fix View Details)

Currently `View Details` on `StationCard` likely links to `/stations/$id`. The user wants a modal experience. Approach: keep `/stations/$id` route but ALSO add a modal opened from cards via a new `StationDetailsModal` component. Modal shows all required fields + Start/Stop Charging, Get Directions (Google Maps URL), and a live charging panel (simulated, 1s ticks) with kW, kWh, est cost.

Files:
- `src/components/StationDetailsModal.tsx`
- Update `src/components/StationCard.tsx` to open modal on click.

## 3. QR Scanner — "Scan & Charge"

- Add `html5-qrcode` dependency (works in browser, handles camera permission).
- New route `src/routes/scan.tsx` with slogan "One Scan. Instant Charge. Endless Journey."
- "⚡ Scan & Charge" CTA added to home hero and a mobile floating action button (visible <md) in `__root.tsx`.
- Scanner opens camera, looks up scanned text against station IDs (`EV001`–`EV004` mapped to existing `evx-001..004`, plus accepts any `evx-XXX`).
- On success → `showScanSuccess` popup + route to details. Errors: invalid QR, permission denied, not found, timeout (30s).

Files:
- `src/routes/scan.tsx`
- `src/components/QRScanner.tsx`
- `src/components/ScanFAB.tsx`

## 4. EV Road Trip Planner

New route `src/routes/trip-planner.tsx`. Hero: "Plan Smarter. Drive Further." + CTA.

Form: Start, Destination, EV Model (preset list), Current Battery %, Battery Capacity (kWh).

Compute (client-side, simulated/realistic):
- Distance via Google Maps Routes API (already wired through gateway in `GoogleMap` / app). Fallback to estimated straight-line if API fails.
- Energy consumption: `kWh = km * consumption(model)` (table per model).
- Stops: greedy — when projected battery <20% before next station, insert nearest station from `stations.ts` along route corridor.
- Cost = sum(stop.kWh * pricePerKwh), charging time = kWh / speedKw.

UI:
- Trip summary cards (distance, time, energy, stops, cost, ETA).
- Stops list with all required fields per stop, color status markers 🟢🟡🔴.
- Interactive map (reuse `GoogleMap`) with start/end/stops.
- Route mode tabs: Fastest / Cheapest / Least Crowded / Most Efficient (re-ranks stops).
- Battery prediction table per leg.
- Weather card (uses Google Weather API via gateway, optional/fallback static).
- Emergency mode banner if battery <15%.
- Save / Share / Download (localStorage + clipboard + text file).

Files:
- `src/routes/trip-planner.tsx`
- `src/components/trip/TripForm.tsx`
- `src/components/trip/TripSummary.tsx`
- `src/components/trip/StopCard.tsx`
- `src/lib/trip-planner.ts` (logic)
- Add nav links in `Navbar`.

## Scope notes / trade-offs

- All "live" charging data and weather impact use realistic simulated values unless gateway endpoints respond — keeps the UX complete without depending on user vehicle telemetry.
- Receipt downloads as a `.txt` (PDF would need an extra heavy lib).
- QR scanner needs HTTPS camera; works in the lovable preview.
- No backend/auth changes; trip history saved to `localStorage`.

Shall I proceed with all four parts in one go, or do you want me to ship them in stages (e.g., popups + details modal first, then scanner, then planner)?
