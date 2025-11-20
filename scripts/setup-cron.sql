-- ==========================================
-- 設置自動化定時任務
-- ==========================================
-- 前置條件：需要先啟用 pg_cron 擴展
-- 
-- 在 Supabase Dashboard 中：
-- 1. 前往 Database → Extensions
-- 2. 搜尋 "pg_cron"
-- 3. 點擊 Enable
-- 
-- 然後在 SQL Editor 中執行此腳本
-- ==========================================

-- 啟用 pg_cron 擴展（如果尚未啟用）
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 刪除現有的定時任務（如果存在）
SELECT cron.unschedule('simulate-branch-headcount-hourly');

-- 設置每小時執行的定時任務
-- 在每小時的第 0 分鐘執行（例如：1:00, 2:00, 3:00...）
SELECT cron.schedule(
  'simulate-branch-headcount-hourly',
  '0 * * * *',
  $$SELECT simulate_branch_headcount();$$
);

-- 查看所有已設置的定時任務
SELECT * FROM cron.job;

-- ==========================================
-- 測試執行
-- ==========================================

-- 手動執行一次以測試功能
SELECT simulate_branch_headcount();

-- 查看執行結果
SELECT * FROM public.branches ORDER BY name;

-- ==========================================
-- 管理定時任務的其他指令
-- ==========================================

-- 查看定時任務執行歷史
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- 暫停定時任務（不刪除）
-- UPDATE cron.job SET active = false WHERE jobname = 'simulate-branch-headcount-hourly';

-- 恢復定時任務
-- UPDATE cron.job SET active = true WHERE jobname = 'simulate-branch-headcount-hourly';

-- 完全刪除定時任務
-- SELECT cron.unschedule('simulate-branch-headcount-hourly');

-- ==========================================
-- 自定義執行頻率範例
-- ==========================================

-- 每 30 分鐘執行一次
-- SELECT cron.schedule('simulate-branch-headcount-half-hourly', '*/30 * * * *', $$SELECT simulate_branch_headcount();$$);

-- 每天早上 9:00 執行
-- SELECT cron.schedule('simulate-branch-headcount-daily', '0 9 * * *', $$SELECT simulate_branch_headcount();$$);

-- 只在工作日（週一到週五）的每小時執行
-- SELECT cron.schedule('simulate-branch-headcount-weekdays', '0 * * * 1-5', $$SELECT simulate_branch_headcount();$$);

SELECT '✅ 定時任務設置完成！每小時將自動更新人力數據。' as status;
