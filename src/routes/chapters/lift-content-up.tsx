import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/lift-content-up')({
  component: LiftContentUpChapter,
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
    <div style={{ color }} className="space-y-3 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Color:</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white text-sm w-40"
          placeholder="Type a color..."
        />
      </div>
      <p className="text-lg font-medium">Hello, world!</p>
      <ExpensiveTree />
      <RenderCounter label="App" />
    </div>
  )
}

function ColorPicker({ children }: { children: React.ReactNode }) {
  const [color, setColor] = useState('cyan')

  return (
    <div style={{ color }} className="space-y-3 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">Color:</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white text-sm w-40"
          placeholder="Type a color..."
        />
      </div>
      {children}
      <RenderCounter label="ColorPicker" />
    </div>
  )
}

function SolutionVersion() {
  return (
    <ColorPicker>
      <p className="text-lg font-medium">Hello, world!</p>
      <ExpensiveTree />
    </ColorPicker>
  )
}

function LiftContentUpChapter() {
  const [fixed, setFixed] = useState(false)

  return (
    <ChapterLayout slug="lift-content-up">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">The Problem: State on a Wrapping Element</h3>
          <p className="text-gray-300 mb-3">
            Sometimes you can't simply "move state down" because the state is
            used on a parent element that wraps the expensive children. Here,
            the <code className="text-cyan-400">color</code> state is applied
            to the outer <code className="text-cyan-400">{'<div>'}</code> via
            its style prop — so it must stay above ExpensiveTree.
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
                ? 'ExpensiveTree passed as children — stops re-rendering'
                : 'Try typing quickly — notice the lag'}
            </span>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            {fixed ? <SolutionVersion /> : <ProblemVersion />}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Before: Everything Inside</h3>
          <p className="text-gray-300 mb-3">
            The color state is used on the wrapping div, so we can't just
            extract the color parts — the expensive tree is nested inside:
          </p>
          <CodeBlock title="Problem — can't move state down" code={`function App() {
  const [color, setColor] = useState('red')
  return (
    // color is used on the wrapper — can't extract it
    <div style={{ color }}>
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <p>Hello, world!</p>
      <ExpensiveTree />  {/* re-renders on every keystroke! */}
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">After: Lift Content Up</h3>
          <p className="text-gray-300 mb-3">
            Create a ColorPicker component that owns the state and the wrapping
            div. Pass the expensive content in as <code className="text-cyan-400">children</code>.
            Since App creates the children JSX and App doesn't re-render,
            React sees the same element references and skips that subtree.
          </p>
          <CodeBlock title="Solution — lift content up via children" code={`function App() {
  // App creates these elements once. They keep the same
  // object identity across ColorPicker's re-renders.
  return (
    <ColorPicker>
      <p>Hello, world!</p>
      <ExpensiveTree />  {/* no longer re-renders! */}
    </ColorPicker>
  )
}

function ColorPicker({ children }) {
  const [color, setColor] = useState('red')
  return (
    <div style={{ color }}>
      <input
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      {children}  {/* same object reference — React skips it */}
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Why Does This Work?</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            As we saw in the React Rendering chapter: when ColorPicker
            re-renders, React compares the new element tree with the previous
            one. The <code className="text-cyan-400">children</code> prop is the
            exact same object that App passed last time (App didn't re-render,
            so it didn't create new elements). React sees the same reference
            and skips reconciling that entire subtree — no{' '}
            <code className="text-cyan-400">memo()</code> needed.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            This pattern is also good for code organization: it separates
            "what to render" (decided by the parent) from "how to style/wrap
            it" (decided by the component with state). It naturally leads to
            more composable component APIs.
          </p>
        </div>
      </div>
    </ChapterLayout>
  )
}
