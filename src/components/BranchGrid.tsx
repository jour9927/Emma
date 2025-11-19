import { getStaffingStatus } from "@/lib/data";
import type { Branch, StaffingStatus } from "@/lib/types";

const statusMap: Record<
  StaffingStatus,
  { label: string; badge: string; bar: string }
> = {
  stable: {
    label: "狀況穩定",
    badge: "text-emerald-700 bg-emerald-100",
    bar: "bg-emerald-500",
  },
  warning: {
    label: "可再補人",
    badge: "text-amber-700 bg-amber-100",
    bar: "bg-amber-500",
  },
  critical: {
    label: "急需支援",
    badge: "text-rose-700 bg-rose-100",
    bar: "bg-rose-500",
  },
};

interface BranchGridProps {
  branches: Branch[];
  showDetails?: boolean;
}

export function BranchGrid({ branches, showDetails = true }: BranchGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            分店人力概況
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            即時 Dashboard
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          依照人力密度自動排序
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {branches
          .sort(
            (a, b) =>
              a.current_headcount / a.required_headcount -
              b.current_headcount / b.required_headcount,
          )
          .map((branch) => {
            const ratio = Math.min(
              1,
              branch.current_headcount / branch.required_headcount,
            );
            const status = getStaffingStatus(branch);
            const colors = statusMap[status];
            return (
              <article
                key={branch.id}
                className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {branch.location}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {branch.name}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
                  >
                    {colors.label}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>
                      目前 {branch.current_headcount} / {branch.required_headcount}
                    </span>
                    <span>{Math.round(ratio * 100)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${colors.bar}`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                </div>
                {showDetails && branch.notes && (
                  <p className="mt-3 text-sm text-slate-600">{branch.notes}</p>
                )}
                {showDetails ? (
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-slate-500">
                      聯絡人：
                      <span className="font-medium text-slate-800">
                        {branch.lead_contact ?? "未設定"}
                      </span>
                    </div>
                    <a
                      href="#support-request"
                      className="text-indigo-600 underline-offset-4 hover:underline"
                    >
                      我要支援
                    </a>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">
                    詳細備註與聯絡資訊僅限管理員於後台檢視。
                  </p>
                )}
              </article>
            );
          })}
      </div>
    </section>
  );
}
