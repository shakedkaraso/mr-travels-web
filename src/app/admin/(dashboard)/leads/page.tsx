import { createClient } from "@/lib/supabase/server";

const SOURCE_LABELS: Record<string, string> = {
  newsletter_hero: "טופס בעמוד הבית",
  newsletter_footer: "טופס בפוטר",
  newsletter_popup: "פופ-אפ דילים",
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">לידים ופניות</h1>

      {!leads || leads.length === 0 ? (
        <p className="text-brand-ink-soft">עדיין אין לידים.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-line">
          <table className="w-full text-start text-sm">
            <thead className="bg-brand-paper text-brand-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">אימייל</th>
                <th className="px-4 py-3 text-start font-semibold">מקור</th>
                <th className="px-4 py-3 text-start font-semibold">הסכמה</th>
                <th className="px-4 py-3 text-start font-semibold">תאריך</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-medium text-brand-ink" dir="ltr">
                    {lead.email}
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">{SOURCE_LABELS[lead.source] ?? lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${lead.consent ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {lead.consent ? "אושרה" : "לא אושרה"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-ink-muted">
                    {new Date(lead.created_at).toLocaleString("he-IL")}
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
