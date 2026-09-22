const TESTIMONIALS = [
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
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TESTIMONIALS.map((item) => (
            <figure key={item.author} className="rounded-2xl border border-brand-line bg-brand-paper p-6">
              <div className="mb-3 flex gap-0.5 text-brand-pink" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                    <path d="M10 1.5 12.6 7.3l6.4.6-4.8 4.2 1.4 6.3L10 15.3l-5.6 3.1 1.4-6.3L1 7.9l6.4-.6L10 1.5Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mb-4 text-sm leading-relaxed text-brand-ink">
                “{item.quote}”
              </blockquote>
              <figcaption className="text-xs font-semibold text-brand-ink-soft">
                {item.author} · {item.meta}
              </figcaption>
            </figure>
          ))}
        </div>

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
      </div>
    </section>
  );
}
