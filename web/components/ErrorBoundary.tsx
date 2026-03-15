'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/30 bg-red-500/10 px-8 py-12 text-center"
        >
          <AlertTriangle className="text-red-400" size={36} />
          <div>
            <p className="text-lg font-semibold text-white">資料載入失敗</p>
            <p className="mt-1 text-sm text-zinc-400">
              {this.state.error?.message ?? '發生未知錯誤，請稍後再試。'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 hover:border-indigo-500 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            重新載入
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
