'use client'

import { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ProjectCard'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Loader2 } from 'lucide-react'
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
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    )
  }

  if (error) throw new Error(error)

  if (projects.length === 0) {
    return (
      <p className="py-20 text-center text-zinc-500">此分類目前尚無作品。</p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export default function PortfolioClient() {
  const [active, setActive] = useState<ProjectCategory | 'All'>('All')

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">作品集</h1>
        <p className="mb-10 text-zinc-400">網頁、跨平台 App 與系統程式專案。</p>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                active === value
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <ErrorBoundary>
          <ProjectList category={active} />
        </ErrorBoundary>
      </div>
    </main>
  )
}
