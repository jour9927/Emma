import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { BranchGrid } from "@/components/BranchGrid";
import { SupportRequestBoard } from "@/components/SupportRequestBoard";
import { loadBranches, loadRequests, buildSnapshot } from "@/lib/data";
import { loadCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [branches, requests, user] = await Promise.all([
    loadBranches(),
    loadRequests(),
    loadCurrentUser(),
  ]);

  const snapshot = buildSnapshot(branches, requests);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-white">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <header className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500">
                員工分流系統
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                即時掌握每家分店的人力，讓支援像叫計程車一樣快。
              </h1>
              <p className="mt-4 text-base text-slate-600">
                透過 Supabase + Vercel 雲端架構，集中處理註冊登入、分店 Dashboard
                與管理員派遣。任何裝置都能即時更新，老闆不用再逐一打電話確認。
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link
                  href="/management"
                  className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  前往管理專區
                </Link>
                <a
                  href="https://supabase.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:border-slate-300"
                >
                  了解資料庫結構
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-900/90 p-6 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                管理員專用
              </p>
              <h3 className="mt-2 text-2xl font-semibold">今日重點</h3>
              <p className="mt-3 text-sm text-slate-200">
                詳細派遣、分店設定與需求控管均已搬到新的管理頁面。
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-3">
                  <dt className="text-xs text-slate-200">紅色警戒</dt>
                  <dd className="text-2xl font-semibold text-amber-200">
                    {snapshot.criticalBranches}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <dt className="text-xs text-slate-200">待支援</dt>
                  <dd className="text-2xl font-semibold text-rose-200">
                    {snapshot.openRequests}
                  </dd>
                </div>
              </dl>
              <Link
                href="/management"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-white"
              >
                開啟管理頁面
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[3fr,2fr]">
          <BranchGrid branches={branches} />
          <div className="space-y-6">
            <AuthCard userEmail={user?.email} />
            <SupportRequestBoard branches={branches} requests={requests} />
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            系統帶來的四個好處
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              {
                title: "統一帳號",
                description: "員工透過 Email 註冊，權限由 Supabase 管理。",
              },
              {
                title: "多分店 Dashboard",
                description: "即時顯示各分店人力、備註與聯絡窗口。",
              },
              {
                title: "支援需求中心",
                description: "只要填表就能廣播缺人資訊，減少來回溝通。",
              },
              {
                title: "管理員維運頁",
                description: "新增分店、調整人力、結案需求都在同一頁。",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
