import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback, memo } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/memoization')({ component: Chapter16 })

function ExpensiveComputationDemo() {
  const [number, setNumber] = useState(30)
  const [dark, setDark] = useState(false)

  const fib = useMemo(() => {
    const compute = (n: number): number => {
      if (n <= 1) return n
      return compute(n - 1) + compute(n - 2)
    }
    const start = performance.now()
    const result = compute(number)
    const duration = performance.now() - start
    return { result, duration: duration.toFixed(2) }
  }, [number])

  return (
    <div
      className={`rounded-lg p-6 space-y-4 transition-colors ${
        dark ? 'bg-gray-950' : 'bg-gray-900'
      }`}
    >
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">
          Fibonacci(n):
          <input
            type="range"
            min={1}
            max={42}
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="ml-2 align-middle"
          />
          <span className="text-cyan-400 font-mono ml-2">{number}</span>
        </label>
        <button
          onClick={() => setDark((d) => !d)}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors ml-auto"
        >
          Toggle background
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 space-y-2">
        <p className="text-gray-300">
          Result: <span className="text-cyan-400 font-mono text-lg">{fib.result.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-500">
          Computed in <span className="text-yellow-400">{fib.duration}ms</span>
        </p>
      </div>
      <p className="text-sm text-gray-500">
        Toggling the background doesn't recompute fibonacci because
        useMemo's dependency array only includes the number.
      </p>
    </div>
  )
}

const ChildButton = memo(function ChildButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  const renderTime = new Date().toLocaleTimeString()

  return (
    <div className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
      <button
        onClick={onClick}
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
      >
        {label}
      </button>
      <span className="text-xs text-gray-500 font-mono">
        rendered at {renderTime}
      </span>
    </div>
  )
})

function CallbackDemo() {
  const [countA, setCountA] = useState(0)
  const [countB, setCountB] = useState(0)
  const [other, setOther] = useState(0)

  const incrementA = useCallback(() => setCountA((c) => c + 1), [])
  const incrementB = useCallback(() => setCountB((c) => c + 1), [])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <ChildButton onClick={incrementA} label={`A: ${countA}`} />
        <ChildButton onClick={incrementB} label={`B: ${countB}`} />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOther((o) => o + 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
        >
          Re-render parent (other: {other})
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Click "Re-render parent" -- notice the child buttons' render timestamps
        don't change because their callbacks are stable (useCallback) and they're
        wrapped in memo().
      </p>
    </div>
  )
}

function FilteredListDemo() {
  const [search, setSearch] = useState('')
  const [items] = useState(() =>
    Array.from({ length: 5000 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1} - ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i % 5]}`,
    })),
  )

  const filtered = useMemo(() => {
    if (!search) return items.slice(0, 50)
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      )
      .slice(0, 50)
  }, [items, search])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search 5,000 items (shows first 50 matches)..."
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
      />
      <p className="text-sm text-gray-500">
        Showing {filtered.length} of {items.length} items
        {search && ` matching "${search}"`}
      </p>
      <div className="max-h-48 overflow-y-auto space-y-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded px-3 py-1.5 text-sm text-gray-300"
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}

function Chapter16() {
  return (
    <ChapterLayout slug="memoization">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">useMemo: Expensive Computation</h3>
          <p className="text-gray-300 mb-3">
            useMemo caches the result of an expensive calculation and only
            recomputes when dependencies change:
          </p>
          <ExpensiveComputationDemo />
          <CodeBlock title="useMemo" code={`const [count, setCount] = useState(30)
const [color, setColor] = useState('cyan')

// Only recomputes when count changes, not when color changes
const fibonacci = useMemo(() => {
  function fib(n: number): number {
    if (n <= 1) return n
    return fib(n - 1) + fib(n - 2)
  }
  return fib(count)
}, [count])`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useCallback + memo</h3>
          <p className="text-gray-300 mb-3">
            useCallback stabilizes function references so memo'd children
            don't re-render unnecessarily:
          </p>
          <CallbackDemo />
          <CodeBlock title="useCallback + React.memo" code={`const ChildButton = memo(function ChildButton({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  console.log(\`\${label} rendered\`)  // won't re-log if onClick is stable
  return <button onClick={onClick}>{label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)

  // Without useCallback: new function every render → child re-renders
  // With useCallback: same function reference → child skips re-render
  const handleClick = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  return <ChildButton onClick={handleClick} label="Increment" />
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useMemo: Filtered List</h3>
          <p className="text-gray-300 mb-3">
            Memoize a filtered/sorted list to avoid recalculating on unrelated
            state changes:
          </p>
          <FilteredListDemo />
          <CodeBlock title="Memoized Filtered List" code={`const [search, setSearch] = useState('')
const [items] = useState(() =>
  Array.from({ length: 5000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }))
)

// Only recomputes when items or search changes
const filtered = useMemo(() => {
  if (!search) return items.slice(0, 50)
  return items
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 50)
}, [items, search])`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
