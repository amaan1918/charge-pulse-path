import { useEffect, useRef } from "react";
import type { Station } from "@/lib/stations";

declare global {
  interface Window {
    google?: any;
    __initEvMap?: () => void;
  }
}

let loaderPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
  if (!key) return Promise.reject(new Error("Missing Google Maps key"));

  loaderPromise = new Promise((resolve, reject) => {
    window.__initEvMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initEvMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

interface Props {
  stations: Station[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const DARK_STYLE: any[] = [
  { elementType: "geometry", stylers: [{ color: "#0b1410" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1410" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ea69a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2a22" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0b1410" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#06140f" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1a2a22" }] },
];

export function GoogleMap({ stations, selectedId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !ref.current || !window.google) return;
        const g = window.google.maps;
        mapRef.current = new g.Map(ref.current, {
          center: { lat: 39.5, lng: -98.35 },
          zoom: 4,
          disableDefaultUI: true,
          zoomControl: true,
          styles: DARK_STYLE,
          backgroundColor: "#0b1410",
        });

        const bounds = new g.LatLngBounds();
        stations.forEach((s) => {
          const marker = new g.Marker({
            position: { lat: s.lat, lng: s.lng },
            map: mapRef.current,
            title: s.name,
            icon: {
              path: g.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: s.available > 0 ? "#22c55e" : "#ef4444",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
            animation: g.Animation.DROP,
          });
          marker.addListener("click", () => onSelect(s.id));
          markersRef.current.set(s.id, marker);
          bounds.extend({ lat: s.lat, lng: s.lng });
        });
        if (stations.length) mapRef.current.fitBounds(bounds, 60);
      })
      .catch((e) => console.error(e));
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker visibility based on filtered stations
  useEffect(() => {
    if (!mapRef.current || !window.google) return;
    const ids = new Set(stations.map((s) => s.id));
    markersRef.current.forEach((marker, id) => {
      marker.setMap(ids.has(id) ? mapRef.current : null);
    });
  }, [stations]);

  // Animate + pan to selected
  useEffect(() => {
    if (!mapRef.current || !window.google || !selectedId) return;
    const g = window.google.maps;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    mapRef.current.panTo(marker.getPosition());
    if (mapRef.current.getZoom() < 11) mapRef.current.setZoom(12);
    marker.setAnimation(g.Animation.BOUNCE);
    const t = setTimeout(() => marker.setAnimation(null), 1400);
    return () => clearTimeout(t);
  }, [selectedId]);

  return <div ref={ref} className="h-full min-h-[500px] w-full" />;
}