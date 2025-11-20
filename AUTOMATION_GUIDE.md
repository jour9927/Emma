# 🎯 自動化系統與用戶過濾 - 設置指南

## 📋 功能概述

### 1. 新增分店
✅ **西門門市** - 台北市西門町  
✅ **高雄門市** - 高雄市旗津區  
✅ **三重門市** - 新北市三重區  
✅ **倉庫** - 新北市北投區

### 2. 自動化人力模擬
- ⏰ 每小時自動更新各分店的人力數據
- 🎲 隨機生成當前人力（需求人力的 40%-100%）
- 🔧 管理員可以開啟/關閉自動化
- 🎯 管理員可以手動觸發立即更新
- 📊 不影響手動管理的分店數據

### 3. 用戶分店過濾
- 🔒 `jour9927@gmail.com` 只能看到：西門門市、三重門市、倉庫
- 👥 其他用戶可以看到所有分店
- 🔑 管理員可以設定任何用戶的分店權限

---

## 🚀 設置步驟

### 步驟 1: 執行資料庫設置

在 Supabase SQL Editor 中執行 `scripts/setup-database.sql`

這會創建：
- ✅ 9 個分店（含 4 個新分店）
- ✅ `system_settings` 資料表（自動化開關）
- ✅ `user_branch_access` 資料表（用戶權限）
- ✅ `simulate_branch_headcount()` 函數（模擬人力）
- ✅ `jour9927@gmail.com` 的分店過濾設定

### 步驟 2: 啟用 pg_cron 擴展（可選）

如果要啟用每小時自動執行：

1. **在 Supabase Dashboard 中啟用 pg_cron**
   - 前往 **Database** → **Extensions**
   - 搜尋 `pg_cron`
   - 點擊 **Enable**

2. **執行定時任務設置**
   - 在 SQL Editor 中執行 `scripts/setup-cron.sql`
   - 這會設置每小時自動執行的任務

### 步驟 3: 測試功能

#### 測試自動化控制
1. 使用管理員帳號登入
2. 前往 `/management` 頁面
3. 找到「🤖 自動化人力模擬」區塊
4. 測試開關和手動執行按鈕

#### 測試用戶過濾
1. 使用 `jour9927@gmail.com` 登入
2. 首頁應該只顯示 3 個分店
3. 其他用戶應該看到所有 9 個分店

---

## 📊 資料庫架構

### system_settings 資料表
```sql
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### user_branch_access 資料表
```sql
CREATE TABLE public.user_branch_access (
  id UUID PRIMARY KEY,
  user_email TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  created_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_email, branch_id)
);
```

---

## 🎛️ 管理員功能

### 在管理後台（/management）

#### 自動化控制
- **開關切換**: 啟用/停用自動化模擬
- **手動執行**: 立即觸發一次人力數據更新
- **狀態顯示**: 顯示當前自動化狀態

#### 手動管理
- 原有的所有管理功能完全保留
- 可以手動調整任何分店的人力數據
- 可以創建和管理支援需求

---

## 🔧 進階設定

### 為其他用戶設置分店過濾

在 Supabase SQL Editor 中執行：

```sql
-- 為特定用戶設置可見分店
INSERT INTO public.user_branch_access (user_email, branch_id)
SELECT 
  'user@example.com',  -- 替換為目標用戶郵箱
  b.id
FROM public.branches b
WHERE b.name IN ('西門門市', '三重門市')  -- 指定可見的分店
ON CONFLICT DO NOTHING;
```

### 移除用戶的分店過濾

```sql
-- 移除特定用戶的所有過濾設定（恢復看到所有分店）
DELETE FROM public.user_branch_access
WHERE user_email = 'user@example.com';
```

### 查看用戶權限設定

```sql
-- 查看所有用戶的分店權限
SELECT 
  uba.user_email,
  b.name as branch_name,
  uba.created_at
FROM public.user_branch_access uba
JOIN public.branches b ON uba.branch_id = b.id
ORDER BY uba.user_email, b.name;
```

### 調整自動化執行頻率

編輯 `scripts/setup-cron.sql` 中的 cron 表達式：

```sql
-- 每 30 分鐘執行一次
'*/30 * * * *'

-- 每 15 分鐘執行一次
'*/15 * * * *'

-- 每天早上 9:00 執行
'0 9 * * *'

-- 只在工作日執行（週一到週五）
'0 * * * 1-5'
```

---

## 🐛 故障排除

### 自動化沒有執行

**檢查項目：**
1. pg_cron 擴展是否啟用？
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
   ```

2. 定時任務是否設置？
   ```sql
   SELECT * FROM cron.job;
   ```

3. 自動化開關是否啟用？
   ```sql
   SELECT * FROM system_settings WHERE key = 'auto_simulation_enabled';
   ```

### 用戶看不到任何分店

**可能原因：**
- 用戶未登入
- 用戶有分店過濾但沒有分配任何分店

**解決方法：**
```sql
-- 檢查用戶的權限設定
SELECT * FROM user_branch_access WHERE user_email = 'user@example.com';

-- 如果誤設了空權限，移除過濾
DELETE FROM user_branch_access WHERE user_email = 'user@example.com';
```

### 手動執行沒有效果

**檢查權限：**
```sql
-- 確認函數可以被執行
SELECT simulate_branch_headcount();

-- 查看執行結果
SELECT name, current_headcount, updated_at 
FROM branches 
ORDER BY updated_at DESC;
```

---

## 📁 相關檔案

- `scripts/setup-database.sql` - 完整資料庫設置（含自動化）
- `scripts/setup-cron.sql` - pg_cron 定時任務設置
- `src/components/AutoSimulationControl.tsx` - 自動化控制 UI
- `src/lib/supabase/actions.ts` - 自動化相關 actions
- `src/lib/data.ts` - 用戶分店過濾邏輯

---

## ✅ 驗證清單

完成設置後，請確認：

- [ ] 9 個分店都已創建（含 4 個新分店）
- [ ] `system_settings` 和 `user_branch_access` 資料表存在
- [ ] `simulate_branch_headcount()` 函數可以執行
- [ ] 管理後台顯示自動化控制區塊
- [ ] 開關和手動執行按鈕正常運作
- [ ] `jour9927@gmail.com` 只看到 3 個分店
- [ ] 其他用戶看到所有 9 個分店
- [ ] pg_cron 定時任務已設置（如需自動執行）

---

## 🎉 完成！

系統現在具備：
- ✅ 9 個分店的完整數據
- ✅ 自動化人力模擬系統
- ✅ 管理員控制介面
- ✅ 用戶分店權限過濾
- ✅ 完整保留原有管理功能
