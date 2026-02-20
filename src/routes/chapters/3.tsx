import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/3')({ component: Chapter3 })

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-center">
      <p className="text-6xl font-bold text-cyan-400 mb-6">{count}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
        >
          - Decrement
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium"
        >
          + Increment
        </button>
      </div>
    </div>
  )
}

function Toggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div className="bg-gray-900 rounded-lg p-6 flex items-center justify-between">
      <span className="text-gray-300">
        Status: <span className={isOn ? 'text-green-400' : 'text-red-400'}>{isOn ? 'ON' : 'OFF'}</span>
      </span>
      <button
        onClick={() => setIsOn(!isOn)}
        className={`w-14 h-7 rounded-full transition-colors relative ${isOn ? 'bg-green-500' : 'bg-gray-600'}`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${isOn ? 'translate-x-8' : 'translate-x-1'}`}
        />
      </button>
    </div>
  )
}

function DerivedState() {
  const [items, setItems] = useState<string[]>(['Apple', 'Banana'])
  const [input, setInput] = useState('')

  const count = items.length
  const hasItems = count > 0

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a fruit..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              setItems([...items, input.trim()])
              setInput('')
            }
          }}
        />
        <button
          onClick={() => {
            if (input.trim()) {
              setItems([...items, input.trim()])
              setInput('')
            }
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Add
        </button>
      </div>
      <div className="text-sm text-gray-400">
        Count: <span className="text-cyan-400">{count}</span> &middot;
        Has items: <span className="text-cyan-400">{hasItems.toString()}</span>
      </div>
      {hasItems && (
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
              <span className="text-gray-300">{item}</span>
              <button
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Chapter3() {
  return (
    <ChapterLayout chapterNumber={3}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Counter</h3>
          <p className="text-gray-300 mb-3">
            The simplest use of useState -- a number that increments and decrements:
          </p>
          <Counter />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Toggle</h3>
          <p className="text-gray-300 mb-3">
            A boolean state toggled between true and false:
          </p>
          <Toggle />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Derived State</h3>
          <p className="text-gray-300 mb-3">
            Values computed from state (count, hasItems) don't need their own
            useState -- they're derived on each render:
          </p>
          <DerivedState />
        </div>
      </div>
    </ChapterLayout>
  )
}
