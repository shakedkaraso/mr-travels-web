"use client";

import { useTransition } from "react";
import { deletePost } from "@/app/admin/(dashboard)/posts/actions";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`למחוק את "${title}"? הפעולה לא הפיכה.`)) return;
    startTransition(() => deletePost(id));
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} className="font-semibold text-brand-ink-muted hover:text-brand-pink disabled:opacity-50">
      {isPending ? "מוחק..." : "מחיקה"}
    </button>
  );
}
