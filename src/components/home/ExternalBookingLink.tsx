"use client";

import { useState, type ReactNode, type MouseEvent } from "react";
import { Lottie } from "lottie-react";
import airplaneAnimation from "@/lottie/airplane.json";

const REDIRECT_DELAY_MS = 2000;

/** A booking link to an external provider (Aviasales, etc.) that shows a
 * brief "you're being redirected" popup before actually opening the new
 * tab — the airplane animation is 120 frames at 60fps, i.e. exactly 2s,
 * so it plays once, start to finish, for the whole time the popup is up. */
export default function ExternalBookingLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    if (pending) return;
    // Popup blockers only allow window.open() synchronously inside the
    // click handler — opening it now (blank) and navigating it after the
    // delay keeps the tab allowed while still deferring the real request.
    // Deliberately not "noopener" here, since we need to keep this
    // reference to navigate it later; opener is severed manually instead.
    const newTab = window.open("", "_blank");
    if (newTab) newTab.opener = null;
    setPending(true);
    setTimeout(() => {
      if (newTab) newTab.location.href = href;
      else window.open(href, "_blank", "noopener,noreferrer");
      setPending(false);
    }, REDIRECT_DELAY_MS);
  }

  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} className={className}>
        {children}
      </a>
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" role="status" aria-live="polite">
          <div className="flex w-full max-w-xs flex-col items-center gap-2 rounded-[12px] border border-brand-pink bg-brand-dark px-8 py-8 text-center">
            <div className="h-20 w-20">
              <Lottie src={airplaneAnimation} autoplay className="h-full w-full" />
            </div>
            <p className="text-[15px] font-semibold leading-relaxed text-white">
              אתם ממשיכים כעת לספק חיצוני להמשך הזמנה.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
