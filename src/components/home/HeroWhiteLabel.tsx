"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * The Travelpayouts widget forces `document.documentElement.dir` to "ltr"
 * on load (to match its own English UI), which flips every RTL/logical-
 * property layout on the whole page, not just inside the widget. Pin it
 * back to "rtl" and keep it pinned if the widget re-applies its change.
 */
function usePinnedRtl() {
  useEffect(() => {
    const html = document.documentElement;
    const enforce = () => {
      if (html.getAttribute("dir") !== "rtl") html.setAttribute("dir", "rtl");
    };
    enforce();
    const observer = new MutationObserver(enforce);
    observer.observe(html, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, []);
}

export default function HeroWhiteLabel() {
  usePinnedRtl();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#0a3a4a] bg-cover bg-center"
        style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/beach.jpg')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/10 to-black/25" aria-hidden="true" />

      <div className="mx-auto max-w-5xl px-6 pb-40 pt-20 text-center sm:pb-48 sm:pt-28">
        <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl">
          מר טרוולס אלוף הטיסות
          <br />
          <span className="text-brand-dark">תכינו מזוודות</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/90 drop-shadow-sm sm:text-lg">
          מנוע החיפוש שלנו ימצא לך את הטיסות ליעדים הכי שווים בעולם!
        </p>
      </div>

      <div className="relative mx-auto -mt-28 max-w-4xl px-4 pb-16 sm:-mt-32">
        <div id="tpwl-search" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 pb-16">
        <div id="tpwl-tickets" />
      </div>

      <Script src="https://tpemb.com/wl_web/main.js?wl_id=22783" type="module" strategy="afterInteractive" />
    </section>
  );
}
