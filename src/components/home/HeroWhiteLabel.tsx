"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useTravelpayoutsRtl } from "@/components/home/useTravelpayoutsRtl";

/**
 * The widget renders flight results into whatever container is on the
 * CURRENT page, updating the URL with a `flightSearch` param but never
 * navigating anywhere itself. Cramming those results into this Hero
 * section (which has a fixed-height background image) breaks the
 * layout badly. Instead: as soon as a search happens here, send the
 * visitor to the dedicated /home-page2/results page, carrying the same
 * query — that page reads it on load and renders the same results,
 * with room to actually display them.
 */
function useRedirectSearchToResultsPage() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.search.includes("flightSearch=")) {
        clearInterval(interval);
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        window.location.assign(`${basePath}/home-page2/results${window.location.search}`);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);
}

export default function HeroWhiteLabel() {
  useTravelpayoutsRtl();
  useRedirectSearchToResultsPage();

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
        <p className="mx-auto mt-4 max-w-full text-base text-white/90 drop-shadow-sm sm:whitespace-nowrap sm:text-[24px]">
          מנוע החיפוש שלנו ימצא לך את הטיסות ליעדים הכי שווים בעולם!
        </p>
      </div>

      <div className="relative mx-auto -mt-28 max-w-4xl px-4 pb-16 sm:-mt-32">
        <div id="tpwl-search" />
      </div>

      <Script src="https://tpemb.com/wl_web/main.js?wl_id=22783" type="module" strategy="afterInteractive" />
    </section>
  );
}
