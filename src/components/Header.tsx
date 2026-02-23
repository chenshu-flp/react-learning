import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, X } from 'lucide-react'
import { chapters, chapterPath } from '#/lib/chapters'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const categories = ['Core Basics', 'Managing State', 'Intermediate'] as const

  return (
    <>
      <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            React Workshop
          </Link>
        </h1>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={() => {}}
          role="button"
          tabIndex={-1}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Chapters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-4"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-4',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {categories.map((category) => (
            <div key={category}>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mt-4 mb-2 first:mt-0">
                {category}
              </div>
              {chapters
                .filter((c) => c.category === category)
                .map((chapter) => (
                  <Link
                    key={chapter.slug}
                    to={chapterPath(chapter.slug)}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800 transition-colors mb-0.5 text-sm"
                    activeProps={{
                      className:
                        'flex items-center gap-3 p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-0.5 text-sm',
                    }}
                  >
                    <span className="w-6 h-6 rounded bg-gray-800 text-cyan-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {chapters.indexOf(chapter) + 1}
                    </span>
                    <span>{chapter.title}</span>
                  </Link>
                ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
