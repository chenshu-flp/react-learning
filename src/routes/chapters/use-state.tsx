import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/use-state')({ component: Chapter3 })

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

function Chapter3() {
  return (
    <ChapterLayout slug="use-state">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Counter</h3>
          <p className="text-gray-300 mb-3">
            The simplest use of useState -- a number that increments and decrements:
          </p>
          <Counter />
          <CodeBlock title="Counter" code={`function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>- Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count + 1)}>+ Increment</button>
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Toggle</h3>
          <p className="text-gray-300 mb-3">
            A boolean state toggled between true and false:
          </p>
          <Toggle />
          <CodeBlock title="Toggle" code={`function Toggle() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div>
      <span>Status: {isOn ? 'ON' : 'OFF'}</span>
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
    </div>
  )
}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
