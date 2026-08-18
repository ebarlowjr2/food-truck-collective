import type { VendorType } from "./types";

/**
 * A vendor as shown on the live map: their profile joined with the location
 * from their most recent geocoded check-in. Built server-side in
 * `lib/liveData.ts`; consumed by the (client) map + list components.
 *
 * This replaces the seeded `Truck` type as the map's data source. There are no
 * weekly `hours` here — a vendor's presence is driven by check-ins ("text your
 * location"), not a fixed schedule.
 */
export interface LiveTruck {
  /** Vendor id (uuid). */
  id: string;
  /** Short textable code, e.g. "AL-7K9Q". */
  checkInId: string;
  name: string;
  cuisine: string;
  vendorType: VendorType;
  description: string | null;
  phone: string;
  instagram: string | null;
  website: string | null;
  facebook: string | null;
  x: string | null;
  menuUrl: string | null;
  /** Emoji marker glyph, derived from cuisine / rig type. */
  emoji: string;
  /** Brand hex color for the marker, derived deterministically from the name. */
  color: string;
  /** Location from the latest geocoded check-in. */
  lat: number;
  lng: number;
  address: string;
  /** Free-text day/time window from the check-in, e.g. "Sat 11am-2pm". */
  when: string | null;
  /** ISO timestamp of the latest check-in. */
  lastCheckInAt: string;
}

export interface LiveStatus {
  /** "open" here means "live now" — checked in within the live window. */
  open: boolean;
  label: string;
}

/** A vendor is "live" if their latest check-in landed within this window. */
const LIVE_WINDOW_MS = 12 * 60 * 60 * 1000;

function relativeTime(fromMs: number): string {
  const mins = Math.max(0, Math.round(fromMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

/**
 * Live status for a truck, shaped like the old `getStatus` so the map + list
 * can consume it the same way. `open` = live now; the label shows the check-in
 * window when available, otherwise how long ago they checked in.
 */
export function getLiveStatus(truck: LiveTruck, now: Date = new Date()): LiveStatus {
  const ageMs = now.getTime() - Date.parse(truck.lastCheckInAt);
  const live = ageMs >= 0 && ageMs < LIVE_WINDOW_MS;

  if (live) {
    return { open: true, label: truck.when ?? `Checked in ${relativeTime(ageMs)}` };
  }
  return { open: false, label: `Last seen ${relativeTime(ageMs)}` };
}
