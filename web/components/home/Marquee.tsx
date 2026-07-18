const ITEMS = [
  'Next.js',
  'React Native',
  'TypeScript',
  'C++',
  'Supabase',
  'Expo',
  'Tailwind CSS',
  'PostgreSQL',
]

/** Infinite capability band. The track holds two identical copies and slides
 *  exactly -50%, so the seam lands off-screen and the loop is invisible.
 *  `prefers-reduced-motion` stops it dead (see globals.css). */
export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]

  return (
    <div
      className="overflow-hidden border-y-4 border-ink bg-ink py-3.5"
      aria-hidden="true"
    >
      <div className="nb-marquee-track">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-6 whitespace-nowrap px-6 font-mono text-[13px] font-medium uppercase tracking-[0.18em] text-cream"
          >
            {item}
            <span className="h-1.5 w-1.5 rotate-45 bg-pop-yellow" />
          </span>
        ))}
      </div>
    </div>
  )
}
