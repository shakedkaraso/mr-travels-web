"use client";

import { useRef, useState } from "react";
import type { Deal } from "@/lib/hot-deals";
import type { DestinationPhoto } from "@/lib/destination-photos";
import DealCard from "@/components/home/DealCard";

type FilterId = "christmas" | "lastMinute";
type DealWithPhoto = Deal & { photo: DestinationPhoto | null };

export default function DealsFilterGrid({
  christmasDeals,
  lastMinuteDeals,
}: {
  christmasDeals: DealWithPhoto[];
  lastMinuteDeals: DealWithPhoto[];
}) {
  const [active, setActive] = useState<FilterId>("christmas");
  const trackRef = useRef<HTMLDivElement>(null);

  const deals = active === "christmas" ? christmasDeals : lastMinuteDeals;

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 280) + 24;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[42px] font-extrabold text-brand-dark">דילים חמים לטיול הבא שלך</h2>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="לחופשה בכריסמס" active={active === "christmas"} onClick={() => setActive("christmas")} />
          <FilterChip label="דקה ה-90" active={active === "lastMinute"} onClick={() => setActive("lastMinute")} />
        </div>
      </div>

      <a href="/deals" className="mb-8 inline-block text-[18px] font-semibold text-brand-pink hover:underline">
        לעוד דילים שווים ←
      </a>

      {deals.length === 0 ? (
        <p className="text-brand-ink-soft">לא נמצאו דילים בקטגוריה הזו כרגע.</p>
      ) : (
        <>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3"
          >
            {deals.map((deal, index) => (
              <div key={deal.bookingUrl} data-card className="w-full shrink-0 snap-center sm:w-auto sm:shrink sm:snap-none">
                <DealCard deal={deal} index={index} photo={deal.photo} />
              </div>
            ))}
          </div>

          {deals.length > 1 && (
            <div className="mt-4 flex justify-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="הדיל הקודם"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-brand-ink-soft transition-colors hover:bg-brand-paper"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                  <path d="M7.5 5 12.5 10l-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="הדיל הבא"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line text-brand-ink-soft transition-colors hover:bg-brand-paper"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                  <path d="M12.5 5 7.5 10l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-brand-ink text-white" : "bg-white text-brand-ink-soft hover:bg-brand-ink/5"
      }`}
    >
      {label}
    </button>
  );
}
