import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: '聯絡諮詢',
  description: '填寫需求描述，我將在 24 小時內與您聯繫。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">聯絡諮詢</h1>
        <p className="mb-10 text-zinc-400">填寫需求描述，我將在 24 小時內與您聯繫。</p>
        <ContactForm />
      </div>
    </main>
  )
}
