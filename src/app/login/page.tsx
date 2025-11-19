import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { loadCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await loadCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row">
        <div className="flex-1 rounded-3xl border border-slate-200 bg-slate-900/90 p-6 text-white shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
            員工分流系統
          </p>
          <h1 className="mt-3 text-3xl font-semibold">登入你的工作帳號</h1>
          <p className="mt-4 text-sm text-slate-200">
            使用相同帳密即可在手機、平板與桌機切換工作裝置。
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-200">
            <p>・支援行動版介面，一樣好操作</p>
            <p>・登入後可存取個人檔案與管理頁面</p>
            <p>
              ・還沒有帳號？{" "}
              <Link
                href="/register"
                className="font-semibold text-white underline-offset-2 hover:underline"
              >
                立即註冊
              </Link>
            </p>
          </div>
        </div>
        <div className="flex-1">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
