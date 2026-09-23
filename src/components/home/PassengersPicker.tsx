"use client";

import { useEffect, useRef, useState } from "react";

type CategoryKey = "adult" | "young" | "child" | "infant" | "senior";

const CATEGORIES: { key: CategoryKey; label: string; range: string; min: number }[] = [
  { key: "adult", label: "מבוגר", range: "24-64", min: 1 },
  { key: "young", label: "צעיר", range: "12-23", min: 0 },
  { key: "child", label: "ילד", range: "2-11", min: 0 },
  { key: "infant", label: "תינוק", range: "מתחת ל-2", min: 0 },
  { key: "senior", label: "פנסיונר", range: "65+", min: 0 },
];

export type PassengerCounts = { adults: number; children: number; infants: number };

/** Aviasales' deep-link format only knows adult/child/infant fares — "young"
 * and "senior" aren't real fare classes there, so they're folded into
 * "adults" for the booking link while staying separate in the picker UI
 * (useful on their own for the on-page passenger summary). */
function toAviasalesCounts(counts: Record<CategoryKey, number>): PassengerCounts {
  return {
    adults: counts.adult + counts.young + counts.senior,
    children: counts.child,
    infants: counts.infant,
  };
}

export default function PassengersPicker({ onChange }: { onChange?: (counts: PassengerCounts) => void }) {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Record<CategoryKey, number>>({
    adult: 1,
    young: 0,
    child: 0,
    infant: 0,
    senior: 0,
  });
  const rootRef = useRef<HTMLDivElement>(null);

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  useEffect(() => {
    onChange?.(toAviasalesCounts(counts));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function adjust(key: CategoryKey, delta: number) {
    setCounts((prev) => {
      const category = CATEGORIES.find((c) => c.key === key)!;
      const next = Math.max(category.min, prev[key] + delta);
      return { ...prev, [key]: next };
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full bg-brand-paper px-4 py-1.5 text-sm font-medium text-brand-ink-soft focus:outline-none focus:ring-2 focus:ring-brand-pink"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className={`h-3.5 w-3.5 fill-current transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {total} {total === 1 ? "נוסע" : "נוסעים"}
      </button>

      {open && (
        <div className="absolute end-0 z-20 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-2xl border border-brand-line bg-white p-4 shadow-2xl">
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => (
              <div key={category.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjust(category.key, 1)}
                    aria-label={`הוסף ${category.label}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink text-white transition-transform hover:scale-105"
                  >
                    +
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-brand-ink">{counts[category.key]}</span>
                  <button
                    type="button"
                    onClick={() => adjust(category.key, -1)}
                    disabled={counts[category.key] <= category.min}
                    aria-label={`הפחת ${category.label}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink-tint text-brand-pink transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>
                </div>
                <div className="text-end">
                  <div className="text-sm font-semibold text-brand-ink">{category.label}</div>
                  <div className="text-xs text-brand-ink-muted">({category.range})</div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 w-full rounded-full bg-brand-pink py-2 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
          >
            אישור
          </button>
        </div>
      )}
    </div>
  );
}
