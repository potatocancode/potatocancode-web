'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

const LINKS: NavLink[] = [
  { label: '作品集', href: '/portfolio' },
  { label: '服務項目', href: '/services' },
  { label: 'GitHub', href: 'https://github.com/potatocancode', external: true },
]

function renderLink(link: NavLink, className: string) {
  return link.external ? (
    <a
      key={link.label}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {link.label}
    </a>
  ) : (
    <Link key={link.label} href={link.href} className={className}>
      {link.label}
    </Link>
  )
}

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 z-10 w-full flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
        <Logo />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-9 text-[15px] tracking-[0.02em] text-black">
          {LINKS.map((link) =>
            renderLink(link, 'hover:opacity-50 transition-opacity')
          )}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center rounded-full border border-black/20 px-5 py-1.5 text-[15px] tracking-[0.02em] text-black transition-colors hover:bg-black hover:text-white"
        >
          聯絡我
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? '關閉選單' : '開啟選單'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-[5px] p-1"
        >
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { transform: 'translateY(7px) rotate(45deg)' } : undefined}
          />
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { opacity: 0 } : undefined}
          />
          <span
            className="w-6 h-[2px] bg-black transition-all duration-300"
            style={open ? { transform: 'translateY(-7px) rotate(-45deg)' } : undefined}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {LINKS.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="text-[32px] font-medium text-black"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[32px] font-medium text-black"
            >
              {link.label}
            </Link>
          )
        )}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="text-[32px] font-medium text-black underline underline-offset-2"
        >
          聯絡我
        </Link>
      </div>
    </>
  )
}
