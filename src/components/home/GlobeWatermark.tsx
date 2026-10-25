"use client";

import { useEffect, useRef } from "react";

/** Spins in place as the page scrolls - tied directly to scroll position
 * (not a timed animation), so it reads as the globe "rolling" with you. */
export default function GlobeWatermark({ className }: { className?: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      const deg = (window.scrollY / 4) % 360;
      if (ref.current) ref.current.style.transform = `rotate(${deg}deg)`;
    }
    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // Positioning (the translate offset the caller passes in className) lives
    // on this wrapper; the scroll-driven rotation is set via inline style on
    // the image itself, so the two transforms don't fight over the same
    // element's `transform` property.
    <div className={`pointer-events-none ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/globe-watermark.jpg`}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-contain opacity-25 will-change-transform"
      />
    </div>
  );
}
