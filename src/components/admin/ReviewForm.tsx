"use client";

export type ReviewFormValues = {
  author: string;
  quote: string;
  review_date: string;
  published: boolean;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ReviewForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: ReviewFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="author">
          שם הממליץ
        </label>
        <input
          id="author"
          name="author"
          required
          defaultValue={initial?.author ?? ""}
          className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-4 py-3 text-lg font-semibold text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="quote">
          תוכן ההמלצה
        </label>
        <textarea
          id="quote"
          name="quote"
          required
          rows={4}
          defaultValue={initial?.quote ?? ""}
          className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm leading-relaxed text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="review_date">
          תאריך
        </label>
        <input
          id="review_date"
          name="review_date"
          type="date"
          dir="ltr"
          defaultValue={initial?.review_date ?? today()}
          className="w-full max-w-xs rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
        <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} className="h-4 w-4" />
        להציג בקרוסלה
      </label>

      <button
        type="submit"
        className="rounded-full bg-brand-pink px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
      >
        {submitLabel}
      </button>
    </form>
  );
}
