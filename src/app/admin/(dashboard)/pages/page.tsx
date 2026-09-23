import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeletePageButton from "@/components/admin/DeletePageButton";

export default async function AdminPagesPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase.from("pages").select("id, title, slug, published, created_at").order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-dark">עמודים</h1>
        <Link href="/admin/pages/new" className="rounded-full bg-brand-pink px-5 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.01]">
          + עמוד חדש
        </Link>
      </div>

      {!pages || pages.length === 0 ? (
        <p className="text-brand-ink-soft">עדיין אין עמודים.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-line">
          <table className="w-full text-start text-sm">
            <thead className="bg-brand-paper text-brand-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">כותרת</th>
                <th className="px-4 py-3 text-start font-semibold">סטטוס</th>
                <th className="px-4 py-3 text-start font-semibold">נוצר</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-medium text-brand-ink">{page.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${page.published ? "bg-emerald-100 text-emerald-700" : "bg-brand-paper text-brand-ink-soft"}`}>
                      {page.published ? "פורסם" : "טיוטה"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink-muted">{new Date(page.created_at).toLocaleDateString("he-IL")}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/pages/${page.id}`} className="font-semibold text-brand-pink hover:underline">
                        עריכה
                      </Link>
                      <DeletePageButton id={page.id} title={page.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
