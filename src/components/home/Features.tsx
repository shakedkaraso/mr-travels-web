import PiggyBankIcon from "@/components/home/PiggyBankIcon";

const FEATURES = [
  {
    title: "מחירים משתלמים",
    description: "אנו עושים את כל המאמצים כדי למצוא לכם את הטיסות הכי זולות ומשתלמות.",
    icon: <PiggyBankIcon />,
    big: true,
  },
  {
    title: "שירות מקצועי ואישי",
    description: "נציג אנושי זמין לעזור לכם בכל עת שתרצו.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 fill-current" aria-hidden="true">
        <path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
        <circle cx="8" cy="10.5" r="1.2" className="fill-white" />
        <circle cx="12" cy="10.5" r="1.2" className="fill-white" />
        <circle cx="16" cy="10.5" r="1.2" className="fill-white" />
      </svg>
    ),
    big: true,
  },
  {
    title: "AI צ'אט",
    description: "תוכלו לתכנן מסלול, להתייעץ ולשאול כל דבר שתרצו על היעד שלכם",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-10 w-10"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="7" width="10" height="10" rx="1.5" />
        <rect x="10" y="10" width="4" height="4" rx="0.5" fill="currentColor" stroke="none" />
        <path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3" />
      </svg>
    ),
    big: true,
  },
  {
    title: "Handpicked",
    description: "Every package is vetted by our expert travel curators.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M12 2 9.3 8.6 2 9.3l5.6 4.7L5.8 21 12 17l6.2 4-1.8-7 5.6-4.7-7.3-.7L12 2Z" />
      </svg>
    ),
    big: false,
  },
];

function GlobePlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="68" r="40" stroke="currentColor" strokeWidth="3" fill="none" />
      <path
        d="M28 50c6-4 10 4 16 2s8-10 16-6 10 10 18 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M24 78c8 10 20 14 30 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M70 92c10-2 18-10 22-20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path
        d="M20 46 48 34l6-14 4 2-3 14 18 6 1 5-19-2-9 16-5-1 4-17-18-6z"
        fill="currentColor"
        stroke="none"
      />
      <path d="M88 20c8 0 15 3 20 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M100 10c10 1 18 6 23 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M10 92c2 8 7 14 14 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M22 104c4 4 9 6 14 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Features() {
  return (
    <section className="relative isolate mx-auto max-w-7xl overflow-hidden px-6 py-16 sm:py-20">
      <GlobePlaneIcon className="pointer-events-none absolute bottom-0 right-0 aspect-square w-1/4 min-w-[180px] -z-10 translate-x-1/2 translate-y-1/2 text-brand-ink/10" />
      <h2 className="mb-10 text-center text-[42px] font-extrabold text-brand-dark">
        דואגים לך להכל
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-brand-line bg-white p-6 text-center shadow-sm"
          >
            <span
              className={`mx-auto mb-4 flex items-center justify-center rounded-full bg-brand-pink-tint text-brand-pink ${
                feature.big ? "h-20 w-20" : "h-12 w-12"
              }`}
            >
              {feature.icon}
            </span>
            <h3 className="mb-1.5 text-[20px] font-bold text-brand-ink">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-brand-ink-soft">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
