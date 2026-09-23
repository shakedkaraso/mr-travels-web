import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageForm from "@/components/admin/PageForm";
import { updatePage } from "@/app/admin/(dashboard)/pages/actions";

export default async function EditPagePage({ params }: PageProps<"/admin/pages/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*").eq("id", id).single();

  if (!page) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">עריכת עמוד</h1>
      <PageForm action={updatePage.bind(null, id)} initial={page} submitLabel="שמירה" />
    </div>
  );
}
