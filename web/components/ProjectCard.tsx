'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github, Layers, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/supabase/types'

const CATEGORY_COLORS: Record<Project['category'], string> = {
  Web: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  App: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  System: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
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
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-indigo-500/50 transition-colors h-full"
    >
      {/* Cover image */}
      <div className="relative h-48 w-full bg-zinc-800 overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
            <Layers size={40} />
          </div>
        )}
        {/* Category badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full border text-xs font-semibold font-mono ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {slug && (
            <ArrowRight size={16} className="shrink-0 mt-1 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
          )}
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs font-mono bg-zinc-800 border border-zinc-700 text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2 border-t border-zinc-800">
          {demo_link && (
            <a
              href={demo_link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
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
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
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
