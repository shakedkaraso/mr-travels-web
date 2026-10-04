import type { Metadata } from "next";
import Link from "next/link";
import { getPopularDestinations, getDealsForDestination, resolvePhotoQuery } from "@/lib/hot-deals";
import { getDestinationPhoto } from "@/lib/destination-photos";

export const metadata: Metadata = {
  title: "יעדים | Mr.travels",
  description: "היעדים שהכי הרבה אהבתם החודש — טיסות ישירות מתל אביב.",
};

const CARD_GRADIENTS = ["from-cyan-600 to-blue-800", "from-amber-500 to-orange-700", "from-rose-400 to-pink-700", "from-slate-500 to-slate-800"];

export default async function DestinationsPage() {
  const popular = await getPopularDestinations(12);

  const destinations = await Promise.all(
    popular.map(async (dest) => {
      const [cheapest, photo] = await Promise.all([
        getDealsForDestination(dest.code, 1),
        getDestinationPhoto(resolvePhotoQuery(dest)),
      ]);
      return { ...dest, price: cheapest[0]?.price ?? null, photo };
    })
  );

  return (
    <>
      <section className="bg-brand-dark px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="פירורי לחם" className="mb-3">
            <ol className="flex items-center gap-2 text-[14px] text-white/70">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  בית
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white" aria-current="page">
                יעדים
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">היעדים שהכי הרבה אהבתם החודש</h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        {destinations.length === 0 ? (
          <p className="text-brand-ink-soft">לא נמצאו יעדים כרגע — נסו לרענן בעוד כמה דקות.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, index) => (
              <Link
                key={dest.code}
                href={`/deals/${dest.code}`}
                className={`group relative h-64 overflow-hidden rounded-2xl flex items-end p-5 transition-transform hover:scale-[1.01] ${
                  dest.photo ? "" : `bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`
                }`}
              >
                {dest.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={dest.photo.url} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden="true" />
                <div className="relative pe-5">
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
        )}
      </section>
    </>
  );
}
