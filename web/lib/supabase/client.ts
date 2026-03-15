import { createClient } from '@supabase/supabase-js'
import type { Project, Service, Inquiry } from './types'

type Database = {
  public: {
    Tables: {
      projects: { Row: Project; Insert: Omit<Project, 'id' | 'created_at'>; Update: Partial<Project> }
      services: { Row: Service; Insert: Omit<Service, 'id' | 'created_at'>; Update: Partial<Service> }
      inquiries: { Row: Inquiry; Insert: Omit<Inquiry, 'id' | 'created_at'>; Update: Partial<Inquiry> }
    }
  }
}

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

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
