import { getHotDeals, getLastMinuteDeals } from "@/lib/hot-deals";
import { attachPhotos } from "@/lib/destination-photos";
import DealsFilterGrid from "@/components/home/DealsFilterGrid";

export default async function Deals() {
  const [christmasDeals, lastMinuteDeals] = await Promise.all([getHotDeals(3), getLastMinuteDeals(3)]);
  if (christmasDeals.length === 0 && lastMinuteDeals.length === 0) return null;

  const [christmasWithPhotos, lastMinuteWithPhotos] = await Promise.all([
    attachPhotos(christmasDeals),
    attachPhotos(lastMinuteDeals),
  ]);

  return (
    <section className="bg-brand-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <DealsFilterGrid christmasDeals={christmasWithPhotos} lastMinuteDeals={lastMinuteWithPhotos} />
      </div>
    </section>
  );
}
