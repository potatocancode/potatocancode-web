import { redirect } from 'next/navigation'
import { createAnonClient } from '@/lib/supabase/server'
import { signOut } from './actions'
import Link from 'next/link'
import { LayoutGrid, MessageSquare, LogOut } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAnonClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col py-6 px-4 gap-2">
        <Link href="/" className="font-mono font-bold text-xl text-indigo-400 px-3 mb-4">
          {'{ PC }'} <span className="text-xs text-zinc-500 font-sans font-normal">admin</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/admin/projects"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <LayoutGrid size={16} /> 作品集管理
          </Link>
          <Link href="/admin/inquiries"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
            <MessageSquare size={16} /> 諮詢紀錄
          </Link>
        </nav>

        <form action={signOut}>
          <button type="submit"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors">
            <LogOut size={16} /> 登出
          </button>
        </form>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
