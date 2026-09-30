import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteReviewButton from "@/components/admin/DeleteReviewButton";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, author, quote, review_date, published")
    .order("review_date", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-dark">ביקורות</h1>
        <Link href="/admin/reviews/new" className="rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.01]">
          + ביקורת חדשה
        </Link>
      </div>

      {!reviews || reviews.length === 0 ? (
        <p className="text-brand-ink-soft">עדיין אין ביקורות.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-line">
          <table className="w-full text-start text-sm">
            <thead className="bg-brand-paper text-brand-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">ממליץ</th>
                <th className="px-4 py-3 text-start font-semibold">תוכן</th>
                <th className="px-4 py-3 text-start font-semibold">סטטוס</th>
                <th className="px-4 py-3 text-start font-semibold">תאריך</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-medium text-brand-ink">{review.author}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-brand-ink-soft">{review.quote}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        review.published ? "bg-emerald-100 text-emerald-700" : "bg-brand-paper text-brand-ink-soft"
                      }`}
                    >
                      {review.published ? "מוצג" : "מוסתר"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink-muted">{new Date(review.review_date).toLocaleDateString("he-IL")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/reviews/${review.id}`} className="font-semibold text-brand-pink hover:underline">
                        עריכה
                      </Link>
                      <DeleteReviewButton id={review.id} author={review.author} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
