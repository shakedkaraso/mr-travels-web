"use client";

import { useRef } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import chatAnimation from "@/lottie/chat.json";

export default function ChatIcon() {
  const lottieRef = useRef<LottieHandle>(null);

  return (
    <span className="h-[60px] w-[60px]">
      <Lottie
        src={chatAnimation}
        autoplay
        lottieRef={lottieRef}
        subscriptions={{ complete: () => lottieRef.current?.play() }}
        className="h-full w-full"
      />
    </span>
  );
}
