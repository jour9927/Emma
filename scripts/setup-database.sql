-- ==========================================
-- 員工分流系統 - 資料庫架構設置
-- ==========================================
-- 使用方法：
-- 1. 登入 Supabase Dashboard (https://supabase.com/dashboard)
-- 2. 選擇你的項目
-- 3. 點選左側選單的 "SQL Editor"
-- 4. 複製以下 SQL 並執行
-- ==========================================

-- 創建 branches 資料表（分店資訊）
CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  required_headcount INTEGER NOT NULL DEFAULT 0,
  current_headcount INTEGER NOT NULL DEFAULT 0,
  lead_contact TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建 coverage_requests 資料表（支援需求）
CREATE TABLE IF NOT EXISTS public.coverage_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('open', 'committed', 'closed')) DEFAULT 'open',
  requested_by TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 創建索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_branches_name ON public.branches(name);
CREATE INDEX IF NOT EXISTS idx_coverage_requests_branch_id ON public.coverage_requests(branch_id);
CREATE INDEX IF NOT EXISTS idx_coverage_requests_status ON public.coverage_requests(status);
CREATE INDEX IF NOT EXISTS idx_coverage_requests_priority ON public.coverage_requests(priority);
CREATE INDEX IF NOT EXISTS idx_coverage_requests_created_at ON public.coverage_requests(created_at DESC);

-- 創建更新時間的觸發函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 為 branches 資料表添加更新時間觸發器
DROP TRIGGER IF EXISTS update_branches_updated_at ON public.branches;
CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON public.branches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 為 coverage_requests 資料表添加更新時間觸發器
DROP TRIGGER IF EXISTS update_coverage_requests_updated_at ON public.coverage_requests;
CREATE TRIGGER update_coverage_requests_updated_at
  BEFORE UPDATE ON public.coverage_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coverage_requests ENABLE ROW LEVEL SECURITY;

-- Branches 資料表的 RLS 政策
-- 所有已認證用戶可以讀取分店資訊
DROP POLICY IF EXISTS "Anyone can view branches" ON public.branches;
CREATE POLICY "Anyone can view branches"
  ON public.branches
  FOR SELECT
  TO authenticated
  USING (true);

-- 只有管理員可以新增分店
DROP POLICY IF EXISTS "Admins can insert branches" ON public.branches;
CREATE POLICY "Admins can insert branches"
  ON public.branches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- 只有管理員可以更新分店
DROP POLICY IF EXISTS "Admins can update branches" ON public.branches;
CREATE POLICY "Admins can update branches"
  ON public.branches
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- 只有管理員可以刪除分店
DROP POLICY IF EXISTS "Admins can delete branches" ON public.branches;
CREATE POLICY "Admins can delete branches"
  ON public.branches
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Coverage Requests 資料表的 RLS 政策
-- 所有已認證用戶可以讀取支援需求
DROP POLICY IF EXISTS "Anyone can view requests" ON public.coverage_requests;
CREATE POLICY "Anyone can view requests"
  ON public.coverage_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- 所有已認證用戶可以新增支援需求
DROP POLICY IF EXISTS "Anyone can insert requests" ON public.coverage_requests;
CREATE POLICY "Anyone can insert requests"
  ON public.coverage_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 只有管理員可以更新支援需求
DROP POLICY IF EXISTS "Admins can update requests" ON public.coverage_requests;
CREATE POLICY "Admins can update requests"
  ON public.coverage_requests
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- 只有管理員可以刪除支援需求
DROP POLICY IF EXISTS "Admins can delete requests" ON public.coverage_requests;
CREATE POLICY "Admins can delete requests"
  ON public.coverage_requests
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- 插入示範資料（可選）
-- 如果不需要示範資料，可以刪除以下部分

-- 插入示範分店
INSERT INTO public.branches (name, location, required_headcount, current_headcount, lead_contact, notes)
VALUES
  ('信義門市', '台北市信義區', 10, 8, '張經理 (02) 2345-6789', '旗艦店，週末人流量大'),
  ('板橋門市', '新北市板橋區', 8, 6, '李店長 (02) 8765-4321', '近捷運站，平日較忙碌'),
  ('桃園門市', '桃園市中壢區', 6, 5, '王主任 (03) 1234-5678', '新開幕分店'),
  ('新竹門市', '新竹市東區', 7, 3, '陳經理 (03) 9876-5432', '科技園區附近，急需人力'),
  ('台中門市', '台中市西屯區', 9, 7, '林店長 (04) 2345-6789', '中部據點')
ON CONFLICT DO NOTHING;

-- 插入示範支援需求
INSERT INTO public.coverage_requests (branch_id, priority, status, requested_by, message)
SELECT 
  b.id,
  'high',
  'open',
  '陳經理',
  '明天有大型活動，急需 2 名支援人員，請於早上 9:00 前到達。'
FROM public.branches b
WHERE b.name = '新竹門市'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.coverage_requests (branch_id, priority, status, requested_by, message)
SELECT 
  b.id,
  'medium',
  'open',
  '張經理',
  '週末預期人流增加，需要 1 名支援人員協助。'
FROM public.branches b
WHERE b.name = '信義門市'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 驗證資料表創建成功
SELECT 
  'branches' as table_name, 
  COUNT(*) as row_count 
FROM public.branches

UNION ALL

SELECT 
  'coverage_requests' as table_name, 
  COUNT(*) as row_count 
FROM public.coverage_requests;

-- 顯示成功訊息
SELECT '✅ 資料庫架構設置完成！' as status;
