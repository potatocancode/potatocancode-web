export type ProjectCategory = 'Web' | 'App' | 'System'

export type InquiryStatus = 'Pending' | 'Contacted' | 'Finished'

export interface MediaItem {
  url: string
  type: 'image' | 'video'
  caption?: string
}

export interface Project {
  id: string
  title: string
  description: string // Markdown short summary
  tech_stack: string[]
  cover_image_url: string | null
  demo_link: string | null
  github_link: string | null
  category: ProjectCategory
  slug: string | null
  detailed_description: string | null // Markdown long-form content
  media_gallery: MediaItem[] | null
  created_at?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon_name: string
  base_price: number | null
  created_at?: string
}

export interface Inquiry {
  id: string
  customer_name: string
  email: string
  project_type: string
  message: string
  status: InquiryStatus
  created_at?: string
}

// Insert types (omit server-generated fields)
export type ProjectInsert = Omit<Project, 'id' | 'created_at'>
export type ServiceInsert = Omit<Service, 'id' | 'created_at'>
export type InquiryInsert = Omit<Inquiry, 'id' | 'created_at'>
