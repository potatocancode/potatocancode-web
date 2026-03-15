import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConditionalHeader from "@/components/ConditionalHeader";
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
  title: {
    default: "PotatoCan Studio | 客製化 App 與網頁開發",
    template: "%s | PotatoCan Studio",
  },
  description:
    "CSIE 資工背景開發者，專精 Next.js 網頁開發、React Native 跨平台 App 與 C++ 系統程式。提供從設計到部署的全方位客製化解決方案。",
  keywords: [
    "客製化App開發",
    "CSIE工作室",
    "React Native",
    "Next.js",
    "網頁開發",
    "跨平台App",
    "C++",
    "Supabase",
    "接案",
    "軟體開發",
  ],
  authors: [{ name: "PotatoCan Studio" }],
  creator: "PotatoCan Studio",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    title: "PotatoCan Studio | 客製化 App 與網頁開發",
    description:
      "CSIE 資工背景開發者，專精 Next.js、React Native 與系統程式開發。",
    siteName: "PotatoCan Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "PotatoCan Studio | 客製化 App 與網頁開發",
    description:
      "CSIE 資工背景開發者，專精 Next.js、React Native 與系統程式開發。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
