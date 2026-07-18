'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useServices } from '@/hooks/useServices'
import SectionHeading from './SectionHeading'

/** Rotates through the accent surfaces so adjacent cards never match. */
const SURFACES = ['bg-pop-yellow', 'bg-pop-sky', 'bg-pop-violet']

export default function ServicesPreview() {
  const { services, loading, error } = useServices()

  if (error || (!loading && services.length === 0)) return null

  const preview = services.slice(0, 3)

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Services"
        title="服務項目"
        description="不確定自己需要哪一種？直接說明你的狀況，我會給你建議。"
      />

      {loading ? (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="載入服務項目中"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 border-4 border-ink bg-paper shadow-nb" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((service, i) => {
            const Icon =
              (LucideIcons[service.icon_name as keyof typeof LucideIcons] as
                | LucideIcon
                | undefined) ?? LucideIcons.Layers

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
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
      )}

      <div className="mt-10">
        <Link
          href="/services"
          className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-5 py-3 text-[15px] font-bold text-ink shadow-nb"
        >
          查看完整服務與報價
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}
