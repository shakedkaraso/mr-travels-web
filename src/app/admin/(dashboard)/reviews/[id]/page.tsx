import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReviewForm from "@/components/admin/ReviewForm";
import { updateReview } from "@/app/admin/(dashboard)/reviews/actions";

export default async function EditReviewPage({ params }: PageProps<"/admin/reviews/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: review } = await supabase.from("reviews").select("*").eq("id", id).single();

  if (!review) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">עריכת ביקורת</h1>
      <ReviewForm action={updateReview.bind(null, id)} initial={review} submitLabel="שמירה" />
    </div>
  );
}
