## 員工分流系統

使用 Next.js 16（App Router）、Vercel 以及 Supabase 打造的多分店人力調度平台。老闆、管理員與員工都可以在同一套系統中完成註冊登入、查看各分店 Dashboard、送出支援需求並在管理頁面維護所有資訊。

### 功能特色

- **帳號系統**：Supabase Auth 處理註冊 / 登入 / 登出，員工資料會跟著會話 Cookie 一起同步。
- **分店 Dashboard**：即時顯示各分店需求與現場人數，依照人力密度排序並提供聯絡人資訊與備註。
- **支援需求中心**：員工或店長可以送出支援申請，所有人立即看到排程狀態。
- **管理員頁面**：新增/更新分店、人力配置與需求結案都在 `/management` 頁面完成。
- **Vercel 友善**：預設配置適合一鍵部署到 Vercel，支援環境變數與自動化資料回補（未設定 Supabase 時會使用 demo data）。

---

## 本機開發

```bash
npm install
npm run dev
# 瀏覽 http://localhost:3000
```

若僅需 UI Demo，可以直接執行上述流程。當 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 尚未設定時，系統會載入 `src/lib/demo-data.ts` 的假資料。

---

## Supabase 設定

1. 在 Supabase 建立專案後，新增下列表格：

```sql
create table public.branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  required_headcount int not null,
  current_headcount int not null default 0,
  lead_contact text,
  notes text,
  updated_at timestamptz default now()
);

create table public.coverage_requests (
  id uuid primary key default uuid_generate_v4(),
  branch_id uuid references public.branches(id) on delete cascade,
  priority text default 'medium',
  status text default 'open',
  requested_by text not null,
  message text not null,
  created_at timestamptz default now()
);
```

2. 到「Project Settings → API」複製 `Project URL` 與 `anon public` key，並設定在環境變數中。

---

## 環境變數

在專案根目錄建立 `.env.local`（Vercel 則在 Project Settings → Environment Variables）：

```
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase anon key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

`NEXT_PUBLIC_SITE_URL` 主要用於註冊信件的 redirect，可在本機開發時設為 `http://localhost:3000`。

---

## 部署到 Vercel

1. 將這個專案推送到 GitHub。
2. 在 Vercel 建立新專案並連動倉庫。
3. 於 Vercel 設定與 `.env.local` 相同的 Supabase 相關環境變數。
4. 首次部署後，可於 Vercel Dashboard 觸發 `Redeploy` 以確保 Server Actions 使用最新環境。

---

## 目錄重點

- `src/app/page.tsx`：首頁，包含註冊登入、分店 Dashboard 與支援需求。
- `src/app/management/page.tsx`：管理員專屬頁面，集中維運相關操作。
- `src/app/admin/page.tsx`：保留相容性的重新導向，導至 `/management`。
- `src/lib/data.ts`：處理 Supabase 資料擷取與 demo fallback。
- `src/lib/supabase`：Server Actions、Supabase client 建立方式。
- `src/components`：UI 與互動元件，例如 `AuthCard`、`SupportRequestBoard`。

---

## 後續延伸建議

1. 加入角色權限（店長 / 管理員）並以 Supabase Row Level Security 限制資料操作。
2. 透過 Edge Functions/Realtime 訂閱 `coverage_requests`，做到全即時更新。
3. 將派遣流程寫入 `branch_activity_logs`，方便回溯每一次人力調度。
4. 串接 Vercel Cron Job，每天自動整理過期的支援需求。
