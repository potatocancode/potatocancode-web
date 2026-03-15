import type { Metadata } from 'next'
import PortfolioClient from './PortfolioClient'

export const metadata: Metadata = {
  title: '作品集',
  description: '客製化網頁、React Native App 與 C++ 系統程式專案展示。',
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
