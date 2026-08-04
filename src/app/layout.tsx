import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My100Ideas — 讓每一個想法，都留下它的人生",
  description: "My100Ideas 是一個靈感紀錄網站，保存曾經想到、正在實現，以及因拖延而錯過的創意與故事。",
  keywords: ["My100Ideas", "點子檔案庫", "創意紀錄", "Indie Hacker", "靈感博物館"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
