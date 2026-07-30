import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

/** Browser Supabase client — used for Auth (signup / login) in client components. */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
