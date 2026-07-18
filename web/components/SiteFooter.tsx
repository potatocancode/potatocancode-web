'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Mail, ArrowUpRight } from 'lucide-react'
import { CONTACT_EMAIL, GMAIL_HREF } from '@/lib/social'

const NAV = [
  { label: '作品集', href: '/portfolio' },
  { label: '服務項目', href: '/services' },
  { label: '聯絡諮詢', href: '/contact' },
]

/** Inverted section — cream on ink. The only place the palette flips. */
export default function SiteFooter() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="border-t-4 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Wordmark */}
          <div className="lg:col-span-2">
            <p
              className="text-[30px] font-bold leading-[0.95] tracking-[-0.03em] sm:text-[38px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              PotatoCanCode
              <br />
              <span className="text-cream/45">Studio</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              CSIE 資工背景開發者。從設計到部署的全方位客製化解決方案。
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="頁尾導覽">
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
              Navigate
            </h2>
            <ul className="flex flex-col gap-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] font-bold text-cream transition-colors duration-150 hover:text-pop-yellow"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
              Contact
            </h2>
            <div className="flex flex-col gap-2.5">
              <a
                href={GMAIL_HREF}
                className="inline-flex items-center gap-2 text-[15px] font-bold break-all text-cream transition-colors duration-150 hover:text-pop-yellow"
              >
                <Mail size={15} className="shrink-0" />
                {CONTACT_EMAIL}
              </a>
              <a
                href="https://github.com/potatocancode"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[15px] font-bold text-cream transition-colors duration-150 hover:text-pop-yellow"
              >
                <Github size={15} className="shrink-0" />
                GitHub
                <ArrowUpRight size={13} className="shrink-0 opacity-50" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t-2 border-cream/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            © {new Date().getFullYear()} PotatoCanCode Studio
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/40">
            Custom App / Web / System
          </p>
        </div>
      </div>
    </footer>
  )
}
