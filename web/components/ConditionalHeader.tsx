'use client'

import { usePathname } from 'next/navigation'
import Logo from '@/components/Logo'

export default function ConditionalHeader() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return (
    <header className="fixed top-0 left-0 z-50 px-6 py-4">
      <Logo />
    </header>
  )
}
