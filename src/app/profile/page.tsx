import Link from "next/link";
import { redirect } from "next/navigation";
import { loadCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await loadCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const defaultUsername =
    (user.user_metadata?.username as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            個人檔案
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            調整顯示名稱、檢視登入 Email，並快速連回 Dashboard 或管理頁。
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
            >
              返回首頁
            </Link>
            <Link
              href="/management"
              className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
            >
              管理專區
            </Link>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ProfileForm defaultUsername={defaultUsername} />
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600">
            <dl className="space-y-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Email
                </dt>
                <dd className="text-lg font-semibold text-slate-900">
                  {user.email}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  UID
                </dt>
                <dd className="truncate text-slate-800">{user.id}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  目前權限
                </dt>
                <dd>依照 Supabase Auth 實際設定，預設為一般員工。</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-slate-400">
              更進階的欄位（例如大頭貼、手機等）可以在 Supabase user metadata 中擴充。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
