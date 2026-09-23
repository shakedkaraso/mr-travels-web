import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "סקירה כללית" },
  { href: "/admin/posts", label: "מאמרים" },
  { href: "/admin/pages", label: "עמודים" },
  { href: "/admin/leads", label: "לידים" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /admin/login and /admin/set-password render their own full-page layout
  // (no nav) — this wrapper is only for the authenticated dashboard shell.
  // Middleware already redirects unauthenticated visitors to /admin/login,
  // but a plain Server Component re-check here avoids a flash of the shell
  // if that ever changes.
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-paper" dir="rtl">
      <div className="flex">
        <aside className="min-h-screen w-56 shrink-0 border-l border-brand-line bg-white p-4">
          <div className="mb-6 px-2 text-lg font-extrabold text-brand-dark">Mr.travels — ניהול</div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-ink-soft transition-colors hover:bg-brand-paper hover:text-brand-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-brand-line pt-4">
            <p className="mb-2 truncate px-2 text-xs text-brand-ink-muted">{user.email}</p>
            <LogoutButton />
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
