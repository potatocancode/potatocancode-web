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
  Web: 'bg-black/[0.04] text-black/70 border-black/10',
  App: 'bg-black/[0.04] text-black/70 border-black/10',
  System: 'bg-black/[0.04] text-black/70 border-black/10',
}

// ── Media embed ────────────────────────────────────────────────────────────────

function MediaEmbed({ item }: { item: MediaItem }) {
  if (item.type === 'video') {
    // YouTube
    const ytMatch = item.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100">
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-black/40">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Google Drive
    const driveMatch = item.url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (driveMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100">
            <iframe
              src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
              allow="autoplay"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-black/40">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Vimeo
    const vimeoMatch = item.url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return (
        <figure className="flex flex-col gap-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-100">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {item.caption && <figcaption className="text-center text-xs text-black/40">{item.caption}</figcaption>}
        </figure>
      )
    }

    // Generic video file
    return (
      <figure className="flex flex-col gap-2">
        <video controls className="w-full rounded-xl bg-neutral-100">
          <source src={item.url} />
        </video>
        {item.caption && <figcaption className="text-center text-xs text-black/40">{item.caption}</figcaption>}
      </figure>
    )
  }

  // Image — use plain <img> since URL hostname is user-provided and unknown
  return (
    <figure className="flex flex-col gap-2">
      <div className="w-full aspect-video rounded-xl overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.caption ?? ''}
          className="w-full h-full object-cover"
        />
      </div>
      {item.caption && <figcaption className="text-center text-xs text-black/40">{item.caption}</figcaption>}
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
    <main className="min-h-screen bg-white px-6 pt-28 pb-20">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={15} />
          返回作品集
        </Link>

        {/* Cover */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-100 mb-8">
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
            <div className="absolute inset-0 flex items-center justify-center text-black/20">
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
            <h1 className="text-3xl font-semibold text-black sm:text-4xl">{title}</h1>
          </div>

          {/* Action links */}
          <div className="flex gap-3 shrink-0 pt-2">
            {demo_link && (
              <a
                href={demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-800 transition-colors"
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
                className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:border-black/40 transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Short description */}
        <p className="text-black/50 text-base mb-6">{description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-10">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-sm font-mono bg-neutral-100 border border-black/10 text-black/70"
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
                h1: ({ children }) => <h1 className="text-2xl font-bold text-black mt-6 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold text-black mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-black mt-4 mb-1">{children}</h3>,
                p: ({ children }) => <p className="text-black/70 leading-7">{children}</p>,
                strong: ({ children }) => <strong className="text-black font-semibold">{children}</strong>,
                em: ({ children }) => <em className="text-black/80 italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside text-black/70 flex flex-col gap-1 pl-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside text-black/70 flex flex-col gap-1 pl-2">{children}</ol>,
                li: ({ children }) => <li className="text-black/70">{children}</li>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-black underline hover:opacity-60">{children}</a>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-black pl-4 text-black/50 italic my-2">{children}</blockquote>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock
                    ? <code className="block bg-neutral-100 border border-black/10 rounded-lg px-4 py-3 text-xs font-mono text-black/80 overflow-x-auto whitespace-pre">{children}</code>
                    : <code className="bg-neutral-100 text-black rounded px-1.5 py-0.5 text-xs font-mono">{children}</code>
                },
                pre: ({ children }) => <pre className="bg-neutral-100 border border-black/10 rounded-lg overflow-x-auto my-2">{children}</pre>,
                hr: () => <hr className="border-black/10 my-4" />,
                table: ({ children }) => <div className="overflow-x-auto my-2"><table className="w-full text-sm text-left border-collapse">{children}</table></div>,
                th: ({ children }) => <th className="border border-black/10 bg-neutral-100 px-3 py-2 text-black font-semibold">{children}</th>,
                td: ({ children }) => <td className="border border-black/10 px-3 py-2 text-black/70">{children}</td>,
              }}
            >
              {detailed_description}
            </ReactMarkdown>
          </section>
        )}

        {/* Media gallery */}
        {media_gallery && media_gallery.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-black mb-6">操作畫面</h2>
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
