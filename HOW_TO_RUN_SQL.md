# 🚀 快速設置指南

## ⚠️ 重要：這些 SQL 檔案需要在 Supabase Dashboard 中執行，不是在終端機！

---

## 📝 正確的執行步驟

### 步驟 1: 打開 Supabase Dashboard

1. 瀏覽器打開 https://supabase.com/dashboard
2. 登入你的帳號
3. 選擇你的專案 (Emma)

### 步驟 2: 打開 SQL Editor

1. 在左側選單找到 **SQL Editor**
2. 點擊進入
3. 點擊 **New query** 創建新查詢

### 步驟 3: 執行資料庫設置

1. **打開檔案**
   - 在 VS Code 中打開 `scripts/setup-database.sql`
   
2. **複製內容**
   - 按 `Cmd + A` (全選)
   - 按 `Cmd + C` (複製)
   
3. **貼到 Supabase**
   - 回到 Supabase SQL Editor
   - 按 `Cmd + V` (貼上)
   - 點擊 **Run** 按鈕 (或按 `Cmd + Enter`)

4. **等待完成**
   - 看到 "✅ 資料庫架構設置完成！" 表示成功

### 步驟 4: 設置定時任務（可選）

如果你想要每小時自動更新人力數據：

1. **啟用 pg_cron 擴展**
   - 在 Supabase Dashboard 左側選單
   - 點擊 **Database** → **Extensions**
   - 搜尋 `pg_cron`
   - 點擊 **Enable**

2. **執行 Cron 設置**
   - 打開 `scripts/setup-cron.sql`
   - 複製全部內容
   - 貼到 SQL Editor
   - 點擊 **Run**

---

## ✅ 驗證設置成功

在 SQL Editor 中執行以下查詢：

```sql
-- 檢查分店數量（應該有 9 個）
SELECT COUNT(*) as branch_count FROM public.branches;

-- 查看所有分店
SELECT name, location, required_headcount, current_headcount 
FROM public.branches 
ORDER BY name;

-- 檢查 jour9927@gmail.com 的權限（應該有 3 個分店）
SELECT b.name 
FROM public.user_branch_access uba
JOIN public.branches b ON uba.branch_id = b.id
WHERE uba.user_email = 'jour9927@gmail.com';

-- 檢查自動化設定
SELECT * FROM public.system_settings;
```

---

## 🎯 快速測試

### 測試自動化模擬

在 SQL Editor 中執行：

```sql
-- 手動執行一次模擬
SELECT simulate_branch_headcount();

-- 查看更新後的數據
SELECT name, current_headcount, updated_at 
FROM public.branches 
ORDER BY updated_at DESC;
```

### 測試管理員權限

```sql
-- 設置 charlesree826@gmail.com 為管理員
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
      ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
    END
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');

-- 確認設置成功
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');
```

---

## 🐛 常見問題

### Q: 為什麼不能在終端機執行？
A: 這些是 PostgreSQL SQL 腳本，需要在 Supabase 的資料庫中執行，不是在本地終端機。

### Q: 執行後沒有看到資料？
A: 確保：
1. 你選擇了正確的 Supabase 專案
2. SQL 執行沒有錯誤
3. 重新整理頁面

### Q: 如何確認自動化正在運作？
A: 執行以下 SQL 查看定時任務：
```sql
SELECT * FROM cron.job WHERE jobname = 'simulate-branch-headcount-hourly';
```

---

## 📚 相關檔案

所有 SQL 腳本位於 `scripts/` 資料夾：

- ✅ `setup-database.sql` - **必須執行** - 創建所有資料表和功能
- ⏰ `setup-cron.sql` - 可選 - 設置自動執行
- 👤 `set-admin.sql` - 參考 - 管理員權限設置範例

---

## 🎉 完成檢查清單

設置完成後，確認：

- [ ] 在 Supabase SQL Editor 中執行了 `setup-database.sql`
- [ ] 看到 9 個分店創建成功
- [ ] `system_settings` 資料表存在
- [ ] `user_branch_access` 資料表存在且有 jour9927@gmail.com 的 3 個權限
- [ ] 管理員帳號已設置
- [ ] （可選）pg_cron 擴展已啟用
- [ ] （可選）定時任務已設置

現在可以登入系統測試功能了！
