import { getHotDeals } from "@/lib/hot-deals";
import DealCard from "@/components/home/DealCard";

const FILTERS = ["חופשה בחג המולד", "Holiday Specials", "Last Minute"];

export default async function Deals() {
  const deals = await getHotDeals(3);
  if (deals.length === 0) return null;

  return (
    <section className="bg-brand-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[42px] font-extrabold text-brand-dark">דילים חמים לטיול הבא שלך</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  index === 0 ? "bg-brand-ink text-white" : "bg-white text-brand-ink-soft hover:bg-brand-ink/5"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <a href="/deals" className="mb-8 inline-block text-[18px] font-semibold text-brand-pink hover:underline">
          לעוד דילים שווים ←
        </a>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, index) => (
            <DealCard key={deal.bookingUrl} deal={deal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
