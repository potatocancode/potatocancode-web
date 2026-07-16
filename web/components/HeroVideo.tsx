'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const SENSITIVITY = 0.8

interface Pill {
  label: string
  href: string
  external?: boolean
  /** Hand-placed scatter so the row reads as composed, not stamped. */
  rotate: number
  offsetY: number
}

const PILLS: Pill[] = [
  { label: '看看作品集', href: '/portfolio', rotate: -2.5, offsetY: 6 },
  { label: '我提供的服務', href: '/services', rotate: 1.5, offsetY: -5 },
  { label: '聊聊你的專案', href: '/contact', rotate: -1, offsetY: 9 },
  {
    label: '查看 GitHub',
    href: 'https://github.com/potatocancode',
    external: true,
    rotate: 2.5,
    offsetY: 0,
  },
]

const PILL_CLASS =
  'hero-pill inline-flex items-center justify-center whitespace-nowrap bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.35em] mx-[0.25em] mb-[0.5em] shadow-sm transition-all duration-200 hover:bg-black hover:text-white'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [showPills, setShowPills] = useState(false)

  // Scrub state kept in refs to avoid re-renders on every mouse move.
  const targetTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const prevXRef = useRef<number | null>(null)
  const ambientRef = useRef(false)

  // Reveal pills 400ms after load.
  useEffect(() => {
    const t = setTimeout(() => setShowPills(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Mouse-scrub the background video.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Touch / no-hover devices can't scrub — play a gentle muted loop instead.
    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches
    if (coarse) {
      ambientRef.current = true
      video.loop = true
      video.muted = true
      video.play().catch(() => {})
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
    <section className="relative h-screen flex flex-col justify-end pb-14 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
      {/* Background video (or gradient fallback) */}
      {videoFailed ? (
        <div
          className="fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(120% 120% at 70% 30%, #f4f4f5 0%, #e4e4e7 45%, #d4d4d8 100%)',
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
          onError={() => setVideoFailed(true)}
          className="fixed inset-0 z-0 h-full w-full"
          style={{ objectFit: 'cover', objectPosition: '70% center' }}
        />
      )}

      <div className="relative z-10 max-w-2xl">
        {/* Wordmark */}
        <h1
          className="text-black"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(46px, 9vw, 92px)',
            lineHeight: 0.98,
            fontWeight: 500,
            letterSpacing: '-0.035em',
          }}
        >
          <span className="block">PotatoCanCode</span>
          <span
            className="block"
            style={{ fontWeight: 400, opacity: 0.55, letterSpacing: '-0.02em' }}
          >
            Studio
          </span>
        </h1>

        {/* Discipline line */}
        <p
          className="text-black font-mono font-medium mt-4 sm:mt-5 mb-8 sm:mb-9"
          style={{
            fontSize: 'clamp(11px, 1.6vw, 14px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Custom&nbsp;APP&nbsp;<span className="text-black/35">/</span>&nbsp;Web&nbsp;<span className="text-black/35">/</span>&nbsp;System
        </p>

        {/* Action pills — scattered */}
        <div
          className="flex flex-wrap items-start"
          style={{
            opacity: showPills ? 1 : 0,
            transform: showPills ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          {PILLS.map((pill) => {
            const scatter = {
              '--pill-rotate': `${pill.rotate}deg`,
              '--pill-y': `${pill.offsetY}px`,
            } as CSSProperties
            return pill.external ? (
              <a
                key={pill.label}
                href={pill.href}
                target="_blank"
                rel="noopener noreferrer"
                className={PILL_CLASS}
                style={scatter}
              >
                {pill.label}
              </a>
            ) : (
              <Link
                key={pill.label}
                href={pill.href}
                className={PILL_CLASS}
                style={scatter}
              >
                {pill.label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
