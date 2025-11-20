import Link from "next/link";
import { BranchGrid } from "@/components/BranchGrid";
import { SupportRequestBoard } from "@/components/SupportRequestBoard";
import { loadBranches, loadRequests, buildSnapshot } from "@/lib/data";
import { loadCurrentUser, isAdmin } from "@/lib/auth";
import { signOutAction } from "@/lib/supabase/actions";

const priorityWeight: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const [branches, requests, user] = await Promise.all([
    loadBranches(),
    loadRequests(),
    loadCurrentUser(),
  ]);

  const snapshot = buildSnapshot(branches, requests);
  const admin = isAdmin(user);
  const isAuthenticated = !!user;
  const greetingName = isAuthenticated
    ? user?.user_metadata?.username ??
      user?.user_metadata?.full_name ??
      user?.email ??
      "夥伴"
    : null;

  const now = new Date();
  const arrivalDeadline = new Date(now.getTime() + 60 * 60 * 1000);
  const openRequests = requests.filter((request) => request.status === "open");
  const urgentRequest = openRequests
    .slice()
    .sort(
      (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority],
    )[0];
  const fallbackBranch = branches
    .slice()
    .sort(
      (a, b) =>
        a.current_headcount / a.required_headcount -
        b.current_headcount / b.required_headcount,
    )[0];

  const recommendedBranch = urgentRequest
    ? branches.find((branch) => branch.id === urgentRequest.branch_id)
    : fallbackBranch;

  const recommendedReason = urgentRequest
    ? `${urgentRequest.requested_by} 回報 ${
        urgentRequest.priority === "high"
          ? "高優先"
          : urgentRequest.priority === "medium"
            ? "中優先"
            : "一般"
      } 缺人需求`
    : fallbackBranch
      ? "該分店人力低於 70%，需要優先支援。"
      : "目前所有分店人力均衡。";

  const generalStats = [
    { label: "分店總數", value: snapshot.totalBranches },
    { label: "待支援需求", value: snapshot.openRequests },
    { label: "紅色警戒", value: snapshot.criticalBranches },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:py-12">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-500">
            員工分流系統
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            {isAuthenticated ? `您好，${greetingName}` : "歡迎使用員工分流系統"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            現在時間 {now.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}，
            {isAuthenticated
              ? "平台會依照最新人力狀況建議支援任務。"
              : "請先登入以接收專屬任務與分店資訊。"}
          </p>
          {isAuthenticated && recommendedBranch && (
            <div className="mt-6 rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5 text-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                最優先支援任務
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                請於{" "}
                {arrivalDeadline.toLocaleTimeString("zh-TW", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                前往 {recommendedBranch.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{recommendedReason}</p>
              <p className="mt-2 text-sm text-slate-500">
                位置：{recommendedBranch.location}
              </p>
              {admin ? (
                <Link
                  href="/management"
                  className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  前往管理頁指派人員
                </Link>
              ) : (
                <p className="mt-4 text-xs text-slate-500">
                  若已在路上，請於抵達後至管理員群組回報；如需調整，等待管理員從後台重新指派。
                </p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">今日總覽</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {generalStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

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
                description: "整合分店指標與支援任務。",
                href: "/",
              },
              {
                title: "管理員頁",
                description: "新增分店、指派支援與追蹤需求。",
                href: "/management",
                highlight: admin,
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
          {isAuthenticated ? (
            <BranchGrid branches={branches} showDetails={admin} />
          ) : (
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-slate-600 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                分店摘要
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                請登入以檢視詳細 Dashboard
              </h3>
              <p className="mt-3 text-sm">
                未登入帳號僅能看到系統總覽，若要查看各分店的即時狀態與支援缺口，請先登入。
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <Link
                  href="/login"
                  className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
                >
                  立即登入
                </Link>
                <Link
                  href="/register"
                  className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
                >
                  建立帳號
                </Link>
              </div>
            </section>
          )}
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                帳號狀態
              </p>
              {user ? (
                <>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    歡迎回來，{greetingName}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {admin
                      ? "你擁有管理員權限，可直接進入後台指派任務。"
                      : "請留意通知，收到管理員指派後盡快回報。"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <Link
                      href="/profile"
                      className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      個人檔案
                    </Link>
                    <form action={signOutAction}>
                      <button className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300">
                        登出
                      </button>
                    </form>
                    {admin && (
                      <Link
                        href="/management"
                        className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
                      >
                        前往管理頁
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    尚未登入
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    立即登入或註冊帳號即可接收指派任務。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs">
                    <Link
                      href="/login"
                      className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      登入
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:border-slate-300"
                    >
                      註冊
                    </Link>
                  </div>
                </>
              )}
            </section>
            {admin ? (
              <SupportRequestBoard branches={branches} requests={requests} />
            ) : user ? (
              <section className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600">
                <h3 className="text-lg font-semibold text-slate-900">
                  管理員指派流程
                </h3>
                <ol className="mt-3 list-inside list-decimal space-y-2">
                  <li>管理員會依分店需求從後台選擇人員。</li>
                  <li>收到通知後，請於指定時間內到場並回報。</li>
                  <li>若無法前往，立即回報負責人，由管理員重新指派。</li>
                </ol>
                <p className="mt-3 text-xs text-slate-500">
                  想了解更多狀態，可向分店主管或管理員詢問；細節僅於後台開放。
                </p>
              </section>
            ) : (
              <section className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-600">
                <h3 className="text-lg font-semibold text-slate-900">
                  登入後即可查看指派流程
                </h3>
                <p className="mt-3">
                  管理員會依分店需求指派到場支援，請先登入以接收通知。
                </p>
              </section>
            )}
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
                description: "即時顯示各分店人力，管理員看到完整資訊。",
              },
              {
                title: "支援需求中心",
                description: "管理員可指派，員工依通知前往支援即可。",
              },
              {
                title: "行動裝置友好",
                description: "手機即可查看任務時間與建議分店。",
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
