import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/move-state-down')({
  component: MoveStateDownChapter,
})

function RenderCounter({ label }: { label: string }) {
  const count = useRef(0)
  count.current++

  return (
    <span className="text-xs text-gray-500 font-mono">
      {label} renders: <span className="text-cyan-400">{count.current}</span>
    </span>
  )
}

function ExpensiveTree() {
  const now = performance.now()
  while (performance.now() - now < 50) {
    // artificial delay
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
      <span className="text-sm text-gray-300">
        ExpensiveTree <span className="text-gray-500">(50ms artificial delay)</span>
      </span>
      <RenderCounter label="ExpensiveTree" />
    </div>
  )
}

function ProblemVersion() {
  const [color, setColor] = useState('cyan')

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Color:</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white text-sm w-40"
          placeholder="Type a color..."
        />
      </div>
      <p style={{ color }} className="text-lg font-medium">
        Hello, world!
      </p>
      <ExpensiveTree />
      <RenderCounter label="App" />
    </div>
  )
}

function ColorForm() {
  const [color, setColor] = useState('cyan')

  return (
    <>
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Color:</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white text-sm w-40"
          placeholder="Type a color..."
        />
      </div>
      <p style={{ color }} className="text-lg font-medium">
        Hello, world!
      </p>
    </>
  )
}

function SolutionVersion() {
  return (
    <div className="space-y-3">
      <ColorForm />
      <ExpensiveTree />
      <RenderCounter label="App" />
    </div>
  )
}

function MoveStateDownChapter() {
  const [fixed, setFixed] = useState(false)

  return (
    <ChapterLayout slug="move-state-down">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">The Problem: Unrelated State Re-renders Everything</h3>
          <p className="text-gray-300 mb-3">
            In this example, typing in the color input is laggy because
            every keystroke re-renders the entire App — including ExpensiveTree,
            which takes 50ms to render and doesn't even use the color state.
          </p>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setFixed((f) => !f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                fixed
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {fixed ? 'Showing: Fixed version' : 'Showing: Broken version'}
            </button>
            <span className="text-sm text-gray-500">
              {fixed
                ? 'State moved into ColorForm — ExpensiveTree stops re-rendering'
                : 'Try typing quickly — notice the lag'}
            </span>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            {fixed ? <SolutionVersion /> : <ProblemVersion />}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Before: State Too High</h3>
          <p className="text-gray-300 mb-3">
            The color state lives in App, so changing it re-renders everything:
          </p>
          <CodeBlock title="Problem — state too high" code={`function App() {
  const [color, setColor] = useState('red')
  return (
    <div>
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <p style={{ color }}>Hello, world!</p>
      <ExpensiveTree />  {/* re-renders on every keystroke! */}
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">After: Move State Down</h3>
          <p className="text-gray-300 mb-3">
            Extract the parts that use color into their own component.
            Now color changes only re-render ColorForm:
          </p>
          <CodeBlock title="Solution — move state down" code={`function App() {
  return (
    <>
      <ColorForm />
      <ExpensiveTree />  {/* no longer re-renders! */}
    </>
  )
}

function ColorForm() {
  const [color, setColor] = useState('red')
  return (
    <>
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <p style={{ color }}>Hello, world!</p>
    </>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">When to Use This</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Look for state that only a small part of your component tree actually
            needs. If you can draw a boundary around the components that read
            that state, extract them. The siblings outside that boundary won't
            re-render anymore — no <code className="text-cyan-400">memo()</code> required.
          </p>
        </div>
      </div>
    </ChapterLayout>
  )
}
