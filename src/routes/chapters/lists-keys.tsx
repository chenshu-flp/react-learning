import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/lists-keys')({ component: Chapter6 })

function KeysDemo() {
  const [useIndex, setUseIndex] = useState(false)
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry'])

  const prependItem = () => {
    const fruits = ['Mango', 'Peach', 'Grape', 'Kiwi', 'Lemon']
    const random = fruits[Math.floor(Math.random() * fruits.length)]
    setItems([random, ...items])
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={prependItem}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Prepend random fruit
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={useIndex}
            onChange={(e) => setUseIndex(e.target.checked)}
            className="rounded"
          />
          Use index as key (bad practice)
        </label>
      </div>
      <p className="text-sm text-gray-500">
        Type in the inputs, then prepend an item. With index keys, the inputs get
        mismatched. With stable keys, they stay correct.
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={useIndex ? index : item}
            className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2"
          >
            <span className="text-gray-300 w-20">{item}</span>
            <input
              defaultValue=""
              placeholder={`Note for ${item}...`}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
            />
            <span className="text-xs text-gray-600 font-mono">
              key={useIndex ? index : `"${item}"`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Chapter6() {
  return (
    <ChapterLayout slug="lists-keys">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Why Keys Matter</h3>
          <p className="text-gray-300 mb-3">
            Toggle between stable keys and index keys to see how React
            reconciliation behaves differently:
          </p>
          <KeysDemo />
          <CodeBlock title="Index Keys vs Stable Keys" code={`// BAD: using index as key — causes bugs when list is reordered
{items.map((item, index) => (
  <li key={index}>
    <input defaultValue="" />
  </li>
))}

// GOOD: using a stable, unique identifier
{items.map((item) => (
  <li key={item.id}>
    <input defaultValue="" />
  </li>
))}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Stable Keys vs Index Keys in Reconciliation</h3>
          <p className="text-gray-300 mb-4">
            When React re-renders a list, it uses <strong>keys</strong> to match elements from the
            previous render to the next. The choice of key fundamentally changes how React
            reconciles the DOM.
          </p>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-red-400 mb-2">Index Keys <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">key={'{index}'}</code></h4>
              <p className="text-gray-300 text-sm mb-3">
                React pairs elements by their position. If you insert an item at the beginning of a list:
              </p>
              <pre className="text-xs bg-gray-800 rounded p-3 text-gray-300 mb-3 overflow-x-auto font-mono">
{`Before:  [A(key=0), B(key=1), C(key=2)]
After:   [X(key=0), A(key=1), B(key=2), C(key=3)]`}
              </pre>
              <p className="text-gray-300 text-sm mb-2">
                React sees key <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">0</code> existed
                before (it was <strong>A</strong>) and now it's <strong>X</strong>, so it <em>mutates</em> the
                DOM node — updating its content, re-running effects, and resetting no state. It does this for
                every subsequent item too. This means:
              </p>
              <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                <li><strong className="text-gray-300">State bleeds between items.</strong> If A had an input with typed text, that DOM node now belongs to X, and X inherits the text.</li>
                <li><strong className="text-gray-300">Effects re-fire</strong> for every item whose index shifted.</li>
                <li><strong className="text-gray-300">Performance degrades</strong> because React updates N nodes instead of inserting 1.</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-green-400 mb-2">Stable Keys <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">key={'{item.id}'}</code></h4>
              <p className="text-gray-300 text-sm mb-3">
                React pairs elements by identity. The same insertion looks like:
              </p>
              <pre className="text-xs bg-gray-800 rounded p-3 text-gray-300 mb-3 overflow-x-auto font-mono">
{`Before:  [A(key="a"), B(key="b"), C(key="c")]
After:   [X(key="x"), A(key="a"), B(key="b"), C(key="c")]`}
              </pre>
              <p className="text-gray-300 text-sm mb-2">
                React sees keys <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">"a"</code>,{' '}
                <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">"b"</code>,{' '}
                <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">"c"</code> all still exist and are
                unchanged, so it <em>reuses</em> those DOM nodes as-is. It only creates one new DOM node
                for <strong>X</strong> and inserts it. This means:
              </p>
              <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                <li><strong className="text-gray-300">State stays with the correct item.</strong> A's input keeps its text.</li>
                <li><strong className="text-gray-300">Effects don't re-fire</strong> for unmoved items.</li>
                <li><strong className="text-gray-300">Performance is optimal</strong> — React does minimal DOM work.</li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-cyan-400 mb-3">Comparison</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 pr-4 text-gray-400 font-medium"></th>
                      <th className="py-2 px-4 text-red-400 font-medium">Index key</th>
                      <th className="py-2 px-4 text-green-400 font-medium">Stable key</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Identity based on</td>
                      <td className="py-2 px-4">position in array</td>
                      <td className="py-2 px-4">data identity</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Insertion/deletion</td>
                      <td className="py-2 px-4">mutates all shifted nodes</td>
                      <td className="py-2 px-4">inserts/removes one node</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 text-gray-400">Component state</td>
                      <td className="py-2 px-4">migrates to wrong item</td>
                      <td className="py-2 px-4">stays with correct item</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-gray-400">Unmount/remount</td>
                      <td className="py-2 px-4">items never unmount, just get wrong props</td>
                      <td className="py-2 px-4">correct mount/unmount lifecycle</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-yellow-400 mb-2">When Index Keys Are Safe</h4>
              <p className="text-gray-300 text-sm mb-2">
                Index keys are acceptable only when <strong>all three</strong> conditions hold:
              </p>
              <ol className="text-sm text-gray-400 space-y-1 ml-4 list-decimal">
                <li>The list is <strong className="text-gray-300">never reordered</strong>.</li>
                <li>Items are <strong className="text-gray-300">never inserted or deleted</strong> (only appended at the end).</li>
                <li>List items have <strong className="text-gray-300">no local state</strong> (no inputs, no animations, no internal useState).</li>
              </ol>
              <p className="text-gray-400 text-sm mt-3">
                In every other case, use a stable unique identifier from your data (database ID, UUID, etc.).
                Avoid generating keys with <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">Math.random()</code> or{' '}
                <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">crypto.randomUUID()</code> during render — that
                creates a new key every render, forcing React to unmount and remount every item every time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
