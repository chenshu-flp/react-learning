import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/use-effect')({ component: ChapterUseEffect })

interface User {
  id: number
  name: string
  email: string
  phone: string
}

function FetchDemo() {
  const [userId, setUserId] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchUser() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`,
          { signal: controller.signal },
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setUser(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchUser()
    return () => controller.abort()
  }, [userId])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              userId === id
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            User {id}
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
        {loading && <p className="text-gray-400 text-sm animate-pulse">Loading...</p>}
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        {!loading && !error && user && (
          <div className="text-sm space-y-1 w-full">
            <p className="text-white font-semibold">{user.name}</p>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-500">{user.phone}</p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Click users rapidly — the AbortController cancels in-flight requests so stale
        responses never overwrite the current one.
      </p>
    </div>
  )
}

function DependencyArrayDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const renderCountRef = useRef(0)
  const [logs, setLogs] = useState<string[]>([])

  const [mode, setMode] = useState<'every' | 'mount' | 'deps'>('deps')

  renderCountRef.current += 1

  useEffect(() => {
    const entry = `[render #${renderCountRef.current}] Effect fired (mode: ${mode})`
    setLogs((prev) => [...prev.slice(-6), entry])

    return () => {
      // cleanup logged on next fire
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, mode === 'every' ? undefined : mode === 'mount' ? [] : [count])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {([
          ['every', 'No array (every render)'],
          ['mount', '[] (mount only)'],
          ['deps', '[count] (when count changes)'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => { setMode(value); setLogs([]) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === value
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          count: {count}
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here (triggers re-render)..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
      </div>

      <div className="bg-gray-800 rounded-lg p-4 min-h-[120px]">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Effect log</p>
        {logs.length === 0 ? (
          <p className="text-gray-600 text-xs">Interact with the controls above...</p>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <p key={i} className="text-xs font-mono text-cyan-400">{log}</p>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">
        {mode === 'every' && 'No dependency array — the effect runs after every render. Typing in the input also triggers it.'}
        {mode === 'mount' && 'Empty array — the effect ran once on mount. Neither button nor input triggers it again.'}
        {mode === 'deps' && 'The effect only fires when count changes. Typing in the input causes a re-render but does NOT trigger the effect.'}
      </p>
    </div>
  )
}

function AntiPatternDemo() {
  const [firstName, setFirstName] = useState('Jane')
  const [lastName, setLastName] = useState('Doe')

  const [fullNameBad, setFullNameBad] = useState('')
  useEffect(() => {
    setFullNameBad(`${firstName} ${lastName}`)
  }, [firstName, lastName])

  const fullNameGood = `${firstName} ${lastName}`

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-xs text-red-400 uppercase tracking-wider mb-1 font-semibold">Bad: derived via useEffect</p>
          <p className="text-white font-mono text-sm">{fullNameBad}</p>
          <p className="text-xs text-gray-500 mt-2">
            Causes an extra render cycle — state is set <em>after</em> the initial render, then triggers a second render.
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-xs text-green-400 uppercase tracking-wider mb-1 font-semibold">Good: computed during render</p>
          <p className="text-white font-mono text-sm">{fullNameGood}</p>
          <p className="text-xs text-gray-500 mt-2">
            No extra state, no extra render. The value is always in sync by construction.
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        If a value can be computed from existing state or props, just calculate it during render.
        Don't synchronize it with useEffect — that's an unnecessary render cycle.
      </p>
    </div>
  )
}

function useConnectionLog() {
  const logsRef = useRef<string[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (msg: string) => {
    logsRef.current = [...logsRef.current, msg]
    setLogs([...logsRef.current])
  }

  const clearLogs = () => {
    logsRef.current = []
    setLogs([])
  }

  return { logs, addLog, clearLogs }
}

function ChatRoomBroken({ room, onLog }: { room: string; onLog: (msg: string) => void }) {
  useEffect(() => {
    onLog(`▶ Connected to ${room}`)
    // BUG: no cleanup — connection is never closed!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room])

  return (
    <p className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3 text-center">
      Chatting in <strong>{room}</strong>
    </p>
  )
}

function ChatRoomFixed({ room, onLog }: { room: string; onLog: (msg: string) => void }) {
  useEffect(() => {
    onLog(`▶ Connected to ${room}`)
    return () => {
      onLog(`◼ Disconnected from ${room}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room])

  return (
    <p className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3 text-center">
      Chatting in <strong>{room}</strong>
    </p>
  )
}

function StrictModeDemo() {
  const rooms = ['#general', '#random', '#react']
  const [room, setRoom] = useState(rooms[0])
  const [mounted, setMounted] = useState(false)

  const broken = useConnectionLog()
  const fixed = useConnectionLog()

  const handleToggle = () => {
    if (mounted) {
      broken.clearLogs()
      fixed.clearLogs()
    }
    setMounted(!mounted)
  }

  const activeConnections = (logs: string[]) => {
    let count = 0
    for (const log of logs) {
      if (log.startsWith('▶')) count++
      if (log.startsWith('◼')) count--
    }
    return count
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-3 items-center flex-wrap">
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mounted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {mounted ? 'Leave chat' : 'Join chat'}
        </button>
        {mounted && rooms.map((r) => (
          <button
            key={r}
            onClick={() => setRoom(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              room === r
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">Without cleanup (buggy)</p>
            {mounted && (
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                {activeConnections(broken.logs)} open connection{activeConnections(broken.logs) !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {mounted && <ChatRoomBroken room={room} onLog={broken.addLog} />}
          <div className="bg-gray-800 rounded-lg p-3 min-h-[120px]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Connection log</p>
            {broken.logs.length === 0 ? (
              <p className="text-gray-600 text-xs">Join chat to see connections...</p>
            ) : (
              <div className="space-y-1">
                {broken.logs.map((log, i) => (
                  <p key={i} className={`text-xs font-mono ${log.startsWith('▶') ? 'text-green-400' : 'text-red-400'}`}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-green-400 uppercase tracking-wider font-semibold">With cleanup (correct)</p>
            {mounted && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                {activeConnections(fixed.logs)} open connection{activeConnections(fixed.logs) !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {mounted && <ChatRoomFixed room={room} onLog={fixed.addLog} />}
          <div className="bg-gray-800 rounded-lg p-3 min-h-[120px]">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Connection log</p>
            {fixed.logs.length === 0 ? (
              <p className="text-gray-600 text-xs">Join chat to see connections...</p>
            ) : (
              <div className="space-y-1">
                {fixed.logs.map((log, i) => (
                  <p key={i} className={`text-xs font-mono ${log.startsWith('▶') ? 'text-green-400' : 'text-red-400'}`}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 space-y-2">
        <p className="text-sm text-gray-300">
          In development, <strong>Strict Mode</strong> runs{' '}
          <strong className="text-yellow-400">setup → cleanup → setup</strong> on mount.
        </p>
        <p className="text-sm text-gray-300">
          The <strong className="text-red-400">buggy version</strong> opens two connections
          (setup fires twice, nothing cleans up). The{' '}
          <strong className="text-green-400">correct version</strong> ends up with exactly one —
          the first is cleaned up before the second opens.
          Try switching rooms to see the difference compound.
        </p>
      </div>
    </div>
  )
}

function ChapterUseEffect() {
  return (
    <ChapterLayout slug="use-effect">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Data Fetching</h3>
          <p className="text-gray-300 mb-3">
            The most common real-world use of useEffect. This demo fetches user data
            and uses an <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">AbortController</code> in
            the cleanup function to cancel in-flight requests when the selected user changes,
            preventing stale responses from overwriting current data.
          </p>
          <FetchDemo />
          <CodeBlock title="Data Fetching with Cleanup" code={`useEffect(() => {
  const controller = new AbortController()

  async function fetchUser() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(\`/api/users/\${userId}\`, {
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      const data = await res.json()
      setUser(data)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  fetchUser()
  return () => controller.abort()  // cancel in-flight request
}, [userId])

// Note: useEffect callbacks must be synchronous (they return
// a cleanup function, not a Promise). Define an async function
// inside the effect and call it immediately.`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">The Dependency Array</h3>
          <p className="text-gray-300 mb-3">
            The dependency array controls <em>when</em> the effect re-runs. Toggle between
            the three modes and interact with the controls to see the difference:
          </p>
          <DependencyArrayDemo />
          <CodeBlock title="Dependency Array Variants" code={`// 1. No array — runs after EVERY render
useEffect(() => {
  console.log('I run on every render')
})

// 2. Empty array — runs ONCE on mount, cleanup on unmount
useEffect(() => {
  console.log('I run once')
  return () => console.log('I clean up on unmount')
}, [])

// 3. With dependencies — runs when any dependency changes
useEffect(() => {
  console.log(\`count changed to \${count}\`)
  return () => console.log('cleaning up previous effect')
}, [count])`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">You Might Not Need an Effect</h3>
          <p className="text-gray-300 mb-3">
            A common anti-pattern is using useEffect to "sync" derived values. If a value
            can be computed from existing state or props, just compute it during render.
          </p>
          <AntiPatternDemo />
          <CodeBlock title="Deriving State: Bad vs Good" code={`// BAD: useEffect to sync derived state
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`)
}, [firstName, lastName])
// Problem: causes an extra render cycle every time

// GOOD: compute during render
const fullName = \`\${firstName} \${lastName}\`
// Always correct, no extra renders, no effect needed`} />
          <div className="mt-4 bg-gray-900 rounded-lg p-5">
            <h4 className="text-md font-semibold text-cyan-400 mb-3">Other Common Anti-Patterns</h4>
            <ul className="text-sm text-gray-400 space-y-3 ml-4 list-disc">
              <li>
                <strong className="text-gray-300">Resetting state when a prop changes</strong> — instead
                of using an effect to call <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">setState</code> when
                a prop changes, give the component a
                different <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">key</code> to
                force React to remount it with fresh state.
              </li>
              <li>
                <strong className="text-gray-300">Responding to user events</strong> — if something should
                happen when a user clicks a button, put that logic in the click handler. Don't set
                state in the handler and then react to it in an effect — that's an unnecessary
                indirection.
              </li>
              <li>
                <strong className="text-gray-300">Transforming data for display</strong> — filtering or
                sorting a list doesn't need an effect. Compute the filtered/sorted array during
                render (and memoize it with <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">useMemo</code> if
                it's expensive).
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Strict Mode Double-Invocation</h3>
          <p className="text-gray-300 mb-3">
            In development, React's Strict Mode intentionally runs your effects twice
            (setup → cleanup → setup) to surface missing cleanup. The demo below
            simulates a chat room connection — join the chat and switch rooms to see
            how the buggy version leaks connections while the correct version stays clean:
          </p>
          <StrictModeDemo />
          <CodeBlock title="Why Strict Mode Runs Effects Twice" code={`// BUG: no cleanup — Strict Mode exposes the leak
useEffect(() => {
  const ws = new WebSocket(\`wss://chat.example.com/\${room}\`)
  ws.onmessage = (e) => setMessages((m) => [...m, e.data])
  // Strict Mode: setup runs twice → 2 open connections!
}, [room])

// CORRECT: cleanup closes the connection
useEffect(() => {
  const ws = new WebSocket(\`wss://chat.example.com/\${room}\`)
  ws.onmessage = (e) => setMessages((m) => [...m, e.data])
  return () => ws.close()
  // Strict Mode: setup → cleanup → setup → 1 connection
}, [room])

// In development, React simulates unmount + remount on every mount.
// If your effect works correctly after this cycle, it handles
// real unmounts (route changes, conditional rendering) correctly too.
// In production, the effect runs only once per mount.`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
