import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { CONTACT_EMAIL, GMAIL_HREF } from '@/lib/social'

/** Yellow block between the cream body and the ink footer — the page's
 *  loudest surface, sitting exactly where the decision gets made. */
export default function ContactCTA() {
  return (
    <section className="border-t-4 border-ink bg-pop-yellow">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <p className="mb-5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">
          Let&apos;s build something
        </p>

        <h2
          className="max-w-3xl text-[34px] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[54px]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          有想法了嗎？
          <br />
          聊聊你的專案。
        </h2>

        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/75 sm:text-base">
          告訴我你想做什麼、預算範圍與時程，我會在 24 小時內回覆一份可行的做法與報價。
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-ink px-6 py-3.5 text-[15px] font-bold text-cream shadow-nb sm:text-base"
          >
            填寫需求表單
            <ArrowRight size={17} strokeWidth={2.5} />
          </Link>

          <a
            href={GMAIL_HREF}
            className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-cream px-6 py-3.5 text-[15px] font-bold text-ink shadow-nb sm:text-base"
          >
            <Mail size={17} strokeWidth={2.5} />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}
