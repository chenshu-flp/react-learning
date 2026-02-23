import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/conditional-rendering')({ component: Chapter5 })

function TernaryDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            isLoggedIn
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoggedIn ? 'Log Out' : 'Log In'}
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-white">Welcome back, User!</p>
              <p className="text-sm text-gray-400">You have 3 new notifications</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Please log in to see your profile.</p>
        )}
      </div>
    </div>
  )
}

function LogicalAndDemo() {
  const [notifications, setNotifications] = useState(3)
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-3">
        <button
          onClick={() => setNotifications((n) => n + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Add notification
        </button>
        <button
          onClick={() => setNotifications(0)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
        >
          Clear all
        </button>
        <button
          onClick={() => setShowBanner(!showBanner)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
        >
          Toggle banner
        </button>
      </div>
      <div className="space-y-2">
        {notifications > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg px-4 py-2 text-sm">
            You have {notifications} unread notification{notifications !== 1 && 's'}
          </div>
        )}
        {showBanner && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-lg px-4 py-2 text-sm">
            This banner is conditionally rendered with &&
          </div>
        )}
        {notifications === 0 && !showBanner && (
          <p className="text-gray-500 text-sm">Nothing to show -- both conditions are false.</p>
        )}
      </div>
    </div>
  )
}

function EarlyReturnDemo() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading')

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2">
        {(['loading', 'error', 'success'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              status === s
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <StatusDisplay status={status} />
      </div>
    </div>
  )
}

function StatusDisplay({ status }: { status: 'loading' | 'error' | 'success' }) {
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 text-yellow-400">
        <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <span>Loading data...</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-red-400">
        <p className="font-semibold">Something went wrong!</p>
        <p className="text-sm mt-1">Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="text-green-400">
      <p className="font-semibold">Data loaded successfully!</p>
      <p className="text-sm mt-1">Everything is working as expected.</p>
    </div>
  )
}

function Chapter5() {
  return (
    <ChapterLayout slug="conditional-rendering">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Ternary Operator</h3>
          <p className="text-gray-300 mb-3">
            Use <code className="text-cyan-400">condition ? A : B</code> to render
            one of two branches:
          </p>
          <TernaryDemo />
          <CodeBlock title="Ternary Operator" code={`const [isLoggedIn, setIsLoggedIn] = useState(false)

return (
  <div>
    <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
      {isLoggedIn ? 'Log Out' : 'Log In'}
    </button>
    {isLoggedIn ? (
      <p>Welcome back, User!</p>
    ) : (
      <p>Please log in to see your profile.</p>
    )}
  </div>
)`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Logical && Operator</h3>
          <p className="text-gray-300 mb-3">
            Use <code className="text-cyan-400">condition && &lt;Element /&gt;</code> to
            render something only when the condition is true:
          </p>
          <LogicalAndDemo />
          <CodeBlock title="Logical && Operator" code={`{notifications > 0 && (
  <div>You have {notifications} unread notifications</div>
)}

{showBanner && (
  <div>This banner is conditionally rendered with &&</div>
)}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Early Return Pattern</h3>
          <p className="text-gray-300 mb-3">
            Return different JSX early based on state -- useful for loading, error,
            and success states:
          </p>
          <EarlyReturnDemo />
          <CodeBlock title="Early Return Pattern" code={`function StatusDisplay({ status }: { status: 'loading' | 'error' | 'success' }) {
  if (status === 'loading') {
    return <div>Loading data...</div>
  }

  if (status === 'error') {
    return <div>Something went wrong!</div>
  }

  return <div>Data loaded successfully!</div>
}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
