import type { Branch, CoverageRequest } from "@/lib/types";
import { RequestStatusForm } from "./RequestStatusForm";

interface AdminRequestBoardProps {
  branches: Branch[];
  requests: CoverageRequest[];
}

const statusLabel: Record<string, string> = {
  open: "未派遣",
  committed: "已派遣",
  closed: "已結案",
};

export function AdminRequestBoard({
  branches,
  requests,
}: AdminRequestBoardProps) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          管理派遣
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          支援需求控管
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {requests.map((request) => {
          const branchName =
            branches.find((branch) => branch.id === request.branch_id)?.name ??
            request.branch_id;
          return (
            <article
              key={request.id}
              className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">分店</p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {branchName}
                  </h3>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{new Date(request.created_at).toLocaleString()}</p>
                  <p>{statusLabel[request.status]}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{request.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                申請人：{request.requested_by}
              </p>
              <div className="mt-4">
                <RequestStatusForm request={request} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
