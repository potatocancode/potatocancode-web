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

  // public/demos/ 底下是獨立的靜態 HTML 範例（不經過 App Router）。
  // Next.js 不會把目錄解析成 index.html，所以 /demos/xxx 預設會 404。
  //
  // 這裡用 redirect 而非 rewrite —— rewrite 雖然能保留漂亮網址，但瀏覽器
  // 看到的仍是 /demos/portfolio-styles（無結尾斜線），會把它當成 /demos/ 底下
  // 的一個檔案，於是範例頁裡的相對連結（如 01-swiss-minimal/index.html）
  // 會解析成 /demos/01-swiss-minimal/... 而 404。Next.js 又會強制去掉結尾
  // 斜線，沒辦法靠 /demos/xxx/ 修正，因此直接導到真實檔案路徑，讓相對連結
  // 有正確的基準目錄。
  //
  // 正規表示式排除帶副檔名的路徑，避免 media/*.webp 被導向，
  // 也避免 /index.html 再被接上一次 /index.html 造成無窮迴圈。
  async redirects() {
    return [
      {
        source: "/demos/:path((?!.*\\.).*)",
        destination: "/demos/:path/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
