"use client";

import { useState } from "react";

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export type PageFormValues = { title: string; slug: string; content: string; published: boolean };

export default function PageForm({
  action,
  initial,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  initial?: PageFormValues;
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="title">
          כותרת
        </label>
        <input
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="slug">
          כתובת (slug)
        </label>
        <input
          id="slug"
          name="slug"
          required
          dir="ltr"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugTouched(true);
          }}
          className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-end text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="content">
          תוכן
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={16}
          defaultValue={initial?.content ?? ""}
          className="w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm leading-relaxed text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
        <input type="checkbox" name="published" defaultChecked={initial?.published ?? false} className="h-4 w-4" />
        פרסום מיידי
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
