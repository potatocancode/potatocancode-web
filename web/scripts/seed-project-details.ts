/**
 * Seed script: adds slug, detailed_description, and media_gallery
 * to existing projects so the detail page has something to display.
 *
 * Usage (Node 20+):
 *   node --env-file=.env.local --import tsx/esm scripts/seed-project-details.ts
 *
 * Or simply:
 *   npx tsx --env-file=.env.local scripts/seed-project-details.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// ── Seed data ─────────────────────────────────────────────────────────────────

const seeds: Record<string, {
  slug: string
  detailed_description: string
  media_gallery: { url: string; type: 'image' | 'video'; caption?: string }[]
}> = {
  'AI Solution': {
    slug: 'ai-solution',
    detailed_description: `## 專案概覽

這套 AI 解決方案整合了大型語言模型（LLM）與企業現有系統，協助客戶自動化繁複的文件處理與客服流程，將人工審核時間縮短約 **70%**。

## 核心功能

- **智慧文件解析**：自動識別 PDF、Word、Excel 格式，擷取結構化資料
- **多輪對話客服機器人**：基於 RAG（Retrieval-Augmented Generation）架構，精準回應企業內部知識庫
- **異常偵測儀表板**：即時監控 AI 推論品質，確保輸出穩定性
- **API 閘道整合**：提供 REST / WebSocket 雙模式，無縫串接各系統

## 技術亮點

### 後端架構

採用 **Python FastAPI** 建立推論服務，並透過 **Redis** 進行快取與 Session 管理。向量資料庫使用 **Pinecone**，負責儲存與檢索文件嵌入（Embedding）。

\`\`\`python
# 簡化版 RAG 檢索流程
async def retrieve_context(query: str, top_k: int = 5):
    embedding = await embed(query)
    results = pinecone_index.query(embedding, top_k=top_k)
    return [r.metadata["text"] for r in results.matches]
\`\`\`

### 前端架構

使用 **Next.js App Router** 搭配 **Server-Sent Events（SSE）** 實現串流輸出，讓使用者能即時看到 AI 逐字生成的回應。

## 挑戰與解決

> 最大的挑戰在於企業文件格式的多樣性。我們開發了一套自動格式偵測的前處理管線，將成功解析率從初期的 62% 提升至 **98%**。

## 成果

| 指標 | 優化前 | 優化後 |
|------|--------|--------|
| 文件處理時間 | 15 分鐘/份 | 45 秒/份 |
| 客服回應準確率 | 74% | 92% |
| 每月人工工時節省 | — | 320 小時 |
`,
    media_gallery: [
      {
        url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        type: 'video',
        caption: 'AI 客服機器人操作示範（Demo 影片）',
      },
      {
        url: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
        type: 'image',
        caption: 'AI 儀表板 — 即時推論監控介面',
      },
      {
        url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
        type: 'image',
        caption: '文件解析流程視覺化',
      },
    ],
  },

  'Warehouse App': {
    slug: 'warehouse-app',
    detailed_description: `## 專案概覽

為某製造業客戶開發的跨平台倉儲管理系統，支援 iOS / Android / Web 三端同步，涵蓋入庫、出庫、盤點、調撥全流程，取代原有的紙本作業方式。

## 核心功能

- **QR Code / Barcode 掃描**：整合手機相機，掃描商品條碼後即時更新庫存
- **即時庫存看板**：所有裝置共享同一資料來源，異動立即反映
- **批次盤點模式**：支援離線作業，網路恢復後自動同步差異
- **出貨揀貨清單**：依照倉位動線優化揀貨順序，提升效率
- **權限管理**：倉管員、主管、系統管理員三層角色分離

## 技術架構

### 跨平台方案

選用 **React Native（Expo）** 作為 App 框架，搭配 **Next.js** Web 端，共享同一套業務邏輯層（TypeScript）。

### 資料同步

使用 **Supabase Realtime** 實現 WebSocket 推播，當任一裝置更新庫存，其他裝置在 **< 500ms** 內收到更新。

\`\`\`typescript
// 訂閱庫存變更
const channel = supabase
  .channel('inventory')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'inventory_items',
  }, (payload) => {
    updateLocalItem(payload.new)
  })
  .subscribe()
\`\`\`

### 離線支援

透過 **MMKV** + 自訂同步佇列（Sync Queue）實現離線操作，確保斷網環境下仍可正常掃描入庫，上線後自動批次提交。

## 挑戰與解決

倉庫 Wi-Fi 訊號不穩是最大痛點。我們設計了「樂觀更新（Optimistic Update）」機制：操作先反映在 UI，背景靜默重試，失敗時才顯示警告，避免工作流程中斷。

## 成果

- 盤點作業時間從 **2 天縮短為 4 小時**
- 庫存差異率從 3.2% 降至 **0.1%**
- 全面上線後三個月，零重大異常事件
`,
    media_gallery: [
      {
        url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
        type: 'image',
        caption: '倉儲管理主控台 — 庫存看板',
      },
      {
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        type: 'image',
        caption: 'QR Code 掃描入庫流程（手機端）',
      },
      {
        url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
        type: 'video',
        caption: 'App 操作示範影片',
      },
    ],
  },
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching existing projects...')
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title')

  if (error) {
    console.error('Failed to fetch projects:', error.message)
    process.exit(1)
  }

  if (!projects || projects.length === 0) {
    console.log('No projects found in the database.')
    return
  }

  for (const project of projects) {
    const seed = seeds[project.title]
    if (!seed) {
      console.log(`  ⚙  Skipping "${project.title}" (no seed data)`)
      continue
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update({
        slug: seed.slug,
        detailed_description: seed.detailed_description,
        media_gallery: seed.media_gallery,
      })
      .eq('id', project.id)

    if (updateError) {
      console.error(`  ✗ Failed to update "${project.title}":`, updateError.message)
    } else {
      console.log(`  ✓ Updated "${project.title}" → /portfolio/${seed.slug}`)
    }
  }

  console.log('\nDone!')
}

main()
