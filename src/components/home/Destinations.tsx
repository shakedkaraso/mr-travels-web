import { getDestinationPhoto } from "@/lib/destination-photos";

const DESTINATIONS = [
  { name: "Amalfi Coast, Italy", query: "Amalfi Coast Italy", meta: "From $1,299 • Flight + 7 Days Hotel", gradient: "from-cyan-600 to-blue-800", size: "lg" as const },
  { name: "Dubai, UAE", query: "Dubai UAE", meta: "From $850", gradient: "from-amber-500 to-orange-700", size: "sm" as const },
  { name: "Paris, France", query: "Paris France", meta: "From $590", gradient: "from-rose-400 to-pink-700", size: "sm" as const },
  { name: "Swiss Alps, Switzerland", query: "Swiss Alps Switzerland", meta: "From $945 • Winter Specials Available", gradient: "from-slate-500 to-slate-800", size: "lg" as const },
];

export default async function Destinations() {
  const destinations = await Promise.all(
    DESTINATIONS.map(async (dest) => ({ ...dest, photo: await getDestinationPhoto(dest.query) }))
  );

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
        {destinations.map((dest) => (
          <figure
            key={dest.name}
            className={`relative overflow-hidden rounded-2xl h-64 flex items-end p-5 ${dest.photo ? "" : `bg-gradient-to-br ${dest.gradient}`}`}
          >
            {dest.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dest.photo.url} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">{dest.name}</h3>
              <p className="text-xs text-white/85">{dest.meta}</p>
            </div>
            {dest.photo && (
              <figcaption className="sr-only">
                Photo by {dest.photo.photographer} on Pexels ({dest.photo.photographerUrl})
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
