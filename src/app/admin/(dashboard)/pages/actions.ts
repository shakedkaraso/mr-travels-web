"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readPageInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createPage(formData: FormData) {
  const input = readPageInput(formData);
  const supabase = await createClient();
  const { error } = await supabase.from("pages").insert(input);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function updatePage(id: string, formData: FormData) {
  const input = readPageInput(formData);
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pages");
}
