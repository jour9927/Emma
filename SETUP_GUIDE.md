# 🚀 員工分流系統 - 快速設置指南

## 第一步：設置 Supabase 資料庫

### 1. 創建資料表

在 Supabase Dashboard 的 SQL Editor 中執行 `scripts/setup-database.sql`：

```bash
# 檔案位置
scripts/setup-database.sql
```

這會創建：
- ✅ `branches` 和 `coverage_requests` 資料表
- ✅ 索引、觸發器和 RLS 政策
- ✅ 示範資料（5 個分店 + 2 個支援需求）

---

## 第二步：設置管理員帳號

### 選項 A：使用現有帳號 (charlesree826@gmail.com)

在 Supabase SQL Editor 中執行：

```sql
-- 驗證郵箱並設為管理員（一次完成）
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
      ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
    END
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');
```

### 選項 B：創建新的管理員帳號

1. 在系統中註冊新帳號
2. 使用 `scripts/set-admin.sql` 將其設為管理員

---

## 第三步：驗證設置

### 1. 確認資料表已創建

```sql
-- 檢查資料表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('branches', 'coverage_requests');

-- 檢查資料
SELECT 'branches' as table_name, COUNT(*) as count FROM branches
UNION ALL
SELECT 'coverage_requests', COUNT(*) FROM coverage_requests;
```

### 2. 確認管理員權限

```sql
-- 查看管理員列表
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  email_confirmed_at IS NOT NULL as is_confirmed
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

### 3. 登入系統測試

1. 使用管理員帳號登入
2. 應該看到「管理後台」連結
3. 訪問 `/admin` 查看儀表板
4. 訪問 `/management` 管理分店

---

## 常見問題

### ❌ "Could not find the table 'public.branches'"
**解決**：執行 `scripts/setup-database.sql` 創建資料表

### ❌ "請先登入" 或 "僅限管理員操作"
**解決**：使用上述 SQL 設置管理員權限，然後重新登入

### ❌ 註冊後沒收到驗證郵件
**解決**：使用上述 SQL 手動驗證郵箱（設置 `email_confirmed_at`）

### ❌ 登入後看不到管理後台連結
**解決**：確認 `raw_user_meta_data` 中 `role` 欄位為 `"admin"`，然後重新登入

---

## 📁 相關檔案

- `scripts/setup-database.sql` - 資料庫架構設置
- `scripts/set-admin.sql` - 管理員權限設置範本
- `ADMIN_SETUP.md` - 詳細設置文件

---

## 🔗 有用連結

- [Supabase Dashboard](https://supabase.com/dashboard)
- [專案 GitHub](https://github.com/jour9927/Emma)
