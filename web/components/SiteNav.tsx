'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

/** Block inversion on hover — the neo-brutalist equivalent of an underline. */
const DESKTOP_LINK =
  'px-3 py-1.5 text-[15px] font-bold tracking-[0.01em] text-ink transition-colors duration-150 hover:bg-ink hover:text-cream'

const MOBILE_LINK =
  'block border-[3px] border-ink bg-paper px-5 py-4 text-[26px] font-bold tracking-[-0.02em] text-ink shadow-nb nb-press'

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const [lastPath, setLastPath] = useState(pathname)

  // Close on route change — covers browser back/forward, which the per-link
  // onClick handlers can't. Adjusting state during render (rather than in an
  // effect) avoids a cascading second render.
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  // Escape to close, and lock body scroll while the overlay is up.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b-4 border-ink bg-cream px-4 sm:px-6 md:h-[72px] md:px-8">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={DESKTOP_LINK}
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className={DESKTOP_LINK}>
                {link.label}
              </Link>
            )
          )}

          <Link
            href="/contact"
            className="nb-press ml-4 border-[3px] border-ink bg-pop-yellow px-5 py-2 text-[15px] font-bold text-ink shadow-nb"
          >
            聯絡我
          </Link>
        </div>

        {/* Mobile toggle — 44×44 minimum touch target */}
        <button
          type="button"
          aria-label={open ? '關閉選單' : '開啟選單'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] border-[3px] border-ink bg-paper shadow-[3px_3px_0_var(--color-ink)] transition-transform duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none md:hidden"
        >
          <span
            className="h-[3px] w-5 bg-ink transition-transform duration-300"
            style={open ? { transform: 'translateY(8px) rotate(45deg)' } : undefined}
          />
          <span
            className="h-[3px] w-5 bg-ink transition-opacity duration-300"
            style={open ? { opacity: 0 } : undefined}
          />
          <span
            className="h-[3px] w-5 bg-ink transition-transform duration-300"
            style={open ? { transform: 'translateY(-8px) rotate(-45deg)' } : undefined}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 top-16 z-40 flex flex-col gap-4 overflow-y-auto bg-cream px-4 py-8 md:hidden"
      >
        {LINKS.map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={MOBILE_LINK}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={MOBILE_LINK}
            >
              {link.label}
            </Link>
          )
        )}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="nb-press block border-[3px] border-ink bg-pop-yellow px-5 py-4 text-[26px] font-bold tracking-[-0.02em] text-ink shadow-nb"
        >
          聯絡我
        </Link>
      </div>
    </>
  )
}
