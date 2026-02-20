import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/8')({ component: Chapter8 })

function DocumentTitleSync() {
  const [title, setTitle] = useState('React Workshop')

  useEffect(() => {
    const original = document.title
    document.title = title
    return () => {
      document.title = original
    }
  }, [title])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Page title (check your browser tab):
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
      </div>
      <p className="text-sm text-gray-500">
        useEffect syncs the document.title with this input value.
        The cleanup function restores the original title when unmounting.
      </p>
    </div>
  )
}

function TimerWithCleanup() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [running])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <p className="text-5xl font-mono text-center text-cyan-400">
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setRunning(!running)}
          className={`px-4 py-2 rounded-lg transition-colors font-medium ${
            running
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setRunning(false)
            setSeconds(0)
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
        >
          Reset
        </button>
      </div>
      <p className="text-sm text-gray-500 text-center">
        {running
          ? 'The interval is active. Cleanup runs when paused or unmounted.'
          : 'Timer is paused. No interval is running.'}
      </p>
    </div>
  )
}

function WindowResizeTracker() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-2">
      <div className="flex gap-8 justify-center">
        <div className="text-center">
          <p className="text-3xl font-mono text-cyan-400">{size.width}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Width</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-mono text-cyan-400">{size.height}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Height</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 text-center">
        Resize your browser window to see this update.
        The event listener is cleaned up on unmount.
      </p>
    </div>
  )
}

function Chapter8() {
  return (
    <ChapterLayout chapterNumber={8}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Document Title Sync</h3>
          <p className="text-gray-300 mb-3">
            useEffect synchronizes the document title with state. The cleanup
            function restores the original title:
          </p>
          <DocumentTitleSync />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Timer with Cleanup</h3>
          <p className="text-gray-300 mb-3">
            An interval that starts and stops based on state. The cleanup function
            clears the interval to prevent memory leaks:
          </p>
          <TimerWithCleanup />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Window Resize Listener</h3>
          <p className="text-gray-300 mb-3">
            An effect with an empty dependency array runs once on mount and
            cleans up on unmount:
          </p>
          <WindowResizeTracker />
        </div>
      </div>
    </ChapterLayout>
  )
}
