'use client'

import { Trash2 } from 'lucide-react'
import { deleteProject } from '../actions'

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form action={deleteProject.bind(null, id)}>
      <button
        type="submit"
        className="p-2 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400 transition-colors"
        onClick={(e) => { if (!confirm(`確定刪除「${title}」？`)) e.preventDefault() }}
      >
        <Trash2 size={14} />
      </button>
    </form>
  )
}
