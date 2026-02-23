import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/lists-keys')({ component: Chapter6 })

let nextId = 4

function ListDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build a project', done: false },
    { id: 3, text: 'Deploy to production', done: false },
  ])
  const [input, setInput] = useState('')

  const addItem = () => {
    if (!input.trim()) return
    setItems([...items, { id: nextId++, text: input.trim(), done: false }])
    setInput('')
  }

  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...items]
    ;[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
    setItems(newItems)
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Add a task..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                item.done
                  ? 'bg-cyan-600 border-cyan-600'
                  : 'border-gray-500 hover:border-cyan-500'
              }`}
            >
              {item.done && (
                <span className="text-white text-xs">&#10003;</span>
              )}
            </button>
            <span
              className={`flex-1 ${item.done ? 'line-through text-gray-500' : 'text-gray-300'}`}
            >
              {item.text}
            </span>
            <span className="text-xs text-gray-600 font-mono">id={item.id}</span>
            <button
              onClick={() => moveUp(index)}
              disabled={index === 0}
              className="text-gray-500 hover:text-gray-300 disabled:opacity-30 text-sm px-1"
            >
              &uarr;
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-300 text-sm px-1"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">
          No items. Add one above!
        </p>
      )}
    </div>
  )
}

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
          <h3 className="text-lg font-semibold mb-3">Rendering Lists</h3>
          <p className="text-gray-300 mb-3">
            Use .map() to render arrays. Each item needs a unique, stable key.
            Try adding, removing, reordering, and toggling items:
          </p>
          <ListDemo />
          <CodeBlock title="Rendering Lists" code={`const [items, setItems] = useState([
  { id: 1, text: 'Learn React', done: false },
  { id: 2, text: 'Build a project', done: false },
])

<ul>
  {items.map((item) => (
    <li key={item.id}>
      <span>{item.text}</span>
      <button onClick={() => removeItem(item.id)}>×</button>
    </li>
  ))}
</ul>`} />
        </div>

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
      </div>
    </ChapterLayout>
  )
}
