'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAnonClient, createServiceClient } from '@/lib/supabase/server'
import type { ProjectCategory, InquiryStatus } from '@/lib/supabase/types'

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signIn(formData: FormData) {
  const supabase = await createAnonClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: error.message }
  redirect('/admin/projects')
}

export async function signOut() {
  const supabase = await createAnonClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

// ── Image upload helper ───────────────────────────────────────────────────────

async function uploadCover(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null
  const service = createServiceClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}.${ext}`
  const buffer = await file.arrayBuffer()
  const { error } = await service.storage
    .from('covers')
    .upload(filename, buffer, { contentType: file.type, upsert: true })
  if (error) throw new Error(error.message)
  const { data } = service.storage.from('covers').getPublicUrl(filename)
  return data.publicUrl
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function createProject(formData: FormData) {
  const service = createServiceClient()
  const coverImageUrl = await uploadCover(formData.get('cover_image') as File)
  const techStack = (formData.get('tech_stack') as string)
    .split(',').map(t => t.trim()).filter(Boolean)

  const { error } = await service.from('projects').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as ProjectCategory,
    tech_stack: techStack,
    cover_image_url: coverImageUrl,
    demo_link: (formData.get('demo_link') as string) || null,
    github_link: (formData.get('github_link') as string) || null,
  })
  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/portfolio')
  redirect('/admin/projects')
}

export async function updateProject(id: string, formData: FormData) {
  const service = createServiceClient()
  const newCoverUrl = await uploadCover(formData.get('cover_image') as File)
  const techStack = (formData.get('tech_stack') as string)
    .split(',').map(t => t.trim()).filter(Boolean)

  const patch: Record<string, unknown> = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as ProjectCategory,
    tech_stack: techStack,
    demo_link: (formData.get('demo_link') as string) || null,
    github_link: (formData.get('github_link') as string) || null,
  }
  if (newCoverUrl) patch.cover_image_url = newCoverUrl

  const { error } = await service.from('projects').update(patch).eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/portfolio')
  redirect('/admin/projects')
}

export async function deleteProject(id: string) {
  const service = createServiceClient()
  await service.from('projects').delete().eq('id', id)
  revalidatePath('/admin/projects')
  revalidatePath('/portfolio')
}

// ── Inquiries ─────────────────────────────────────────────────────────────────

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const service = createServiceClient()
  await service.from('inquiries').update({ status }).eq('id', id)
  revalidatePath('/admin/inquiries')
}
