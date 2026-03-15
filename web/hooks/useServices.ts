'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Service } from '@/lib/supabase/types'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setServices(data ?? [])
      }
      setLoading(false)
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}
