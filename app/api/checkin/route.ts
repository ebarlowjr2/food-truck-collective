import { NextResponse } from "next/server";
import { parseCheckInText, geocodeAddress } from "@/lib/checkin";
import { recentCheckIns } from "@/lib/liveData";
import { createClient } from "@/lib/supabase/server";
import { verifyTwilioSignature, twilioWebhookUrl } from "@/lib/twilio";
import { CHECKIN_EXAMPLE } from "@/lib/config";

function escapeXml(input: string): string {
  return input.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] ?? c
  );
}

/** Reply to Twilio with TwiML so the vendor gets an SMS confirmation. */
function twiml(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(
    message
  )}</Message></Response>`;
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}

/**
 * Inbound SMS webhook.
 *
 * Point your Twilio number's "A message comes in" webhook here (POST).
 * Twilio sends `application/x-www-form-urlencoded` with `From` and `Body`.
 * JSON is also accepted for easy local testing (no signature required).
 *
 * Security: when `TWILIO_AUTH_TOKEN` is set, form-encoded requests must carry a
 * valid `X-Twilio-Signature`, so only genuine Twilio traffic is accepted.
 */
export async function POST(req: Request): Promise<NextResponse> {
  const contentType = req.headers.get("content-type") ?? "";

  let from = "";
  let body = "";
  if (contentType.includes("application/json")) {
    const json = (await req.json()) as Record<string, string>;
    from = json.From ?? json.from ?? "";
    body = json.Body ?? json.body ?? "";
  } else {
    const form = await req.formData();
    const params: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      params[key] = typeof value === "string" ? value : "";
    }
    from = params.From ?? "";
    body = params.Body ?? "";

    // Reject spoofed webhooks once an Auth Token is configured.
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (authToken) {
      const signature = req.headers.get("x-twilio-signature");
      const url = twilioWebhookUrl(req);
      if (!verifyTwilioSignature(url, params, signature, authToken)) {
        console.error("check-in: rejected invalid Twilio signature", {
          url,
          hasSignature: Boolean(signature),
        });
        return new NextResponse("Invalid Twilio signature", { status: 403 });
      }
    }
  }

  const parsed = parseCheckInText(body);
  if (!parsed) {
    return twiml(
      `We couldn't read that. Text: <YourID> <address>; <day & time>. Example: ${CHECKIN_EXAMPLE}`
    );
  }

  const supabase = await createClient();

  // Only registered vendors can place themselves on the map.
  const { data: vendor, error: vendorErr } = await supabase
    .from("vendors")
    .select("check_in_id")
    .eq("check_in_id", parsed.checkInId)
    .maybeSingle();

  if (vendorErr) {
    console.error("check-in: vendor lookup failed", vendorErr);
    return twiml("Something went wrong on our end. Please try again in a minute.");
  }
  if (!vendor) {
    return twiml(
      `We don't recognize the ID "${parsed.checkInId}". List your truck to get your check-in ID, then text your spot.`
    );
  }

  const geo = await geocodeAddress(parsed.address);

  const { error: insertErr } = await supabase.from("check_ins").insert({
    check_in_id: parsed.checkInId,
    from_phone: from || null,
    raw_text: body,
    address: parsed.address,
    when_text: parsed.when ?? null,
    lat: geo?.lat ?? null,
    lng: geo?.lng ?? null,
    geocoded: Boolean(geo),
  });

  if (insertErr) {
    console.error("check-in: insert failed", insertErr);
    return twiml("Something went wrong saving your check-in. Please try again in a minute.");
  }

  if (!geo) {
    return twiml(
      `Got your check-in, but we couldn't pin "${parsed.address}". Try adding a city + state. We saved it for ${
        parsed.when ?? "today"
      }.`
    );
  }

  return twiml(
    `You're on the map! ${parsed.checkInId} at ${parsed.address}${
      parsed.when ? ` (${parsed.when})` : ""
    }. Customers can find you now.`
  );
}

/** Recent check-ins — handy for testing and, later, feeding the live map. */
export async function GET(): Promise<NextResponse> {
  const checkIns = await recentCheckIns();
  return NextResponse.json({ checkIns });
}
