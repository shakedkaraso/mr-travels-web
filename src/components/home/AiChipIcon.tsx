"use client";

import { Lottie } from "lottie-react";
import aiChipAnimation from "@/lottie/ai-chip.json";

export default function AiChipIcon() {
  return (
    <span className="h-[60px] w-[60px]">
      <Lottie src={aiChipAnimation} loop autoplay className="h-full w-full" />
    </span>
  );
}
