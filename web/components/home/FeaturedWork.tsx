'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ProjectCard'
import SectionHeading from './SectionHeading'

export default function FeaturedWork() {
  const { projects, loading, error } = useProjects()

  // The landing page stays clean when the DB is unreachable — /portfolio is
  // where a load failure is actually reported.
  if (error || (!loading && projects.length === 0)) return null

  const featured = projects.slice(0, 3)

  return (
    <section className="border-t-4 border-ink bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Selected Work"
          title="精選作品"
          description="每個專案都從需求釐清開始，到上線後的維護結束。"
        />

        {loading ? (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="載入作品中"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-[400px] border-4 border-ink bg-cream shadow-nb"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/portfolio"
            className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-cream px-5 py-3 text-[15px] font-bold text-ink shadow-nb"
          >
            看全部作品
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  )
}
