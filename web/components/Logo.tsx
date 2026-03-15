'use client'

import Link from 'next/link'

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="回首頁"
      className="logo-root inline-flex items-center gap-0 font-mono font-bold text-xl select-none cursor-pointer"
    >
      <span className="logo-bracket text-indigo-400">{`{`}</span>
      <span className="text-white tracking-tight px-1.5">PC</span>
      <span className="logo-cursor" aria-hidden="true" />
      <span className="logo-bracket text-indigo-400">{`}`}</span>
    </Link>
  )
}
