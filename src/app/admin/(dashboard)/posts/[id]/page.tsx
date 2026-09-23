import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostForm from "@/components/admin/PostForm";
import { updatePost } from "@/app/admin/(dashboard)/posts/actions";

export default async function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">עריכת מאמר</h1>
      <PostForm action={updatePost.bind(null, id)} initial={post} submitLabel="שמירה" />
    </div>
  );
}
