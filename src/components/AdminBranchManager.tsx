import type { Branch, CoverageRequest } from "@/lib/types";
import { BranchUpdateForm } from "./BranchUpdateForm";
import { CreateBranchForm } from "./CreateBranchForm";

interface AdminBranchManagerProps {
  branches: Branch[];
  requests: CoverageRequest[];
}

export function AdminBranchManager({
  branches,
  requests,
}: AdminBranchManagerProps) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          管理員操作
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          分店管理與支援派送
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {branches.map((branch) => (
            <article
              key={branch.id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">{branch.location}</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {branch.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">待處理需求</p>
                  <p className="text-lg font-semibold text-rose-600">
                    {
                      requests.filter(
                        (req) =>
                          req.branch_id === branch.id && req.status === "open",
                      ).length
                    }
                  </p>
                </div>
              </div>
              <BranchUpdateForm branch={branch} />
            </article>
          ))}
        </div>
        <div className="space-y-4">
          <CreateBranchForm />
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
              快速指引
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              派遣流程最佳實務
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>1. 優先處理紅色警戒 (70% 以下)</li>
              <li>2. 與鄰近分店確認可支援人數</li>
              <li>3. 在需求卡上更新派遣狀態</li>
              <li>4. 每日關閉完成案件，保持資料新鮮</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
