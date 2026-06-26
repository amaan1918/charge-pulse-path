export type ChargerType = "DC Fast" | "Level 2 AC" | "Tesla Supercharger" | "Ultra Fast";

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  distanceKm: number;
  chargers: number;
  available: number;
  type: ChargerType;
  speedKw: number;
  pricePerKwh: number; // Indian Rupees (₹) per kWh
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

// Sample EV charging stations across India (lat/lng approximate).
// Pricing in ₹ per kWh — AC chargers ₹8–12, DC Fast ₹15–22.
export const stations: Station[] = [
  { id: "EV001", name: "Tata Power EZ — SG Highway", address: "SG Highway, Bodakdev", city: "Ahmedabad", state: "Gujarat", pincode: "380054", distanceKm: 1.2, chargers: 8, available: 5, type: "DC Fast", speedKw: 60, pricePerKwh: 18, rating: 4.7, reviews: 312, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom"], image: img("photo-1593941707882-a5bba14938c7"), lat: 23.0469, lng: 72.5121 },
  { id: "EV002", name: "Ather Grid — Gandhinagar", address: "Sector 11, GH Road", city: "Gandhinagar", state: "Gujarat", pincode: "382011", distanceKm: 28, chargers: 4, available: 2, type: "Level 2 AC", speedKw: 22, pricePerKwh: 10, rating: 4.5, reviews: 142, hours: "24/7", amenities: ["Wi-Fi","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 23.2156, lng: 72.6369 },
  { id: "EV003", name: "Statiq Hub — Surat Adajan", address: "Adajan Patia, Rander Road", city: "Surat", state: "Gujarat", pincode: "395009", distanceKm: 265, chargers: 6, available: 4, type: "DC Fast", speedKw: 50, pricePerKwh: 17, rating: 4.6, reviews: 198, hours: "24/7", amenities: ["Cafe","Wi-Fi","Restroom"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 21.1959, lng: 72.7933 },
  { id: "EV004", name: "ChargeZone — Vadodara Alkapuri", address: "RC Dutt Road, Alkapuri", city: "Vadodara", state: "Gujarat", pincode: "390007", distanceKm: 115, chargers: 5, available: 3, type: "DC Fast", speedKw: 60, pricePerKwh: 16, rating: 4.4, reviews: 156, hours: "06:00 AM – 11:00 PM", amenities: ["Wi-Fi","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 22.3110, lng: 73.1812 },
  { id: "EV005", name: "Tata Power — Rajkot Race Course", address: "Race Course Ring Road", city: "Rajkot", state: "Gujarat", pincode: "360001", distanceKm: 220, chargers: 4, available: 4, type: "Level 2 AC", speedKw: 22, pricePerKwh: 9, rating: 4.3, reviews: 89, hours: "24/7", amenities: ["Wi-Fi"], image: img("photo-1593941707882-a5bba14938c7"), lat: 22.2871, lng: 70.7833 },
  { id: "EV006", name: "Zeon Charging — BKC Mumbai", address: "Bandra Kurla Complex", city: "Mumbai", state: "Maharashtra", pincode: "400051", distanceKm: 525, chargers: 12, available: 7, type: "Ultra Fast", speedKw: 150, pricePerKwh: 22, rating: 4.8, reviews: 612, hours: "24/7", amenities: ["Cafe","Shop","Lounge","Wi-Fi"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 19.0596, lng: 72.8656 },
  { id: "EV007", name: "Tata Power EZ — Pune Kharadi", address: "EON IT Park, Kharadi", city: "Pune", state: "Maharashtra", pincode: "411014", distanceKm: 670, chargers: 8, available: 5, type: "DC Fast", speedKw: 60, pricePerKwh: 18, rating: 4.6, reviews: 254, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 18.5511, lng: 73.9376 },
  { id: "EV008", name: "Statiq — Nagpur Civil Lines", address: "Civil Lines", city: "Nagpur", state: "Maharashtra", pincode: "440001", distanceKm: 1010, chargers: 4, available: 2, type: "Level 2 AC", speedKw: 22, pricePerKwh: 11, rating: 4.2, reviews: 71, hours: "24/7", amenities: ["Wi-Fi","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 21.1458, lng: 79.0882 },
  { id: "EV009", name: "Bharat Charge — Connaught Place", address: "Connaught Place, Block A", city: "New Delhi", state: "Delhi", pincode: "110001", distanceKm: 940, chargers: 10, available: 6, type: "DC Fast", speedKw: 60, pricePerKwh: 19, rating: 4.7, reviews: 438, hours: "24/7", amenities: ["Cafe","Wi-Fi","Restroom","Lounge"], image: img("photo-1593941707882-a5bba14938c7"), lat: 28.6304, lng: 77.2177 },
  { id: "EV010", name: "Ather Grid — Indiranagar", address: "100 Feet Road, Indiranagar", city: "Bengaluru", state: "Karnataka", pincode: "560038", distanceKm: 1490, chargers: 6, available: 3, type: "DC Fast", speedKw: 50, pricePerKwh: 18, rating: 4.7, reviews: 521, hours: "24/7", amenities: ["Wi-Fi","Cafe"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 12.9719, lng: 77.6412 },
  { id: "EV011", name: "Tata Power — Mysuru Palace Road", address: "Palace Road", city: "Mysuru", state: "Karnataka", pincode: "570001", distanceKm: 1640, chargers: 4, available: 1, type: "Level 2 AC", speedKw: 22, pricePerKwh: 10, rating: 4.4, reviews: 96, hours: "06:00 AM – 11:00 PM", amenities: ["Wi-Fi","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 12.3052, lng: 76.6552 },
  { id: "EV012", name: "ChargeZone — Chennai OMR", address: "Old Mahabalipuram Road, Thoraipakkam", city: "Chennai", state: "Tamil Nadu", pincode: "600097", distanceKm: 1830, chargers: 8, available: 5, type: "DC Fast", speedKw: 60, pricePerKwh: 17, rating: 4.6, reviews: 287, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 12.9351, lng: 80.2362 },
  { id: "EV013", name: "Statiq — Coimbatore RS Puram", address: "DB Road, RS Puram", city: "Coimbatore", state: "Tamil Nadu", pincode: "641002", distanceKm: 1660, chargers: 4, available: 3, type: "Level 2 AC", speedKw: 22, pricePerKwh: 9, rating: 4.3, reviews: 112, hours: "24/7", amenities: ["Wi-Fi"], image: img("photo-1593941707882-a5bba14938c7"), lat: 11.0030, lng: 76.9606 },
  { id: "EV014", name: "Tata Power EZ — Hitech City", address: "HITEC City, Madhapur", city: "Hyderabad", state: "Telangana", pincode: "500081", distanceKm: 1230, chargers: 10, available: 6, type: "Ultra Fast", speedKw: 120, pricePerKwh: 21, rating: 4.7, reviews: 402, hours: "24/7", amenities: ["Cafe","Lounge","Wi-Fi"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 17.4486, lng: 78.3908 },
  { id: "EV015", name: "Bharat Charge — Jaipur MI Road", address: "M.I. Road, Panch Batti", city: "Jaipur", state: "Rajasthan", pincode: "302001", distanceKm: 690, chargers: 6, available: 4, type: "DC Fast", speedKw: 50, pricePerKwh: 17, rating: 4.5, reviews: 198, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 26.9173, lng: 75.8127 },
  { id: "EV016", name: "Zeon — Lucknow Hazratganj", address: "Hazratganj", city: "Lucknow", state: "Uttar Pradesh", pincode: "226001", distanceKm: 1190, chargers: 5, available: 3, type: "DC Fast", speedKw: 50, pricePerKwh: 16, rating: 4.4, reviews: 134, hours: "24/7", amenities: ["Wi-Fi","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 26.8467, lng: 80.9462 },
  { id: "EV017", name: "Tata Power — Noida Sector 18", address: "Sector 18, Atta Market", city: "Noida", state: "Uttar Pradesh", pincode: "201301", distanceKm: 950, chargers: 8, available: 5, type: "DC Fast", speedKw: 60, pricePerKwh: 18, rating: 4.6, reviews: 271, hours: "24/7", amenities: ["Wi-Fi","Cafe","Shop"], image: img("photo-1593941707882-a5bba14938c7"), lat: 28.5707, lng: 77.3260 },
  { id: "EV018", name: "ChargeZone — Indore Vijay Nagar", address: "Vijay Nagar Square", city: "Indore", state: "Madhya Pradesh", pincode: "452010", distanceKm: 400, chargers: 6, available: 4, type: "DC Fast", speedKw: 60, pricePerKwh: 17, rating: 4.5, reviews: 167, hours: "24/7", amenities: ["Wi-Fi","Cafe"], image: img("photo-1561361398-a8db1b3a1a06"), lat: 22.7533, lng: 75.8937 },
  { id: "EV019", name: "Statiq — Bhopal MP Nagar", address: "Zone 1, MP Nagar", city: "Bhopal", state: "Madhya Pradesh", pincode: "462011", distanceKm: 580, chargers: 4, available: 2, type: "Level 2 AC", speedKw: 22, pricePerKwh: 10, rating: 4.3, reviews: 88, hours: "24/7", amenities: ["Wi-Fi","Restroom"], image: img("photo-1633507102236-39e1e3a4a8d2"), lat: 23.2330, lng: 77.4347 },
  { id: "EV020", name: "Ather Grid — Kolkata Park Street", address: "Park Street, Mullick Bazar", city: "Kolkata", state: "West Bengal", pincode: "700016", distanceKm: 1730, chargers: 6, available: 3, type: "DC Fast", speedKw: 50, pricePerKwh: 18, rating: 4.5, reviews: 209, hours: "24/7", amenities: ["Wi-Fi","Cafe","Restroom"], image: img("photo-1647677447024-1aa4c2a1b0d8"), lat: 22.5512, lng: 88.3526 },
];

export const findStation = (id: string) => stations.find((s) => s.id === id);

export const reviews = [
  { id: "r1", stationId: "EV001", user: "Rohan P.", rating: 5, text: "Super fast charge — got 80% in under 40 minutes on my Nexon EV.", date: "2 days ago" },
  { id: "r2", stationId: "EV001", user: "Priya N.", rating: 5, text: "Clean, well-lit and right on SG Highway. Booked through app, no waiting.", date: "5 days ago" },
  { id: "r3", stationId: "EV001", user: "Aakash D.", rating: 4, text: "Great location but busy on weekends — book a slot ahead.", date: "1 week ago" },
  { id: "r4", stationId: "EV006", user: "Sneha L.", rating: 5, text: "150 kW Ultra Fast in BKC — my MG ZS EV charged before my chai was ready.", date: "3 days ago" },
];