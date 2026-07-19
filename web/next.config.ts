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
  // Next.js 不會自動把目錄解析成 index.html，所以 /demos/xxx 預設會 404。
  // afterFiles 在靜態檔比對「之後」才跑，因此 /demos/xxx/index.html 這種
  // 直接命中檔案的請求不受影響，只有目錄形式的網址會被補上 index.html。
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/demos/:path*", destination: "/demos/:path*/index.html" },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
