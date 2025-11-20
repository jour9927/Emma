# 員工分流系統 - 設置指南

## 🚀 快速開始

### 步驟 0: 設置資料庫架構（首次必須執行）

如果遇到 `Could not find the table 'public.branches' in the schema cache` 錯誤，需要先創建資料表：

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的項目
3. 點選左側選單的 **SQL Editor**
4. 執行 `scripts/setup-database.sql` 中的 SQL（或複製以下連結的內容）

這會創建：
- ✅ `branches` 資料表（分店資訊）
- ✅ `coverage_requests` 資料表（支援需求）
- ✅ 必要的索引和觸發器
- ✅ Row Level Security (RLS) 政策
- ✅ 示範資料（可選）

---

## 問題 1: 註冊郵件沒收到

### 原因
- Supabase 預設使用內建郵件服務，可能會被郵件服務商過濾
- 郵件可能在垃圾郵件資料夾中

### 解決方案

#### 方案 A: 檢查 Supabase 郵件設定（推薦）
1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的項目
3. 前往 **Authentication** → **Email Templates**
4. 檢查 **Confirm signup** 模板是否啟用
5. 確認 **From email** 設定正確

#### 方案 B: 設定自訂 SMTP（適合生產環境）
1. 在 Supabase Dashboard 中前往 **Project Settings** → **Auth**
2. 找到 **SMTP Settings**
3. 設定你的 SMTP 服務（如 Gmail、SendGrid、Mailgun 等）

#### 方案 C: 暫時停用郵件驗證（開發環境）
1. 在 Supabase Dashboard 中前往 **Authentication** → **Settings**
2. 找到 **Email Auth** 區塊
3. 關閉 **Enable email confirmations**（僅建議開發環境使用）

#### 方案 D: 手動驗證用戶
如果急需使用，可以在 Supabase Dashboard 的 SQL Editor 中執行：

\`\`\`sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE LOWER(email) = LOWER('你的郵箱@gmail.com');
\`\`\`

---

## 問題 2: 設置管理員權限

### 使用 SQL 腳本設置

1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的項目
3. 點選左側選單的 **SQL Editor**
4. 執行以下 SQL：

\`\`\`sql
-- 將 charlesree826@gmail.com 設為管理員
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');

-- 確認設置成功
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name
FROM auth.users
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');
\`\`\`

### 注意事項
- 確保該郵箱已經完成註冊
- 如果郵箱未驗證，需要先手動驗證（見問題 1 的方案 D）
- 設置完成後，用戶需要重新登入才能看到管理員權限

---

## 完整流程（首次設置管理員）

如果郵箱 `charlesree826@gmail.com` 尚未註冊或驗證：

1. **先在系統中註冊該帳號**
   - 前往註冊頁面
   - 使用 charlesree826@gmail.com 註冊

2. **手動驗證郵箱**（如果沒收到驗證郵件）
   ```sql
   UPDATE auth.users
   SET email_confirmed_at = NOW()
   WHERE LOWER(email) = LOWER('charlesree826@gmail.com');
   ```

3. **設置為管理員**
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = 
     CASE 
       WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
       ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
     END
   WHERE LOWER(email) = LOWER('charlesree826@gmail.com');
   ```

4. **登入系統**
   - 使用該帳號登入
   - 應該可以看到管理後台連結

---

## 驗證管理員權限

登入後檢查：
- 導航列應該顯示「管理後台」連結
- 可以訪問 `/admin` 頁面
- 可以訪問 `/management` 頁面
- 可以創建和管理分店
- 可以處理支援需求

---

## 常見問題

### Q: 為什麼要用 LOWER(email)？
A: 防止大小寫不一致導致找不到用戶

### Q: 如何移除管理員權限？
A: 執行以下 SQL：
\`\`\`sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE LOWER(email) = LOWER('郵箱@gmail.com');
\`\`\`

### Q: 如何查看所有管理員？
A: 執行以下 SQL：
\`\`\`sql
SELECT 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
ORDER BY created_at DESC;
\`\`\`
