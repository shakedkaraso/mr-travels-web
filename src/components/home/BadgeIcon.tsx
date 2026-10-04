"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import badgeAnimation from "@/lottie/badge.json";

export default function BadgeIcon() {
  const lottieRef = useRef<LottieHandle>(null);

  return (
    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-paper">
      <span className="h-[60px] w-[60px]">
        <Lottie
          src={badgeAnimation}
          loop
          lottieRef={lottieRef}
          subscriptions={{ ready: () => lottieRef.current?.play() }}
          className="h-full w-full"
        />
      </span>
    </span>
  );
}
