import { getHotDeals, getLastMinuteDeals } from "@/lib/hot-deals";
import { attachPhotos } from "@/lib/destination-photos";
import DealsFilterGrid from "@/components/home/DealsFilterGrid";

function MagnifyingGlassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="54" cy="46" r="34" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="54" cy="46" r="24" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M30 70 L10 92" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
      <circle cx="32" cy="68" r="5" fill="currentColor" />
    </svg>
  );
}

export default async function Deals() {
  const [christmasDeals, lastMinuteDeals] = await Promise.all([getHotDeals(9), getLastMinuteDeals(9)]);
  if (christmasDeals.length === 0 && lastMinuteDeals.length === 0) return null;

  const [christmasWithPhotos, lastMinuteWithPhotos] = await Promise.all([
    attachPhotos(christmasDeals),
    attachPhotos(lastMinuteDeals),
  ]);

  return (
    <section className="relative isolate bg-brand-paper py-16 sm:py-20">
      <MagnifyingGlassIcon className="pointer-events-none absolute bottom-0 left-0 aspect-square w-1/3 min-w-[240px] -z-10 translate-y-1/2 text-brand-ink/25" />
      <div className="mx-auto max-w-7xl px-6">
        <DealsFilterGrid christmasDeals={christmasWithPhotos} lastMinuteDeals={lastMinuteWithPhotos} />
      </div>
    </section>
  );
}
