import type { AdminSnapshot } from "@/lib/types";

interface AdminSnapshotProps {
  snapshot: AdminSnapshot;
}

const cards = [
  {
    key: "totalBranches" as const,
    label: "分店數",
    color: "text-indigo-600",
  },
  {
    key: "openRequests" as const,
    label: "待處理需求",
    color: "text-rose-600",
  },
  {
    key: "coverageCommitted" as const,
    label: "已派遣人次",
    color: "text-emerald-600",
  },
  {
    key: "criticalBranches" as const,
    label: "紅色警戒",
    color: "text-amber-600",
  },
];

export function AdminSnapshot({ snapshot }: AdminSnapshotProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            管理員概況
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            今日調度指標
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          最後更新 {new Date().toLocaleTimeString()}
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-slate-100 p-4 text-center"
          >
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.color}`}>
              {snapshot[card.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
