"use client";

import { useActionState, useEffect, useState } from "react";
import {
  toggleAutoSimulation,
  manualSimulateBranches,
  type FormState,
} from "@/lib/supabase/actions";

interface AutoSimulationControlProps {
  initialEnabled: boolean;
}

const initialState: FormState = { status: "idle", message: "" };

export default function AutoSimulationControl({
  initialEnabled,
}: AutoSimulationControlProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [toggleState, toggleAction] = useActionState(
    toggleAutoSimulation,
    initialState,
  );
  const [simulateState, simulateAction] = useActionState(
    manualSimulateBranches,
    initialState,
  );

  useEffect(() => {
    if (toggleState.status === "success") {
      setEnabled(!enabled);
    }
  }, [toggleState, enabled]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          🤖 自動化人力模擬
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          展示用功能：每小時自動隨機更新各分店的人力數據
        </p>
      </div>

      <div className="space-y-4">
        {/* 開關控制 */}
        <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div>
            <p className="font-medium text-slate-900">自動化模擬</p>
            <p className="text-xs text-slate-500">
              {enabled ? "每小時自動更新" : "已暫停"}
            </p>
          </div>
          <form action={toggleAction}>
            <input
              type="hidden"
              name="enabled"
              value={(!enabled).toString()}
            />
            <button
              type="submit"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </form>
        </div>

        {/* 手動執行按鈕 */}
        <form action={simulateAction}>
          <button
            type="submit"
            className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            🎲 立即手動更新人力數據
          </button>
        </form>

        {/* 狀態訊息 */}
        {toggleState.status !== "idle" && (
          <p
            className={`text-sm ${
              toggleState.status === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {toggleState.message}
          </p>
        )}
        {simulateState.status !== "idle" && (
          <p
            className={`text-sm ${
              simulateState.status === "success"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {simulateState.message}
          </p>
        )}

        {/* 說明 */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            ⚠️ 這是展示功能，不會影響手動管理的分店數據。自動化更新會在需求人力的
            40%-100% 之間隨機生成。
          </p>
        </div>
      </div>
    </div>
  );
}
