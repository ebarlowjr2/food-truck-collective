export interface ParsedCheckIn {
  checkInId: string;
  address: string;
  when?: string;
}

/**
 * Parse an inbound SMS body into a check-in.
 *
 * Expected shape: `<ID> <address>; <day & time>`
 *   e.g. "AL-7K9Q 1728 1st Ave N, Birmingham; Sat 11am-2pm"
 *
 * The address/when separator is forgiving: `;`, `|`, or a newline all work.
 * If no separator is present, the whole remainder is treated as the address.
 */
export function parseCheckInText(body: string): ParsedCheckIn | null {
  const trimmed = body.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(\S+)\s+([\s\S]+)$/);
  if (!match) return null;

  const checkInId = match[1].toUpperCase();
  const rest = match[2].trim();
  const [address, when] = rest.split(/\s*[;|\n]\s*/);

  if (!address?.trim()) return null;
  return {
    checkInId,
    address: address.trim(),
    when: when?.trim() || undefined,
  };
}

/**
 * Geocode a free-text address to lat/lng using OpenStreetMap Nominatim
 * (no API key — matches our map tiles). Biased to Alabama when no state is given.
 * Returns null if nothing is found.
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  const query = /\b(al|alabama)\b/i.test(address) ? address : `${address}, Alabama`;
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=us&q=" +
    encodeURIComponent(query);

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim requires a descriptive User-Agent.
        "User-Agent": "CentralALFoodTrucks/1.0 (SMS check-in geocoder)",
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
