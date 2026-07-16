'use client'

import { usePathname } from 'next/navigation'
import { Mail, MessageCircle } from 'lucide-react'
import { GMAIL_HREF, LINE_URL, LINE_ENABLED } from '@/lib/social'

const CIRCLE =
  'group relative flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md transition-colors duration-200'

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-full bg-black px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
      {label}
    </span>
  )
}

export default function SocialDock() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      {/* Gmail */}
      <a
        href={GMAIL_HREF}
        aria-label="寄信給我（Gmail）"
        className={`${CIRCLE} hover:bg-black hover:text-white`}
      >
        <Tooltip label="寄信給我" />
        <Mail size={20} />
      </a>

      {/* LINE — active when NEXT_PUBLIC_LINE_URL is set, otherwise a disabled hook */}
      {LINE_ENABLED ? (
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="用 LINE 聯絡我"
          className={`${CIRCLE} hover:bg-[#06C755] hover:text-white hover:border-[#06C755]`}
        >
          <Tooltip label="LINE 聊聊" />
          <MessageCircle size={20} />
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-label="LINE 帳號建置中"
          className={`${CIRCLE} cursor-not-allowed opacity-50`}
        >
          <Tooltip label="LINE 建置中" />
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  )
}
