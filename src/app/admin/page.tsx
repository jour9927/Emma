import Link from "next/link";
import { AdminSnapshot } from "@/components/AdminSnapshot";
import { loadBranches, loadRequests, buildSnapshot } from "@/lib/data";
import { AdminBranchManager } from "@/components/AdminBranchManager";
import { AdminRequestBoard } from "@/components/AdminRequestBoard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
              Admin
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              管理員控台
            </h1>
            <p className="text-sm text-slate-500">
              監控分店人力、派送支援並維護整體營運
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            返回 Dashboard
          </Link>
        </header>

        <AdminSnapshot snapshot={snapshot} />
        <AdminBranchManager branches={branches} requests={requests} />
        <AdminRequestBoard branches={branches} requests={requests} />
      </div>
    </div>
  );
}
