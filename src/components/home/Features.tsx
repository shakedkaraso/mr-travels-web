import PiggyBankIcon from "@/components/home/PiggyBankIcon";
import ChatIcon from "@/components/home/ChatIcon";
import AiChipIcon from "@/components/home/AiChipIcon";
import GlobeWatermark from "@/components/home/GlobeWatermark";

const FEATURES = [
  {
    title: "מחירים משתלמים",
    description: "אנו עושים את כל המאמצים כדי למצוא לכם את הטיסות הכי זולות ומשתלמות.",
    icon: <PiggyBankIcon />,
  },
  {
    title: "שירות מקצועי ואישי",
    description: "נציג אנושי זמין לעזור לכם בכל עת שתרצו.",
    icon: <ChatIcon />,
  },
  {
    title: "AI צ'אט (בקרוב)",
    description: "תוכלו לתכנן מסלול, להתייעץ ולשאול כל דבר שתרצו על היעד שלכם.",
    icon: <AiChipIcon />,
  },
];

export default function Features() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      <GlobeWatermark className="absolute bottom-0 right-0 aspect-square w-1/3 min-w-[240px] -z-10 translate-x-[20%] translate-y-[20%]" />
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-[42px] font-extrabold text-brand-dark">
          דואגים לך להכל
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-brand-line bg-white p-6 text-center shadow-sm"
            >
              <span className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-pink-tint text-brand-pink">
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
