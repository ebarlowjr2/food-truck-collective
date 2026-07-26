export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

/** 24-hour clock times, e.g. { open: "11:00", close: "20:00" }. */
export interface DayHours {
  open: string;
  close: string;
}

/** A truck's weekly schedule. `null` for a day means closed that day. */
export type WeeklyHours = Record<DayKey, DayHours | null>;

export type PriceRange = "$" | "$$" | "$$$";

export interface Truck {
  id: string;
  name: string;
  cuisine: string;
  /** Emoji used as the map marker glyph. */
  emoji: string;
  /** Brand hex color for the marker + accents. */
  color: string;
  description: string;
  city: string;
  lat: number;
  lng: number;
  hours: WeeklyHours;
  phone?: string;
  instagram?: string;
  specialties: string[];
  priceRange: PriceRange;
}
