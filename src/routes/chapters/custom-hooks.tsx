import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/custom-hooks')({ component: Chapter15 })

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable
    }
  }, [key, value])

  return [value, setValue] as const
}

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  const toggle = useCallback(() => setOn((v) => !v), [])
  const setTrue = useCallback(() => setOn(true), [])
  const setFalse = useCallback(() => setOn(false), [])
  return { on, toggle, setTrue, setFalse } as const
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('workshop-name', '')
  const [count, setCount] = useLocalStorage('workshop-count', 0)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Your name (persists across refreshes):
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Increment
        </button>
        <span className="text-gray-300">
          Persisted count: <span className="text-cyan-400 font-mono">{count}</span>
        </span>
        <button
          onClick={() => {
            setName('')
            setCount(0)
          }}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors ml-auto"
        >
          Reset All
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Try refreshing the page -- the values persist via localStorage.
      </p>
    </div>
  )
}

function WindowSizeDemo() {
  const { width, height } = useWindowSize()

  const breakpoint =
    width >= 1280
      ? 'xl'
      : width >= 1024
        ? 'lg'
        : width >= 768
          ? 'md'
          : width >= 640
            ? 'sm'
            : 'xs'

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-8 justify-center">
        <div className="text-center">
          <p className="text-3xl font-mono text-cyan-400">{width}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Width</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-mono text-cyan-400">{height}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Height</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-mono text-yellow-400">{breakpoint}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Breakpoint
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">
        The same useWindowSize hook from Chapter 8, extracted into a reusable custom hook.
      </p>
    </div>
  )
}

function ToggleDemo() {
  const modal = useToggle()
  const darkMode = useToggle(true)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-4">
        <button
          onClick={modal.toggle}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          {modal.on ? 'Hide' : 'Show'} Panel
        </button>
        <button
          onClick={darkMode.toggle}
          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            darkMode.on
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {darkMode.on ? 'Light' : 'Dark'} mode
        </button>
      </div>
      {modal.on && (
        <div
          className={`rounded-lg p-4 border transition-colors ${
            darkMode.on
              ? 'bg-gray-800 border-gray-700 text-gray-300'
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        >
          <p>This panel is controlled by useToggle.</p>
          <button
            onClick={modal.setFalse}
            className="mt-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            Close with setFalse()
          </button>
        </div>
      )}
    </div>
  )
}

function DebounceDemo() {
  const [text, setText] = useState('')
  const debouncedText = useDebounce(text, 500)
  const [searchCount, setSearchCount] = useState(0)

  useEffect(() => {
    if (debouncedText) {
      setSearchCount((c) => c + 1)
    }
  }, [debouncedText])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type quickly... search fires after 500ms pause"
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
      />
      <div className="text-sm space-y-1">
        <p className="text-gray-400">
          Raw value: <span className="text-white font-mono">"{text}"</span>
        </p>
        <p className="text-gray-400">
          Debounced: <span className="text-cyan-400 font-mono">"{debouncedText}"</span>
        </p>
        <p className="text-gray-400">
          "Search" triggered: <span className="text-cyan-400">{searchCount}</span> times
        </p>
      </div>
    </div>
  )
}

function Chapter15() {
  return (
    <ChapterLayout slug="custom-hooks">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">useLocalStorage</h3>
          <p className="text-gray-300 mb-3">
            A custom hook that syncs state with localStorage:
          </p>
          <LocalStorageDemo />
          <CodeBlock title="useLocalStorage" code={`function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

// Usage
const [name, setName] = useLocalStorage('name', '')`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useWindowSize</h3>
          <p className="text-gray-300 mb-3">
            Encapsulate the resize listener in a reusable hook:
          </p>
          <WindowSizeDemo />
          <CodeBlock title="useWindowSize" code={`function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

const { width, height } = useWindowSize()`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useToggle</h3>
          <p className="text-gray-300 mb-3">
            A simple hook that provides toggle, setTrue, and setFalse:
          </p>
          <ToggleDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">useDebounce</h3>
          <p className="text-gray-300 mb-3">
            Delay a value update until the user stops typing:
          </p>
          <DebounceDemo />
          <CodeBlock title="useDebounce" code={`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage: fires "search" 500ms after user stops typing
const [text, setText] = useState('')
const debouncedText = useDebounce(text, 500)`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
