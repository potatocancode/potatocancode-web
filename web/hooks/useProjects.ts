'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Project, ProjectCategory } from '@/lib/supabase/types'

export function useProjects(category?: ProjectCategory) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true)
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setProjects(data ?? [])
      }
      setLoading(false)
    }

    fetchProjects()
  }, [category])

  return { projects, loading, error }
}
