import { stations, type Station } from "@/lib/stations";

export interface EvModel {
  name: string;
  consumptionKwhPerKm: number; // typical
  defaultBatteryKwh: number;
}

export const EV_MODELS: EvModel[] = [
  { name: "Tesla Model 3 LR", consumptionKwhPerKm: 0.15, defaultBatteryKwh: 75 },
  { name: "Tesla Model Y", consumptionKwhPerKm: 0.17, defaultBatteryKwh: 75 },
  { name: "Ford Mustang Mach-E", consumptionKwhPerKm: 0.20, defaultBatteryKwh: 88 },
  { name: "Rivian R1T", consumptionKwhPerKm: 0.27, defaultBatteryKwh: 135 },
  { name: "Polestar 2", consumptionKwhPerKm: 0.19, defaultBatteryKwh: 78 },
  { name: "Hyundai Ioniq 5", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 77 },
  { name: "Chevy Bolt EV", consumptionKwhPerKm: 0.16, defaultBatteryKwh: 65 },
  { name: "Nissan Leaf", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 62 },
];

export type RouteMode = "fastest" | "cheapest" | "least-crowded" | "efficient";

export interface TripInput {
  startLabel: string;
  endLabel: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  model: EvModel;
  batteryPct: number; // 0-100
  batteryKwh: number;
  mode: RouteMode;
}

export interface TripStop {
  station: Station;
  distanceFromStartKm: number;
  arrivalBatteryPct: number;
  chargeToPct: number;
  energyAddedKwh: number;
  chargingDurationMin: number;
  cost: number;
  availabilityLevel: "green" | "yellow" | "red";
}

export interface TripLeg {
  fromLabel: string;
  toLabel: string;
  distanceKm: number;
  startBatteryPct: number;
  endBatteryPct: number;
}

export interface TripPlan {
  input: TripInput;
  totalDistanceKm: number;
  drivingTimeMin: number;
  totalEnergyKwh: number;
  totalCost: number;
  totalChargingMin: number;
  stops: TripStop[];
  legs: TripLeg[];
  etaMin: number;
  emergency: boolean;
  weather: { condition: string; rangeImpactPct: number };
}

const R = 6371;

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Distance from point P to segment A-B (km)
function distanceToSegmentKm(pLat: number, pLng: number, aLat: number, aLng: number, bLat: number, bLng: number) {
  const ax = aLng, ay = aLat;
  const bx = bLng, by = bLat;
  const px = pLng, py = pLat;
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  const projLat = ay + t * dy;
  const projLng = ax + t * dx;
  return { distanceKm: haversineKm(pLat, pLng, projLat, projLng), t };
}

const AVG_SPEED_KMH = 90;

function score(s: Station, mode: RouteMode) {
  switch (mode) {
    case "fastest": return -s.speedKw;
    case "cheapest": return s.pricePerKwh;
    case "least-crowded": return -(s.available / Math.max(1, s.chargers));
    case "efficient": return s.pricePerKwh / Math.max(20, s.speedKw);
  }
}

export function planTrip(input: TripInput): TripPlan {
  const totalDistanceKm = haversineKm(input.startLat, input.startLng, input.endLat, input.endLng);
  const drivingTimeMin = Math.round((totalDistanceKm / AVG_SPEED_KMH) * 60);

  // Corridor: stations within 60km of straight-line route
  const corridor = stations
    .map((s) => {
      const { distanceKm, t } = distanceToSegmentKm(s.lat, s.lng, input.startLat, input.startLng, input.endLat, input.endLng);
      return { s, off: distanceKm, t, fromStart: t * totalDistanceKm };
    })
    .filter((x) => x.off < 60)
    .sort((a, b) => a.fromStart - b.fromStart);

  const usableKwh = input.batteryKwh;
  const consumption = input.model.consumptionKwhPerKm;
  const rangeKm = (pct: number) => (pct / 100) * usableKwh / consumption;
  const RESERVE_PCT = 15;
  const TARGET_CHARGE_PCT = 80;

  let currentPct = input.batteryPct;
  let cursorKm = 0;
  const stops: TripStop[] = [];
  const legs: TripLeg[] = [];

  while (cursorKm < totalDistanceKm) {
    const remainingKm = totalDistanceKm - cursorKm;
    const reachableKm = rangeKm(currentPct - RESERVE_PCT);

    if (reachableKm >= remainingKm) {
      const consumedPct = (remainingKm * consumption / usableKwh) * 100;
      const endPct = Math.max(0, currentPct - consumedPct);
      legs.push({
        fromLabel: stops.length === 0 ? input.startLabel : stops[stops.length - 1].station.name,
        toLabel: input.endLabel,
        distanceKm: remainingKm,
        startBatteryPct: currentPct,
        endBatteryPct: endPct,
      });
      currentPct = endPct;
      cursorKm = totalDistanceKm;
      break;
    }

    // Need a stop. Find candidates ahead within reach.
    const maxReachKm = cursorKm + reachableKm;
    const candidates = corridor.filter((c) => c.fromStart > cursorKm + 5 && c.fromStart <= maxReachKm);
    if (candidates.length === 0) {
      // Force closest ahead even if marginally out of reach
      const next = corridor.find((c) => c.fromStart > cursorKm + 5);
      if (!next) break;
      candidates.push(next);
    }
    candidates.sort((a, b) => score(a.s, input.mode) - score(b.s, input.mode));
    const pick = candidates[0];
    const distLegKm = pick.fromStart - cursorKm;
    const consumedPct = (distLegKm * consumption / usableKwh) * 100;
    const arrivalPct = Math.max(0, currentPct - consumedPct);

    legs.push({
      fromLabel: stops.length === 0 ? input.startLabel : stops[stops.length - 1].station.name,
      toLabel: pick.s.name,
      distanceKm: distLegKm,
      startBatteryPct: currentPct,
      endBatteryPct: arrivalPct,
    });

    const energyAddedKwh = ((TARGET_CHARGE_PCT - arrivalPct) / 100) * usableKwh;
    const chargingDurationMin = Math.round((energyAddedKwh / pick.s.speedKw) * 60);
    const cost = energyAddedKwh * pick.s.pricePerKwh;
    const ratio = pick.s.available / Math.max(1, pick.s.chargers);
    const availabilityLevel: TripStop["availabilityLevel"] =
      ratio === 0 ? "red" : ratio < 0.3 ? "yellow" : "green";

    stops.push({
      station: pick.s,
      distanceFromStartKm: pick.fromStart,
      arrivalBatteryPct: arrivalPct,
      chargeToPct: TARGET_CHARGE_PCT,
      energyAddedKwh,
      chargingDurationMin,
      cost,
      availabilityLevel,
    });

    currentPct = TARGET_CHARGE_PCT;
    cursorKm = pick.fromStart;
  }

  const totalChargingMin = stops.reduce((a, s) => a + s.chargingDurationMin, 0);
  const totalCost = stops.reduce((a, s) => a + s.cost, 0);
  const totalEnergyKwh = (totalDistanceKm * consumption);
  const etaMin = drivingTimeMin + totalChargingMin;
  const emergency = input.batteryPct < 15;

  const weather =
    totalDistanceKm > 0
      ? { condition: "Clear · 22°C", rangeImpactPct: -3 }
      : { condition: "—", rangeImpactPct: 0 };

  return {
    input,
    totalDistanceKm,
    drivingTimeMin,
    totalEnergyKwh,
    totalCost,
    totalChargingMin,
    stops,
    legs,
    etaMin,
    emergency,
    weather,
  };
}

export const SAMPLE_CITIES: Record<string, { lat: number; lng: number }> = {
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Las Vegas, NV": { lat: 36.1699, lng: -115.1398 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
};