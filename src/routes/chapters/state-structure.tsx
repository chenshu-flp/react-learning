import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/state-structure')({ component: Chapter10 })

function RedundantStateDemo() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showRedundant, setShowRedundant] = useState(true)
  const [redundantFullName, setRedundantFullName] = useState('')

  const derivedFullName = `${firstName} ${lastName}`.trim()

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setShowRedundant(true)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            showRedundant ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          Redundant (bad)
        </button>
        <button
          onClick={() => setShowRedundant(false)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            !showRedundant ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          Derived (good)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First name</label>
          <input
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value)
              if (showRedundant) {
                setRedundantFullName(`${e.target.value} ${lastName}`)
              }
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Last name</label>
          <input
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value)
              if (showRedundant) {
                setRedundantFullName(`${firstName} ${e.target.value}`)
              }
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      </div>

      <div className={`rounded-lg p-4 border ${showRedundant ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}>
        {showRedundant ? (
          <div>
            <p className="text-xs text-red-400 uppercase tracking-wider mb-1">
              Redundant state (3 useState calls)
            </p>
            <p className="text-white">
              Full name: <span className="font-semibold">{redundantFullName || '(empty)'}</span>
            </p>
            <p className="text-xs text-red-300/70 mt-2">
              fullName is stored separately and must be manually kept in sync with firstName and lastName.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-1">
              Derived value (2 useState calls)
            </p>
            <p className="text-white">
              Full name: <span className="font-semibold">{derivedFullName || '(empty)'}</span>
            </p>
            <p className="text-xs text-green-300/70 mt-2">
              fullName is computed during render: const fullName = firstName + " " + lastName
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function GroupRelatedStateDemo() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setPosition({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          })
        }}
        className="h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 relative overflow-hidden cursor-crosshair"
      >
        <div
          className="absolute w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
          style={{ left: position.x, top: position.y }}
        />
        <div className="absolute bottom-2 right-3 text-xs text-gray-500 font-mono">
          ({position.x}, {position.y})
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-3 text-sm space-y-2">
        <div className="flex gap-3 items-start">
          <span className="text-green-400 flex-shrink-0">&#10003;</span>
          <p className="text-gray-300">
            <code className="text-cyan-400">{'{ x, y }'}</code> grouped in one state object
            because they always change together
          </p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-red-400 flex-shrink-0">&times;</span>
          <p className="text-gray-300">
            Separate <code className="text-cyan-400">useState(x)</code> and{' '}
            <code className="text-cyan-400">useState(y)</code> would work but is
            harder to keep in sync
          </p>
        </div>
      </div>
    </div>
  )
}

function AvoidContradictionDemo() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [text, setText] = useState('')

  const handleSend = () => {
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1500)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="space-y-3">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (status === 'sent') setStatus('idle')
          }}
          disabled={status === 'sending'}
          placeholder="Type a message..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={status === 'sending' || text.length === 0}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors text-sm font-medium"
        >
          {status === 'sending' ? 'Sending...' : 'Send'}
        </button>
        {status === 'sent' && (
          <p className="text-green-400 text-sm">Message sent!</p>
        )}
      </div>
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Single status instead of isSending + isSent booleans
        </p>
        <div className="flex gap-2">
          {(['idle', 'sending', 'sent'] as const).map((s) => (
            <span
              key={s}
              className={`px-2 py-1 rounded text-xs font-mono ${
                status === s
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-gray-700 text-gray-500'
              }`}
            >
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Using separate isSending and isSent booleans could lead to an
          impossible state where both are true simultaneously.
        </p>
      </div>
    </div>
  )
}

function Chapter10() {
  return (
    <ChapterLayout slug="state-structure">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Avoid Redundant State</h3>
          <p className="text-gray-300 mb-3">
            If you can calculate a value from existing state, don't store it in
            another useState. Derive it during render instead:
          </p>
          <RedundantStateDemo />
          <CodeBlock title="Redundant vs Derived State" code={`// BAD: redundant state — fullName must be manually synced
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // redundant!

function handleFirstNameChange(e) {
  setFirstName(e.target.value)
  setFullName(e.target.value + ' ' + lastName)  // easy to forget
}

// GOOD: derived value — calculated during render
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')

const fullName = firstName + ' ' + lastName  // always in sync`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Group Related State</h3>
          <p className="text-gray-300 mb-3">
            When two state variables always change together, merge them into a
            single state object:
          </p>
          <GroupRelatedStateDemo />
          <CodeBlock title="Group Related State" code={`// GOOD: x and y always change together — group them
const [position, setPosition] = useState({ x: 0, y: 0 })

onMouseMove={(e) => {
  setPosition({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  })
}}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Avoid Contradictions</h3>
          <p className="text-gray-300 mb-3">
            Use a single status enum instead of multiple booleans that could
            contradict each other:
          </p>
          <AvoidContradictionDemo />
          <CodeBlock title="Status Enum vs Boolean Flags" code={`// BAD: two booleans can contradict (both true at once!)
const [isSending, setIsSending] = useState(false)
const [isSent, setIsSent] = useState(false)

// GOOD: single status — impossible states are impossible
const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

<button disabled={status === 'sending'}>
  {status === 'sending' ? 'Sending...' : 'Send'}
</button>
{status === 'sent' && <p>Message sent!</p>}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
