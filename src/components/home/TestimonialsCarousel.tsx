"use client";

import { useRef } from "react";

export type Testimonial = { quote: string; author: string; meta: string };

export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 280) + 20;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <figure
            key={item.author}
            data-card
            className="w-72 shrink-0 snap-start rounded-2xl border border-brand-line bg-brand-paper p-6"
          >
            <div className="mb-3 flex gap-0.5 text-brand-pink" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                  <path d="M10 1.5 12.6 7.3l6.4.6-4.8 4.2 1.4 6.3L10 15.3l-5.6 3.1 1.4-6.3L1 7.9l6.4-.6L10 1.5Z" />
                </svg>
              ))}
            </div>
            <blockquote className="mb-4 text-sm leading-relaxed text-brand-ink">“{item.quote}”</blockquote>
            <figcaption className="text-xs font-semibold text-brand-ink-soft">
              {item.author} · {item.meta}
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="ביקורת הבאה"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-brand-ink-soft transition-colors hover:bg-brand-paper"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="ביקורת קודמת"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-brand-ink-soft transition-colors hover:bg-brand-paper"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              <path d="M7.5 5 12.5 10l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
