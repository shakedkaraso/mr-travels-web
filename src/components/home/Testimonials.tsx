import TestimonialsCarousel, { type Testimonial } from "@/components/home/TestimonialsCarousel";
import BadgeIcon from "@/components/home/BadgeIcon";
import { createClient } from "@/lib/supabase/server";

// Shown until real reviews exist in the `reviews` table (or if that query
// fails, e.g. the table hasn't been created yet) — never an empty carousel.
const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { quote: "אחלה מחירים לטיסות, אין על מר טרוולס", author: "דורין א.", meta: "לקוח מאומת" },
  { quote: "אתר נח וקל, שירות מעולה", author: "אורי ב.", meta: "לקוח מאומת" },
  { quote: "מר טרוולס מנוע חיפוש סופר יעיל, דילים טובים", author: "מתן ק.", meta: "לקוח מאומת" },
];

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("author, quote")
    .eq("published", true)
    .order("review_date", { ascending: false })
    .limit(10);

  if (!data || data.length === 0) return FALLBACK_TESTIMONIALS;
  return data.map((row) => ({ quote: row.quote, author: row.author, meta: "לקוח מאומת" }));
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

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

        <TestimonialsCarousel items={testimonials} />
      </div>
    </section>
  );
}
