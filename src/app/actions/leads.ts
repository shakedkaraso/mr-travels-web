"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitLead(input: { email: string; source: string; consent: boolean }): Promise<{ ok: boolean }> {
  if (!input.consent) return { ok: false };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    email: input.email,
    source: input.source,
    consent: input.consent,
  });

  return { ok: !error };
}
