"use client";

import { useEffect } from "react";

/**
 * The Travelpayouts widget forces `document.documentElement.dir` to "ltr"
 * on load (to match its own English UI), which flips every RTL/logical-
 * property layout on the whole page, not just inside the widget. Pin it
 * back to "rtl" and keep it pinned if the widget re-applies its change.
 */
export function useTravelpayoutsRtl() {
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
