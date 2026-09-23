import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDealsForDestination, findDestination } from "@/lib/hot-deals";
import { attachPhotos } from "@/lib/destination-photos";
import DealCard from "@/components/home/DealCard";

export async function generateMetadata({ params }: PageProps<"/deals/[code]">): Promise<Metadata> {
  const { code } = await params;
  const spec = findDestination(code);
  return { title: spec ? `דילים ל${spec.name} | Mr.travels` : "דילים | Mr.travels" };
}

export default async function DestinationDealsPage({ params }: PageProps<"/deals/[code]">) {
  const { code } = await params;
  const spec = findDestination(code);
  if (!spec) notFound();

  const deals = await getDealsForDestination(spec.code, 12);
  const dealsWithPhotos = await attachPhotos(deals);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <h1 className="text-[42px] font-extrabold text-brand-dark">טיסות ישירות ל{spec.name}</h1>
      <p className="mt-2 text-brand-ink-soft">הלוך-חזור מתל אביב, לדצמבר — ממוינות מהזול ליקר.</p>

      {dealsWithPhotos.length === 0 ? (
        <p className="mt-10 text-brand-ink-soft">לא נמצאו דילים ליעד הזה כרגע — נסו לרענן בעוד כמה דקות.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dealsWithPhotos.map((deal, index) => (
            <DealCard key={deal.bookingUrl} deal={deal} index={index} photo={deal.photo} />
          ))}
        </div>
      )}
    </section>
  );
}
