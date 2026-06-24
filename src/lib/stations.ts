export type ChargerType = "DC Fast" | "Level 2 AC" | "Tesla Supercharger" | "Ultra Fast";

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  distanceKm: number;
  chargers: number;
  available: number;
  type: ChargerType;
  speedKw: number;
  pricePerKwh: number;
  rating: number;
  reviews: number;
  hours: string;
  amenities: string[];
  image: string;
  lat: number;
  lng: number;
}

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=70`;

export const stations: Station[] = [
  { id: "evx-001", name: "Pulse Hub — Downtown", address: "120 Market St", city: "San Francisco", state: "CA", distanceKm: 1.2, chargers: 12, available: 7, type: "Tesla Supercharger", speedKw: 250, pricePerKwh: 0.36, rating: 4.8, reviews: 342, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom","Lounge"], image: img("photo-1593941707882-a5bba14938c7"), lat: 37.7937, lng: -122.3965 },
  { id: "evx-002", name: "Voltway Plaza", address: "44 Embarcadero Center", city: "San Francisco", state: "CA", distanceKm: 2.8, chargers: 8, available: 3, type: "DC Fast", speedKw: 150, pricePerKwh: 0.32, rating: 4.6, reviews: 218, hours: "06:00 – 23:00", amenities: ["Wi-Fi","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 37.7956, lng: -122.4003 },
  { id: "evx-003", name: "GreenGrid Station", address: "900 Mission St", city: "San Francisco", state: "CA", distanceKm: 3.4, chargers: 6, available: 0, type: "Ultra Fast", speedKw: 350, pricePerKwh: 0.42, rating: 4.9, reviews: 512, hours: "24/7", amenities: ["Cafe","Shop","Lounge","Wi-Fi"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 37.7825, lng: -122.4058 },
  { id: "evx-004", name: "ChargeLine Express", address: "2200 Broadway", city: "Oakland", state: "CA", distanceKm: 12.6, chargers: 10, available: 5, type: "DC Fast", speedKw: 180, pricePerKwh: 0.30, rating: 4.4, reviews: 174, hours: "24/7", amenities: ["Wi-Fi","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 37.8113, lng: -122.2655 },
  { id: "evx-005", name: "ElectricPoint LA", address: "650 S Spring St", city: "Los Angeles", state: "CA", distanceKm: 560, chargers: 16, available: 11, type: "Tesla Supercharger", speedKw: 250, pricePerKwh: 0.34, rating: 4.7, reviews: 891, hours: "24/7", amenities: ["Cafe","Lounge","Wi-Fi","Shop"], image: img("photo-1593941707882-a5bba14938c7"), lat: 34.0467, lng: -118.2535 },
  { id: "evx-006", name: "Skyline EV Bay", address: "1 Hudson Yards", city: "New York", state: "NY", distanceKm: 4123, chargers: 14, available: 9, type: "Ultra Fast", speedKw: 350, pricePerKwh: 0.45, rating: 4.8, reviews: 622, hours: "24/7", amenities: ["Cafe","Shop","Restroom","Wi-Fi","Lounge"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 40.7536, lng: -74.0014 },
  { id: "evx-007", name: "Nova Charge — Brooklyn", address: "55 Front St", city: "Brooklyn", state: "NY", distanceKm: 4128, chargers: 8, available: 4, type: "DC Fast", speedKw: 150, pricePerKwh: 0.38, rating: 4.5, reviews: 256, hours: "05:00 – 24:00", amenities: ["Wi-Fi","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 40.7033, lng: -73.9881 },
  { id: "evx-008", name: "Mile High Volt", address: "1700 Wynkoop", city: "Denver", state: "CO", distanceKm: 1530, chargers: 6, available: 6, type: "Level 2 AC", speedKw: 22, pricePerKwh: 0.22, rating: 4.3, reviews: 92, hours: "24/7", amenities: ["Wi-Fi"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 39.7525, lng: -105.0009 },
  { id: "evx-009", name: "Lakeshore Power", address: "401 N Wabash", city: "Chicago", state: "IL", distanceKm: 2980, chargers: 10, available: 7, type: "DC Fast", speedKw: 200, pricePerKwh: 0.33, rating: 4.6, reviews: 308, hours: "24/7", amenities: ["Cafe","Wi-Fi","Restroom"], image: img("photo-1593941707882-a5bba14938c7"), lat: 41.8895, lng: -87.6265 },
  { id: "evx-010", name: "Bayview Supercharge", address: "777 King St", city: "Seattle", state: "WA", distanceKm: 1090, chargers: 12, available: 2, type: "Tesla Supercharger", speedKw: 250, pricePerKwh: 0.35, rating: 4.7, reviews: 414, hours: "24/7", amenities: ["Lounge","Cafe","Wi-Fi"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 47.5990, lng: -122.3340 },
  { id: "evx-011", name: "Sunset Eco Charge", address: "300 W 6th St", city: "Austin", state: "TX", distanceKm: 2670, chargers: 8, available: 5, type: "DC Fast", speedKw: 150, pricePerKwh: 0.28, rating: 4.4, reviews: 178, hours: "06:00 – 23:00", amenities: ["Wi-Fi","Shop"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 30.2682, lng: -97.7470 },
  { id: "evx-012", name: "Harbor Light EV", address: "Pier 39", city: "Miami", state: "FL", distanceKm: 4360, chargers: 6, available: 3, type: "Level 2 AC", speedKw: 22, pricePerKwh: 0.24, rating: 4.2, reviews: 84, hours: "24/7", amenities: ["Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 25.7781, lng: -80.1856 },
];

export const findStation = (id: string) => stations.find((s) => s.id === id);

export const reviews = [
  { id: "r1", stationId: "evx-001", user: "Marcus T.", rating: 5, text: "Lightning quick, beautiful lounge area. 80% in 18 minutes.", date: "2 days ago" },
  { id: "r2", stationId: "evx-001", user: "Priya N.", rating: 5, text: "Cleanest station I've ever used. The app booking saved me twice.", date: "5 days ago" },
  { id: "r3", stationId: "evx-001", user: "Diego R.", rating: 4, text: "Great location but gets busy during commute hours — book ahead.", date: "1 week ago" },
  { id: "r4", stationId: "evx-003", user: "Sophie L.", rating: 5, text: "350 kW is unreal. Full charge before my coffee was ready.", date: "3 days ago" },
];