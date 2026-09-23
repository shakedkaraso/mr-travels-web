import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Handles Supabase's invite/magic-link/password-recovery redirect (PKCE
 * `code` param), exchanges it for a session, then sends the now-logged-in
 * user to set their own password — never seen or typed by anyone but her. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/admin/set-password", request.url));
}
