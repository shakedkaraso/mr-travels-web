"use client";

import { Lottie } from "lottie-react";
import magnifierAnimation from "@/lottie/magnifier.json";

export default function MagnifierIcon() {
  return (
    <span className="h-5 w-5 shrink-0">
      <Lottie src={magnifierAnimation} loop autoplay speed={0.4} className="h-full w-full" />
    </span>
  );
}
