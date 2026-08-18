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

/* ---------------------------------------------------------------------------
 * Vendors (onboarding)
 * ------------------------------------------------------------------------- */

export type VendorType = "truck" | "trailer" | "table" | "tent";

export interface VendorLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
}

export interface Vendor {
  id: string;
  /** Short, human-textable code used for SMS check-ins, e.g. "AL-7K9Q". */
  checkInId: string;
  ownerName: string;
  email: string;
  businessName: string;
  vendorType: VendorType;
  cuisine: string;
  description?: string;
  phone: string;
  /** Name of the uploaded menu PDF (file itself lives in storage later). */
  menuFileName?: string;
  links: VendorLinks;
  /** Vendor has no website and opted into a free build from the collective. */
  wantsFreeWebsite: boolean;
  createdAt: string;
}

/* ---------------------------------------------------------------------------
 * SMS check-ins ("text your location")
 * ------------------------------------------------------------------------- */

export interface CheckIn {
  checkInId: string;
  /** Phone number the text came from. */
  from: string;
  rawText: string;
  address: string;
  /** Free-text day/time window, e.g. "Sat 11am-2pm". */
  when?: string;
  lat?: number;
  lng?: number;
  geocoded: boolean;
  receivedAt: string;
}
