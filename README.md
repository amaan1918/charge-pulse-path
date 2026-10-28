# EVChargeHub — Charge Smarter. Drive Further. ⚡

EVChargeHub is an electric-vehicle charging web application concept designed to help drivers discover charging stations, compare charger options, estimate charging costs, scan station QR codes, and plan EV road trips. The project focuses on an India-oriented experience, including station examples across Indian cities, state filters, and prices displayed in Indian rupees (₹).

> **Project/demo notice:** This repository currently contains sample station records and demo-style booking, dashboard, availability, and weather content. It is a project prototype—not a verified live charging network. A booking confirmation or QR scan in this app does not, by itself, reserve a real charger or start electrical charging.

## ✨ Main Features

### Charging station discovery
- Browse station cards with names, addresses, cities, states, charger types, charging speeds (kW), prices per kWh, ratings, amenities, and sample availability.
- Search and filter the station list by location, charger type, and availability.
- Open station detail pages for additional information.

### Station locator and map
- Explore stations using a map view and station list.
- Filter by city, state, charger type, and availability.
- View charger speed and example prices in ₹/kWh.

### QR scanner
- Open the Scan & Charge screen and scan station QR codes using the device camera.
- The current demo resolves recognised station IDs (for example, `EV001`) to entries in its local station dataset.
- Camera access is required, and browser/device support may vary.

### Booking flow
- Select a station, charger type, date and time, and enter vehicle details.
- The prototype displays a booking confirmation code.
- **This UI confirmation is not a live reservation** unless a compatible charging-network/reservation backend is connected.

### EV road-trip planner
- Choose a route, vehicle model, battery capacity and current charge level.
- Calculate suggested charging stops and estimate the energy, charging time and cost for each leg.
- The current project includes sample cities and local planning data; check real routes, station status and weather independently before driving.

### Charging cost calculator
- Estimate the energy needed between a starting and target battery percentage.
- Adjust battery capacity, charger power and tariff to estimate cost (₹) and charging duration.

### Driver dashboard and account flows
- Includes authentication screens and a driver dashboard concept with charging summaries, saved stations, upcoming bookings, and charging history.
- Supabase is used by the project for authentication and selected account/admin data flows. Some dashboard figures and records in the current interface are example/demo content.

### Admin console
- Includes an admin sign-in flow and protected admin dashboard concept for charging-network summaries and management-oriented views.
- Admin access requires correctly configured Supabase authentication and role data.

### Contextual popups
- Welcome and location prompts
- QR scan success and charging-completion dialogs
- Offer and weather-alert popups

These popups are user-interface features; they do not prove a real charger started, completed, or became available.

## 🧰 Technology Stack

- **React 19** and **TypeScript**
- **Vite** for development and production builds
- **TanStack Start** and **TanStack Router**
- **Tailwind CSS v4**
- **Radix UI** components and Lucide icons
- **Supabase** for supported authentication/data integration
- **html5-qrcode** for camera-based QR scanning
- **Framer Motion** for interface animations
- **Recharts** for dashboard charts

## 🚀 Run the Project Locally

### Requirements
- Node.js and npm (or Bun)
- A code editor such as Visual Studio Code

### Installation

```bash
git clone https://github.com/amaan1918/charge-pulse-path.git
cd charge-pulse-path
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

### Useful commands

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run build:dev  # Create a development-mode build
npm run preview    # Preview the production build
npm run lint       # Run ESLint
npm run format     # Format project files with Prettier
```

## 🔐 Environment Setup

The Supabase client expects these values to be configured through the project's environment setup:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Server-side code may also use `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, depending on the execution path. Configure credentials through your local environment or the deployment platform; do not put passwords, service-role keys, or other private secrets in client-side code or in a public repository.

## 📁 Project Structure

```text
src/
├── assets/          # EV and map imagery
├── components/      # Station cards, map, QR scanner, navbar, popups
│   └── ui/          # Reusable interface components
├── hooks/           # Shared hooks, including authentication helpers
├── integrations/    # Supabase and Lovable integration
├── lib/             # Station data, trip-planning logic, settings and utilities
├── routes/          # Homepage and application pages
├── styles.css       # Global styles and visual theme
├── router.tsx       # Router configuration
└── server.ts        # Server entry
supabase/            # Supabase configuration and migrations/functions (where present)
public/              # Public static assets
```

## 🇮🇳 India-Focused Experience

The sample station data includes Indian cities and states, with prices shown in rupees per kilowatt-hour (₹/kWh). The displayed station names, addresses, availability counts, tariffs, ratings and coordinates are illustrative project data unless verified independently with the relevant charging provider.

## ⚠️ Current Limitations

- **No confirmed live charger feed is established by the sample station dataset.** Availability, ratings, station details and several dashboard figures should be treated as demo content.
- The QR flow identifies a station from its QR payload; it does not itself control charger hardware or initiate a real charging session.
- The booking screen creates a prototype confirmation code. Real reservations, payments, refunds and charger control need a secure integration with appropriate providers.
- Road-trip recommendations and weather alerts use project-side/sample logic in parts of the current implementation; they should not replace live navigation, official weather services or charging-provider information.
- Map and Supabase integrations may require valid configuration. Camera-based QR scanning normally requires a secure context (HTTPS or localhost) and camera permission.
- Verify charger compatibility, actual tariffs, station hours, route conditions and availability before travelling.

## 🎓 Project Purpose

EVChargeHub is intended as an educational web development project that brings common EV-driver workflows—station discovery, charging estimates, QR scanning, booking UI, and road-trip planning—together in one responsive interface. It can be extended with verified station APIs, real-time charger status, secure payment integration, and provider-backed charging sessions.

## 👨‍💻 Author

**Amaan Khan**

Repository: [amaan1918/charge-pulse-path](https://github.com/amaan1918/charge-pulse-path)  
Live prototype: [charge-pulse-path.lovable.app](https://charge-pulse-path.lovable.app)

---

*Charge smarter. Drive further. Make every journey count.*
