'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { InquiryInsert } from '@/lib/supabase/types'
import { Send, Loader2, CheckCircle } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const PROJECT_TYPES = ['網頁開發', 'App 開發', '系統程式', '其他']

const LABEL = 'text-[13px] font-bold uppercase tracking-[0.08em] text-ink'

// 16px base size — anything smaller triggers iOS zoom-on-focus.
const FIELD =
  'border-[3px] border-ink bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/35'

function Required() {
  return (
    <span className="ml-1 font-normal text-ink/45" aria-hidden="true">
      *
    </span>
  )
}

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
        className="flex flex-col items-center gap-5 border-4 border-ink bg-pop-yellow px-8 py-14 text-center shadow-nb-lg"
      >
        <span className="flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-cream text-ink">
          <CheckCircle size={28} strokeWidth={2.25} />
        </span>
        <p
          className="text-[26px] font-bold tracking-[-0.02em] text-ink"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          提交成功！
        </p>
        <p className="text-[15px] text-ink/75">
          感謝您的詢問，我將在 24 小時內與您聯繫。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="customer_name" className={LABEL}>
          姓名
          <Required />
        </label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          required
          placeholder="王小明"
          className={FIELD}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={LABEL}>
          Email
          <Required />
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="example@mail.com"
          className={FIELD}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="project_type" className={LABEL}>
          需求類型
          <Required />
        </label>
        <select
          id="project_type"
          name="project_type"
          required
          defaultValue=""
          className={`${FIELD} cursor-pointer`}
        >
          <option value="" disabled>
            請選擇...
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={LABEL}>
          需求描述
          <Required />
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="請描述您的專案需求、預算範圍或時程..."
          className={`${FIELD} resize-none`}
        />
      </div>

      {state === 'error' && (
        <p
          role="alert"
          className="border-[3px] border-ink bg-pop-red px-4 py-3 text-sm font-bold text-ink"
        >
          {errorMsg || '提交失敗，請稍後再試。'}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="nb-press inline-flex cursor-pointer items-center justify-center gap-2 border-[3px] border-ink bg-pop-yellow px-6 py-4 text-base font-bold text-ink shadow-nb disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === 'submitting' ? (
          <>
            <Loader2 size={17} strokeWidth={2.5} className="animate-spin" /> 送出中...
          </>
        ) : (
          <>
            <Send size={17} strokeWidth={2.5} /> 送出詢問
          </>
        )}
      </button>

      <p className="text-[13px] leading-relaxed text-stone">
        送出後我會在 24 小時內回覆。你的資料只用於本次專案聯繫。
      </p>
    </form>
  )
}
