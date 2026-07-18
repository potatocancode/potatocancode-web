interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
}

/** Shared masthead for interior pages. Sits below the fixed nav. */
export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="mb-12 border-b-4 border-ink pb-10">
      <p className="mb-4 inline-block border-[3px] border-ink bg-pop-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink shadow-[3px_3px_0_var(--color-ink)]">
        {eyebrow}
      </p>
      <h1
        className="text-[36px] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[52px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone sm:text-base">
          {description}
        </p>
      )}
    </header>
  )
}
