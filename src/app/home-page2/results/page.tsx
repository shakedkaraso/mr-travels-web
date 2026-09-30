"use client";

import Script from "next/script";
import { useTravelpayoutsRtl } from "@/components/home/useTravelpayoutsRtl";

export default function FlightResultsPage() {
  useTravelpayoutsRtl();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div id="tpwl-search" className="mb-8" />
      <div id="tpwl-tickets" />

      <Script src="https://tpemb.com/wl_web/main.js?wl_id=22783" type="module" strategy="afterInteractive" />
    </div>
  );
}
