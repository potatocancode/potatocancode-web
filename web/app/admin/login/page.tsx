import { signIn } from '../actions'
import { Terminal } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 font-mono font-bold text-2xl text-indigo-400 mb-8 justify-center">
          <Terminal size={24} />
          <span>{'{ PC }'}</span>
          <span className="text-sm text-zinc-500 font-normal">admin</span>
        </div>

        <form
          action={async (formData: FormData) => {
            'use server'
            await signIn(formData)
          }}
          className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <h1 className="text-white font-semibold text-lg mb-1">登入管理後台</h1>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-zinc-400">密碼</label>
            <input
              id="password" name="password" type="password" required autoComplete="current-password"
              className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  )
}
