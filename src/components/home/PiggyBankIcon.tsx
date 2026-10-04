"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import piggyBankAnimation from "@/lottie/piggy-bank.json";
import { useLottieWatchdog } from "@/components/home/useLottieWatchdog";

export default function PiggyBankIcon() {
  const lottieRef = useRef<LottieHandle>(null);
  useLottieWatchdog(lottieRef);

  return (
    <span className="h-[60px] w-[60px]">
      <Lottie
        src={piggyBankAnimation}
        autoplay
        lottieRef={lottieRef}
        subscriptions={{ complete: () => lottieRef.current?.play() }}
        className="h-full w-full"
      />
    </span>
  );
}
