import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Sign the vendor out and return home. Posted from the header form. */
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
