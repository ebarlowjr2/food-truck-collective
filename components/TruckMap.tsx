"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LiveTruck } from "@/lib/live";
import { getLiveStatus } from "@/lib/live";

function pinIcon(truck: LiveTruck, active: boolean): L.DivIcon {
  const size = active ? 52 : 42;
  return L.divIcon({
    className: "truck-pin-wrap",
    html: `<div class="truck-pin${active ? " is-active" : ""}" style="--pin:${truck.color}">
        <span class="truck-pin__glyph">${truck.emoji}</span>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size - 4],
    popupAnchor: [0, -(size - 8)],
  });
}

/**
 * Initial map focus. Launching in the Montgomery, AL region for now, so the map
 * centers here on load. Trucks elsewhere are still on the map — pan/zoom to reach
 * them, or tap one in the list to fly there.
 */
const MONTGOMERY_CENTER: [number, number] = [32.3668, -86.3];
const MONTGOMERY_ZOOM = 11;

/** Fly to and open the popup for the selected truck. */
function FlyToSelected({
  truck,
  markerRefs,
}: {
  truck: LiveTruck | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();
  useEffect(() => {
    if (!truck) return;
    map.flyTo([truck.lat, truck.lng], Math.max(map.getZoom(), 12), { duration: 0.8 });
    const marker = markerRefs.current[truck.id];
    if (marker) {
      // Open once the fly animation has mostly settled.
      const t = setTimeout(() => marker.openPopup(), 350);
      return () => clearTimeout(t);
    }
  }, [truck, map, markerRefs]);
  return null;
}

export interface TruckMapProps {
  trucks: LiveTruck[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TruckMap({ trucks, selectedId, onSelect }: TruckMapProps) {
  const markerRefs = useMemo<{ current: Record<string, L.Marker | null> }>(
    () => ({ current: {} }),
    []
  );
  const selectedTruck = trucks.find((t) => t.id === selectedId) ?? null;

  return (
    <MapContainer
      center={MONTGOMERY_CENTER}
      zoom={MONTGOMERY_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToSelected truck={selectedTruck} markerRefs={markerRefs} />
      {trucks.map((truck) => {
        const status = getLiveStatus(truck);
        return (
          <Marker
            key={truck.id}
            position={[truck.lat, truck.lng]}
            icon={pinIcon(truck, truck.id === selectedId)}
            ref={(m) => {
              markerRefs.current[truck.id] = m;
            }}
            eventHandlers={{ click: () => onSelect(truck.id) }}
          >
            <Popup>
              <div className="truck-popup">
                <div className="truck-popup__title">
                  <span aria-hidden>{truck.emoji}</span> {truck.name}
                </div>
                <div className="truck-popup__meta">
                  {truck.cuisine} · {truck.address}
                </div>
                <div
                  className={`truck-popup__status ${status.open ? "is-open" : "is-closed"}`}
                >
                  {status.open ? "● " : "○ "}
                  {status.label}
                </div>
                {truck.menuUrl && (
                  <a
                    className="truck-popup__menu"
                    href={truck.menuUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 View menu
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
