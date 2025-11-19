import Link from "next/link";
import { signOutAction } from "@/lib/supabase/actions";

interface SiteNavProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export function SiteNav({ isAuthenticated, userName }: SiteNavProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm sm:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          員工分流系統
        </Link>
        <nav className="flex flex-wrap gap-4 text-slate-600">
          <Link
            href="/"
            className="hover:text-slate-900"
          >
            Dashboard
          </Link>
          <Link
            href="/management"
            className="hover:text-slate-900"
          >
            管理員
          </Link>
          <Link
            href="/profile"
            className="hover:text-slate-900"
          >
            個人檔案
          </Link>
          <a href="#support-request" className="hover:text-slate-900">
            支援需求
          </a>
        </nav>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          {isAuthenticated ? (
            <>
              <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-slate-700 sm:inline">
                {userName ?? "已登入"}
              </span>
              <Link
                href="/profile"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-900 hover:border-slate-300"
              >
                設定
              </Link>
              <form action={signOutAction}>
                <button className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-900 hover:border-slate-300">
                  登出
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-slate-900 hover:border-slate-300"
              >
                登入
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-slate-900 bg-slate-900 px-4 py-1.5 text-white hover:bg-slate-800"
              >
                註冊
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
