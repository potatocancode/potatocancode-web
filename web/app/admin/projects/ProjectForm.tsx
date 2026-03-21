'use client'

import { useRef, useState, useTransition } from 'react'
import { Upload, X, Plus, Trash2, GripVertical, Eye, Code } from 'lucide-react'
import type { Project, MediaItem } from '@/lib/supabase/types'

const CATEGORIES = ['Web', 'App', 'System'] as const

interface Props {
  project?: Project
  action: (formData: FormData) => Promise<{ error: string } | void>
}

// ── Slug helpers ───────────────────────────────────────────────────────────────

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Markdown preview (simple inline renderer) ──────────────────────────────────

function MarkdownPreview({ content }: { content: string }) {
  // Very lightweight preview — just enough to show headings, bold, italic, code
  const html = content
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-zinc-300">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-zinc-700 text-indigo-300 rounded px-1 text-xs font-mono">$1</code>')
    .replace(/^- (.+)$/gm, '<li class="text-zinc-300 ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-zinc-300 ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-zinc-400 text-sm mb-2">')
    .replace(/\n/g, '<br />')

  return (
    <div
      className="min-h-[180px] rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-400 overflow-auto prose-sm"
      dangerouslySetInnerHTML={{ __html: `<p class="text-zinc-400 text-sm mb-2">${html}</p>` }}
    />
  )
}

// ── Media gallery manager ──────────────────────────────────────────────────────

function MediaGalleryManager({
  initial,
  onChange,
}: {
  initial: MediaItem[]
  onChange: (items: MediaItem[]) => void
}) {
  const [items, setItems] = useState<MediaItem[]>(initial)
  const [urlInput, setUrlInput] = useState('')
  const [typeInput, setTypeInput] = useState<'image' | 'video'>('image')
  const [captionInput, setCaptionInput] = useState('')

  function update(next: MediaItem[]) {
    setItems(next)
    onChange(next)
  }

  function add() {
    const url = urlInput.trim()
    if (!url) return
    update([...items, { url, type: typeInput, caption: captionInput.trim() || undefined }])
    setUrlInput('')
    setCaptionInput('')
  }

  function remove(idx: number) {
    update(items.filter((_, i) => i !== idx))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...items]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    update(next)
  }

  function moveDown(idx: number) {
    if (idx === items.length - 1) return
    const next = [...items]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    update(next)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Existing items */}
      {items.length > 0 && (
        <ul className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 rounded-lg border border-zinc-700 bg-zinc-800/40 px-3 py-2">
              {/* Sort handle */}
              <div className="flex flex-col gap-0.5 pt-1">
                <button type="button" onClick={() => moveUp(idx)} className="text-zinc-500 hover:text-zinc-300" title="上移">
                  <GripVertical size={14} />
                </button>
                <button type="button" onClick={() => moveDown(idx)} className="text-zinc-500 hover:text-zinc-300 rotate-180" title="下移">
                  <GripVertical size={14} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-mono border ${
                    item.type === 'image'
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      : 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                  }`}>
                    {item.type === 'image' ? '圖片' : '影片'}
                  </span>
                  <span className="text-xs text-zinc-400 truncate">{item.url}</span>
                </div>
                {item.caption && <span className="text-xs text-zinc-500 italic">{item.caption}</span>}
              </div>

              <button type="button" onClick={() => remove(idx)} className="shrink-0 text-zinc-500 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new item */}
      <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-800/20 p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <select
            value={typeInput}
            onChange={e => setTypeInput(e.target.value as 'image' | 'video')}
            className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="image">圖片</option>
            <option value="video">影片</option>
          </select>
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="貼上圖片或影片 URL..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={captionInput}
            onChange={e => setCaptionInput(e.target.value)}
            placeholder="說明文字（選填）"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={add}
            disabled={!urlInput.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-600 disabled:opacity-40 transition-colors"
          >
            <Plus size={14} />
            新增
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main form ──────────────────────────────────────────────────────────────────

export default function ProjectForm({ project, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [preview, setPreview] = useState<string | null>(project?.cover_image_url ?? null)
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [detailedDesc, setDetailedDesc] = useState(project?.detailed_description ?? '')
  const [showPreview, setShowPreview] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(project?.media_gallery ?? [])
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Auto-generate slug only if user hasn't manually typed one
    if (!project?.slug && slug === toSlug(e.target.defaultValue ?? '')) {
      setSlug(toSlug(e.target.value))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    // Inject controlled state that isn't standard inputs
    formData.set('slug', slug)
    formData.set('detailed_description', detailedDesc)
    formData.set('media_gallery', JSON.stringify(mediaItems))
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

      {/* Title + slug */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">標題 *</label>
        <input
          name="title"
          type="text"
          defaultValue={project?.title}
          required
          onChange={handleTitleChange}
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">
          Slug <span className="text-zinc-500">（用於詳情頁 URL：/portfolio/<em>slug</em>）</span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={e => setSlug(toSlug(e.target.value))}
          placeholder="my-project-name"
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-sm"
        />
        {slug && (
          <p className="text-xs text-zinc-500">/portfolio/<span className="text-indigo-400">{slug}</span></p>
        )}
      </div>

      {/* Short description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">簡短描述 * <span className="text-zinc-500">(顯示在卡片，支援 Markdown)</span></label>
        <textarea
          name="description" required rows={3} defaultValue={project?.description}
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
          placeholder="一兩句話描述這個專案..."
        />
      </div>

      {/* Detailed description with preview */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">
            詳細介紹 <span className="text-zinc-500">(詳情頁顯示，支援 Markdown)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showPreview ? <><Code size={13} /> 編輯</> : <><Eye size={13} /> 預覽</>}
          </button>
        </div>

        {showPreview ? (
          <MarkdownPreview content={detailedDesc} />
        ) : (
          <textarea
            value={detailedDesc}
            onChange={e => setDetailedDesc(e.target.value)}
            rows={10}
            className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-y font-mono text-sm"
            placeholder={`## 專案概覽\n\n這個專案解決了...\n\n## 技術亮點\n\n- 使用 **Next.js** 建立 SSR 架構\n- 整合 **Supabase** 實現即時資料同步`}
          />
        )}
      </div>

      {/* Category */}
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

      {/* Media gallery */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">媒體藝廊 <span className="text-zinc-500">（圖片或影片 URL，詳情頁展示）</span></label>
        <MediaGalleryManager
          initial={project?.media_gallery ?? []}
          onChange={setMediaItems}
        />
      </div>

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
