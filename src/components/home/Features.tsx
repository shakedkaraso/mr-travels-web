import PiggyBankIcon from "@/components/home/PiggyBankIcon";
import ChatIcon from "@/components/home/ChatIcon";
import AiChipIcon from "@/components/home/AiChipIcon";

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
    icon: <ChatIcon />,
    big: true,
  },
  {
    title: "AI צ'אט",
    description: "תוכלו לתכנן מסלול, להתייעץ ולשאול כל דבר שתרצו על היעד שלכם.",
    icon: <AiChipIcon />,
    big: true,
  },
  {
    title: "רק טיסות ישירות",
    description: "אנחנו מתמקדים בטיסות ישירות מתל אביב, כך שתגיעו ליעד הכי מהר ובלי עצירות מיותרות.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5Z" />
      </svg>
    ),
    big: false,
  },
];

export default function Features() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/globe-watermark.jpg`}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 aspect-square w-1/3 min-w-[240px] -z-10 translate-x-[20%] translate-y-[20%] object-contain"
      />
      <div className="mx-auto max-w-7xl px-6">
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
      </div>
    </section>
  );
}
