import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/RegisterForm";
import { loadCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await loadCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row">
        <div className="flex-1">
          <RegisterForm />
          <p className="mt-4 text-sm text-slate-500">
            已經有帳號了嗎？{" "}
            <Link
              href="/login"
              className="font-semibold text-slate-900 underline-offset-2 hover:underline"
            >
              前往登入
            </Link>
          </p>
        </div>
        <div className="flex-1 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            註冊就能獲得
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>・存取所有分店 Dashboard</li>
            <li>・提交支援需求與接收派遣通知</li>
            <li>・更新個人檔案，讓大家快速識別你</li>
            <li>・在手機與桌機之間無痛切換</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
