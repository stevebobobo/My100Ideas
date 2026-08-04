# My100Ideas

My100Ideas 是一個以雲端為基礎的創意管理網站，用來記錄想法、追蹤發展過程，並選擇性地將內容公開展示於個人作品集或學校課程中。

目前此倉庫僅包含第一版應用程式骨架，尚未加入任何真實的創意資料。

## 專案架構

- **Next.js、React 與 TypeScript**：建立網站介面與應用程式功能。
- **Supabase**：預留 PostgreSQL 資料庫、使用者登入與檔案儲存整合。
- **Cloudflare Pages**：部署 Next.js 產生的靜態網站。
- **GitHub**：保存程式碼、版本紀錄與串接自動部署。

## 目錄結構

```text
src/
  app/                 Next.js 頁面與全域樣式
  lib/supabase/        Supabase 瀏覽器端連線程式
  types/               應用程式資料模型
supabase/
  migrations/          資料庫結構與資料存取規則
```

## 在本機執行

1. 安裝相依套件：

   ```bash
   npm install
   ```

2. 將 `.env.example` 複製為 `.env.local`，並填入 Supabase 專案提供的公開網址與匿名金鑰。

3. 啟動開發伺服器：

   ```bash
   npm run dev
   ```

目前的首頁不需要 Supabase 設定也能正常建置。只有實際呼叫 `getSupabaseBrowserClient()` 的功能，才需要提供 Supabase 環境變數。

## 設定資料庫

建立 Supabase 專案後，執行 `supabase/migrations` 目錄中的 SQL migration。

此 migration 會建立：

- `ideas` 創意資料表。
- 創意狀態與公開範圍選項。
- 原創性、影響力、難度、時機與遺憾程度等評分限制。
- 建立與更新時間欄位。
- 查詢索引。
- 資料列層級安全性（Row Level Security，RLS）規則。

請勿將 Supabase 的 `service_role` 金鑰放入網站程式或 Cloudflare Pages。瀏覽器端只能使用公開的匿名金鑰，並由 RLS 規則保護資料。

## 部署到 Cloudflare Pages

將此 GitHub 倉庫連接至 Cloudflare Pages，並使用以下設定：

| 設定項目 | 設定值 |
| --- | --- |
| Framework preset | Next.js（Static HTML Export） |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node.js version | `22` 或更新版本 |

開始使用 Supabase 功能時，請在 Cloudflare Pages 加入以下環境變數：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 目前完成範圍

- 響應式網站首頁。
- 相容 Cloudflare Pages 的靜態建置設定。
- Supabase 連線程式骨架。
- 第一版 `Idea` TypeScript 資料模型。
- 包含資料存取規則的 PostgreSQL 初始 schema。

以下功能刻意保留至後續版本：

- 管理者登入。
- 新增與編輯創意的管理介面。
- 公開創意列表與詳細頁面。
- 圖片及附件上傳。
- 真實創意內容。

## 專案理念

> 讓每一個想法，都留下它的人生。

My100Ideas 不只是蒐集一百個點子，而是記錄每個想法從出現、研究、實驗、實作，到完成、錯過或放棄的完整歷程。
