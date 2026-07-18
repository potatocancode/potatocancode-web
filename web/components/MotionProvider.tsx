'use client'

import { MotionConfig } from 'framer-motion'

/**
 * Framer Motion does not honour `prefers-reduced-motion` on its own — the CSS
 * media query in globals.css only reaches CSS animations, not JS-driven ones.
 * `reducedMotion="user"` drops transform/scale animations for visitors who ask
 * for it, while keeping opacity fades so nothing ends up invisible.
 *
 * Server components passed through `children` stay server-rendered.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
