import type { Metadata } from 'next'
import { Github, Mail } from 'lucide-react'
import ContactForm from './ContactForm'
import PageHeader from '@/components/PageHeader'
import { CONTACT_EMAIL, GMAIL_HREF } from '@/lib/social'

export const metadata: Metadata = {
  title: '聯絡諮詢',
  description: '填寫需求描述，我將在 24 小時內與您聯繫。',
}

const STEPS = [
  {
    n: '01',
    title: '你送出需求',
    body: '把想做的東西、預算範圍與期望時程寫下來，越具體越好。',
  },
  {
    n: '02',
    title: '我在 24 小時內回覆',
    body: '確認需求細節，必要時安排一次線上通話把範圍釐清。',
  },
  {
    n: '03',
    title: '收到做法與報價',
    body: '一份包含技術方案、里程碑與費用的提案，確認後就能開工。',
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream px-5 pb-24 pt-16 sm:px-8 md:pt-[72px]">
      <div className="mx-auto max-w-6xl pt-14">
        <PageHeader
          eyebrow="Contact"
          title="聯絡諮詢"
          description="填寫需求描述，我將在 24 小時內與您聯繫。"
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
          {/* Form */}
          <div className="border-4 border-ink bg-paper p-6 shadow-nb-lg sm:p-8">
            <ContactForm />
          </div>

          {/* Aside */}
          <aside className="flex flex-col gap-6">
            <div className="border-4 border-ink bg-paper p-6 shadow-nb">
              <h2 className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-stone">
                接下來會發生什麼
              </h2>
              <ol className="flex flex-col gap-6">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-pop-yellow font-mono text-[12px] font-bold text-ink">
                      {step.n}
                    </span>
                    <div>
                      <p className="text-[15px] font-bold text-ink">{step.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-stone">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-4 border-ink bg-ink p-6 text-cream shadow-nb">
              <h2 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cream/45">
                或直接找我
              </h2>
              <div className="flex flex-col gap-3">
                <a
                  href={GMAIL_HREF}
                  className="inline-flex items-center gap-2.5 break-all text-[14px] font-bold text-cream transition-colors hover:text-pop-yellow"
                >
                  <Mail size={16} strokeWidth={2.5} className="shrink-0" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href="https://github.com/potatocancode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[14px] font-bold text-cream transition-colors hover:text-pop-yellow"
                >
                  <Github size={16} strokeWidth={2.5} className="shrink-0" />
                  github.com/potatocancode
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
