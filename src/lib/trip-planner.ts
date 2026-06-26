import { stations, type Station } from "@/lib/stations";

export interface EvModel {
  name: string;
  consumptionKwhPerKm: number; // typical
  defaultBatteryKwh: number;
}

// EVs available in India — typical consumption (kWh/km) and battery (kWh).
// Port type CCS2 across the lineup unless noted.
export const EV_MODELS: EvModel[] = [
  { name: "Tata Nexon EV", consumptionKwhPerKm: 0.14, defaultBatteryKwh: 40.5 },
  { name: "Tata Punch EV", consumptionKwhPerKm: 0.13, defaultBatteryKwh: 35 },
  { name: "Tata Curvv EV", consumptionKwhPerKm: 0.15, defaultBatteryKwh: 55 },
  { name: "Tata Tiago EV", consumptionKwhPerKm: 0.12, defaultBatteryKwh: 24 },
  { name: "Tata Tigor EV", consumptionKwhPerKm: 0.13, defaultBatteryKwh: 26 },
  { name: "Tata Harrier EV", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 75 },
  { name: "Mahindra XEV 9e", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 79 },
  { name: "Mahindra BE 6", consumptionKwhPerKm: 0.17, defaultBatteryKwh: 79 },
  { name: "MG Windsor EV", consumptionKwhPerKm: 0.14, defaultBatteryKwh: 38 },
  { name: "MG ZS EV", consumptionKwhPerKm: 0.16, defaultBatteryKwh: 50.3 },
  { name: "MG Comet EV", consumptionKwhPerKm: 0.10, defaultBatteryKwh: 17.3 },
  { name: "Hyundai Creta Electric", consumptionKwhPerKm: 0.17, defaultBatteryKwh: 51.4 },
  { name: "Hyundai Ioniq 5", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 72.6 },
  { name: "Kia EV6", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 84 },
  { name: "Kia EV9", consumptionKwhPerKm: 0.22, defaultBatteryKwh: 99.8 },
  { name: "BYD Atto 3", consumptionKwhPerKm: 0.16, defaultBatteryKwh: 60.5 },
  { name: "BYD Seal", consumptionKwhPerKm: 0.16, defaultBatteryKwh: 82.5 },
  { name: "BYD eMAX 7", consumptionKwhPerKm: 0.19, defaultBatteryKwh: 71.8 },
  { name: "Citroën ë-C3", consumptionKwhPerKm: 0.13, defaultBatteryKwh: 29.2 },
  { name: "BMW iX1", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 66.5 },
  { name: "BMW i4", consumptionKwhPerKm: 0.17, defaultBatteryKwh: 83.9 },
  { name: "BMW iX", consumptionKwhPerKm: 0.21, defaultBatteryKwh: 111.5 },
  { name: "Mercedes-Benz EQA", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 70.5 },
  { name: "Mercedes-Benz EQB", consumptionKwhPerKm: 0.19, defaultBatteryKwh: 70.5 },
  { name: "Mercedes-Benz EQE SUV", consumptionKwhPerKm: 0.21, defaultBatteryKwh: 90.6 },
  { name: "Mercedes-Benz EQS SUV", consumptionKwhPerKm: 0.23, defaultBatteryKwh: 118 },
  { name: "Volvo EX40", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 78 },
  { name: "Volvo EC40", consumptionKwhPerKm: 0.18, defaultBatteryKwh: 78 },
  { name: "MINI Countryman Electric", consumptionKwhPerKm: 0.17, defaultBatteryKwh: 66.5 },
  { name: "Audi Q8 e-tron", consumptionKwhPerKm: 0.22, defaultBatteryKwh: 114 },
  { name: "Porsche Macan Electric", consumptionKwhPerKm: 0.20, defaultBatteryKwh: 95 },
  { name: "Porsche Taycan", consumptionKwhPerKm: 0.20, defaultBatteryKwh: 93.4 },
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

const AVG_SPEED_KMH = 70; // typical Indian highway cruising

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
      ? { condition: "Clear · 32°C", rangeImpactPct: -3 }
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

// Indian cities for the trip planner (sorted by state).
export const SAMPLE_CITIES: Record<string, { lat: number; lng: number }> = {
  // Gujarat (default region)
  "Ahmedabad, Gujarat": { lat: 23.0225, lng: 72.5714 },
  "Surat, Gujarat": { lat: 21.1702, lng: 72.8311 },
  "Vadodara, Gujarat": { lat: 22.3072, lng: 73.1812 },
  "Rajkot, Gujarat": { lat: 22.3039, lng: 70.8022 },
  "Gandhinagar, Gujarat": { lat: 23.2156, lng: 72.6369 },
  "Bhavnagar, Gujarat": { lat: 21.7645, lng: 72.1519 },
  "Jamnagar, Gujarat": { lat: 22.4707, lng: 70.0577 },
  "Junagadh, Gujarat": { lat: 21.5222, lng: 70.4579 },
  "Anand, Gujarat": { lat: 22.5645, lng: 72.9289 },
  "Mehsana, Gujarat": { lat: 23.5879, lng: 72.3693 },
  // Maharashtra
  "Mumbai, Maharashtra": { lat: 19.0760, lng: 72.8777 },
  "Pune, Maharashtra": { lat: 18.5204, lng: 73.8567 },
  "Nagpur, Maharashtra": { lat: 21.1458, lng: 79.0882 },
  "Nashik, Maharashtra": { lat: 19.9975, lng: 73.7898 },
  "Aurangabad, Maharashtra": { lat: 19.8762, lng: 75.3433 },
  "Thane, Maharashtra": { lat: 19.2183, lng: 72.9781 },
  // Delhi
  "New Delhi, Delhi": { lat: 28.6139, lng: 77.2090 },
  // Karnataka
  "Bengaluru, Karnataka": { lat: 12.9716, lng: 77.5946 },
  "Mysuru, Karnataka": { lat: 12.2958, lng: 76.6394 },
  "Hubballi, Karnataka": { lat: 15.3647, lng: 75.1240 },
  // Tamil Nadu
  "Chennai, Tamil Nadu": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore, Tamil Nadu": { lat: 11.0168, lng: 76.9558 },
  "Madurai, Tamil Nadu": { lat: 9.9252, lng: 78.1198 },
  // Telangana
  "Hyderabad, Telangana": { lat: 17.3850, lng: 78.4867 },
  "Warangal, Telangana": { lat: 17.9784, lng: 79.5941 },
  // Rajasthan
  "Jaipur, Rajasthan": { lat: 26.9124, lng: 75.7873 },
  "Udaipur, Rajasthan": { lat: 24.5854, lng: 73.7125 },
  "Jodhpur, Rajasthan": { lat: 26.2389, lng: 73.0243 },
  // Uttar Pradesh
  "Lucknow, Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Kanpur, Uttar Pradesh": { lat: 26.4499, lng: 80.3319 },
  "Varanasi, Uttar Pradesh": { lat: 25.3176, lng: 82.9739 },
  "Agra, Uttar Pradesh": { lat: 27.1767, lng: 78.0081 },
  "Noida, Uttar Pradesh": { lat: 28.5355, lng: 77.3910 },
  // Madhya Pradesh
  "Indore, Madhya Pradesh": { lat: 22.7196, lng: 75.8577 },
  "Bhopal, Madhya Pradesh": { lat: 23.2599, lng: 77.4126 },
  "Gwalior, Madhya Pradesh": { lat: 26.2183, lng: 78.1828 },
  // Punjab / Chandigarh
  "Chandigarh, Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Amritsar, Punjab": { lat: 31.6340, lng: 74.8723 },
  "Ludhiana, Punjab": { lat: 30.9010, lng: 75.8573 },
  // West Bengal
  "Kolkata, West Bengal": { lat: 22.5726, lng: 88.3639 },
  "Siliguri, West Bengal": { lat: 26.7271, lng: 88.3953 },
  // Kerala
  "Kochi, Kerala": { lat: 9.9312, lng: 76.2673 },
  "Thiruvananthapuram, Kerala": { lat: 8.5241, lng: 76.9366 },
  // Odisha
  "Bhubaneswar, Odisha": { lat: 20.2961, lng: 85.8245 },
  "Cuttack, Odisha": { lat: 20.4625, lng: 85.8828 },
  // Bihar
  "Patna, Bihar": { lat: 25.5941, lng: 85.1376 },
  // Assam
  "Guwahati, Assam": { lat: 26.1445, lng: 91.7362 },
};