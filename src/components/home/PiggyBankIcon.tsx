"use client";

import { Lottie } from "lottie-react";
import piggyBankAnimation from "@/lottie/piggy-bank.json";

export default function PiggyBankIcon() {
  return (
    <span className="h-[60px] w-[60px]">
      <Lottie src={piggyBankAnimation} loop autoplay className="h-full w-full" />
    </span>
  );
}
