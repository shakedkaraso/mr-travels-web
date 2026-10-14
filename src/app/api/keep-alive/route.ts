import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Pinged by a Vercel Cron Job (see vercel.json) so the Supabase project
 * never sits idle long enough to hit the free-tier 7-day auto-pause. */
export async function GET() {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").select("id").limit(1);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
