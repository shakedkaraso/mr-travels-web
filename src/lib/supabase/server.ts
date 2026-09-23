import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Server Component / Server Action / Route Handler Supabase client. Reads
 * the auth session from cookies; writes are best-effort (a plain Server
 * Component can't set cookies — session refresh there is a no-op, which is
 * fine since middleware.ts already refreshes the session on every request). */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — middleware handles refresh instead.
        }
      },
    },
  });
}
