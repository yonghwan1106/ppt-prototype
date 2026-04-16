import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PPT · Public Project Tracker — 경기남부 공공사업 추적 대시보드",
  description: "경인블루저널이 운영하는 AI 에이전트 기반 공공 프로젝트 추적·분석 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Noto+Sans+KR:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#08090d] text-[#e8e4dc] antialiased">
        {children}
      </body>
    </html>
  );
}
