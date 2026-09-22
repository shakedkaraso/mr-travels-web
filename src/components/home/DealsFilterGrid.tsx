"use client";

import { useState } from "react";
import type { Deal } from "@/lib/hot-deals";
import DealCard from "@/components/home/DealCard";

type FilterId = "christmas" | "holiday" | "lastMinute";

export default function DealsFilterGrid({
  christmasDeals,
  lastMinuteDeals,
}: {
  christmasDeals: Deal[];
  lastMinuteDeals: Deal[];
}) {
  const [active, setActive] = useState<FilterId>("christmas");

  const deals = active === "christmas" ? christmasDeals : active === "lastMinute" ? lastMinuteDeals : [];

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[42px] font-extrabold text-brand-dark">דילים חמים לטיול הבא שלך</h2>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="חופשה בחג המולד" active={active === "christmas"} onClick={() => setActive("christmas")} />
          <FilterChip label="Holiday Specials" active={active === "holiday"} onClick={() => setActive("holiday")} />
          <FilterChip label="דקה ה-90" active={active === "lastMinute"} onClick={() => setActive("lastMinute")} />
        </div>
      </div>

      <a href="/deals" className="mb-8 inline-block text-[18px] font-semibold text-brand-pink hover:underline">
        לעוד דילים שווים ←
      </a>

      {deals.length === 0 ? (
        <p className="text-brand-ink-soft">לא נמצאו דילים בקטגוריה הזו כרגע.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, index) => (
            <DealCard key={deal.bookingUrl} deal={deal} index={index} />
          ))}
        </div>
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
