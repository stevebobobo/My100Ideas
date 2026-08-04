# My100Ideas

My100Ideas 是一個簡單的創意紀錄網站，用來保存曾經想到、正在實現，以及因拖延而錯過的點子。

> 讓每一個想法，都留下它的人生。

## 專案架構

第一版刻意保持簡單：

- **Next.js、React、TypeScript**：建立網站。
- **JSON 檔案**：保存創意資料。
- **GitHub**：保存程式與版本紀錄。
- **GitHub Pages**：自動部署公開網站。

目前不使用資料庫或登入系統。需要直接從手機或網頁新增資料時，再評估加入 Supabase。

## 目錄結構

```text
src/
  app/                 網站頁面與樣式
  data/ideas.json      所有創意資料
  types/idea.ts        Idea 資料格式
```

## 在本機執行

```bash
npm install
npm run dev
```

開啟瀏覽器並前往 `http://localhost:3000`。

## 新增 Idea

在 `src/data/ideas.json` 加入一筆符合 `src/types/idea.ts` 格式的資料即可。網站建置時會直接讀取並顯示這些內容。

## 部署到 GitHub Pages

網站透過 `.github/workflows/deploy-pages.yml` 自動部署。合併或推送到 `main` 後，GitHub Actions 會建置並發布網站：

<https://stevebobobo.github.io/My100Ideas/>

GitHub 倉庫的 Pages 設定需選擇 **GitHub Actions** 作為來源。

## 第一筆 Idea

`IDEA-001`：匯款帳號後五碼對帳法。

付款者完成匯款後提供帳號末五碼，讓收款方能與銀行入帳紀錄比對，快速辨識款項來源。
