import { createService } from '../../actions'
import ServiceForm from '../ServiceForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewServicePage() {
  return (
    <div>
      <Link href="/admin/services" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={16} /> 返回列表
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">新增服務</h1>
      <ServiceForm action={createService} />
    </div>
  )
}
