'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

interface Pill {
  label: string
  href: string
  external?: boolean
  primary?: boolean
  /** Hand-placed scatter so the row reads as composed, not stamped. */
  rotate: number
}

const PILLS: Pill[] = [
  { label: '看看作品集', href: '/portfolio', primary: true, rotate: -2 },
  { label: '聊聊你的專案', href: '/contact', primary: true, rotate: 1.5 },
  { label: '我提供的服務', href: '/services', rotate: -1 },
  {
    label: 'GitHub',
    href: 'https://github.com/potatocancode',
    external: true,
    rotate: 2,
  },
]

const PILL_BASE =
  'nb-tilt nb-press inline-flex items-center gap-1.5 border-[3px] border-ink px-4 py-2.5 text-[14px] font-bold text-ink shadow-nb sm:px-5 sm:text-[15px]'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [showPills, setShowPills] = useState(false)

  // Scrub state kept in refs to avoid re-renders on every mouse move.
  const targetTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const prevXRef = useRef<number | null>(null)

  // Reveal pills 400ms after load.
  useEffect(() => {
    const t = setTimeout(() => setShowPills(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Mouse-scrub the background video.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Touch / no-hover devices can't scrub — play a gentle muted loop instead,
    // unless the visitor has asked for reduced motion.
    const coarse =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (coarse) {
      if (!reduced) {
        video.loop = true
        video.muted = true
        video.play().catch(() => {})
      }
      return
    }

    function seekToTarget() {
      const v = videoRef.current
      if (!v || !v.duration) return
      if (Math.abs(v.currentTime - targetTimeRef.current) < 0.01) return
      isSeekingRef.current = true
      v.currentTime = targetTimeRef.current
    }

    function handleSeeked() {
      isSeekingRef.current = false
      // If the target moved while we were seeking, chase it.
      const v = videoRef.current
      if (v && Math.abs(v.currentTime - targetTimeRef.current) >= 0.01) {
        seekToTarget()
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const v = videoRef.current
      if (!v || !v.duration) return
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX
        return
      }
      const delta = e.clientX - prevXRef.current
      prevXRef.current = e.clientX

      let target =
        targetTimeRef.current +
        (delta / window.innerWidth) * SENSITIVITY * v.duration
      target = Math.max(0, Math.min(v.duration, target))
      targetTimeRef.current = target

      if (!isSeekingRef.current) seekToTarget()
    }

    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section className="relative flex min-h-[100svh] flex-col pt-16 md:pt-[72px]">
      {/* Media panel — the video is scoped to the hero, not the whole page, so
          the sections below scroll over an opaque canvas. */}
      <div className="relative flex flex-1 items-end overflow-hidden md:items-center">
        {videoFailed ? (
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'repeating-linear-gradient(45deg, #ffd93d 0px, #ffd93d 28px, #fffdf5 28px, #fffdf5 56px)',
            }}
            aria-hidden="true"
          />
        ) : (
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 z-0 h-full w-full"
            style={{ objectFit: 'cover', objectPosition: '70% center' }}
          />
        )}

        {/* Poster panel — guarantees text contrast over unpredictable video
            frames, and reads as a label slapped onto the media. */}
        <div className="relative z-10 w-full px-4 pb-12 sm:px-6 md:px-10 md:pb-0">
          <div className="max-w-2xl border-4 border-ink bg-cream p-6 shadow-nb-lg sm:p-8 md:p-10">
            <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-stone sm:text-[12px]">
              Custom&nbsp;App&nbsp;/&nbsp;Web&nbsp;/&nbsp;System
            </p>

            <h1
              className="text-ink"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 7.5vw, 82px)',
                lineHeight: 0.94,
                fontWeight: 700,
                letterSpacing: '-0.035em',
              }}
            >
              <span className="block">PotatoCanCode</span>
              <span className="mt-2 inline-block border-[3px] border-ink bg-pop-yellow px-3 py-0.5 shadow-nb">
                Studio
              </span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] font-medium leading-relaxed text-stone sm:text-base">
              CSIE 資工背景開發者，專精客製化網頁、跨平台 App 與系統程式。
              <span className="text-ink">從設計到部署，一個人全包。</span>
            </p>

            <div
              className="mt-7 flex flex-wrap gap-3"
              style={{
                opacity: showPills ? 1 : 0,
                transform: showPills ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {PILLS.map((pill) => {
                const scatter = { '--tilt': `${pill.rotate}deg` } as CSSProperties
                const cls = `${PILL_BASE} ${pill.primary ? 'bg-pop-yellow' : 'bg-paper'}`
                return pill.external ? (
                  <a
                    key={pill.label}
                    href={pill.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                    style={scatter}
                  >
                    {pill.label}
                    <ArrowUpRight size={15} className="shrink-0" />
                  </a>
                ) : (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className={cls}
                    style={scatter}
                  >
                    {pill.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Scroll cue — on its own opaque chip; the video frame behind it is
              unpredictable, and bare ink text on mid-grey fails contrast. */}
          <div className="mt-8 hidden md:block">
            <span className="inline-flex items-center gap-2.5 border-[3px] border-ink bg-cream px-3 py-2 shadow-[3px_3px_0_var(--color-ink)]">
              <ArrowDown size={15} strokeWidth={2.5} className="text-ink" />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                往下看技術實力
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
