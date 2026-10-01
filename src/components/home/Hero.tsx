"use client";

import { useEffect, useState } from "react";
import FlightSearchWidget from "@/components/home/FlightSearchWidget";

const BACKGROUNDS = ["/images/beach.jpg", "/images/vegas.jpg", "/images/sakura.jpg"];
const SLIDE_MS = 6000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % BACKGROUNDS.length), SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {BACKGROUNDS.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 -z-10 bg-[#0a3a4a] bg-cover bg-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${basePath}${src}')` }}
          aria-hidden="true"
        >
          {src.includes("vegas") && <div className="absolute inset-0 bg-white/25" />}
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/10 to-black/25" aria-hidden="true" />

      <div className="mx-auto max-w-5xl px-6 pb-40 pt-20 text-center sm:pb-48 sm:pt-28">
        <h1 className="text-3xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-5xl">
          מר טרוולס אלוף הטיסות
          <br />
          <span className="text-brand-dark">תכינו מזוודות</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[24px] text-white/90 drop-shadow-sm">
          מנוע החיפוש שלנו ימצא לך את הטיסות ליעדים הכי שווים בעולם!
        </p>
      </div>

      <div className="relative mx-auto -mt-28 max-w-4xl px-4 pb-16 sm:-mt-32">
        <FlightSearchWidget />
      </div>
    </section>
  );
}
