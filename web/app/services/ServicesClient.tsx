'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import PageHeader from '@/components/PageHeader'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/** Rotates through the accent surfaces so adjacent cards never match. */
const SURFACES = ['bg-pop-yellow', 'bg-pop-sky', 'bg-pop-violet', 'bg-pop-red']

function ServicesList() {
  const { services, loading, error } = useServices()

  if (loading) {
    return (
      <div className="flex justify-center py-24" aria-busy="true">
        <Loader2 className="animate-spin text-ink/40" size={32} strokeWidth={2.5} />
      </div>
    )
  }

  if (error) {
    throw new Error(error)
  }

  if (services.length === 0) {
    return (
      <div className="border-4 border-dashed border-ink/25 px-8 py-20 text-center">
        <p className="font-bold text-ink">服務項目整理中。</p>
        <p className="mt-2 text-sm text-stone">先來聊聊你的需求，我一樣可以報價。</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const Icon =
          (LucideIcons[service.icon_name as keyof typeof LucideIcons] as
            | LucideIcon
            | undefined) ?? LucideIcons.Layers

        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: Math.min(i, 6) * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className={`flex h-full flex-col gap-3 border-4 border-ink p-6 shadow-nb ${
              SURFACES[i % SURFACES.length]
            }`}
          >
            <span className="mb-2 flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-ink bg-cream text-ink">
              <Icon size={21} strokeWidth={2.25} />
            </span>

            <h3
              className="text-[20px] font-bold tracking-[-0.02em] text-ink"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {service.title}
            </h3>

            <p className="text-[14px] leading-relaxed text-ink/75">
              {service.description}
            </p>

            {service.base_price !== null && (
              <p className="mt-auto border-t-[3px] border-ink pt-3 font-mono text-[13px] font-bold text-ink">
                起價 NT${service.base_price.toLocaleString()}
              </p>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default function ServicesClient() {
  return (
    <main className="min-h-screen bg-cream px-5 pb-24 pt-16 sm:px-8 md:pt-[72px]">
      <div className="mx-auto max-w-6xl pt-14">
        <PageHeader
          eyebrow="Services"
          title="服務項目"
          description="以下為常見的服務與參考起價。實際報價依功能範圍、時程與維護需求調整。"
        />

        <ErrorBoundary>
          <ServicesList />
        </ErrorBoundary>

        {/* Quote CTA */}
        <div className="mt-14 border-4 border-ink bg-paper p-7 shadow-nb-lg sm:p-10">
          <h2
            className="text-[24px] font-bold tracking-[-0.025em] text-ink sm:text-[30px]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            沒有找到符合的項目？
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-stone">
            大部分專案都是客製的。描述你的需求，我會給你一份具體的做法與報價。
          </p>
          <Link
            href="/contact"
            className="nb-press mt-7 inline-flex items-center gap-2 border-[3px] border-ink bg-pop-yellow px-6 py-3.5 text-[15px] font-bold text-ink shadow-nb"
          >
            索取客製報價
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </main>
  )
}
