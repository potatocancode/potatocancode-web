'use client'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useServices } from '@/hooks/useServices'
import { Loader2 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function ServicesList() {
  const { services, loading, error } = useServices()

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-black/40" size={32} />
      </div>
    )
  }

  if (error) {
    throw new Error(error)
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = (LucideIcons[service.icon_name as keyof typeof LucideIcons] as LucideIcon | undefined) ?? LucideIcons.Layers

        return (
          <div
            key={service.id}
            className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-black/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
              <Icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-black">{service.title}</h3>
            <p className="text-sm text-black/50">{service.description}</p>
            {service.base_price !== null && (
              <p className="mt-auto pt-2 text-sm font-semibold text-black">
                起價 NT${service.base_price.toLocaleString()}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ServicesClient() {
  return (
    <main className="min-h-screen bg-white px-6 pt-28 pb-20">
      <div className="mx-auto max-w-5xl">
        <h1
          className="mb-12 text-3xl font-semibold tracking-tight text-black sm:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          服務項目
        </h1>
        <ErrorBoundary>
          <ServicesList />
        </ErrorBoundary>
      </div>
    </main>
  )
}
