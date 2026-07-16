'use client'

import { useState, useTransition } from 'react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Service } from '@/lib/supabase/types'

interface Props {
  service?: Service
  action: (formData: FormData) => Promise<{ error: string } | void>
}

export default function ServiceForm({ service, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [iconName, setIconName] = useState(service?.icon_name ?? 'Layers')

  const PreviewIcon =
    (LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon | undefined) ??
    LucideIcons.Layers

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) setErrorMsg(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">標題 *</label>
        <input
          name="title"
          type="text"
          defaultValue={service?.title}
          required
          placeholder="例如：客製化網頁開發"
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">描述 *</label>
        <textarea
          name="description"
          defaultValue={service?.description}
          required
          rows={4}
          placeholder="簡短說明這項服務的內容與價值..."
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
        />
      </div>

      {/* Icon name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">
          圖示名稱{' '}
          <span className="text-zinc-500">
            （
            <a
              href="https://lucide.dev/icons/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              lucide.dev
            </a>
            {' '}的圖示名，例如 Code2、Smartphone、Server）
          </span>
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <PreviewIcon size={22} />
          </div>
          <input
            name="icon_name"
            type="text"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            placeholder="Layers"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-sm"
          />
        </div>
        <p className="text-xs text-zinc-500">找不到對應圖示時會自動使用 Layers。</p>
      </div>

      {/* Base price */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">
          起價 <span className="text-zinc-500">(NT$，留空則不顯示價格)</span>
        </label>
        <input
          name="base_price"
          type="number"
          min="0"
          step="1"
          defaultValue={service?.base_price ?? ''}
          placeholder="例如：15000"
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
      >
        {isPending ? '儲存中...' : service ? '更新服務' : '新增服務'}
      </button>
    </form>
  )
}
