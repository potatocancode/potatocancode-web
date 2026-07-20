/**
 * 把 Expo 匯出的 dist 統一成「每個路由一個目錄 + index.html」。
 *
 * Expo 混用兩種結構：資料夾路由給 shop/index.html，
 * 單檔路由給 cart.html。混在一起沒辦法用單一 rewrite 規則服務，
 * 所以在這裡把扁平的 X.html 一律改成 X/index.html。
 *
 * 之後 next.config 只需要一條：
 *   /demos/app/:path*  →  /demos/app/:path*\/index.html
 */
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
let moved = 0;

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith('.html') || name === 'index.html') continue;

    // +not-found 與 _sitemap 是 Expo 的內部頁，保持原樣即可
    if (name.startsWith('+') || name.startsWith('_')) continue;

    const base = name.slice(0, -'.html'.length);
    const targetDir = path.join(dir, base);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.renameSync(full, path.join(targetDir, 'index.html'));
    moved++;
    console.log('  ' + path.relative(DIST, full).replace(/\\/g, '/') +
                ' → ' + path.relative(DIST, path.join(targetDir, 'index.html')).replace(/\\/g, '/'));
  }
}

if (!fs.existsSync(DIST)) {
  console.error('找不到 dist/，請先執行 npx expo export --platform web');
  process.exit(1);
}

console.log('正規化路由結構：');
walk(DIST);
console.log(`\n完成，搬移 ${moved} 個檔案`);

// generateStaticParams 已經為每個 id 產生實體頁面，
// 樣板本身（[id]/）就是死檔案，留著只會讓 dist 多出看不懂的路徑
let removed = 0;
(function prune(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!fs.statSync(full).isDirectory()) continue;
    if (name.includes('[')) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log('  移除樣板 ' + path.relative(DIST, full).replace(/\\/g, '/'));
      removed++;
    } else prune(full);
  }
})(DIST);
console.log(`移除 ${removed} 個動態路由樣板`);

// 驗證：整個 dist 不該再有任何含 [ 的路徑
const leftovers = [];
(function scan(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(DIST, full).replace(/\\/g, '/');
    if (rel.includes('[')) leftovers.push(rel);
    if (fs.statSync(full).isDirectory()) scan(full);
  }
})(DIST);

if (leftovers.length) {
  console.error('\n⚠ 仍有未展開的動態路由（generateStaticParams 沒生效？）:');
  leftovers.forEach((f) => console.error('  ' + f));
  process.exit(1);
}
console.log('沒有未展開的動態路由 ✓');
