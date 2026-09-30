import ReviewForm from "@/components/admin/ReviewForm";
import { createReview } from "@/app/admin/(dashboard)/reviews/actions";

export default function NewReviewPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">ביקורת חדשה</h1>
      <ReviewForm action={createReview} submitLabel="הוספה" />
    </div>
  );
}
