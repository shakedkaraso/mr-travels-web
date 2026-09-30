"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ReviewInput = {
  author: string;
  quote: string;
  review_date: string;
  published: boolean;
};

function readReviewInput(formData: FormData): ReviewInput {
  return {
    author: String(formData.get("author") ?? "").trim(),
    quote: String(formData.get("quote") ?? "").trim(),
    review_date: String(formData.get("review_date") ?? "").trim(),
    published: formData.get("published") === "on",
  };
}

export async function createReview(formData: FormData) {
  const input = readReviewInput(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert(input);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, formData: FormData) {
  const input = readReviewInput(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
