import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPT \u00b7 Public Project Tracker \u2014 \uacbd\uae30\ub0a8\ubd80 \uacf5\uacf5\uc0ac\uc5c5 \ucd94\uc801 \ub300\uc2dc\ubcf4\ub4dc",
  description: "\uacbd\uc778\ube14\ub8e8\uc800\ub110\uc774 \uc6b4\uc601\ud558\ub294 AI \uc5d0\uc774\uc804\ud2b8 \uae30\ubc18 \uacf5\uacf5 \ud504\ub85c\uc81d\ud2b8 \ucd94\uc801\u00b7\ubd84\uc11d \ud50c\ub7ab\ud3fc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0f1a] text-gray-100 antialiased">{children}</body>
    </html>
  );
}
