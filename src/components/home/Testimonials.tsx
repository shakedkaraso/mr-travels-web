import TestimonialsCarousel, { type Testimonial } from "@/components/home/TestimonialsCarousel";

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
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div className="text-center lg:text-start">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-ink-soft">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-brand-pink">
              <path d="M10 1.5 12.6 7.3l6.4.6-4.8 4.2 1.4 6.3L10 15.3l-5.6 3.1 1.4-6.3L1 7.9l6.4-.6L10 1.5Z" />
            </svg>
            Trustpilot 4.9/5 Rating
          </span>
          <h2 className="text-[42px] font-extrabold text-brand-dark">
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
