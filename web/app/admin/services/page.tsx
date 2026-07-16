import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Pencil, Layers } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import DeleteButton from './DeleteButton'

export default async function AdminServicesPage() {
  const service = createServiceClient()
  const { data: services } = await service
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">服務項目管理</h1>
        <Link href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
          <Plus size={16} /> 新增服務
        </Link>
      </div>

      {!services?.length ? (
        <p className="text-zinc-500 py-12 text-center">尚無服務項目，點擊右上角新增。</p>
      ) : (
        <div className="flex flex-col gap-3">
          {services.map((s) => {
            const Icon =
              (LucideIcons[s.icon_name as keyof typeof LucideIcons] as LucideIcon | undefined) ??
              Layers
            return (
              <div key={s.id} className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium truncate block">{s.title}</span>
                  <p className="text-xs text-zinc-500 truncate">
                    {s.base_price !== null ? `起價 NT$${s.base_price.toLocaleString()}` : '未標價'} · {s.description}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link href={`/admin/services/${s.id}/edit`}
                    className="p-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors">
                    <Pencil size={14} />
                  </Link>
                  <DeleteButton id={s.id} title={s.title} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
