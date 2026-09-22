"use client";

import { useEffect } from "react";

// Dev-only: sets up window.__VE_BOOT and loads the Visual Editor's boot
// script. Only ever rendered when NODE_ENV === "development" (see
// layout.tsx) — this component itself doesn't re-check, its caller does,
// so it's trivially tree-shakeable out of a production render path.
//
// Add ?ve=off to any URL to load the page without the editor mounting at
// all (no toggle button, no click interception) — handy for just browsing.
export default function VisualEditorBoot() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("ve") === "off") return;

    // No practical way to enumerate every source file a given render might
    // touch ahead of time in a component-based app, so the pre-load
    // concurrency guard the static adapter has isn't available here yet —
    // /__ve/save still re-reads and re-parses each file fresh at save time
    // and refuses on a shape mismatch, just without the "changed since you
    // loaded the page" pre-check. Known, documented simplification.
    window.__VE_BOOT = { page: "(next.js)", fileHashes: {}, cssFile: null };

    const script = document.createElement("script");
    script.type = "module";
    script.src = "/__ve/client/boot.js";
    document.body.appendChild(script);
  }, []);

  return null;
}

declare global {
  interface Window {
    __VE_BOOT?: { page: string; fileHashes: Record<string, string>; cssFile: string | null };
  }
}
