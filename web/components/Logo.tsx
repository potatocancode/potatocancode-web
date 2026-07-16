'use client'

import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="回首頁"
      className="group flex items-center gap-3 select-none"
    >
      <span
        className="text-[21px] sm:text-[26px] tracking-tight text-black transition-opacity group-hover:opacity-70"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        PotatoCan<sup className="text-[0.6em] align-super">®</sup>
      </span>
      <span
        className="text-[25px] sm:text-[30px] text-black select-none transition-transform duration-700 ease-out group-hover:rotate-180"
        style={{ letterSpacing: '-0.02em' }}
        aria-hidden="true"
      >
        ✳︎
      </span>
    </Link>
  )
}
