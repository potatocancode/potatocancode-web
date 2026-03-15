import { createServiceClient } from '@/lib/supabase/server'
import { deleteProject } from '../actions'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const CATEGORY_BADGE: Record<string, string> = {
  Web: 'bg-cyan-500/10 text-cyan-300',
  App: 'bg-violet-500/10 text-violet-300',
  System: 'bg-orange-500/10 text-orange-300',
}

export default async function AdminProjectsPage() {
  const service = createServiceClient()
  const { data: projects } = await service
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">作品集管理</h1>
        <Link href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
          <Plus size={16} /> 新增作品
        </Link>
      </div>

      {!projects?.length ? (
        <p className="text-zinc-500 py-12 text-center">尚無作品，點擊右上角新增。</p>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map(p => (
            <div key={p.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              {/* Cover thumbnail */}
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                {p.cover_image_url
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-zinc-700" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${CATEGORY_BADGE[p.category] ?? ''}`}>{p.category}</span>
                  <span className="text-white font-medium truncate">{p.title}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{p.tech_stack.join(' · ')}</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/projects/${p.id}/edit`}
                  className="p-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                  <Pencil size={14} />
                </Link>
                <form action={async () => { 'use server'; await deleteProject(p.id) }}>
                  <button type="submit"
                    className="p-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400 transition-colors"
                    onClick={(e) => { if (!confirm(`確定刪除「${p.title}」？`)) e.preventDefault() }}>
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
