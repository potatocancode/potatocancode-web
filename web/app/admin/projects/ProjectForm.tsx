'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, X } from 'lucide-react'
import type { Project } from '@/lib/supabase/types'

const CATEGORIES = ['Web', 'App', 'System'] as const

interface Props {
  project?: Project
  action: (formData: FormData) => Promise<{ error: string } | void>
}

export default function ProjectForm({ project, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [preview, setPreview] = useState<string | null>(project?.cover_image_url ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

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
      {/* Cover image */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">封面圖片</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="relative flex items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-800/40 cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden"
        >
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreview(null); if (fileRef.current) fileRef.current.value = '' }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Upload size={28} />
              <span className="text-sm">點擊上傳封面圖片</span>
            </div>
          )}
        </div>
        <input ref={fileRef} name="cover_image" type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <Field label="標題 *" name="title" defaultValue={project?.title} required />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">描述 * <span className="text-zinc-500">(支援 Markdown)</span></label>
        <textarea
          name="description" required rows={5} defaultValue={project?.description}
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
          placeholder="專案描述..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">類別 *</label>
        <select
          name="category" required defaultValue={project?.category ?? 'Web'}
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Field
        label="技術標籤 * (逗號分隔)" name="tech_stack" required
        defaultValue={project?.tech_stack.join(', ')}
        placeholder="Next.js, TypeScript, Supabase"
      />
      <Field label="Demo 連結" name="demo_link" type="url" defaultValue={project?.demo_link ?? ''} placeholder="https://" />
      <Field label="GitHub 連結" name="github_link" type="url" defaultValue={project?.github_link ?? ''} placeholder="https://github.com/..." />

      {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

      <button
        type="submit" disabled={isPending}
        className="self-start rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
      >
        {isPending ? '儲存中...' : '儲存'}
      </button>
    </form>
  )
}

function Field({ label, name, type = 'text', defaultValue, placeholder, required }: {
  label: string; name: string; type?: string
  defaultValue?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required}
        className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
      />
    </div>
  )
}
