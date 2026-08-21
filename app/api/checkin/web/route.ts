import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processCheckIn } from "@/lib/checkinService";

/**
 * Web check-in: a vendor enters their private code + location on /checkin.
 * The code is their credential (same trust model as SMS), so it must be kept
 * private. Returns JSON for the form to render.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: { code?: string; address?: string; when?: string };
  try {
    body = (await req.json()) as { code?: string; address?: string; when?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase();
  const address = (body.address ?? "").trim();
  const when = (body.when ?? "").trim();

  if (!code || !address) {
    return NextResponse.json(
      { error: "Enter your check-in code and where you're parked." },
      { status: 400 }
    );
  }
  if (!/^AL-/.test(code)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid check-in code (they look like AL-7K9Q)." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const result = await processCheckIn(supabase, {
    checkInId: code,
    address,
    when: when || null,
    rawText: `web: ${code} ${address}${when ? `; ${when}` : ""}`,
  });

  if (result.status === "unknown_vendor") {
    return NextResponse.json(
      { error: `We don't recognize the code ${code}. Double-check it, or list your truck to get one.` },
      { status: 404 }
    );
  }
  if (result.status === "error") {
    return NextResponse.json(
      { error: "Something went wrong saving your check-in. Please try again." },
      { status: 500 }
    );
  }
  if (!result.geocoded) {
    return NextResponse.json({
      ok: true,
      geocoded: false,
      message: `Saved${when ? ` for ${when}` : ""}, but we couldn't pin "${address}". Add a city + state so customers can find you.`,
    });
  }
  return NextResponse.json({
    ok: true,
    geocoded: true,
    message: "You're on the map! Customers can find you now.",
  });
}
