"use client";

import { useEffect, useRef, useState } from "react";
import NewsletterForm from "@/components/forms/NewsletterForm";

const SESSION_KEY = "mrtravels_deals_popup_shown";
const DELAY_MS = 8000;

export default function DealsPopup() {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="סגירת חלון"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-brand-ink/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deals-popup-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <button class="absolute-ve-41da"
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="סגירה"
          className="absolute top-3 inset-inline-end-3 flex h-8 w-8 items-center justify-center rounded-full text-brand-ink-soft transition-colors hover:bg-brand-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-pink [margin-block-end:20px]"
        >
          ✕
        </button>
        <h2 id="deals-popup-title" className="mb-1.5 text-lg font-extrabold text-brand-ink">
          לא רוצים לפספס דיל חם? 🔥
        </h2>
        <p className="mb-4 text-sm text-brand-ink-soft">
          הצטרפו לרשימת התפוצה וקבלו את הדילים הכי שווים לפני כולם.
        </p>
        <NewsletterForm variant="popup" />
      </div>
    </div>
  );
}
