/* eslint-disable @next/next/no-img-element */
import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock next/image — jsdom does not support Next.js image optimization
vi.mock('next/image', () => ({
  default: function MockNextImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} />
  },
}))

// Mock framer-motion — avoid animation overhead in jsdom
vi.mock('framer-motion', () => {
  const createEl = (tag: string) => {
    const Component = React.forwardRef(
      ({ children, ...props }: React.HTMLAttributes<HTMLElement>, ref: React.Ref<HTMLElement>) =>
        React.createElement(tag, { ...props, ref }, children)
    )
    Component.displayName = `motion.${tag}`
    return Component
  }

  return {
    motion: {
      div: createEl('div'),
      h1: createEl('h1'),
      h2: createEl('h2'),
      p: createEl('p'),
      span: createEl('span'),
      section: createEl('section'),
      article: createEl('article'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
    useInView: () => false,
  }
})
