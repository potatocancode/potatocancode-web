import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ---------------------------------------------------------------------
  // public/demos/ 底下是三組獨立的範例集，都不經過 App Router。
  // Next.js 不會把目錄解析成 index.html，所以預設全部 404，需要在這裡接。
  //
  // 兩組 HTML 範例集用 redirect、Expo App 用 rewrite，兩者不能互換：
  //
  //  · portfolio-styles / dashboards 是手寫 HTML，頁面裡用「相對連結」
  //    （例如 01-swiss-minimal/index.html）。網址若停在 /demos/xxx
  //    （無結尾斜線），瀏覽器會把最後一段當成檔案、以 /demos/ 為基準，
  //    連結就解析錯了。Next 又會強制去掉結尾斜線，沒辦法靠 /demos/xxx/
  //    修正，所以只能 redirect 到真實檔案路徑，讓相對基準正確。
  //
  //  · demos/app 是 Expo Router 匯出的 React Native App。它設了 baseUrl，
  //    資源全是絕對路徑，沒有相對基準問題；但 Expo Router 是看
  //    location.pathname 決定渲染哪個畫面，網址一旦被改寫成
  //    /demos/app/index.html 就會變成 Unmatched Route。所以只能 rewrite，
  //    網址必須保持不變。
  //
  // Next.js 先跑 redirects 再跑 rewrites，因此下面的 redirect 必須用
  // negative lookahead 把 app/ 排除，否則會搶在 rewrite 之前攔截。
  // ---------------------------------------------------------------------

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        // Expo 匯出後會跑 normalize-dist.js，把每個路由整成 <route>/index.html，
        // 所以一條規則就夠。帶副檔名的 _expo 資源會先被靜態檔案攔截。
        { source: "/demos/app", destination: "/demos/app/index.html" },
        { source: "/demos/app/:path+", destination: "/demos/app/:path+/index.html" },
      ],
      fallback: [],
    };
  },

  async redirects() {
    return [
      {
        // (?!app(?:/|$)) 排除 Expo App；(?!.*\.) 排除帶副檔名的路徑，
        // 避免 media/*.webp 被導向，也避免 index.html 被再接一次造成迴圈。
        source: "/demos/:path((?!app(?:/|$))(?!.*\\.).*)",
        destination: "/demos/:path/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
