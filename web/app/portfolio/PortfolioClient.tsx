'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ProjectCard'
import PageHeader from '@/components/PageHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { ProjectCategory } from '@/lib/supabase/types'

const CATEGORIES: { label: string; value: ProjectCategory | 'All' }[] = [
  { label: '全部', value: 'All' },
  { label: '網頁', value: 'Web' },
  { label: 'App', value: 'App' },
  { label: '系統', value: 'System' },
]

function ProjectList({ category }: { category: ProjectCategory | 'All' }) {
  const { projects, loading, error } = useProjects(
    category === 'All' ? undefined : category
  )

  if (loading) {
    return (
      <div className="flex justify-center py-24" aria-busy="true">
        <Loader2 className="animate-spin text-ink/40" size={32} strokeWidth={2.5} />
      </div>
    )
  }

  if (error) throw new Error(error)

  if (projects.length === 0) {
    return (
      <div className="border-4 border-dashed border-ink/25 px-8 py-20 text-center">
        <p className="font-bold text-ink">此分類目前尚無作品。</p>
        <p className="mt-2 text-sm text-stone">換個分類看看，或直接來聊聊你的需求。</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: Math.min(i, 6) * 0.06,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  )
}

export default function PortfolioClient() {
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  return (
    <main className="min-h-screen bg-cream px-5 pb-24 pt-16 sm:px-8 md:pt-[72px]">
      <div className="mx-auto max-w-6xl pt-14">
        <PageHeader
          eyebrow="Portfolio"
          title="作品集"
          description="網頁、跨平台 App 與系統程式專案。點進去看完整的技術細節與畫面。"
        />

        {/* Category filter */}
        <div
          role="group"
          aria-label="作品分類篩選"
          className="mb-10 flex flex-wrap gap-3"
        >
          {CATEGORIES.map(({ label, value }) => {
            const isActive = active === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(value)}
                className={`nb-press cursor-pointer border-[3px] border-ink px-4 py-2 text-[14px] font-bold shadow-nb sm:text-[15px] ${
                  isActive
                    ? 'bg-ink text-cream'
                    : 'bg-paper text-ink hover:bg-pop-yellow'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <ErrorBoundary key={active}>
          <ProjectList category={active} />
        </ErrorBoundary>
      </div>
    </main>
  )
}
