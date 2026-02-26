import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import { chapters, chapterPath } from '#/lib/chapters'

const categories = ['Core Basics', 'Managing State', 'Intermediate'] as const

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 text-white flex flex-col z-30">
      <div className="p-5 border-b border-gray-800">
        <Link to="/" className="text-xl font-bold hover:text-cyan-400 transition-colors">
          React Workshop
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-3"
          activeProps={{
            className:
              'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-3',
          }}
        >
          <Home size={18} />
          <span className="font-medium text-sm">Home</span>
        </Link>

        {categories.map((category) => (
          <div key={category}>
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-3 mt-5 mb-2 first:mt-0">
              {category}
            </div>
            {chapters
              .filter((c) => c.category === category)
              .map((chapter) => (
                <Link
                  key={chapter.slug}
                  to={chapterPath(chapter.slug)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors mb-0.5 text-sm"
                  activeProps={{
                    className:
                      'flex items-center gap-3 p-2 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition-colors mb-0.5 text-sm',
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
  )
}
