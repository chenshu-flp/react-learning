import { createFileRoute } from '@tanstack/react-router'
import { createContext, useContext, useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'

export const Route = createFileRoute('/chapters/10')({ component: Chapter10 })

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'dark',
  toggleTheme: () => {},
})

function useTheme() {
  return useContext(ThemeContext)
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
        theme === 'dark'
          ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
          : 'bg-gray-800 text-white hover:bg-gray-700'
      }`}
    >
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  )
}

function ThemedCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme()

  return (
    <div
      className={`rounded-lg p-4 border transition-colors ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
        {children}
      </div>
    </div>
  )
}

function ThemedBadge({ label }: { label: string }) {
  const { theme } = useTheme()

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        theme === 'dark'
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'bg-cyan-100 text-cyan-700'
      }`}
    >
      {label}
    </span>
  )
}

function ThemeStatusBar() {
  const { theme } = useTheme()

  return (
    <div
      className={`rounded-lg px-4 py-2 text-sm flex items-center justify-between ${
        theme === 'dark'
          ? 'bg-gray-800 text-gray-400'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      <span>
        Current theme: <strong>{theme}</strong>
      </span>
      <ThemedBadge label={theme.toUpperCase()} />
    </div>
  )
}

function ThemeDemo() {
  return (
    <ThemeProvider>
      <ThemedDemoContent />
    </ThemeProvider>
  )
}

function ThemedDemoContent() {
  const { theme } = useTheme()

  return (
    <div
      className={`rounded-lg p-6 space-y-4 transition-colors ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Themed Components
        </h3>
        <ThemeToggleButton />
      </div>
      <ThemeStatusBar />
      <div className="grid grid-cols-2 gap-4">
        <ThemedCard title="Card A">
          This card reads theme from context. No props needed.
        </ThemedCard>
        <ThemedCard title="Card B">
          <p className="mb-2">Nested components work too:</p>
          <div className="flex gap-2">
            <ThemedBadge label="React" />
            <ThemedBadge label="Context" />
            <ThemedBadge label="API" />
          </div>
        </ThemedCard>
      </div>
    </div>
  )
}

function WithoutContextDemo() {
  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-3">
      <p className="text-gray-300 text-sm">
        Without context, you'd have to pass <code className="text-cyan-400">theme</code> as
        a prop through every level:
      </p>
      <div className="bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-400 space-y-1">
        <p>&lt;App <span className="text-cyan-400">theme="dark"</span>&gt;</p>
        <p className="pl-4">&lt;Layout <span className="text-cyan-400">theme="dark"</span>&gt;</p>
        <p className="pl-8">&lt;Sidebar <span className="text-cyan-400">theme="dark"</span>&gt;</p>
        <p className="pl-12">&lt;NavItem <span className="text-cyan-400">theme="dark"</span> /&gt;</p>
        <p className="pl-8">&lt;/Sidebar&gt;</p>
        <p className="pl-4">&lt;/Layout&gt;</p>
        <p>&lt;/App&gt;</p>
      </div>
      <p className="text-gray-300 text-sm">
        With context, any component can access the theme directly -- no prop drilling.
      </p>
    </div>
  )
}

function Chapter10() {
  return (
    <ChapterLayout chapterNumber={10}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">The Problem: Prop Drilling</h3>
          <p className="text-gray-300 mb-3">
            Passing data through many layers of components is tedious and fragile:
          </p>
          <WithoutContextDemo />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">The Solution: Context</h3>
          <p className="text-gray-300 mb-3">
            ThemeProvider wraps the tree. Any descendant can call useTheme() to
            read and toggle the theme:
          </p>
          <ThemeDemo />
        </div>
      </div>
    </ChapterLayout>
  )
}
