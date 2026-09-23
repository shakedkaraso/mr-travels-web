import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();
  const [posts, pages, leads, clicks] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("pages").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("link_clicks").select("*", { count: "exact", head: true }),
  ]);
  return {
    posts: posts.count ?? 0,
    pages: pages.count ?? 0,
    leads: leads.count ?? 0,
    clicks: clicks.count ?? 0,
  };
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  const cards = [
    { label: "מאמרים", value: counts.posts, href: "/admin/posts" },
    { label: "עמודים", value: counts.pages, href: "/admin/pages" },
    { label: "לידים", value: counts.leads, href: "/admin/leads" },
    { label: "קליקים על קישורי טיסות", value: counts.clicks, href: null },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">סקירה כללית</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-line">
            <p className="text-sm text-brand-ink-soft">{card.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-ink">{card.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-brand-ink-muted">
        "קליקים על קישורי טיסות" סופר לחיצות על כפתורי חיפוש/הזמנה באתר עצמו — זה בנוסף לדוחות של Travelpayouts, לא במקומם.
      </p>
    </div>
  );
}
