import TestimonialsCarousel, { type Testimonial } from "@/components/home/TestimonialsCarousel";
import BadgeIcon from "@/components/home/BadgeIcon";

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "אחלה מחירים לטיסות, אין על מר טרוולס",
    author: "דורין א.",
    meta: "לקוח מאומת",
  },
  {
    quote: "אתר נח וקל, שירות מעולה",
    author: "אורי ב.",
    meta: "לקוח מאומת",
  },
  {
    quote: "מר טרוולס מנוע חיפוש סופר יעיל, דילים טובים",
    author: "מתן ק.",
    meta: "לקוח מאומת",
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
