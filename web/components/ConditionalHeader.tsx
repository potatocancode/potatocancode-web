'use client'

import { usePathname } from 'next/navigation'
import SiteNav from '@/components/SiteNav'

export default function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <SiteNav />
}
