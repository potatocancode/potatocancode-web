'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { InquiryInsert } from '@/lib/supabase/types'
import { Send, Loader2, CheckCircle } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const PROJECT_TYPES = ['網頁開發', 'App 開發', '系統程式', '其他']

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)

    const payload: InquiryInsert = {
      customer_name: data.get('customer_name') as string,
      email: data.get('email') as string,
      project_type: data.get('project_type') as string,
      message: data.get('message') as string,
      status: 'Pending',
    }

    const { error } = await supabase.from('inquiries').insert(payload)

    if (error) {
      setErrorMsg(error.message)
      setState('error')
    } else {
      setState('success')
      form.reset()
    }
  }

  if (state === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/10 px-8 py-12 text-center"
      >
        <CheckCircle className="text-green-400" size={40} />
        <p className="text-xl font-semibold text-white">提交成功！</p>
        <p className="text-sm text-zinc-400">感謝您的詢問，我將盡快與您聯繫。</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer_name" className="text-sm font-medium text-zinc-300">
          姓名 <span className="text-red-400">*</span>
        </label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          required
          placeholder="王小明"
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-300">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="example@mail.com"
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="project_type" className="text-sm font-medium text-zinc-300">
          需求類型 <span className="text-red-400">*</span>
        </label>
        <select
          id="project_type"
          name="project_type"
          required
          defaultValue=""
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
        >
          <option value="" disabled>請選擇...</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-zinc-300">
          需求描述 <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="請描述您的專案需求、預算範圍或時程..."
          className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
        />
      </div>

      {state === 'error' && (
        <p role="alert" className="text-sm text-red-400">{errorMsg || '提交失敗，請稍後再試。'}</p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
      >
        {state === 'submitting' ? (
          <><Loader2 size={16} className="animate-spin" /> 送出中...</>
        ) : (
          <><Send size={16} /> 送出詢問</>
        )}
      </button>
    </form>
  )
}
