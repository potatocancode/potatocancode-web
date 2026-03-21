import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github, Layers } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createServiceClient } from '@/lib/supabase/server'
import type { MediaItem } from '@/lib/supabase/types'

// ── Data fetching ──────────────────────────────────────────────────────────────

async function getProject(slug: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: '找不到專案' }
  return {
    title: `${project.title} — PotatoCan Studio`,
    description: project.description,
  }
}

// ── Category color ─────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Web: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  App: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
  System: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
}

// ── Media embed ────────────────────────────────────────────────────────────────

function MediaEmbed({ item }: { item: MediaItem }) {
  if (item.type === 'video') {
    // YouTube
    const ytMatch = item.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-zinc-500">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Google Drive
    const driveMatch = item.url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
            <iframe
              src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
              allow="autoplay"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-zinc-500">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Vimeo
    const vimeoMatch = item.url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-zinc-500">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Generic video file
    return (
      <figure className="flex flex-col gap-2">
        <video controls className="w-full rounded-xl bg-zinc-800">
          <source src={item.url} />
        </video>
        {item.caption && <figcaption className="text-center text-xs text-zinc-500">{item.caption}</figcaption>}
      </figure>
    )
  }

  // Image — use plain <img> since URL hostname is user-provided and unknown
  return (
    <figure className="flex flex-col gap-2">
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.caption ?? ''}
          className="w-full h-full object-cover"
        />
      </div>
      {item.caption && <figcaption className="text-center text-xs text-zinc-500">{item.caption}</figcaption>}
    </figure>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const { title, description, category, cover_image_url,
    demo_link, github_link, detailed_description } = project
  const tech_stack = project.tech_stack as string[]
  const media_gallery = project.media_gallery as MediaItem[] | null

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft size={15} />
          返回作品集
        </Link>

        {/* Cover */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-800 mb-8">
          {cover_image_url ? (
            <Image
              src={cover_image_url}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
              <Layers size={56} />
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <span className={`inline-block mb-3 px-2.5 py-0.5 rounded-full border text-xs font-semibold font-mono ${CATEGORY_COLORS[category] ?? ''}`}>
              {category}
            </span>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h1>
          </div>

          {/* Action links */}
          <div className="flex gap-3 shrink-0 pt-2">
            {demo_link && (
              <a
                href={demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {github_link && (
              <a
                href={github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="text-zinc-400 text-base mb-6">{description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-sm font-mono bg-zinc-800 border border-zinc-700 text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Detailed description */}
        {detailed_description && (
          <section className="mb-12 flex flex-col gap-4 text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-1">{children}</h3>,
                p: ({ children }) => <p className="text-zinc-300 leading-7">{children}</p>,
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-zinc-200 italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside text-zinc-300 flex flex-col gap-1 pl-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-300 flex flex-col gap-1 pl-2">{children}</ol>,
                li: ({ children }) => <li className="text-zinc-300">{children}</li>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">{children}</a>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-4 text-zinc-400 italic my-2">{children}</blockquote>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock
                    ? <code className="block bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre">{children}</code>
                    : <code className="bg-zinc-800 text-indigo-300 rounded px-1.5 py-0.5 text-xs font-mono">{children}</code>
                },
                pre: ({ children }) => <pre className="bg-zinc-800 border border-zinc-700 rounded-lg overflow-x-auto my-2">{children}</pre>,
                hr: () => <hr className="border-zinc-700 my-4" />,
                table: ({ children }) => <div className="overflow-x-auto my-2"><table className="w-full text-sm text-left border-collapse">{children}</table></div>,
                th: ({ children }) => <th className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-white font-semibold">{children}</th>,
                td: ({ children }) => <td className="border border-zinc-700 px-3 py-2 text-zinc-300">{children}</td>,
              }}
            >
              {detailed_description}
            </ReactMarkdown>
          </section>
        )}

        {/* Media gallery */}
        {media_gallery && media_gallery.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6">操作畫面</h2>
            <div className="flex flex-col gap-8">
              {media_gallery.map((item, idx) => (
                <MediaEmbed key={idx} item={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
