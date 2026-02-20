import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/9')({ component: Chapter9 })

function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-3">
        <input
          ref={inputRef}
          placeholder="Click the button to focus me"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
        <button
          onClick={() => inputRef.current?.focus()}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium text-sm"
        >
          Focus Input
        </button>
        <button
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = ''
              inputRef.current.focus()
            }
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          Clear & Focus
        </button>
      </div>
      <p className="text-sm text-gray-500">
        useRef gives us direct access to the DOM input element, allowing
        imperative actions like .focus() and .value manipulation.
      </p>
    </div>
  )
}

function RenderCountDemo() {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium text-sm"
        >
          Increment ({count})
        </button>
        <div className="text-sm text-gray-400 space-y-1">
          <p>
            State value: <span className="text-cyan-400">{count}</span>
          </p>
          <p>
            Render count: <span className="text-cyan-400">{renderCount.current}</span>
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        renderCount is stored in a ref. Updating it doesn't cause a re-render,
        but it persists across renders (unlike a local variable).
      </p>
    </div>
  )
}

function MeasureDemo() {
  const [text, setText] = useState('Resize me by changing this text!')
  const boxRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect()
      setDimensions({ width: Math.round(rect.width), height: Math.round(rect.height) })
    }
  }, [text])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
      />
      <div
        ref={boxRef}
        className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-300 break-words"
      >
        {text || 'Type something above...'}
      </div>
      <div className="flex gap-6 text-sm">
        <p className="text-gray-400">
          Width: <span className="text-cyan-400 font-mono">{dimensions.width}px</span>
        </p>
        <p className="text-gray-400">
          Height: <span className="text-cyan-400 font-mono">{dimensions.height}px</span>
        </p>
      </div>
    </div>
  )
}

function PreviousValueDemo() {
  const [value, setValue] = useState(0)
  const prevValue = useRef(0)
  const [prev, setPrev] = useState(0)

  useEffect(() => {
    setPrev(prevValue.current)
    prevValue.current = value
  }, [value])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setValue((v) => v - 5)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          -5
        </button>
        <button
          onClick={() => setValue((v) => v - 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium text-sm"
        >
          -1
        </button>
        <button
          onClick={() => setValue((v) => v + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium text-sm"
        >
          +1
        </button>
        <button
          onClick={() => setValue((v) => v + 5)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium text-sm"
        >
          +5
        </button>
      </div>
      <div className="flex gap-8 justify-center text-center">
        <div>
          <p className="text-3xl font-mono text-gray-500">{prev}</p>
          <p className="text-xs text-gray-600 uppercase tracking-wider">Previous</p>
        </div>
        <div>
          <p className="text-3xl font-mono text-cyan-400">{value}</p>
          <p className="text-xs text-gray-600 uppercase tracking-wider">Current</p>
        </div>
        <div>
          <p className="text-3xl font-mono text-gray-400">
            {value - prev > 0 ? '+' : ''}
            {value - prev}
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wider">Delta</p>
        </div>
      </div>
    </div>
  )
}

function Chapter9() {
  return (
    <ChapterLayout chapterNumber={9}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Focus Management</h3>
          <p className="text-gray-300 mb-3">
            useRef provides a reference to a DOM element for imperative operations:
          </p>
          <FocusDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Render Count (Persistent Value)</h3>
          <p className="text-gray-300 mb-3">
            Refs persist across renders without causing re-renders when mutated:
          </p>
          <RenderCountDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Measuring DOM Elements</h3>
          <p className="text-gray-300 mb-3">
            Combine refs with useEffect to measure element dimensions:
          </p>
          <MeasureDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Previous Value Pattern</h3>
          <p className="text-gray-300 mb-3">
            Use a ref to remember the previous value after each render:
          </p>
          <PreviousValueDemo />
        </div>
      </div>
    </ChapterLayout>
  )
}
