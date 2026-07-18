# Design System Master File — PotatoCanCode Studio

> **LOGIC:** When building a specific page, first check `design-system/potatocancode-studio/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, strictly follow the rules below.

**Project:** PotatoCanCode Studio (zh-TW freelance dev studio)
**Stack:** Next.js 16 App Router · Tailwind v4 · Framer Motion · Supabase
**Style:** Neo-Brutalism
**Design Dials:** Variance 8/10 (Bold / Asymmetric) | Motion 6/10 (Standard) | Density 4/10 (Standard)

> **Deviation from generated output:** the `--design-system` run paired the Neo-Brutalism
> style with a pink SaaS palette (`#EC4899` on `#FDF2F8`), 8–12px radii and soft blurred
> shadows — all three directly contradict the style it selected, and the pink reads Gen-Z
> rather than "engineer you can hire". Palette below is taken from the Neo Brutalism
> entry's own `Design System Variables`, with **yellow promoted to dominant accent**
> (industrial/engineering signal) and red demoted to emphasis.

---

## Color Palette

| Role | Hex | Token | Notes |
|------|-----|-------|-------|
| Canvas | `#FFFDF5` | `--color-cream` | Page background. Warm, not white. |
| Ink | `#0A0A0A` | `--color-ink` | All borders, all body text. |
| Paper | `#FFFFFF` | `--color-paper` | Card surfaces on cream. |
| Accent (dominant) | `#FFD93D` | `--color-pop-yellow` | Primary highlight, CTA fills, active states. |
| Accent (emphasis) | `#FF6B6B` | `--color-pop-red` | Secondary highlight, alerts, "App" category. |
| Accent (tertiary) | `#C4B5FD` | `--color-pop-violet` | Tags, "System" category. |
| Accent (cool) | `#7DD3FC` | `--color-pop-sky` | "Web" category, info states. |
| Muted text | `#57534E` | `--color-stone` | Secondary copy only. 7.4:1 on cream. |

### Contrast law (non-negotiable)

**Every accent surface takes `--color-ink` text. Never white-on-accent.**

| Pair | Ratio | Verdict |
|------|-------|---------|
| ink on cream | 19.6:1 | AAA |
| ink on yellow | 15.3:1 | AAA |
| ink on red | 7.3:1 | AAA |
| ink on violet | 11.6:1 | AAA |
| ink on sky | 12.8:1 | AAA |
| cream on ink | 19.6:1 | AAA (inverted sections) |
| stone on cream | 7.4:1 | AAA |
| **white on red** | **2.8:1** | **FORBIDDEN** |

---

## Typography

Latin display font has **no CJK glyphs** — the pairing below is script-aware, not decorative.
Space Grotesk resolves Latin; Noto Sans TC catches every Han character behind it.

```css
--font-display: 'Space Grotesk', 'Noto Sans TC', sans-serif;
--font-body:    'Space Grotesk', 'Noto Sans TC', sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, monospace;
```

- **Weights: 700 and 900 only** for display. Neo-brutalism has no light type.
- Display sizes use `clamp()`, `line-height: 0.92–1.0`, `letter-spacing: -0.03em`.
- Labels/eyebrows: mono, `11–13px`, `uppercase`, `letter-spacing: 0.18em`.
- Body: `16px` minimum, `line-height: 1.6`.
- CJK never gets negative tracking below `-0.01em` — it collides.

---

## Core Primitives

| Token | Value |
|-------|-------|
| `--radius` | `0px` (pills `999px` — badges only) |
| `--border-thick` | `3px solid var(--color-ink)` |
| `--border-heavy` | `4px solid var(--color-ink)` |
| `--shadow-nb` | `4px 4px 0 var(--color-ink)` |
| `--shadow-nb-lg` | `8px 8px 0 var(--color-ink)` |

**Mechanical press:** on `:hover`/`:active`, translate the element by the shadow offset and
shrink the shadow to `0 0`. The element appears to be physically pressed into the page.
Never scale, never blur, never gradient.

---

## Component Specs

```css
.nb-card {                      /* Cards, tiles, panels */
  background: var(--color-paper);
  border: var(--border-thick);
  border-radius: 0;
  box-shadow: var(--shadow-nb);
  transition: transform 150ms, box-shadow 150ms;
}
.nb-card:hover { transform: translate(4px, 4px); box-shadow: 0 0 0 var(--color-ink); }

.nb-btn {                       /* Buttons + CTA links */
  background: var(--color-pop-yellow);
  color: var(--color-ink);
  border: var(--border-thick);
  box-shadow: var(--shadow-nb);
  font-weight: 700;
  cursor: pointer;
}
.nb-btn:hover  { transform: translate(4px, 4px); box-shadow: 0 0 0; }
.nb-btn:active { transform: translate(4px, 4px); }

.nb-input {                     /* Form fields */
  background: var(--color-paper);
  border: var(--border-thick);
  border-radius: 0;
  font-size: 16px;              /* 16px prevents iOS zoom-on-focus */
}
.nb-input:focus { box-shadow: var(--shadow-nb); outline: none; }
```

**Focus ring:** `outline: 3px solid var(--color-ink); outline-offset: 3px;` — visible, and it
matches the border language instead of fighting it. Never remove it.

---

## Layout Pattern — Portfolio Grid

Section order (landing):
1. Hero (wordmark + mouse-scrub video, preserved from prior build)
2. Marquee strip (capability keywords)
3. Bento Grid — technical capability *(required by SPEC.md)*
4. Featured work (live Supabase read, 3 items)
5. Services summary (live Supabase read, 3 items)
6. CTA
7. Footer

CTA placement: project-card hover + footer contact.
Color strategy: cream canvas lets the work images carry the color; accents are structural,
not decorative.

---

## Motion

Framer Motion is the project's animation library — the DB's GSAP preset is translated, not imported.

**Stagger reveal** (Standard tier, 300–450ms, overshoot easing):

```js
// viewport-triggered, once
initial={{ opacity: 0, y: 16, scale: 0.96 }}
whileInView={{ opacity: 1, y: 0, scale: 1 }}
viewport={{ once: true, margin: '-80px' }}
transition={{ duration: 0.4, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] }}  // ≈ back.out(1.4)
```

- Overshoot easing on cards and bento tiles only. **Never** on tables or dense informational UI.
- Marquee: linear, infinite, ~24s loop, no fade edges.
- Max 1–2 animated elements per viewport.

---

## Anti-Patterns

- Gradients, blurs, soft shadows, glassmorphism — all of them break the style
- Any `border-radius` other than 0 or full-pill on badges
- Font weights below 700 for display type
- White text on any accent surface (see contrast law)
- Emoji as icons — Lucide only
- Rotation beyond ±2deg, or rotation on anything containing body copy
- `scale()` hovers that shift surrounding layout

---

## Pre-Delivery Checklist

- [ ] No emoji icons; Lucide throughout
- [ ] `cursor-pointer` on every clickable element
- [ ] Hover transitions 150–300ms
- [ ] Text contrast ≥ 4.5:1 (accent surfaces = ink text)
- [ ] Focus states visible for keyboard nav
- [ ] `prefers-reduced-motion` respected — marquee and stagger both stop
- [ ] Responsive at 375 / 768 / 1024 / 1440px
- [ ] No content hidden behind the fixed navbar
- [ ] No horizontal scroll on mobile (marquee must clip, not overflow)
