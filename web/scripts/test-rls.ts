/**
 * scripts/test-rls.ts
 *
 * 驗證 Supabase RLS 權限設定的測試腳本。
 * 使用 anon key，模擬匿名使用者的資料庫行為。
 *
 * 執行方式：
 *   npm run test:rls
 * (需先在 .env.local 設定 NEXT_PUBLIC_SUPABASE_URL 與 NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少環境變數：NEXT_PUBLIC_SUPABASE_URL 或 NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

let passed = 0
let failed = 0

function ok(label: string) {
  console.log(`  ✅ PASS  ${label}`)
  passed++
}

function fail(label: string, detail?: string) {
  console.log(`  ❌ FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
  failed++
}

// ── Test 1：匿名使用者可以新增詢價 ────────────────────────────────────────────
async function testAnonInsertInquiry() {
  console.log('\n[1] 匿名使用者 INSERT inquiries')

  const { error } = await supabase.from('inquiries').insert({
    customer_name: 'RLS Test User',
    email: 'rls-test@example.com',
    project_type: '網頁開發',
    message: '這是 RLS 自動化測試，請忽略。',
    status: 'Pending',
  })

  if (error) {
    fail('匿名使用者應可以新增詢價', error.message)
    console.log('    → 建議：確認 inquiries 表有啟用 RLS Policy: "Allow anon insert"')
  } else {
    ok('匿名使用者可以新增詢價')
  }
}

// ── Test 2：匿名使用者無法讀取他人詢價紀錄 ──────────────────────────────────
async function testAnonSelectInquiries() {
  console.log('\n[2] 匿名使用者 SELECT inquiries（應為空或被 RLS 阻擋）')

  const { data, error } = await supabase
    .from('inquiries')
    .select('id, customer_name')
    .limit(10)

  if (error) {
    ok('SELECT 被 RLS 阻擋（最嚴格的設定）')
  } else if (data && data.length === 0) {
    ok('SELECT 回傳空結果（RLS 過濾成功）')
  } else {
    fail(
      '匿名使用者不應看到他人詢價紀錄',
      `讀到 ${data?.length ?? 0} 筆資料 — RLS SELECT policy 未正確設定`
    )
  }
}

// ── Test 3：匿名使用者無法讀取 projects（應允許，public data）──────────────
async function testAnonSelectProjects() {
  console.log('\n[3] 匿名使用者 SELECT projects（作品集應公開）')

  const { data, error } = await supabase.from('projects').select('id, title').limit(5)

  if (error) {
    fail('projects 表應允許公開讀取', error.message)
    console.log('    → 建議：為 projects 表新增 RLS Policy: "Allow public read"')
  } else {
    ok(`projects 表可公開讀取（取得 ${data?.length ?? 0} 筆）`)
  }
}

// ── Test 4：匿名使用者無法刪除 inquiries ─────────────────────────────────────
async function testAnonDeleteInquiries() {
  console.log('\n[4] 匿名使用者 DELETE inquiries（應被阻擋）')

  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('status', 'Pending')

  if (error) {
    ok('DELETE 被 RLS 正確阻擋')
  } else {
    fail('匿名使用者不應能刪除詢價紀錄', 'RLS DELETE policy 未設定')
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(60))
  console.log('  Supabase RLS 權限驗證腳本')
  console.log(`  URL: ${supabaseUrl}`)
  console.log('='.repeat(60))

  await testAnonInsertInquiry()
  await testAnonSelectInquiries()
  await testAnonSelectProjects()
  await testAnonDeleteInquiries()

  console.log('\n' + '='.repeat(60))
  console.log(`  結果：${passed} passed / ${failed} failed`)
  console.log('='.repeat(60))

  if (failed > 0) {
    console.log('\n📋 建議的 SQL RLS Policy 修復（在 Supabase SQL Editor 執行）:\n')
    console.log(RLS_SQL_RECOMMENDATIONS)
    process.exit(1)
  }
}

const RLS_SQL_RECOMMENDATIONS = `
-- ① 確保 RLS 已啟用
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE services  ENABLE ROW LEVEL SECURITY;

-- ② projects：允許所有人讀取（公開作品集）
CREATE POLICY "Allow public read on projects"
  ON projects FOR SELECT
  USING (true);

-- ③ services：允許所有人讀取（公開服務項目）
CREATE POLICY "Allow public read on services"
  ON services FOR SELECT
  USING (true);

-- ④ inquiries：允許匿名使用者新增詢價
CREATE POLICY "Allow anon insert on inquiries"
  ON inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- ⑤ inquiries：禁止匿名使用者讀取他人資料
--    （不建立 SELECT policy => 預設拒絕所有 SELECT）
-- 若需要管理員讀取，請搭配 service_role key 在後端進行。

-- ⑥ inquiries：禁止所有人 UPDATE / DELETE（防止資料竄改）
-- （不建立 UPDATE / DELETE policy => 預設拒絕）
`

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
