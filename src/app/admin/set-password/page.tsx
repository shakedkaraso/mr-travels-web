"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError("הסיסמה חייבת להכיל לפחות 8 תווים");
      return;
    }
    if (password !== confirm) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError("משהו השתבש, נסי שוב");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-brand-line">
        <h1 className="mb-2 text-center text-2xl font-extrabold text-brand-dark">הגדרת סיסמה</h1>
        <p className="mb-6 text-center text-sm text-brand-ink-soft">בחרי סיסמה לחשבון הניהול שלך</p>

        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="password">
          סיסמה חדשה
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />

        <label className="mb-1.5 block text-sm font-semibold text-brand-ink" htmlFor="confirm">
          אימות סיסמה
        </label>
        <input
          id="confirm"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mb-4 w-full rounded-xl border border-brand-field-border bg-brand-field-bg px-3 py-2.5 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
        />

        {error && <p className="mb-4 text-sm font-semibold text-brand-pink">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-pink py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? "שומר..." : "שמירת סיסמה והתחברות"}
        </button>
      </form>
    </div>
  );
}
