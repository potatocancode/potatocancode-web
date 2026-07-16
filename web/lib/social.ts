/**
 * Social / contact configuration for the floating social dock and hero CTA.
 *
 * Gmail is live. LINE is a hook: it activates automatically once
 * NEXT_PUBLIC_LINE_URL is set (e.g. an official LINE account / chat URL).
 * Until then the LINE circle renders in a disabled "coming soon" state.
 */

export const CONTACT_EMAIL = 'potatocancode@gmail.com'

/** Opens the user's default mail client to compose a message. */
export const GMAIL_HREF = `mailto:${CONTACT_EMAIL}`

/**
 * LINE chat URL. Set NEXT_PUBLIC_LINE_URL in .env.local when the LINE
 * official account exists, e.g. https://line.me/ti/p/@your-line-id
 */
export const LINE_URL: string | undefined =
  process.env.NEXT_PUBLIC_LINE_URL || undefined

export const LINE_ENABLED = Boolean(LINE_URL)
