"use client";

import { Lottie } from "lottie-react";
import badgeAnimation from "@/lottie/badge.json";

export default function BadgeIcon() {
  return (
    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-paper">
      <span className="h-[60px] w-[60px]">
        <Lottie src={badgeAnimation} loop autoplay className="h-full w-full" />
      </span>
    </span>
  );
}
