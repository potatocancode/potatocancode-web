'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Smartphone,
  Cpu,
  Database,
  Rocket,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'
import SectionHeading from './SectionHeading'

interface Tile {
  icon: LucideIcon
  title: string
  body: string
  /** Only the tall tile uses these — they fill the extra row it spans. */
  points?: string[]
  tags?: string[]
  /** Accent surface — always paired with ink text (see MASTER.md contrast law). */
  surface: string
  span: string
  large?: boolean
}

const TILES: Tile[] = [
  {
    icon: Globe,
    title: '網頁開發',
    body: 'Next.js App Router 全端開發。從第一版設計稿到正式網域上線，中間所有環節都在我這裡完成。',
    points: [
      '形象官網、Landing Page、後台管理系統',
      'SSR / SSG 與 SEO 最佳化，Google 搜得到',
      '手機、平板、桌機三種尺寸都排版過',
      '串接資料庫、金流、第三方 API',
      '部署到 Vercel，附上後續維護說明',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    surface: 'bg-pop-yellow',
    span: 'sm:col-span-2 lg:col-span-3 lg:row-span-2',
    large: true,
  },
  {
    icon: Smartphone,
    title: '跨平台 App',
    body: 'React Native + Expo，一套程式碼同時上架 iOS 與 Android，省下一半的開發與維護成本。',
    tags: ['React Native', 'Expo'],
    surface: 'bg-pop-sky',
    span: 'sm:col-span-1 lg:col-span-3',
  },
  {
    icon: Cpu,
    title: '系統程式',
    body: 'C++ 系統程式與演算法實作。教學平台、效能敏感的工具與底層邏輯開發。',
    tags: ['C++', '演算法'],
    surface: 'bg-pop-violet',
    span: 'sm:col-span-1 lg:col-span-3',
  },
  {
    icon: Database,
    title: '後端與資料庫',
    body: 'Supabase / PostgreSQL、RLS 權限設計、Auth 與檔案儲存。',
    surface: 'bg-paper',
    span: 'sm:col-span-1 lg:col-span-2',
  },
  {
    icon: Rocket,
    title: '一條龍交付',
    body: '設計、開發、測試到 Vercel 部署全包，不用再找第二個人接手。',
    surface: 'bg-paper',
    span: 'sm:col-span-1 lg:col-span-2',
  },
  {
    icon: GraduationCap,
    title: 'CSIE 本科',
    body: '資訊工程系背景，理論基礎紮實，不只是把模板改一改。',
    surface: 'bg-paper',
    span: 'sm:col-span-2 lg:col-span-2',
  },
]

export default function BentoGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionHeading
        eyebrow="Capability"
        title="技術實力"
        description="從前端介面到後端資料庫，從瀏覽器到 App Store。以下是我實際交付過的範圍。"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {TILES.map((tile, i) => {
          const Icon = tile.icon
          return (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.4,
                delay: i * 0.06,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={`flex flex-col border-4 border-ink p-6 shadow-nb ${tile.surface} ${tile.span}`}
            >
              <span className="mb-5 flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-ink bg-cream text-ink">
                <Icon size={21} strokeWidth={2.25} />
              </span>

              <h3
                className={`font-bold tracking-[-0.02em] text-ink ${
                  tile.large ? 'text-[26px] sm:text-[32px]' : 'text-[20px]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {tile.title}
              </h3>

              <p
                className={`mt-3 leading-relaxed text-ink/75 ${
                  tile.large ? 'text-[15px] sm:text-base' : 'text-[14px]'
                }`}
              >
                {tile.body}
              </p>

              {tile.points && (
                <ul className="mt-5 flex flex-col gap-2.5 border-t-[3px] border-ink/20 pt-5">
                  {tile.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2.5 text-[14px] leading-snug text-ink/80"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-ink"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              {tile.tags && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">

                  {tile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-2 border-ink bg-cream px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.04em] text-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
