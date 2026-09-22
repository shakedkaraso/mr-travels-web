"use client";

import { useId, useState } from "react";
import Link from "next/link";

type Variant = "footer" | "popup" | "hero";

const VARIANT_STYLES: Record<Variant, { input: string; button: string; label: string }> = {
  footer: {
    input:
      "flex-1 min-w-0 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-pink",
    button:
      "shrink-0 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    label: "text-white/70",
  },
  popup: {
    input:
      "flex-1 min-w-0 rounded-full border border-brand-line bg-white px-4 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-soft focus:outline-none focus:ring-2 focus:ring-brand-pink",
    button:
      "shrink-0 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
    label: "text-brand-ink-soft",
  },
  hero: {
    input:
      "flex-1 min-w-0 rounded-full border border-brand-line bg-white px-4 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-soft focus:outline-none focus:ring-2 focus:ring-brand-pink",
    button:
      "shrink-0 rounded-full bg-brand-pink px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink",
    label: "text-brand-ink-soft",
  },
};

export default function NewsletterForm({ variant = "footer" }: { variant?: Variant }) {
  const emailId = useId();
  const consentId = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const styles = VARIANT_STYLES[variant];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    // TODO(supabase): insert into `leads` table once Supabase is wired into this project.
    window.setTimeout(() => setStatus("success"), 400);
  }

  if (status === "success") {
    return <p className={`text-sm font-medium ${variant === "footer" ? "text-white" : "text-brand-ink"}`}>תודה! נעדכן אתכם בדילים החמים ביותר 🎉</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="flex gap-2">
        <label htmlFor={emailId} className="sr-only">
          כתובת אימייל
        </label>
        <input
          id={emailId}
          type="email"
          required
          placeholder="האימייל שלכם"
          className={styles.input}
        />
        <button type="submit" disabled={status === "submitting"} className={styles.button}>
          {status === "submitting" ? "רגע..." : "הרשמה"}
        </button>
      </div>
      <div className="flex items-start gap-2">
        <input
          id={consentId}
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-brand-pink"
        />
        <label htmlFor={consentId} className={`text-xs leading-relaxed ${styles.label}`}>
          אני מאשר/ת למסור את פרטיי לצורך יצירת קשר ומתן מענה לפנייתי, בהתאם ל
          <Link href="/privacy" className="underline hover:text-brand-pink">
            מדיניות הפרטיות
          </Link>
        </label>
      </div>
    </form>
  );
}
