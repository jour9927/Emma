import type { Branch, CoverageRequest } from "@/lib/types";
import { SupportRequestForm } from "./SupportRequestForm";

interface SupportRequestBoardProps {
  branches: Branch[];
  requests: CoverageRequest[];
}

const priorityColor: Record<string, string> = {
  high: "bg-rose-100 text-rose-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const statusColor: Record<string, string> = {
  open: "text-rose-600",
  committed: "text-amber-600",
  closed: "text-emerald-600",
};

export function SupportRequestBoard({
  branches,
  requests,
}: SupportRequestBoardProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          緊急調度情況
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          支援需求與派遣
        </h2>
      </div>
      <SupportRequestForm branches={branches} />
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">最新需求</p>
          <span className="text-xs text-slate-500">
            共 {requests.length} 筆
          </span>
        </div>
        <div className="space-y-3">
          {requests.length === 0 && (
            <p className="text-sm text-slate-500">目前沒有需求。</p>
          )}
          {requests.map((req) => {
            const branchName =
              branches.find((branch) => branch.id === req.branch_id)?.name ??
              req.branch_id;
            return (
              <article
                key={req.id}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-slate-500">分店</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {branchName}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor[req.priority]}`}
                  >
                    {req.priority === "high"
                      ? "高"
                      : req.priority === "medium"
                        ? "中"
                        : "低"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{req.message}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>由 {req.requested_by}</span>
                  <span className={statusColor[req.status]}>
                    {req.status === "open"
                      ? "未派遣"
                      : req.status === "committed"
                        ? "已有支援"
                        : "已結案"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
