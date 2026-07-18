'use client'

import { usePathname } from 'next/navigation'
import { Mail, MessageCircle } from 'lucide-react'
import { GMAIL_HREF, LINE_URL, LINE_ENABLED } from '@/lib/social'

const BOX =
  'group relative flex h-12 w-12 items-center justify-center border-[3px] border-ink text-ink shadow-nb'

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute right-14 whitespace-nowrap border-2 border-ink bg-ink px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {label}
    </span>
  )
}

export default function SocialDock() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      <a
        href={GMAIL_HREF}
        aria-label="寄信給我（Gmail）"
        className={`${BOX} nb-press bg-pop-yellow`}
      >
        <Tooltip label="寄信給我" />
        <Mail size={20} />
      </a>

      {/* LINE — live once NEXT_PUBLIC_LINE_URL is set, otherwise a disabled hook */}
      {LINE_ENABLED ? (
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="用 LINE 聯絡我"
          className={`${BOX} nb-press bg-[#06C755]`}
        >
          <Tooltip label="LINE 聊聊" />
          <MessageCircle size={20} />
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-label="LINE 帳號建置中"
          className={`${BOX} cursor-not-allowed bg-paper opacity-45`}
        >
          <Tooltip label="LINE 建置中" />
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  )
}
