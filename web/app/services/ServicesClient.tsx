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
        <Loader2 className="animate-spin text-indigo-400" size={32} />
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
            className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Icon size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">{service.title}</h3>
            <p className="text-sm text-zinc-400">{service.description}</p>
            {service.base_price !== null && (
              <p className="mt-auto pt-2 text-sm font-semibold text-indigo-300">
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
    <main className="min-h-screen bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-12 text-3xl font-extrabold text-white sm:text-4xl">服務項目</h1>
        <ErrorBoundary>
          <ServicesList />
        </ErrorBoundary>
      </div>
    </main>
  )
}
