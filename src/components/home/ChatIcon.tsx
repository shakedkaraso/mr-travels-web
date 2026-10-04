"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import chatAnimation from "@/lottie/chat.json";
import { useLottieWatchdog } from "@/components/home/useLottieWatchdog";

export default function ChatIcon() {
  const lottieRef = useRef<LottieHandle>(null);
  useLottieWatchdog(lottieRef, { allowRestAtEnd: true });

  return (
    <span className="h-[60px] w-[60px]">
      <Lottie src={chatAnimation} loop={false} autoplay lottieRef={lottieRef} className="h-full w-full" />
    </span>
  );
}
