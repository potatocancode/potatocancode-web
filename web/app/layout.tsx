import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_TC, JetBrains_Mono } from "next/font/google";
import ConditionalHeader from "@/components/ConditionalHeader";
import SocialDock from "@/components/SocialDock";
import SiteFooter from "@/components/SiteFooter";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

// Display + body. Neo-brutalism uses bold weights only.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Catches every Han character behind Space Grotesk, which has no CJK glyphs.
// preload:false — the traditional-chinese subset is ~20k glyphs across ~100
// woff2 slices; Google's unicode-range splitting means the browser pulls only
// the slices a page actually uses, but preloading all of them would be fatal.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
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
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoSansTC.variable} ${jetbrainsMono.variable} bg-cream text-ink antialiased`}
        suppressHydrationWarning
      >
        <ConditionalHeader />
        <MotionProvider>{children}</MotionProvider>
        <SiteFooter />
        <SocialDock />
      </body>
    </html>
  );
}
