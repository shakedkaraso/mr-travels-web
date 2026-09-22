import type { Metadata } from "next";
import { getHotDeals, EUROPE_DESTINATIONS } from "@/lib/hot-deals";
import DealCard from "@/components/home/DealCard";

export const metadata: Metadata = {
  title: "דילים חמים | Mr.travels",
  description: "כל הדילים החמים לטיסות הלוך-חזור מתל אביב ליעדים באירופה בדצמבר.",
};

export default async function DealsPage() {
  const deals = await getHotDeals(EUROPE_DESTINATIONS.length);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <h1 className="text-[42px] font-extrabold text-brand-dark">דילים חמים לטיול הבא שלך</h1>
      <p className="mt-2 text-brand-ink-soft">כל הטיסות הלוך-חזור מתל אביב ליעדים באירופה, לדצמבר — ממוינות מהזול ליקר.</p>

      {deals.length === 0 ? (
        <p className="mt-10 text-brand-ink-soft">לא נמצאו דילים כרגע — נסו לרענן בעוד כמה דקות.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, index) => (
            <DealCard key={deal.bookingUrl} deal={deal} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
