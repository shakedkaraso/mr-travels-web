"use client";

import { useTransition } from "react";
import { deleteReview } from "@/app/admin/(dashboard)/reviews/actions";

export default function DeleteReviewButton({ id, author }: { id: string; author: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`למחוק את הביקורת של "${author}"? הפעולה לא הפיכה.`)) return;
    startTransition(() => deleteReview(id));
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="font-semibold text-brand-ink-muted hover:text-brand-pink disabled:opacity-50">
      {isPending ? "מוחק..." : "מחיקה"}
    </button>
  );
}
