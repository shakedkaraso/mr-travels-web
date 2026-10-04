"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import badgeAnimation from "@/lottie/badge.json";
import { useLottieWatchdog } from "@/components/home/useLottieWatchdog";

export default function BadgeIcon() {
  const lottieRef = useRef<LottieHandle>(null);
  useLottieWatchdog(lottieRef);

  return (
    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-paper">
      <span className="h-[60px] w-[60px]">
        <Lottie
          src={badgeAnimation}
          autoplay
          lottieRef={lottieRef}
          subscriptions={{ complete: () => lottieRef.current?.play() }}
          className="h-full w-full"
        />
      </span>
    </span>
  );
}
