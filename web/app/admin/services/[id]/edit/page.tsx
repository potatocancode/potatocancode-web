import { createServiceClient } from '@/lib/supabase/server'
import { updateService } from '../../../actions'
import ServiceForm from '../../ServiceForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = createServiceClient()
  const { data: service } = await client.from('services').select('*').eq('id', id).single()
  if (!service) notFound()

  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} /> 返回列表
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">編輯服務</h1>
      <ServiceForm service={service} action={updateService.bind(null, id)} />
    </div>
  )
}
