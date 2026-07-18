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
          className="flex flex-col items-center justify-center gap-5 border-4 border-ink bg-pop-red px-8 py-14 text-center shadow-nb"
        >
          <span className="flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-cream text-ink">
            <AlertTriangle size={24} strokeWidth={2.25} />
          </span>
          <div>
            <p
              className="text-[22px] font-bold tracking-[-0.02em] text-ink"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              資料載入失敗
            </p>
            <p className="mt-2 max-w-md text-sm text-ink/70">
              {this.state.error?.message ?? '發生未知錯誤，請稍後再試。'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="nb-press inline-flex cursor-pointer items-center gap-2 border-[3px] border-ink bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-nb"
          >
            <RefreshCw size={15} strokeWidth={2.5} />
            重新載入
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
