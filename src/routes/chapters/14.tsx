import { createFileRoute } from '@tanstack/react-router'
import { Component, useState } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/14')({ component: Chapter14 })

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-400 font-semibold text-lg mb-2">
            Something went wrong
          </p>
          <p className="text-red-300/70 text-sm mb-4">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0)

  if (count === 5) {
    throw new Error('Counter crashed at 5! This is intentional.')
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
      >
        Count: {count}
      </button>
      <span className="text-sm text-gray-500">
        {count < 4
          ? `Crashes at 5 (${5 - count} clicks away)`
          : 'One more click will crash!'}
      </span>
    </div>
  )
}

function SafeComponent() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-green-400 text-sm">
      I'm a safe component. I won't crash regardless of what happens next to me.
    </div>
  )
}

function IsolationDemo() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <p className="text-sm text-gray-400 mb-2">
        Each widget has its own ErrorBoundary. Crashing one doesn't affect the others:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Widget A
          </p>
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Widget B
          </p>
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Widget C (safe)
          </p>
          <ErrorBoundary>
            <SafeComponent />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

function CustomFallbackDemo() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <ErrorBoundary
        fallback={
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 text-center">
            <p className="text-yellow-400 font-semibold mb-1">
              Custom fallback UI
            </p>
            <p className="text-yellow-300/70 text-sm">
              This component had an error, but we're showing a custom message
              instead of the default. Refresh the page to try again.
            </p>
          </div>
        }
      >
        <BuggyCounter />
      </ErrorBoundary>
    </div>
  )
}

function Chapter14() {
  return (
    <ChapterLayout chapterNumber={14}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Error Boundary</h3>
          <p className="text-gray-300 mb-3">
            Click the counter until it reaches 5 -- it will throw an error that
            the ErrorBoundary catches. Click "Try Again" to recover:
          </p>
          <div className="bg-gray-900 rounded-lg p-6">
            <ErrorBoundary>
              <BuggyCounter />
            </ErrorBoundary>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Error Isolation</h3>
          <p className="text-gray-300 mb-3">
            Wrapping each widget in its own boundary prevents one crash from
            taking down the whole UI:
          </p>
          <IsolationDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Custom Fallback UI</h3>
          <p className="text-gray-300 mb-3">
            Pass a custom fallback prop to show a tailored error message:
          </p>
          <CustomFallbackDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Key Points</h3>
          <div className="bg-gray-900 rounded-lg p-6 space-y-3 text-sm text-gray-300">
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>Error boundaries must be class components (no hook equivalent yet)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>They catch errors during rendering, lifecycle methods, and constructors</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>They do NOT catch errors in event handlers (use try/catch for those)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>Place them strategically: around routes, widgets, or individual components</p>
            </div>
          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
