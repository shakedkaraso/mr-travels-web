import TestimonialsCarousel, { type Testimonial } from "@/components/home/TestimonialsCarousel";
import BadgeIcon from "@/components/home/BadgeIcon";

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The most seamless booking experience I've ever had. Santorini was a dream, and everything from the flights to the hotel was perfectly curated.",
    author: "Sarah Jenkins",
    meta: "Verified Explorer",
  },
  {
    quote:
      "Excellent 24/7 support. Our flight was delayed in Tokyo and the team handled our rebooking before we even landed. Truly professional.",
    author: "Mark Thompson",
    meta: "Frequent Flyer",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="min-w-0 text-center lg:text-start">
          <div className="mb-3 flex justify-center lg:justify-start">
            <BadgeIcon />
          </div>
          <h2 className="text-[42px] font-extrabold leading-tight text-brand-dark">
            עם ההמלצות אי
            <br />
            אפשר להתווכח
          </h2>
          <span className="mt-2 inline-block h-1 w-14 rounded-full bg-brand-pink" aria-hidden="true" />
        </div>

        <TestimonialsCarousel items={TESTIMONIALS} />
      </div>
    </section>
  );
}
