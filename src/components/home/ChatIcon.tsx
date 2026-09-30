"use client";

import { Lottie } from "lottie-react";
import chatAnimation from "@/lottie/chat.json";

export default function ChatIcon() {
  return (
    <span className="h-[60px] w-[60px]">
      <Lottie src={chatAnimation} loop autoplay className="h-full w-full" />
    </span>
  );
}
