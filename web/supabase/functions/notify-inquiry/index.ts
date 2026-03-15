import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

interface InquiryPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    customer_name: string
    email: string
    project_type: string
    message: string
    status: string
    created_at: string
  }
}

serve(async (req: Request) => {
  try {
    const payload: InquiryPayload = await req.json()
    const { record } = payload

    // Only handle INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 })
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const notifyEmail = Deno.env.get('NOTIFY_EMAIL')

    if (!resendApiKey || !notifyEmail) {
      throw new Error('Missing RESEND_API_KEY or NOTIFY_EMAIL environment variables')
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #4f46e5;">📬 新諮詢通知 — PotatoCan Studio</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; color: #6b7280; width: 120px;">姓名</td>
            <td style="padding: 8px 0; font-weight: 600;">${record.customer_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; color: #6b7280;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${record.email}" style="color: #4f46e5;">${record.email}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; color: #6b7280;">需求類型</td>
            <td style="padding: 8px 0;">${record.project_type}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">需求描述</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${record.message}</td>
          </tr>
        </table>
        <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
          送出時間：${new Date(record.created_at).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
          ｜ ID: ${record.id}
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PotatoCan Studio <onboarding@resend.dev>',
        to: [notifyEmail],
        subject: `[新詢問] ${record.customer_name} — ${record.project_type}`,
        html,
        reply_to: record.email,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`Resend API error ${res.status}: ${errBody}`)
    }

    const data = await res.json()
    return new Response(JSON.stringify({ success: true, emailId: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('notify-inquiry error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
