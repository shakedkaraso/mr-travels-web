import { getHotDeals, getLastMinuteDeals } from "@/lib/hot-deals";
import { attachPhotos } from "@/lib/destination-photos";
import DealsFilterGrid from "@/components/home/DealsFilterGrid";
import MagnifyingGlassIcon from "@/components/icons/MagnifyingGlassIcon";

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
