"use client";

import Script from "next/script";
import { useTravelpayoutsRtl } from "@/components/home/useTravelpayoutsRtl";

export default function HeroWhiteLabel() {
  useTravelpayoutsRtl();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-[#0a3a4a] bg-cover bg-center"
        style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/beach.jpg')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/10 to-black/25" aria-hidden="true" />

      <div className="mx-auto max-w-5xl px-6 pb-40 pt-20 text-center sm:pb-48 sm:pt-28">
        <h1 className="text-[36px] font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl">
          מר טרוולס אלוף הטיסות
          <br />
          <span className="text-brand-dark">תכינו מזוודות</span>
        </h1>
        <p className="mx-auto mt-4 max-w-full text-[21px] text-white/90 drop-shadow-sm sm:whitespace-nowrap sm:text-[24px]">
          מנוע החיפוש שלנו ימצא לך את הטיסות ליעדים הכי שווים בעולם!
        </p>
      </div>

      <div className="relative mx-auto -mt-28 max-w-4xl px-4 pb-16 sm:-mt-32">
        <div id="tpwl-search" />
      </div>

      {/* Official Travelpayouts snippet (config set before the script loads,
          exactly as their own embed code does it) rather than the ad-hoc
          polling redirect this used to do - lets the widget navigate to
          the results page itself instead of us reverse-engineering its
          flightSearch query param. */}
      <Script id="tpwl-config" strategy="afterInteractive">
        {`
          window.TPWL_CONFIGURATION = {
            ...window.TPWL_CONFIGURATION,
            resultsURL: "${basePath}/home-page2/results",
          };
          var script = document.createElement("script");
          script.async = 1;
          script.type = "module";
          script.src = "https://tpemb.com/wl_web/main.js?wl_id=22783";
          document.head.appendChild(script);
        `}
      </Script>
    </section>
  );
}
