"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server-client";

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
}

const missingEnvState: FormState = {
  status: "error",
  message:
    "請先在 Vercel/Supabase 設定 NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY。",
};

async function requireAdmin(
  supabase: SupabaseClient | null,
): Promise<FormState | { user: User }> {
  if (!supabase) {
    return missingEnvState;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { status: "error", message: "請先登入" };
  }

  if ((user.user_metadata?.role as string | undefined) !== "admin") {
    return { status: "error", message: "僅限管理員操作" };
  }

  return { user };
}

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const fullName = formData.get("fullName")?.toString() ?? "";
  const branch = formData.get("branch")?.toString() ?? "";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        branch_preference: branch,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  return { status: "success", message: "註冊成功，請至信箱完成驗證" };
}

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  return { status: "success", message: "登入成功" };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut();
  revalidatePath("/");
}

export async function createBranchAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }
  const adminCheck = await requireAdmin(supabase);
  if ("status" in adminCheck) {
    return adminCheck;
  }

  const name = formData.get("name")?.toString();
  const location = formData.get("location")?.toString();
  const required = Number(formData.get("required_headcount") ?? 0);
  const lead = formData.get("lead_contact")?.toString() ?? null;

  const { error } = await supabase.from("branches").insert({
    name,
    location,
    required_headcount: required,
    current_headcount: 0,
    lead_contact: lead,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/management");
  return { status: "success", message: "成功新增分店" };
}

export async function updateBranchStaffingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }
  const adminCheck = await requireAdmin(supabase);
  if ("status" in adminCheck) {
    return adminCheck;
  }

  const branchId = formData.get("branchId")?.toString();
  const required = Number(formData.get("required_headcount") ?? 0);
  const current = Number(formData.get("current_headcount") ?? 0);
  const notes = formData.get("notes")?.toString() ?? null;

  if (!branchId) {
    return { status: "error", message: "缺少分店 ID" };
  }

  const { error } = await supabase
    .from("branches")
    .update({
      required_headcount: required,
      current_headcount: current,
      notes,
    })
    .eq("id", branchId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/management");
  return { status: "success", message: "分店資訊已更新" };
}

export async function createSupportRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const branchId = formData.get("branchId")?.toString();
  const priority = formData.get("priority")?.toString() ?? "medium";
  const requestedBy = formData.get("requested_by")?.toString() ?? "";
  const message = formData.get("message")?.toString() ?? "";

  if (!branchId) {
    return { status: "error", message: "請選擇分店" };
  }

  const { error } = await supabase.from("coverage_requests").insert({
    branch_id: branchId,
    priority,
    requested_by: requestedBy,
    message,
    status: "open",
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/management");
  return { status: "success", message: "已送出支援需求" };
}

export async function resolveRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }
  const adminCheck = await requireAdmin(supabase);
  if ("status" in adminCheck) {
    return adminCheck;
  }

  const requestId = formData.get("requestId")?.toString();
  const status = formData.get("status")?.toString() ?? "closed";

  if (!requestId) {
    return { status: "error", message: "缺少需求 ID" };
  }

  const { error } = await supabase
    .from("coverage_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/management");
  return { status: "success", message: "需求狀態已更新" };
}

export async function updateProfileAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const username = formData.get("username")?.toString().trim() ?? "";
  if (!username) {
    return { status: "error", message: "請輸入使用者名稱" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "error", message: "請先登入" };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      username,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/");
  revalidatePath("/management");

  return { status: "success", message: "使用者名稱已更新" };
}

// ==========================================
// 自動化模擬系統控制
// ==========================================

export async function toggleAutoSimulation(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const adminCheck = await requireAdmin(supabase);
  if ("status" in adminCheck) {
    return adminCheck;
  }

  const enabled = formData.get("enabled")?.toString() === "true";

  const { error } = await supabase
    .from("system_settings")
    .update({ value: enabled })
    .eq("key", "auto_simulation_enabled");

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin");
  return {
    status: "success",
    message: `自動模擬已${enabled ? "啟用" : "停用"}`,
  };
}

export async function getAutoSimulationStatus(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return false;
  }

  const { data } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "auto_simulation_enabled")
    .single();

  return data?.value === true;
}

export async function manualSimulateBranches(
  _prev: FormState,
): Promise<FormState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return missingEnvState;
  }

  const adminCheck = await requireAdmin(supabase);
  if ("status" in adminCheck) {
    return adminCheck;
  }

  const { error } = await supabase.rpc("simulate_branch_headcount");

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/management");

  return { status: "success", message: "已手動更新所有分店人力數據" };
}
