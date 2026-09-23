import PageForm from "@/components/admin/PageForm";
import { createPage } from "@/app/admin/(dashboard)/pages/actions";

export default function NewPagePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">עמוד חדש</h1>
      <PageForm action={createPage} submitLabel="פרסום" />
    </div>
  );
}
