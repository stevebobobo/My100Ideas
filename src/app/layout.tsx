import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My100Ideas",
  description: "A place for ideas to grow from notes into outcomes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
