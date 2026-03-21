'use client'

import { motion } from 'framer-motion'
import { Terminal, Code2, Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const TAGLINE = 'PotatoCanCode Studio'
const SUB = '從設計到部署的全方位客製化解決方案'

const BADGES = ['React Native / Expo', 'Next.js', 'C++ / Systems', 'Supabase']

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Blinking cursor label */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 text-sm font-mono"
        >
          <Terminal size={14} />
          <span>potatocan.dev</span>
          <span className="w-2 h-4 bg-indigo-400 animate-pulse rounded-sm" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
            {TAGLINE}
          </span>
        </motion.h1>

        {/* Sub headline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
        >
          {SUB}
        </motion.p>

        {/* Tech badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-zinc-700 bg-zinc-800/60 text-zinc-300 text-sm font-mono"
            >
              <Code2 size={12} className="text-indigo-400" />
              {badge}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            <Layers size={18} />
            查看作品集
            <ArrowRight size={16} />
          </Link>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg border border-zinc-600 hover:border-indigo-500 text-zinc-300 hover:text-white font-semibold transition-colors"
          >
            聯絡諮詢
          </a>
        </motion.div>
      </div>
    </section>
  )
}
