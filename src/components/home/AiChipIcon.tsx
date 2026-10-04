"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import aiChipAnimation from "@/lottie/ai-chip.json";

export default function AiChipIcon() {
  const lottieRef = useRef<LottieHandle>(null);

  return (
    <span className="h-[60px] w-[60px]">
      <Lottie
        src={aiChipAnimation}
        autoplay
        lottieRef={lottieRef}
        subscriptions={{ complete: () => lottieRef.current?.play() }}
        className="h-full w-full"
      />
    </span>
  );
}
