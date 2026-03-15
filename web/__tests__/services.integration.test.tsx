import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Service } from '@/lib/supabase/types'

// ── Mock Supabase client ────────────────────────────────────────────────────
const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockFrom = vi.fn(() => ({ select: mockSelect }))
mockSelect.mockReturnValue({ order: mockOrder })

vi.mock('@/lib/supabase/client', () => ({
  supabase: { from: mockFrom },
}))

// Import AFTER mock is set up
const { default: ServicesClient } = await import('@/app/services/ServicesClient')

// ── Helpers ──────────────────────────────────────────────────────────────────
const mockServices: Service[] = [
  { id: '1', title: '網頁開發', description: 'Next.js 全端開發', icon_name: 'Globe', base_price: 30000 },
  { id: '2', title: 'App 開發', description: 'React Native 跨平台', icon_name: 'Smartphone', base_price: 50000 },
]

function setupSuccess() {
  mockOrder.mockResolvedValueOnce({ data: mockServices, error: null })
}

function setupNetworkError() {
  mockOrder.mockResolvedValueOnce({ data: null, error: { message: '無法連線至資料庫' } })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockFrom.mockReturnValue({ select: mockSelect })
  mockSelect.mockReturnValue({ order: mockOrder })
})

// ── Tests ────────────────────────────────────────────────────────────────────
describe('ServicesClient 整合測試', () => {
  describe('成功載入', () => {
    it('顯示 loading 狀態後渲染服務卡片', async () => {
      setupSuccess()
      render(<ServicesClient />)

      // Loading spinner should appear first
      expect(document.querySelector('.animate-spin')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('網頁開發')).toBeInTheDocument()
        expect(screen.getByText('App 開發')).toBeInTheDocument()
      })
    })

    it('顯示所有服務的描述', async () => {
      setupSuccess()
      render(<ServicesClient />)

      await waitFor(() => {
        expect(screen.getByText('Next.js 全端開發')).toBeInTheDocument()
        expect(screen.getByText('React Native 跨平台')).toBeInTheDocument()
      })
    })

    it('顯示起價資訊', async () => {
      setupSuccess()
      render(<ServicesClient />)

      await waitFor(() => {
        expect(screen.getByText(/30,000/)).toBeInTheDocument()
        expect(screen.getByText(/50,000/)).toBeInTheDocument()
      })
    })

    it('呼叫 Supabase services table 一次', async () => {
      setupSuccess()
      render(<ServicesClient />)
      await waitFor(() => screen.getByText('網頁開發'))
      expect(mockFrom).toHaveBeenCalledWith('services')
      expect(mockFrom).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error Boundary — 資料抓取失敗', () => {
    it('Supabase 回傳錯誤時顯示「資料載入失敗」', async () => {
      setupNetworkError()

      // Suppress expected React error boundary console.error
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

      render(<ServicesClient />)

      await waitFor(() => {
        expect(screen.getByText('資料載入失敗')).toBeInTheDocument()
      })

      expect(screen.getByText('無法連線至資料庫')).toBeInTheDocument()
      consoleError.mockRestore()
    })

    it('錯誤 UI 包含重新載入按鈕', async () => {
      setupNetworkError()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

      render(<ServicesClient />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /重新載入/ })).toBeInTheDocument()
      })

      consoleError.mockRestore()
    })

    it('點擊重新載入後清除錯誤狀態', async () => {
      setupNetworkError()
      // Second call succeeds after reset
      mockOrder.mockResolvedValueOnce({ data: mockServices, error: null })

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      const user = userEvent.setup()

      render(<ServicesClient />)

      await waitFor(() => screen.getByRole('button', { name: /重新載入/ }))
      await user.click(screen.getByRole('button', { name: /重新載入/ }))

      // After reset, error boundary shows children again
      // (hook won't re-fetch automatically, but error boundary state is cleared)
      await waitFor(() => {
        expect(screen.queryByText('資料載入失敗')).not.toBeInTheDocument()
      })

      consoleError.mockRestore()
    })

    it('role="alert" 存在於錯誤訊息容器', async () => {
      setupNetworkError()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

      render(<ServicesClient />)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      consoleError.mockRestore()
    })
  })
})
