import { createClient } from '@supabase/supabase-js'
import type { Project, Service, Inquiry } from './types'

// Re-export types for use across the app
export type { Project, Service, Inquiry }

// Guard against malformed placeholder URLs (e.g., https://<your-ref>.supabase.co)
function resolveUrl(raw: string | undefined): string {
  try {
    if (raw) new URL(raw)
    return raw && raw.startsWith('https://') ? raw : 'https://placeholder.supabase.co'
  } catch {
    return 'https://placeholder.supabase.co'
  }
}

const supabaseUrl = resolveUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

// Using untyped client to avoid GenericTable constraint changes in @supabase/supabase-js v2.99+
// Types are enforced at the call site via types.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
