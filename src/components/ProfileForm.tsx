"use client";

import { useActionState } from "react";
import { updateProfileAction, type FormState } from "@/lib/supabase/actions";

const initialState: FormState = { status: "idle", message: "" };

interface ProfileFormProps {
  defaultUsername: string;
}

export function ProfileForm({ defaultUsername }: ProfileFormProps) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-3 rounded-3xl bg-white/90 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Profile
        </p>
        <h2 className="text-xl font-semibold text-slate-900">自訂使用者名稱</h2>
        <p className="text-sm text-slate-500">
          使用者名稱會顯示在支援需求與管理頁面上。
        </p>
      </div>
      <label className="block text-sm font-semibold text-slate-700">
        使用者名稱
        <input
          type="text"
          name="username"
          className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2"
          defaultValue={defaultUsername}
          placeholder="輸入你的暱稱"
          required
        />
      </label>
      <button
        className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={pending}
      >
        {pending ? "儲存中..." : "儲存變更"}
      </button>
      {state.message && (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-rose-600" : "text-emerald-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
