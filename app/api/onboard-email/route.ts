import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/emails/welcome";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://onthecurb.app";

/**
 * Sends the welcome/onboarding email after a vendor signs up. Called by the
 * onboarding form once signUp succeeds.
 *
 * The vendor's email is column-blocked from the anon role by RLS, so the
 * recipient is provided by the client. We confirm the code belongs to a real
 * vendor before sending. MVP tradeoff: a caller with a valid code could trigger
 * a (benign) welcome email to an address they supply — acceptable for now;
 * move to a service-role trigger (webhook / edge function) to make it airtight.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: { code?: string; email?: string };
  try {
    body = (await req.json()) as { code?: string; email?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase();
  const email = (body.email ?? "").trim();
  if (!/^AL-/.test(code) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: vendor } = await supabase
    .from("vendors")
    .select("business_name")
    .eq("check_in_id", code)
    .maybeSingle();

  // No such vendor — no-op without revealing anything.
  if (!vendor) {
    return NextResponse.json({ ok: true });
  }

  const { subject, html } = welcomeEmail({
    businessName: vendor.business_name,
    code,
    siteUrl: SITE_URL,
  });

  // Best-effort — never block onboarding on the email.
  await sendEmail({ to: email, subject, html });
  return NextResponse.json({ ok: true });
}
