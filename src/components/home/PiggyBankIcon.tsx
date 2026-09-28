"use client";

import { Lottie } from "lottie-react";
import piggyBankAnimation from "@/lottie/piggy-bank.json";

export default function PiggyBankIcon() {
  return (
    <span className="h-11 w-11">
      <Lottie src={piggyBankAnimation} loop autoplay className="h-full w-full" />
    </span>
  );
}
