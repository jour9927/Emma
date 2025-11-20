-- 設置用戶為管理員的 SQL 腳本
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://supabase.com/dashboard)
-- 2. 選擇你的項目
-- 3. 點選左側選單的 "SQL Editor"
-- 4. 複製以下 SQL 並執行

-- 將 charlesree826@gmail.com 設為管理員
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
    ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
  END
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');

-- 查詢確認用戶已設為管理員
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
WHERE LOWER(email) = LOWER('charlesree826@gmail.com');

-- 如果要查看所有管理員
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
ORDER BY created_at DESC;
