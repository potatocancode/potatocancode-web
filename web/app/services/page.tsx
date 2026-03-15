import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'

export const metadata: Metadata = {
  title: '服務項目',
  description: '客製化 App 開發、Next.js 網頁、C++ 系統程式等全方位開發服務。',
}

export default function ServicesPage() {
  return <ServicesClient />
}
