import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../database.types";

/**
 * Per-request server Supabase client (server components, route handlers).
 * Reads/writes the auth session from cookies. Public data reads work without a
 * session; authenticated reads/writes pick up the logged-in vendor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore, the proxy
            // (proxy.ts) refreshes the session cookies on each request.
          }
        },
      },
    }
  );
}
