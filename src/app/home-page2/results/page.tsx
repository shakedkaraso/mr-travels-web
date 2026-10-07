"use client";

import Link from "next/link";
import Script from "next/script";
import { useTravelpayoutsRtl } from "@/components/home/useTravelpayoutsRtl";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlassIcon";

export default function FlightResultsPage() {
  useTravelpayoutsRtl();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <>
      <section className="bg-brand-dark px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="פירורי לחם" className="mb-3">
            <ol className="flex items-center gap-2 text-[14px] text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  בית
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                תוצאות חיפוש
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">תוצאות חיפוש</h1>
        </div>
      </section>

      <div className="relative isolate overflow-hidden bg-[#f8f9fa]">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-0 left-0 aspect-square w-1/3 min-w-[240px] -z-10 -translate-y-1/4 text-brand-ink/5" />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div id="tpwl-search" className="mb-8" />
          <div id="tpwl-tickets" />

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
        </div>
      </div>
    </>
  );
}
