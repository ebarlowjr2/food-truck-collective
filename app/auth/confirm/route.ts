import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email-confirmation endpoint for the server-side (SSR) auth flow. Handles both
 * link formats so it works whether or not the email template is customized:
 *
 *  1. token_hash flow (recommended, cross-device): customize the "Confirm
 *     signup" template to point here —
 *       {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
 *  2. code flow (Supabase's DEFAULT template): the default confirmation link
 *     verifies with Supabase, then redirects here with ?code=... which we
 *     exchange for a session. Works when confirmed in the same browser.
 *
 * On success the session cookie is set and the vendor is signed in.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/?confirmed=1";

  const redirectTo = new URL(next, request.url);
  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(redirectTo);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(redirectTo);
  }

  return NextResponse.redirect(new URL("/vendors/login?error=confirm", request.url));
}
