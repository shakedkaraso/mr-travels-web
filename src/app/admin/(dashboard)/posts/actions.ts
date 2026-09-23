"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published: boolean;
};

function readPostInput(formData: FormData): PostInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createPost(formData: FormData) {
  const input = readPostInput(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("posts").insert({
    ...input,
    published_at: input.published ? new Date().toISOString() : null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const input = readPostInput(formData);
  const supabase = await createClient();

  // Only stamp a fresh published_at when going from unpublished -> published;
  // re-saving an already-published post shouldn't bump its publish date.
  let publishedAt: string | null = null;
  if (input.published) {
    const { data: existing } = await supabase.from("posts").select("published_at").eq("id", id).single();
    publishedAt = existing?.published_at ?? new Date().toISOString();
  }

  const { error } = await supabase
    .from("posts")
    .update({ ...input, updated_at: new Date().toISOString(), published_at: publishedAt })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/posts");
}
