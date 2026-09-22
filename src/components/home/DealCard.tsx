import type { Deal } from "@/lib/hot-deals";
import type { DestinationPhoto } from "@/lib/destination-photos";

const CARD_GRADIENTS = ["from-sky-400 to-blue-600", "from-indigo-500 to-purple-700", "from-emerald-500 to-teal-700"];

export default function DealCard({
  deal,
  index,
  photo,
}: {
  deal: Deal;
  index: number;
  photo?: DestinationPhoto | null;
}) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-line">
      <figure
        className={`relative h-40 ${photo ? "" : `bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`}`}
      >
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt={deal.city} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute top-3 inset-inline-start-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-ink">
          {deal.airline}
        </span>
        {photo && (
          // Pexels attribution isn't required by their license, but kept
          // for good practice — not shown over the photo, only in markup
          // (accessible to screen readers / crawlers).
          <figcaption className="sr-only">
            Photo by {photo.photographer} on Pexels ({photo.photographerUrl})
          </figcaption>
        )}
      </figure>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-brand-ink">{deal.city}</h3>
            <p className="text-xs tracking-wide text-brand-ink-muted">הלוך-חזור: {deal.departureLabel}</p>
          </div>
          <span className="whitespace-nowrap text-lg font-extrabold text-brand-pink">{deal.price}</span>
        </div>
        <a
          href={deal.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-brand-pink py-2.5 text-center text-sm font-bold text-white transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
        >
          הזמינו עכשיו
        </a>
      </div>
    </article>
  );
}
