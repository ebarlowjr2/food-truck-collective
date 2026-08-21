import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { geocodeAddress } from "./checkin";

/**
 * Shared check-in pipeline used by every channel (SMS webhook, web form, and
 * later email): confirm the code belongs to a real vendor, geocode the address,
 * and record the check-in. The latest geocoded row per vendor is what the live
 * map reads.
 */
export type CheckInResult =
  | { status: "unknown_vendor" }
  | { status: "error" }
  | { status: "saved"; geocoded: boolean; lat: number | null; lng: number | null };

export interface CheckInInput {
  checkInId: string;
  address: string;
  when?: string | null;
  fromPhone?: string | null;
  rawText?: string | null;
}

export async function processCheckIn(
  supabase: SupabaseClient<Database>,
  input: CheckInInput
): Promise<CheckInResult> {
  // Only registered vendors can place themselves on the map.
  const { data: vendor, error: vendorErr } = await supabase
    .from("vendors")
    .select("check_in_id")
    .eq("check_in_id", input.checkInId)
    .maybeSingle();

  if (vendorErr) {
    console.error("check-in: vendor lookup failed", vendorErr);
    return { status: "error" };
  }
  if (!vendor) return { status: "unknown_vendor" };

  const geo = await geocodeAddress(input.address);

  const { error: insertErr } = await supabase.from("check_ins").insert({
    check_in_id: input.checkInId,
    from_phone: input.fromPhone ?? null,
    raw_text: input.rawText ?? null,
    address: input.address,
    when_text: input.when ?? null,
    lat: geo?.lat ?? null,
    lng: geo?.lng ?? null,
    geocoded: Boolean(geo),
  });

  if (insertErr) {
    console.error("check-in: insert failed", insertErr);
    return { status: "error" };
  }

  return {
    status: "saved",
    geocoded: Boolean(geo),
    lat: geo?.lat ?? null,
    lng: geo?.lng ?? null,
  };
}
