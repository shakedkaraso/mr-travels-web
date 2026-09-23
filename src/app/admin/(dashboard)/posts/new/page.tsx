import PostForm from "@/components/admin/PostForm";
import { createPost } from "@/app/admin/(dashboard)/posts/actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold text-brand-dark">מאמר חדש</h1>
      <PostForm action={createPost} submitLabel="פרסום" />
    </div>
  );
}
