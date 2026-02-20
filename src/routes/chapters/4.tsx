import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/4')({ component: Chapter4 })

function ClickDemo() {
  const [clicks, setClicks] = useState(0)
  const [lastEvent, setLastEvent] = useState<string | null>(null)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            setClicks((c) => c + 1)
            setLastEvent(`click at (${e.clientX}, ${e.clientY})`)
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium"
        >
          Click me
        </button>
        <button
          onDoubleClick={() => {
            setClicks(0)
            setLastEvent('double-click (reset)')
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
        >
          Double-click to reset
        </button>
      </div>
      <div className="text-sm text-gray-400 space-y-1">
        <p>Clicks: <span className="text-cyan-400">{clicks}</span></p>
        {lastEvent && (
          <p>Last event: <span className="text-cyan-400">{lastEvent}</span></p>
        )}
      </div>
    </div>
  )
}

function KeyboardDemo() {
  const [keys, setKeys] = useState<string[]>([])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <input
        onKeyDown={(e) => {
          setKeys((prev) => [...prev.slice(-9), e.key])
        }}
        placeholder="Type here to see key events..."
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
      />
      <div className="flex flex-wrap gap-2">
        {keys.map((key, i) => (
          <span
            key={`${key}-${i}`}
            className="px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-cyan-400 font-mono"
          >
            {key}
          </span>
        ))}
        {keys.length === 0 && (
          <span className="text-gray-500 text-sm">No keys pressed yet</span>
        )}
      </div>
    </div>
  )
}

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(false)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setPos({
            x: Math.round(e.clientX - rect.left),
            y: Math.round(e.clientY - rect.top),
          })
        }}
        onMouseEnter={() => setIsInside(true)}
        onMouseLeave={() => setIsInside(false)}
        className="h-40 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center relative"
      >
        {isInside ? (
          <span className="text-cyan-400 font-mono text-lg">
            ({pos.x}, {pos.y})
          </span>
        ) : (
          <span className="text-gray-500">Move your mouse here</span>
        )}
      </div>
    </div>
  )
}

function Chapter4() {
  return (
    <ChapterLayout chapterNumber={4}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Click Events</h3>
          <p className="text-gray-300 mb-3">
            onClick and onDoubleClick handlers with access to the event object:
          </p>
          <ClickDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Keyboard Events</h3>
          <p className="text-gray-300 mb-3">
            onKeyDown captures each keystroke and displays the last 10 keys:
          </p>
          <KeyboardDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Mouse Tracking</h3>
          <p className="text-gray-300 mb-3">
            onMouseMove, onMouseEnter, and onMouseLeave in action:
          </p>
          <MouseTracker />
        </div>
      </div>
    </ChapterLayout>
  )
}
