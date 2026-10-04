"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import piggyBankAnimation from "@/lottie/piggy-bank.json";

export default function PiggyBankIcon() {
  const lottieRef = useRef<LottieHandle>(null);

  return (
    <span className="h-[60px] w-[60px]">
      <Lottie
        src={piggyBankAnimation}
        loop
        lottieRef={lottieRef}
        subscriptions={{ ready: () => lottieRef.current?.play() }}
        className="h-full w-full"
      />
    </span>
  );
}
