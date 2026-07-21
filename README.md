# PotatoCanCode Studio

個人工作室的作品集網站，含後台管理與 20 個可線上操作的技術範例。

**線上網站** → https://potatocancode-web.vercel.app

```
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS
Supabase (Postgres + Auth + Storage) · Vercel
```

---

## 這個 repo 有什麼

```
web/            Next.js 網站本體（前台 + 後台）
demos-src/      React Native 範例集的原始碼
supabase/       資料庫 migration
```

### 網站

- **前台** — 首頁、作品集、服務、聯絡表單
- **後台** `/admin` — 作品與服務的 CRUD、封面圖上傳、詢問單管理
- **認證** — Supabase Auth，middleware 保護 `/admin` 路由
- **資料** — Postgres 搭配 Row Level Security，另有一支腳本專門驗 RLS 政策 (`npm run test:rls`)

### 三組技術範例

不是截圖，是**可以直接點進去操作**的東西。三組刻意證明不同的能力：

| 範例集 | 內容 | 證明什麼 |
|---|---|---|
| [**網頁風格**](https://potatocancode-web.vercel.app/demos/portfolio-styles) | 12 種視覺風格，同一份文案 | 視覺語言、捲動動畫、GSAP / Three.js |
| [**營運儀表板**](https://potatocancode-web.vercel.app/demos/dashboards) | 4 個 BI 儀表板 | 資料密度、虛擬捲動、即時推送、圖表 |
| [**行動 App**](https://potatocancode-web.vercel.app/demos/app) | 4 個 React Native App | 跨平台開發、手勢、本機儲存、狀態機 |

三組共用同一套虛構的工作室資料（客戶、專案、金額都對得起來），所以它們讀起來是同一個世界的三個切面，而不是三堆不相干的 demo。

App 那組是**真的 React Native**（原始碼在 [`demos-src/studio07-app/`](demos-src/studio07-app)），透過 `react-native-web` 匯出成靜態網頁，同一份程式碼可以直接編譯成 iOS / Android。

---

## 本機開發

```bash
cd web
npm install
cp .env.example .env.local   # 填入 Supabase 的 URL 與金鑰
npm run dev
```

| 指令 | 用途 |
|---|---|
| `npm run dev` | 開發伺服器 |
| `npm run build` | 產品建置 |
| `npm test` | 單元測試（Vitest + Testing Library） |
| `npm run test:e2e` | 端對端測試（Playwright） |
| `npm run test:rls` | 驗證 Supabase 的 Row Level Security 政策 |

---

## 幾個值得一提的實作決定

**`next.config.ts` 對範例集用了兩套路由規則。** 手寫的 HTML 範例集用 `redirect`，Expo App 用 `rewrite` —— 兩者不能互換。HTML 範例靠相對連結，網址必須真的變成 `.../index.html` 相對基準才正確；但 Expo Router 是看 `location.pathname` 決定渲染哪個畫面，網址一被改寫就會變成 Unmatched Route。設定檔裡有完整說明。

**`.gitattributes` 把 `web/public/demos/` 標成 vendored。** 範例集的靜態檔約 1.1 MB，遠大於實際的 Next.js 原始碼，不排除的話 GitHub 會把這個專案標成「HTML 專案」。

**範例集的驗收是實際操作，不是看 console 有沒有錯。** 用 Chrome DevTools Protocol 驅動 headless Chrome，真的去點篩選、拖捲軸、加購物車、在設計稿上標註，再斷言畫面有對應反應。這樣才抓得到「路徑存在但連結指不到」、「標註全部擠在左上角」這類靜態檢查看不出來的問題。

---

## 授權

範例集的程式碼可自由參考。網站內容與品牌識別為個人所有。
