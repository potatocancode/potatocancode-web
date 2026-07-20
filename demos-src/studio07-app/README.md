# STUDIO 07 App Suite — React Native 範例集原始碼

作品集 `/demos/app` 那個 App 範例集的原始碼。**這是真的 React Native**，
同一份程式碼可以編譯成 iOS / Android App，網站上看到的是透過
`react-native-web` 匯出的靜態版本。

四個 App 放在同一個 Expo 專案裡（而不是四個獨立專案），
這樣 react-native-web 的執行期只會被打包一次 —— 四個 App 合計
只有一份 1.2MB 的 bundle，分開做會變成四份。

## 內容

| 路由 | App | 證明的能力 |
|---|---|---|
| `/` | 總覽 | 手機外框（寬螢幕）／全螢幕（手機） |
| `/shop` | 霧谷咖啡 · 電商 | 列表篩選、購物車狀態、三步驟結帳、加購物車動畫 |
| `/studio` | STUDIO 07 · 客戶端 | 進度視覺化、里程碑時間軸、設計稿上標註 |
| `/ledger` | 記一筆 · 記帳 | AsyncStorage 持久化、自製數字鍵盤、SVG 圖表 |
| `/live` | 追蹤中 · 即時外送 | 狀態機、Animated 路線動畫、深色介面 |

假資料沿用網頁範例集與儀表板的同一套 STUDIO 07 世界觀（見 `src/data.ts`）。

## 開發

```bash
npm install
npx expo start          # 開發（可用 Expo Go 掃描 QR code 在真機上跑）
npx expo start --web    # 只跑瀏覽器
```

## 重新產生網站上的版本

```bash
npx expo export --platform web
node normalize-dist.js
# 然後把 dist/ 複製到 web/public/demos/app/
```

**`normalize-dist.js` 不能省。** Expo 匯出的路由結構是混的：
資料夾路由給 `shop/index.html`，單檔路由給 `cart.html`。
混在一起沒辦法用單一 rewrite 規則服務，這支腳本把全部整成
`<route>/index.html`，並移除 `generateStaticParams` 展開後
留下的 `[id]` 樣板目錄。

## 部署上的兩個坑

1. **`app.json` 的 `experiments.baseUrl` 必須是 `/demos/app`** ——
   否則資源會指向網站根目錄而 404。

2. **`next.config.ts` 用 rewrite 而不是 redirect。**
   其他 HTML 範例集用 redirect（它們靠相對連結，網址必須真的變成
   `.../index.html`）；但 Expo Router 是看 `location.pathname` 決定
   渲染哪個畫面，網址一旦被改成 `/demos/app/index.html` 就會變成
   Unmatched Route。因此通用的 redirect 規則有一段 negative lookahead
   把 `app/` 排除掉。
