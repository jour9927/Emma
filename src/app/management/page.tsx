import Link from "next/link";
import Link from "next/link";
import { AdminSnapshot } from "@/components/AdminSnapshot";
import { loadBranches, loadRequests, buildSnapshot } from "@/lib/data";
import { AdminBranchManager } from "@/components/AdminBranchManager";
import { AdminRequestBoard } from "@/components/AdminRequestBoard";
import { loadCurrentUser, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ManagementPage() {
  const user = await loadCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const admin = isAdmin(user);
  if (!admin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Access Denied
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            需要管理員權限
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            你目前的帳號沒有管理權限，無法檢視分店設定與支援派遣。請聯繫總部或使用管理員帳號登入。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-900 hover:border-slate-300"
            >
              返回首頁
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-5 py-2 font-semibold text-slate-900 hover:border-slate-300"
            >
              切換帳號
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [branches, requests] = await Promise.all([
    loadBranches(),
    loadRequests(),
  ]);
  const snapshot = buildSnapshot(branches, requests);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Management
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              總部管理專區
            </h1>
            <p className="text-sm text-slate-500">
              監控分店人力、送出支援與維護營運設定
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            返回員工 Dashboard
          </Link>
        </header>

        <AdminSnapshot snapshot={snapshot} />
        <AdminBranchManager branches={branches} requests={requests} />
        <AdminRequestBoard branches={branches} requests={requests} />
      </div>
    </div>
  );
}
