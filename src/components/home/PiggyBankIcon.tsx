"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import piggyBankAnimation from "@/lottie/piggy-bank.json";

export default function PiggyBankIcon() {
  const lottieRef = useRef<LottieHandle>(null);

  function replay() {
    lottieRef.current?.stop();
    lottieRef.current?.play();
  }

  return (
    <span className="h-8 w-8" onMouseEnter={replay} onFocus={replay}>
      <Lottie lottieRef={lottieRef} src={piggyBankAnimation} loop={false} autoplay={false} className="h-full w-full" />
    </span>
  );
}
