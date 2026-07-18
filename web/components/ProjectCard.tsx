'use client'

import { ExternalLink, Github, Layers, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/supabase/types'

/** Each category owns an accent surface. Ink text on all of them. */
const CATEGORY_SURFACE: Record<Project['category'], string> = {
  Web: 'bg-pop-sky',
  App: 'bg-pop-red',
  System: 'bg-pop-violet',
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    title,
    description,
    tech_stack,
    cover_image_url,
    demo_link,
    github_link,
    category,
    slug,
  } = project

  return (
    <div
      className={`group relative flex h-full flex-col border-4 border-ink bg-paper shadow-nb ${
        slug ? 'nb-press' : ''
      }`}
    >
      {/* Cover */}
      <div className="relative h-48 w-full overflow-hidden border-b-4 border-ink bg-cream">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-ink/25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(10,10,10,0.05) 0px, rgba(10,10,10,0.05) 10px, transparent 10px, transparent 20px)',
            }}
          >
            <Layers size={40} strokeWidth={2} />
          </div>
        )}

        {/* Category badge — slapped on, straightens when the card is hovered */}
        <span
          className={`absolute right-3 top-3 rotate-2 border-[3px] border-ink px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink shadow-[3px_3px_0_var(--color-ink)] transition-transform duration-200 group-hover:rotate-0 ${CATEGORY_SURFACE[category]}`}
        >
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-[19px] font-bold leading-tight tracking-[-0.02em] text-ink"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {slug ? (
              // Stretched link: covers the whole card without nesting anchors
              // inside the Demo/GitHub links below.
              <Link
                href={`/portfolio/${slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          {slug && (
            <ArrowRight
              size={17}
              strokeWidth={2.5}
              className="mt-0.5 shrink-0 text-ink/30 transition-colors group-hover:text-ink"
              aria-hidden="true"
            />
          )}
        </div>

        <p className="line-clamp-2 text-[14px] leading-relaxed text-stone">
          {description}
        </p>

        {/* Tech stack */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="border-2 border-ink bg-cream px-2 py-0.5 font-mono text-[11px] font-medium text-ink"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links — z-10 lifts them above the stretched link */}
        {(demo_link || github_link) && (
          <div className="relative z-10 flex gap-4 border-t-[3px] border-ink pt-3">
            {demo_link && (
              <a
                href={demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink transition-colors hover:text-ink/55"
              >
                <ExternalLink size={14} strokeWidth={2.5} />
                Demo
              </a>
            )}
            {github_link && (
              <a
                href={github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink transition-colors hover:text-ink/55"
              >
                <Github size={14} strokeWidth={2.5} />
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
