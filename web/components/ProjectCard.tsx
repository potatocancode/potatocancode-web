'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Layers, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/supabase/types'

const CATEGORY_COLORS: Record<Project['category'], string> = {
  Web: 'bg-black/[0.04] text-black/70 border-black/10',
  App: 'bg-black/[0.04] text-black/70 border-black/10',
  System: 'bg-black/[0.04] text-black/70 border-black/10',
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, tech_stack, cover_image_url, demo_link, github_link, category, slug } = project

  const cardContent = (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group flex flex-col rounded-2xl border border-black/10 bg-white overflow-hidden hover:border-black/40 transition-colors h-full"
    >
      {/* Cover image */}
      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/20">
            <Layers size={40} />
          </div>
        )}
        {/* Category badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          {slug && (
            <ArrowRight size={16} className="shrink-0 mt-1 text-black/30 group-hover:text-black transition-colors" />
          )}
        </div>

        <p className="text-sm text-black/50 line-clamp-2">{description}</p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-xs bg-black/[0.04] border border-black/10 text-black/60"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2 border-t border-black/10">
          {demo_link && (
            <a
              href={demo_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors"
            >
              <ExternalLink size={14} />
              Demo
            </a>
          )}
          {github_link && (
            <a
              href={github_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-black/60 hover:text-black transition-colors"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (slug) {
    return (
      <Link href={`/portfolio/${slug}`} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}
