import { createServiceClient } from '@/lib/supabase/server'
import { updateProject } from '../../../actions'
import ProjectForm from '../../ProjectForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data: project } = await service.from('projects').select('*').eq('id', id).single()
  if (!project) notFound()

  return (
    <div>
      <Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} /> 返回列表
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">編輯作品</h1>
      <ProjectForm project={project} action={(formData) => updateProject(id, formData)} />
    </div>
  )
}
