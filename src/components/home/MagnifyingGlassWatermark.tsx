"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Background magnifying glass, mirrored left-to-right. Once scrolled into
 * view it slides in from the side and sways briefly, like it's searching,
 * then settles (see `magnifier-enter` in globals.css).
 *
 * Positioning (`className`) goes on the wrapper so the entrance animation
 * on the image can't clobber the caller's translate/position utilities.
 */
export default function MagnifyingGlassWatermark({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/magnifying-glass-watermark.webp`}
        alt=""
        className={`h-full w-full -scale-x-100 object-contain ${
          visible ? "magnifier-enter" : "opacity-0"
        }`}
      />
    </div>
  );
}
