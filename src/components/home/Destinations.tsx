import Link from "next/link";
import { getPopularDestinations, getDealsForDestination } from "@/lib/hot-deals";
import { getDestinationPhoto } from "@/lib/destination-photos";

const CARD_GRADIENTS = ["from-cyan-600 to-blue-800", "from-amber-500 to-orange-700", "from-rose-400 to-pink-700", "from-slate-500 to-slate-800"];

export default async function Destinations() {
  const popular = await getPopularDestinations(4);
  if (popular.length === 0) return null;

  const destinations = await Promise.all(
    popular.map(async (dest) => {
      const [cheapest, photo] = await Promise.all([getDealsForDestination(dest.code, 1), getDestinationPhoto(dest.nameEn)]);
      return { ...dest, price: cheapest[0]?.price ?? null, photo };
    })
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mb-8 text-center">
        <h2 className="text-[42px] font-extrabold text-brand-dark">
          היעדים שהכי הרבה אהבתם החודש
        </h2>
        <p className="mt-2 text-sm text-brand-ink-soft">
          גלו את היעדים המבוקשים ביותר אצל הגולשים שלנו — טיסות ישירות מתל אביב.
        </p>
      </div>

      {/* Figma grid: 4 columns x 2 rows — card 1 spans 2x2, cards 2-3 are
          1x1, card 4 spans 2 columns in row 2. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:auto-rows-[16rem]">
        {destinations.map((dest, index) => (
          <Link
            key={dest.code}
            href={`/deals/${dest.code}`}
            className={`group relative overflow-hidden rounded-2xl h-64 sm:h-full flex items-end p-5 transition-transform hover:scale-[1.01] ${
              index === 0 ? "sm:col-span-2 sm:row-span-2" : index === 3 ? "sm:col-span-2" : ""
            } ${dest.photo ? "" : `bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`}`}
          >
            {dest.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dest.photo.url} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
            <div className="relative">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">{dest.name}</h3>
              {dest.price && <p className="text-xs text-white/85">החל מ-{dest.price} · הלוך-חזור</p>}
            </div>
            {dest.photo && (
              <figcaption className="sr-only">
                Photo by {dest.photo.photographer} on Pexels ({dest.photo.photographerUrl})
              </figcaption>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
