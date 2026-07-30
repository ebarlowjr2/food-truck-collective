import { createClient } from "./supabase/server";
import type { LiveTruck } from "./live";
import type { VendorType, CheckIn } from "./types";

/**
 * Server-only live-data layer. Reads vendors + check_ins from Supabase and
 * shapes them for the map. Do not import this from client components.
 */

// Marker palette (same hues the original seed used), picked deterministically
// per business name so a given truck always gets the same color.
const PALETTE = [
  "#E4572E",
  "#8C3B1B",
  "#F6AE2D",
  "#2E86AB",
  "#C1272D",
  "#6A4C93",
  "#E09F3E",
  "#D1495B",
  "#EF3E36",
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

// Cuisine keyword -> emoji. First match wins; falls back by rig type.
const CUISINE_EMOJI: [RegExp, string][] = [
  [/taco|mexican|burrito/, "🌮"],
  [/bbq|barbecue|smoke|brisket/, "🍖"],
  [/cheese|grilled cheese|melt/, "🧀"],
  [/seafood|shrimp|fish|crab|oyster/, "🦐"],
  [/hot dog|dawg|sausage|brat/, "🌭"],
  [/a[çc]a[íi]|bowl|healthy|juice|smoothie|vegan/, "🥣"],
  [/indian|curry|naan|masala/, "🍛"],
  [/waffle|pancake|breakfast|brunch/, "🧇"],
  [/chicken|wing|tender/, "🍗"],
  [/burger|smash/, "🍔"],
  [/pizza|italian|pasta/, "🍕"],
  [/coffee|espresso|latte/, "☕"],
  [/dessert|ice cream|cookie|donut|sweet/, "🍦"],
  [/bbq|soul|comfort/, "🍽️"],
];

const VENDOR_TYPE_EMOJI: Record<VendorType, string> = {
  truck: "🚚",
  trailer: "🚛",
  table: "🍽️",
  tent: "⛺",
};

function emojiFor(cuisine: string, vendorType: VendorType): string {
  const c = cuisine.toLowerCase();
  for (const [re, emoji] of CUISINE_EMOJI) {
    if (re.test(c)) return emoji;
  }
  return VENDOR_TYPE_EMOJI[vendorType] ?? "🍽️";
}

/**
 * Every vendor that currently has a location, newest check-in first. A vendor
 * appears on the map only once it has at least one geocoded check-in.
 */
export async function getLiveTrucks(): Promise<LiveTruck[]> {
  const supabase = await createClient();

  const [vendorsRes, checkInsRes] = await Promise.all([
    supabase
      .from("vendors")
      .select(
        "id, check_in_id, business_name, vendor_type, cuisine, description, phone, menu_url, website, facebook, instagram, x"
      ),
    supabase
      .from("check_ins")
      .select("check_in_id, address, when_text, lat, lng, received_at")
      .eq("geocoded", true)
      .not("lat", "is", null)
      .not("lng", "is", null)
      .order("received_at", { ascending: false }),
  ]);

  if (vendorsRes.error) throw vendorsRes.error;
  if (checkInsRes.error) throw checkInsRes.error;

  // check_ins are newest-first, so the first row per vendor is their latest.
  const latestByVendor = new Map<string, (typeof checkInsRes.data)[number]>();
  for (const ci of checkInsRes.data ?? []) {
    if (!latestByVendor.has(ci.check_in_id)) latestByVendor.set(ci.check_in_id, ci);
  }

  const trucks: LiveTruck[] = [];
  for (const v of vendorsRes.data ?? []) {
    const ci = latestByVendor.get(v.check_in_id);
    if (!ci || ci.lat == null || ci.lng == null) continue;

    trucks.push({
      id: v.id,
      checkInId: v.check_in_id,
      name: v.business_name,
      cuisine: v.cuisine,
      vendorType: v.vendor_type,
      description: v.description,
      phone: v.phone,
      instagram: v.instagram,
      website: v.website,
      facebook: v.facebook,
      x: v.x,
      menuUrl: v.menu_url,
      emoji: emojiFor(v.cuisine, v.vendor_type),
      color: colorFor(v.business_name),
      lat: ci.lat,
      lng: ci.lng,
      address: ci.address,
      when: ci.when_text,
      lastCheckInAt: ci.received_at,
    });
  }

  // Most-recently-seen first.
  trucks.sort((a, b) => Date.parse(b.lastCheckInAt) - Date.parse(a.lastCheckInAt));
  return trucks;
}

/** Recent check-ins for the webhook GET endpoint (testing / admin). */
export async function recentCheckIns(limit = 20): Promise<CheckIn[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("check_ins")
    .select("check_in_id, from_phone, raw_text, address, when_text, lat, lng, geocoded, received_at")
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((c) => ({
    checkInId: c.check_in_id,
    from: c.from_phone ?? "",
    rawText: c.raw_text ?? "",
    address: c.address,
    when: c.when_text ?? undefined,
    lat: c.lat ?? undefined,
    lng: c.lng ?? undefined,
    geocoded: c.geocoded,
    receivedAt: c.received_at,
  }));
}
