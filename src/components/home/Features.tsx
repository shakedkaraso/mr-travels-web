const FEATURES = [
  {
    title: "מחירים משתלמים",
    description: "אנו עושים את כל המאמצים כדי למצוא לכם את הטיסות הכי זולות ומשתלמות.",
    icon: <path d="M4 12 12 4l8 8-8 8-8-8Zm8-4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />,
  },
  {
    title: "שירות מקצועי ואישי",
    description: "נציג אנושי זמין לעזור לכם בכל עת שתרצו.",
    icon: (
      <path d="M12 3a7 7 0 0 0-7 7v4a2 2 0 0 0 2 2h1v-6H6v-1a6 6 0 0 1 12 0v1h-2v6h1a2 2 0 0 0 2-2v-4a7 7 0 0 0-7-7Z" />
    ),
  },
  {
    title: "Flexible Booking",
    description: "Easy cancellations and rescheduling for peace of mind.",
    icon: <path d="M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6V3l4 3-4 3V4Z" />,
  },
  {
    title: "Handpicked",
    description: "Every package is vetted by our expert travel curators.",
    icon: <path d="M12 2 9.3 8.6 2 9.3l5.6 4.7L5.8 21 12 17l6.2 4-1.8-7 5.6-4.7-7.3-.7L12 2Z" />,
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <h2 className="mb-10 text-center text-[42px] font-extrabold text-brand-dark">
        דואגים לך להכל
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-brand-line bg-white p-6 text-center shadow-sm"
          >
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink-tint text-brand-pink">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
                {feature.icon}
              </svg>
            </span>
            <h3 className="mb-1.5 font-bold text-brand-ink">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-brand-ink-soft">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
