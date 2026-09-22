const DESTINATIONS = [
  { name: "Amalfi Coast, Italy", meta: "From $1,299 • Flight + 7 Days Hotel", gradient: "from-cyan-600 to-blue-800", size: "lg" as const },
  { name: "Dubai, UAE", meta: "From $850", gradient: "from-amber-500 to-orange-700", size: "sm" as const },
  { name: "Paris, France", meta: "From $590", gradient: "from-rose-400 to-pink-700", size: "sm" as const },
  { name: "Swiss Alps, Switzerland", meta: "From $945 • Winter Specials Available", gradient: "from-slate-500 to-slate-800", size: "lg" as const },
];

export default function Destinations() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mb-8 text-center">
        <h2 className="text-[42px] font-extrabold text-brand-dark">
          היעדים שהכי הרבה אהבתם החודש
        </h2>
        <p className="mt-2 text-sm text-brand-ink-soft">
          גלו את היעדים המבוקשים ביותר אצל הגולשים שלנו.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.name}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${dest.gradient} h-64 flex items-end p-5`}
          >
            <div className="relative">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">{dest.name}</h3>
              <p className="text-xs text-white/85">{dest.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
