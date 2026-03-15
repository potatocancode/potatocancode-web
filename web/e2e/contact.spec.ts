import { test, expect } from '@playwright/test'

// Use glob so the intercept works regardless of which Supabase URL the client resolves to
const INQUIRIES_GLOB = '**/rest/v1/inquiries**'

test.describe('/contact 頁面 E2E 測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('頁面標題與表單欄位正確顯示', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '聯絡諮詢' })).toBeVisible()
    await expect(page.getByLabel(/姓名/)).toBeVisible()
    await expect(page.getByLabel(/Email/)).toBeVisible()
    await expect(page.getByLabel(/需求類型/)).toBeVisible()
    await expect(page.getByLabel(/需求描述/)).toBeVisible()
    await expect(page.getByRole('button', { name: /送出詢問/ })).toBeVisible()
  })

  test('攔截 Supabase API，填表並送出，確認資料正確 + 出現成功訊息', async ({ page }) => {
    // ── 1. 攔截 Supabase inquiries insert 請求 ──────────────────────────────
    let capturedBody: Record<string, unknown> | null = null

    await page.route(INQUIRIES_GLOB, async (route) => {
      const request = route.request()
      const body = request.postDataJSON() as Record<string, unknown>
      capturedBody = body

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        headers: { 'Content-Range': '0-0/1' },
        body: JSON.stringify([{ id: 'mock-id-123' }]),
      })
    })

    // ── 2. 填寫表單 ──────────────────────────────────────────────────────────
    await page.getByLabel(/姓名/).fill('王小明')
    await page.getByLabel(/Email/).fill('test@example.com')
    await page.getByLabel(/需求類型/).selectOption('網頁開發')
    await page.getByLabel(/需求描述/).fill('需要一個作品集網站，包含 Supabase 後端整合。')

    // ── 3. 送出並等待 API 攔截 ───────────────────────────────────────────────
    const [response] = await Promise.all([
      page.waitForResponse(INQUIRIES_GLOB),
      page.getByRole('button', { name: /送出詢問/ }).click(),
    ])

    expect(response.status()).toBe(201)

    // ── 4. 確認攔截到的資料正確 ─────────────────────────────────────────────
    expect(capturedBody).toMatchObject({
      customer_name: '王小明',
      email: 'test@example.com',
      project_type: '網頁開發',
      message: '需要一個作品集網站，包含 Supabase 後端整合。',
      status: 'Pending',
    })

    // ── 5. 確認成功訊息出現 ──────────────────────────────────────────────────
    await expect(page.getByText('提交成功！')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('status')).toBeVisible()
  })

  test('表單提交後成功訊息帶有正確 aria-live 屬性', async ({ page }) => {
    await page.route(INQUIRIES_GLOB, (route) =>
      route.fulfill({ status: 201, contentType: 'application/json', body: '[]' })
    )

    await page.getByLabel(/姓名/).fill('測試者')
    await page.getByLabel(/Email/).fill('test@test.com')
    await page.getByLabel(/需求類型/).selectOption('其他')
    await page.getByLabel(/需求描述/).fill('測試訊息')

    await Promise.all([
      page.waitForResponse(INQUIRIES_GLOB),
      page.getByRole('button', { name: /送出詢問/ }).click(),
    ])

    const statusEl = page.getByRole('status')
    await expect(statusEl).toBeVisible({ timeout: 5000 })
    await expect(statusEl).toHaveAttribute('aria-live', 'polite')
  })

  test('Mobile — 表單在小螢幕下可正常互動', async ({ page }) => {
    // Mobile Chrome project (Pixel 5) uses 393×851 viewport
    await expect(page.getByRole('button', { name: /送出詢問/ })).toBeVisible()
    await expect(page.getByLabel(/姓名/)).toBeVisible()

    await page.getByLabel(/姓名/).fill('行動測試')
    await expect(page.getByLabel(/姓名/)).toHaveValue('行動測試')
  })
})
