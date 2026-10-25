"use client";

import { useEffect, useRef, useState } from "react";

/** Fades and slides in once scrolled into view, instead of just appearing. */
export default function MagnifyingGlassWatermark({ className }: { className?: string }) {
  const ref = useRef<HTMLImageElement>(null);
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/magnifying-glass-watermark.webp`}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none object-contain transition-all duration-1000 ease-out ${
        visible ? "translate-x-0 opacity-25" : "-translate-x-10 opacity-0"
      } ${className ?? ""}`}
    />
  );
}
