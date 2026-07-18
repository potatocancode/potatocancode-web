'use client'

import Link from 'next/link'

/** Six-spoke asterisk. Drawn rather than typed — the ✳ dingbat renders as a
 *  colour emoji on some platforms and a hairline glyph on others. */
function Asterisk({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.75"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5v17M4.6 7.75l14.8 8.5M19.4 7.75l-14.8 8.5" />
    </svg>
  )
}

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="回首頁"
      className="group flex select-none items-center gap-2.5"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border-[3px] border-ink bg-pop-yellow text-ink shadow-[3px_3px_0_var(--color-ink)] transition-transform duration-500 ease-out group-hover:rotate-180 sm:h-10 sm:w-10">
        <Asterisk className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </span>
      <span
        className="text-[19px] font-bold tracking-[-0.03em] text-ink sm:text-[23px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        PotatoCan
        <sup className="align-super text-[0.48em] font-medium">®</sup>
      </span>
    </Link>
  )
}
