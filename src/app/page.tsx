import Link from "next/link";
import { BranchGrid } from "@/components/BranchGrid";
import { SupportRequestBoard } from "@/components/SupportRequestBoard";
import { loadBranches, loadRequests, buildSnapshot } from "@/lib/data";
import { loadCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/lib/supabase/actions";

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
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:py-12">
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
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <Link
                  href="/management"
                  className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                >
                  前往管理專區
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      個人檔案
                    </Link>
                    <form action={signOutAction}>
                      <button className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:border-slate-300">
                        登出
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      登入
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-full border border-slate-200 px-6 py-3 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      註冊
                    </Link>
                  </>
                )}
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
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            系統頁面分類
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            依照角色與需求快速找到入口
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              {
                title: "主頁 Dashboard",
                description: "整合分店指標與當前支援狀況。",
                href: "/",
              },
              {
                title: "管理員頁",
                description: "新增分店、指派支援與追蹤需求。",
                href: "/management",
              },
              {
                title: "登入 / 註冊",
                description: "分別在 /login 與 /register 完成身份驗證。",
                href: user ? "/profile" : "/login",
              },
              {
                title: "個人檔案",
                description: "自訂顯示名稱，維護個人資料。",
                href: "/profile",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-300"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {card.description}
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-indigo-600">
                  查看頁面 →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[3fr,2fr]">
          <BranchGrid branches={branches} />
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                帳號狀態
              </p>
              {user ? (
                <>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    歡迎回來，{user.user_metadata?.username ?? user.email}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    你可以前往{" "}
                    <Link
                      href="/profile"
                      className="font-semibold text-slate-900 underline-offset-2 hover:underline"
                    >
                      個人檔案
                    </Link>{" "}
                    或直接管理分店。
                  </p>
                </>
              ) : (
                <>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    尚未登入
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    立即
                    <Link
                      href="/login"
                      className="font-semibold text-slate-900 underline-offset-2 hover:underline"
                    >
                      登入
                    </Link>{" "}
                    或{" "}
                    <Link
                      href="/register"
                      className="font-semibold text-slate-900 underline-offset-2 hover:underline"
                    >
                      註冊帳號
                    </Link>
                    ，掌握即時資訊。
                  </p>
                </>
              )}
            </section>
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
