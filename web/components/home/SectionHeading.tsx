interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-10 sm:mb-12">
      <p className="mb-4 inline-block border-[3px] border-ink bg-pop-yellow px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink shadow-[3px_3px_0_var(--color-ink)]">
        {eyebrow}
      </p>
      <h2
        className="text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[42px]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}
