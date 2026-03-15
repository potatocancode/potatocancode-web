import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProjectCard from '@/components/ProjectCard'
import type { Project } from '@/lib/supabase/types'

const mockProject: Project = {
  id: '1',
  title: 'C++ 教學系統',
  description: '互動式 C++ 學習平台，含自動評測與進度追蹤。',
  tech_stack: ['C++', 'React', 'Supabase'],
  cover_image_url: null,
  demo_link: 'https://demo.example.com',
  github_link: 'https://github.com/example/repo',
  category: 'System',
  created_at: '2024-01-01T00:00:00Z',
}

describe('ProjectCard', () => {
  describe('資料顯示', () => {
    it('正確顯示標題', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('C++ 教學系統')).toBeInTheDocument()
    })

    it('正確顯示描述', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText(/互動式 C\+\+ 學習平台/)).toBeInTheDocument()
    })

    it('正確顯示所有技術標籤', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('C++')).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Supabase')).toBeInTheDocument()
    })

    it('正確顯示類別徽章', () => {
      render(<ProjectCard project={mockProject} />)
      expect(screen.getByText('System')).toBeInTheDocument()
    })

    it('顯示 Demo 連結', () => {
      render(<ProjectCard project={mockProject} />)
      const demoLink = screen.getByRole('link', { name: /Demo/i })
      expect(demoLink).toBeInTheDocument()
      expect(demoLink).toHaveAttribute('href', 'https://demo.example.com')
    })

    it('顯示 GitHub 連結', () => {
      render(<ProjectCard project={mockProject} />)
      const ghLink = screen.getByRole('link', { name: /GitHub/i })
      expect(ghLink).toBeInTheDocument()
      expect(ghLink).toHaveAttribute('href', 'https://github.com/example/repo')
    })
  })

  describe('條件渲染', () => {
    it('沒有 demo_link 時不顯示 Demo 連結', () => {
      render(<ProjectCard project={{ ...mockProject, demo_link: null }} />)
      expect(screen.queryByRole('link', { name: /Demo/i })).not.toBeInTheDocument()
    })

    it('沒有 github_link 時不顯示 GitHub 連結', () => {
      render(<ProjectCard project={{ ...mockProject, github_link: null }} />)
      expect(screen.queryByRole('link', { name: /GitHub/i })).not.toBeInTheDocument()
    })

    it('沒有封面圖時顯示佔位圖示', () => {
      render(<ProjectCard project={{ ...mockProject, cover_image_url: null }} />)
      // 沒有 img 元素 (cover)，但卡片仍然渲染
      expect(screen.getByText('C++ 教學系統')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('有封面圖時顯示 img 元素', () => {
      render(<ProjectCard project={{ ...mockProject, cover_image_url: 'https://test.supabase.co/storage/v1/object/public/covers/test.jpg' }} />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'C++ 教學系統')
    })
  })

  describe('響應式設計', () => {
    it('在 Mobile (375px) 下正常渲染不崩潰', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 375 })
      const { container } = render(<ProjectCard project={mockProject} />)
      // 卡片應為 flex column 佈局（全寬）
      const card = container.firstChild as HTMLElement
      expect(card).toBeInTheDocument()
      // 確保包含 flex flex-col 類別
      expect(card.className).toMatch(/flex/)
      expect(card.className).toMatch(/flex-col/)
    })

    it('在 Desktop (1280px) 下正常渲染不崩潰', () => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 })
      const { container } = render(<ProjectCard project={mockProject} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('技術標籤區塊具備 flex-wrap 類別以防止行動端溢出', () => {
      const { container } = render(<ProjectCard project={mockProject} />)
      const tagContainer = container.querySelector('.flex.flex-wrap')
      expect(tagContainer).toBeInTheDocument()
    })
  })
})
