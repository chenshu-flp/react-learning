import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/sharing-state')({ component: Chapter11 })

function Panel({
  title,
  isActive,
  onShow,
  children,
}: {
  title: string
  isActive: boolean
  onShow: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isActive
          ? 'border-cyan-500/50 bg-gray-800'
          : 'border-gray-700 bg-gray-900'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{title}</h4>
        {!isActive && (
          <button
            onClick={onShow}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-medium transition-colors"
          >
            Show
          </button>
        )}
      </div>
      {isActive && (
        <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
      )}
    </div>
  )
}

function AccordionDemo() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-3">
      <Panel
        title="About React"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        React is a JavaScript library for building user interfaces. It was
        created by Facebook and is maintained by Meta and a community of
        individual developers and companies.
      </Panel>
      <Panel
        title="How It Works"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        React creates a virtual DOM in memory, where it does all the necessary
        manipulating, before making changes to the actual browser DOM. React
        only changes what needs to be changed.
      </Panel>
      <Panel
        title="Getting Started"
        isActive={activeIndex === 2}
        onShow={() => setActiveIndex(2)}
      >
        The easiest way to start with React is to use a framework like Next.js,
        Remix, or TanStack Start. You can also use Vite to set up a client-side
        React project quickly.
      </Panel>
    </div>
  )
}

function TemperatureConverter() {
  const [temperature, setTemperature] = useState('')
  const [scale, setScale] = useState<'c' | 'f'>('c')

  const celsius =
    scale === 'f' && temperature !== ''
      ? ((Number.parseFloat(temperature) - 32) * 5) / 9
      : Number.parseFloat(temperature)

  const fahrenheit =
    scale === 'c' && temperature !== ''
      ? (Number.parseFloat(temperature) * 9) / 5 + 32
      : Number.parseFloat(temperature)

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <p className="text-sm text-gray-400">
        Both inputs are controlled by the same lifted state. Changing one
        automatically updates the other:
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Celsius</label>
          <input
            value={scale === 'c' ? temperature : Number.isNaN(celsius) ? '' : celsius.toFixed(1)}
            onChange={(e) => {
              setScale('c')
              setTemperature(e.target.value)
            }}
            type="number"
            placeholder="°C"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Fahrenheit</label>
          <input
            value={scale === 'f' ? temperature : Number.isNaN(fahrenheit) ? '' : fahrenheit.toFixed(1)}
            onChange={(e) => {
              setScale('f')
              setTemperature(e.target.value)
            }}
            type="number"
            placeholder="°F"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      </div>
      {temperature !== '' && !Number.isNaN(Number.parseFloat(temperature)) && (
        <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300">
          {(scale === 'c' ? celsius : (fahrenheit - 32) * 5 / 9) >= 100
            ? 'The water would boil.'
            : (scale === 'c' ? celsius : (fahrenheit - 32) * 5 / 9) <= 0
              ? 'The water would freeze.'
              : 'The water would not boil.'}
        </div>
      )}
    </div>
  )
}

function FilterableList() {
  const [query, setQuery] = useState('')
  const allItems = [
    'React', 'Angular', 'Vue', 'Svelte', 'Solid',
    'Next.js', 'Remix', 'Astro', 'Nuxt', 'SvelteKit',
  ]

  const filtered = allItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <p className="text-sm text-gray-400">
        The search input and the list share state via the parent. The parent owns
        the query, both children receive it:
      </p>
      <SearchBar query={query} onChange={setQuery} />
      <ResultsList items={filtered} query={query} />
    </div>
  )
}

function SearchBar({
  query,
  onChange,
}: {
  query: string
  onChange: (value: string) => void
}) {
  return (
    <input
      value={query}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search frameworks..."
      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
    />
  )
}

function ResultsList({ items, query }: { items: string[]; query: string }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item}
          className="bg-gray-800 rounded px-3 py-2 text-sm text-gray-300"
        >
          {item}
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-3">
          No results for "{query}"
        </p>
      )}
    </div>
  )
}

function Chapter11() {
  return (
    <ChapterLayout slug="sharing-state">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Accordion (Lifting State Up)</h3>
          <p className="text-gray-300 mb-3">
            Only one panel can be open at a time. The parent owns the
            activeIndex state and passes isActive/onShow to each Panel:
          </p>
          <AccordionDemo />
          <CodeBlock title="Accordion — Lifting State Up" code={`function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0)  // parent owns state

  return (
    <>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Content for panel 1...
      </Panel>
      <Panel
        title="Details"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Content for panel 2...
      </Panel>
    </>
  )
}

function Panel({ title, isActive, onShow, children }) {
  return (
    <div>
      <h4>{title}</h4>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Temperature Converter</h3>
          <p className="text-gray-300 mb-3">
            Two inputs that stay in sync by sharing a single source of truth
            in their parent component:
          </p>
          <TemperatureConverter />
          <CodeBlock title="Temperature Converter" code={`function TemperatureConverter() {
  const [celsius, setCelsius] = useState('')

  const fahrenheit = celsius
    ? ((parseFloat(celsius) * 9) / 5 + 32).toFixed(1)
    : ''

  return (
    <div>
      <input
        value={celsius}
        onChange={(e) => setCelsius(e.target.value)}
        placeholder="Celsius"
      />
      <input value={fahrenheit} readOnly placeholder="Fahrenheit" />
    </div>
  )
}`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Filterable List</h3>
          <p className="text-gray-300 mb-3">
            SearchBar and ResultsList are siblings. The parent lifts the query
            state so both components can access it:
          </p>
          <FilterableList />
          <CodeBlock title="Filterable List — Sibling Communication" code={`function FilterableList() {
  const [query, setQuery] = useState('')  // parent owns state

  const filtered = allItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  // Both siblings receive data from the parent
  return (
    <div>
      <SearchBar query={query} onChange={setQuery} />
      <ResultsList items={filtered} query={query} />
    </div>
  )
}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
