import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/react-rendering')({
  component: ReactRenderingChapter,
})

function RenderFlash({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const prevRender = useRef(0)

  prevRender.current++
  const count = prevRender.current

  if (ref.current) {
    ref.current.classList.remove('animate-flash')
    void ref.current.offsetWidth
    ref.current.classList.add('animate-flash')
  }

  return (
    <div
      ref={ref}
      className="rounded-lg border border-gray-700 bg-gray-800 p-3 transition-colors [&.animate-flash]:border-cyan-400 [&.animate-flash]:bg-cyan-950"
    >
      <div className="flex items-center justify-between">
        <div>{children}</div>
        <span className="text-xs text-gray-500 font-mono">
          renders: <span className="text-cyan-400">{count}</span>
        </span>
      </div>
    </div>
  )
}

function ChildA() {
  return (
    <RenderFlash>
      <span className="text-sm text-gray-300">ChildA</span>
    </RenderFlash>
  )
}

function ChildB() {
  return (
    <RenderFlash>
      <span className="text-sm text-gray-300">ChildB</span>
    </RenderFlash>
  )
}

function ChildC() {
  return (
    <RenderFlash>
      <span className="text-sm text-gray-300">ChildC</span>
    </RenderFlash>
  )
}

function CascadeDemo() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <RenderFlash>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">Parent</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-medium transition-colors"
          >
            Update parent state ({count})
          </button>
        </div>
      </RenderFlash>
      <div className="ml-6 space-y-2 border-l-2 border-gray-700 pl-4">
        <ChildA />
        <ChildB />
        <ChildC />
      </div>
      <p className="text-sm text-gray-500">
        Click the button and watch every render count increase. When a
        component's state changes, React re-renders it <em>and all of its
        descendants</em>, regardless of whether their props changed.
      </p>
    </div>
  )
}

function InnerChild() {
  return (
    <RenderFlash>
      <span className="text-sm text-gray-300">InnerChild</span>
    </RenderFlash>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <RenderFlash>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">Wrapper</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-medium transition-colors"
          >
            Update wrapper state ({count})
          </button>
        </div>
        <div className="ml-6 border-l-2 border-gray-700 pl-4 space-y-2">
          {children}
        </div>
      </div>
    </RenderFlash>
  )
}

function ChildrenPropDemo() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <RenderFlash>
        <span className="text-sm font-medium text-white">App (creates the JSX)</span>
      </RenderFlash>
      <div className="ml-6 border-l-2 border-gray-700 pl-4">
        <Wrapper>
          <InnerChild />
        </Wrapper>
      </div>
      <p className="text-sm text-gray-500">
        Click "Update wrapper state" — Wrapper re-renders but InnerChild does
        not. The <code className="text-cyan-400">{'<InnerChild />'}</code> JSX
        was created by App and passed as <code className="text-cyan-400">children</code>.
        Since App didn't re-render, React receives the same element object and
        skips that subtree entirely.
      </p>
    </div>
  )
}

function SideBySideDemo() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
          Inline child — always re-renders
        </h4>
        <InlineVersion />
      </div>
      <div className="border-t border-gray-700 pt-6">
        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">
          Children prop — skips re-render
        </h4>
        <ChildrenVersion />
      </div>
    </div>
  )
}

function InlineVersion() {
  const [count, setCount] = useState(0)

  return (
    <RenderFlash>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">Parent</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
          >
            setState ({count})
          </button>
        </div>
        <div className="ml-6 border-l-2 border-gray-700 pl-4">
          <SlowChild label="Inline" />
        </div>
      </div>
    </RenderFlash>
  )
}

function ChildrenVersion() {
  return (
    <ChildrenParent>
      <SlowChild label="Via children" />
    </ChildrenParent>
  )
}

function ChildrenParent({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <RenderFlash>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white">Parent</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
          >
            setState ({count})
          </button>
        </div>
        <div className="ml-6 border-l-2 border-gray-700 pl-4">
          {children}
        </div>
      </div>
    </RenderFlash>
  )
}

function SlowChild({ label }: { label: string }) {
  return (
    <RenderFlash>
      <span className="text-sm text-gray-300">{label}</span>
    </RenderFlash>
  )
}

function ReactRenderingChapter() {
  return (
    <ChapterLayout slug="react-rendering">
      <div className="space-y-8">
        <style>{`
          @keyframes flash {
            0% { border-color: rgb(34 211 238); background-color: rgb(8 51 68); }
            100% { border-color: rgb(55 65 81); background-color: rgb(31 41 55); }
          }
          .animate-flash {
            animation: flash 0.8s ease-out;
          }
        `}</style>

        <div>
          <h3 className="text-lg font-semibold mb-3">Rule #1: State Change = Re-render the Whole Subtree</h3>
          <p className="text-gray-300 mb-3">
            When a component's state changes, React re-renders that component
            and <strong>every component nested inside it</strong>. It doesn't
            matter if the children's props haven't changed — React calls their
            render functions anyway.
          </p>
          <CascadeDemo />
          <CodeBlock title="Cascading re-renders" code={`function Parent() {
  const [count, setCount] = useState(0)

  // When count changes, Parent re-renders.
  // React also re-renders ChildA, ChildB, and ChildC
  // even though they receive no props.
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        {count}
      </button>
      <ChildA />
      <ChildB />
      <ChildC />
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Rule #2: Elements Created "Above" Keep Their Identity</h3>
          <p className="text-gray-300 mb-3">
            JSX like <code className="text-cyan-400">{'<InnerChild />'}</code> is
            just a call to <code className="text-cyan-400">React.createElement()</code> that
            returns a plain object. When you pass that object as
            the <code className="text-cyan-400">children</code> prop, React
            sees the exact same object reference on re-render and skips
            re-rendering that subtree.
          </p>
          <ChildrenPropDemo />
          <CodeBlock title="children prop identity" code={`// App creates the <InnerChild /> element object.
// It only re-creates that object when App itself re-renders.
function App() {
  return (
    <Wrapper>
      <InnerChild />
    </Wrapper>
  )
}

// When Wrapper's state changes, Wrapper re-renders.
// But children is the same object App created last time,
// so React skips re-rendering InnerChild.
function Wrapper({ children }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {children}
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Side by Side: Inline vs. Children Prop</h3>
          <p className="text-gray-300 mb-3">
            Compare these two approaches. In the inline version the parent
            creates the child JSX, so every state update creates a new element
            object and triggers a re-render. In the children version, the
            element comes from a parent that didn't re-render — same object, no
            re-render.
          </p>
          <SideBySideDemo />
          <CodeBlock title="Inline vs. children" code={`// INLINE: SlowChild re-renders every time Parent's state changes
function InlineVersion() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <SlowChild />  {/* new element object every render */}
    </div>
  )
}

// CHILDREN: SlowChild does NOT re-render when Parent's state changes
function App() {
  return (
    <Parent>
      <SlowChild />  {/* created here, above the state */}
    </Parent>
  )
}

function Parent({ children }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      {children}  {/* same object reference — skip! */}
    </div>
  )
}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
