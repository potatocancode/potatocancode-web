import { createServiceClient } from '@/lib/supabase/server'
import { updateInquiryStatus } from '../actions'
import type { InquiryStatus } from '@/lib/supabase/types'

const STATUS_STYLES: Record<InquiryStatus, string> = {
  Pending:   'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  Contacted: 'bg-blue-500/10   text-blue-300   border-blue-500/30',
  Finished:  'bg-green-500/10  text-green-300  border-green-500/30',
}

const NEXT_STATUS: Record<InquiryStatus, InquiryStatus | null> = {
  Pending:   'Contacted',
  Contacted: 'Finished',
  Finished:  null,
}

const NEXT_LABEL: Record<InquiryStatus, string> = {
  Pending:   '標記已聯繫',
  Contacted: '標記已完成',
  Finished:  '',
}

export default async function AdminInquiriesPage() {
  const service = createServiceClient()
  const { data: inquiries } = await service
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">諮詢紀錄</h1>

      {!inquiries?.length ? (
        <p className="text-zinc-500 py-12 text-center">尚無諮詢紀錄。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {inquiries.map(inq => {
            const next = NEXT_STATUS[inq.status as InquiryStatus]
            return (
              <div key={inq.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[inq.status as InquiryStatus]}`}>
                        {inq.status}
                      </span>
                      <span className="text-white font-semibold">{inq.customer_name}</span>
                      <span className="text-zinc-500 text-sm">·</span>
                      <a href={`mailto:${inq.email}`} className="text-sm text-indigo-400 hover:underline">{inq.email}</a>
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">
                      {inq.project_type} ·{' '}
                      {new Date(inq.created_at!).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
                    </p>
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">{inq.message}</p>
                  </div>

                  {next && (
                    <form action={async () => { 'use server'; await updateInquiryStatus(inq.id, next) }}>
                      <button type="submit"
                        className="shrink-0 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:border-indigo-500 hover:text-white transition-colors">
                        {NEXT_LABEL[inq.status as InquiryStatus]}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
