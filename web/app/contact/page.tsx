import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: '聯絡諮詢',
  description: '填寫需求描述，我將在 24 小時內與您聯繫。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white px-6 pt-28 pb-20">
      <div className="mx-auto max-w-xl">
        <h1
          className="mb-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          聯絡諮詢
        </h1>
        <p className="mb-10 text-black/50">填寫需求描述，我將在 24 小時內與您聯繫。</p>
        <ContactForm />
      </div>
    </main>
  )
}
