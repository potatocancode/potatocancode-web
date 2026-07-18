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

// ── Category surface (matches ProjectCard) ─────────────────────────────────────

const CATEGORY_SURFACE: Record<string, string> = {
  Web: 'bg-pop-sky',
  App: 'bg-pop-red',
  System: 'bg-pop-violet',
}

// ── Media embed ────────────────────────────────────────────────────────────────

function MediaFrame({
  children,
  caption,
}: {
  children: React.ReactNode
  caption?: string
}) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden border-4 border-ink bg-cream shadow-nb">
        {children}
      </div>
      {caption && (
        <figcaption className="font-mono text-[12px] text-stone">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function MediaEmbed({ item }: { item: MediaItem }) {
  if (item.type === 'video') {
    // YouTube
    const ytMatch = item.url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (ytMatch) {
      return (
        <MediaFrame caption={item.caption}>
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            title={item.caption ?? '專案影片'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </MediaFrame>
      )
    }

    // Google Drive
    const driveMatch = item.url.match(
      /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
    )
    if (driveMatch) {
      return (
        <MediaFrame caption={item.caption}>
          <iframe
            src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
            title={item.caption ?? '專案影片'}
            allow="autoplay"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </MediaFrame>
      )
    }

    // Vimeo
    const vimeoMatch = item.url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return (
        <MediaFrame caption={item.caption}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            title={item.caption ?? '專案影片'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </MediaFrame>
      )
    }

    // Generic video file
    return (
      <MediaFrame caption={item.caption}>
        <video controls className="absolute inset-0 h-full w-full object-cover">
          <source src={item.url} />
        </video>
      </MediaFrame>
    )
  }

  // Image — plain <img> since the URL hostname is user-provided and unknown
  return (
    <MediaFrame caption={item.caption}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.url}
        alt={item.caption ?? ''}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </MediaFrame>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const {
    title,
    description,
    category,
    cover_image_url,
    demo_link,
    github_link,
    detailed_description,
  } = project
  const tech_stack = project.tech_stack as string[]
  const media_gallery = project.media_gallery as MediaItem[] | null

  return (
    <main className="min-h-screen bg-cream px-5 pb-24 pt-16 sm:px-8 md:pt-[72px]">
      <div className="mx-auto max-w-3xl pt-14">
        {/* Back */}
        <Link
          href="/portfolio"
          className="nb-press mb-10 inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-4 py-2 text-[14px] font-bold text-ink shadow-nb"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          返回作品集
        </Link>

        {/* Cover */}
        <div className="relative mb-10 aspect-video w-full overflow-hidden border-4 border-ink bg-paper shadow-nb-lg">
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
            <div
              className="absolute inset-0 flex items-center justify-center text-ink/25"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(10,10,10,0.05) 0px, rgba(10,10,10,0.05) 12px, transparent 12px, transparent 24px)',
              }}
            >
              <Layers size={56} strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Header */}
        <span
          className={`mb-4 inline-block border-[3px] border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink shadow-[3px_3px_0_var(--color-ink)] ${
            CATEGORY_SURFACE[category] ?? 'bg-paper'
          }`}
        >
          {category}
        </span>

        <h1
          className="text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[46px]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>

        <p className="mt-5 text-[16px] leading-relaxed text-stone">{description}</p>

        {/* Actions */}
        {(demo_link || github_link) && (
          <div className="mt-7 flex flex-wrap gap-4">
            {demo_link && (
              <a
                href={demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-ink px-5 py-3 text-[15px] font-bold text-cream shadow-nb"
              >
                <ExternalLink size={16} strokeWidth={2.5} />
                Live Demo
              </a>
            )}
            {github_link && (
              <a
                href={github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="nb-press inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-5 py-3 text-[15px] font-bold text-ink shadow-nb"
              >
                <Github size={16} strokeWidth={2.5} />
                GitHub
              </a>
            )}
          </div>
        )}

        {/* Tech stack */}
        <div className="mt-8 flex flex-wrap gap-2 border-t-4 border-ink pt-8">
          {tech_stack.map((tech) => (
            <span
              key={tech}
              className="border-2 border-ink bg-paper px-2.5 py-1 font-mono text-[12px] font-medium text-ink"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Detailed description */}
        {detailed_description && (
          <section className="mt-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2
                    className="mt-10 mb-3 text-[26px] font-bold tracking-[-0.02em] text-ink"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h2
                    className="mt-9 mb-3 text-[22px] font-bold tracking-[-0.02em] text-ink"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-7 mb-2 text-[17px] font-bold text-ink">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-4 text-[15px] leading-7 text-ink/80">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-ink">{children}</strong>
                ),
                em: ({ children }) => <em className="italic text-ink/90">{children}</em>,
                ul: ({ children }) => (
                  <ul className="my-4 flex list-disc flex-col gap-1.5 pl-6 text-[15px] leading-7 text-ink/80 marker:text-ink">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-4 flex list-decimal flex-col gap-1.5 pl-6 text-[15px] leading-7 text-ink/80 marker:font-bold marker:text-ink">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li>{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-ink underline decoration-[3px] underline-offset-[3px] transition-colors hover:bg-pop-yellow"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-5 border-l-[6px] border-ink bg-paper py-3 pl-5 text-[15px] leading-7 text-ink/75">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock ? (
                    <code className="block overflow-x-auto whitespace-pre px-4 py-3 font-mono text-[13px] leading-6 text-cream">
                      {children}
                    </code>
                  ) : (
                    <code className="border-2 border-ink bg-pop-yellow px-1.5 py-0.5 font-mono text-[13px] text-ink">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-5 overflow-x-auto border-4 border-ink bg-ink shadow-nb">
                    {children}
                  </pre>
                ),
                hr: () => <hr className="my-8 border-t-4 border-ink" />,
                table: ({ children }) => (
                  <div className="my-5 overflow-x-auto border-4 border-ink shadow-nb">
                    <table className="w-full border-collapse text-left text-[14px]">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border-2 border-ink bg-pop-yellow px-3 py-2 font-bold text-ink">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-2 border-ink bg-paper px-3 py-2 text-ink/80">
                    {children}
                  </td>
                ),
              }}
            >
              {detailed_description}
            </ReactMarkdown>
          </section>
        )}

        {/* Media gallery */}
        {media_gallery && media_gallery.length > 0 && (
          <section className="mt-14">
            <h2
              className="mb-7 border-b-4 border-ink pb-4 text-[24px] font-bold tracking-[-0.02em] text-ink"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              操作畫面
            </h2>
            <div className="flex flex-col gap-10">
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
