import { createFileRoute, Link } from '@tanstack/react-router'
import { chapters, chapterPath } from '#/lib/chapters'

export const Route = createFileRoute('/')({ component: Home })

function ChapterGrid({ category }: { category: string }) {
  const filtered = chapters.filter((c) => c.category === category)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filtered.map((chapter) => (
        <Link
          key={chapter.slug}
          to={chapterPath(chapter.slug)}
          className="group bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5"
        >
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg">
              {chapters.indexOf(chapter) + 1}
            </span>
            <div>
              <h3 className="text-lg font-semibold group-hover:text-cyan-400 transition-colors">
                {chapter.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                {chapter.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4">React Workshop</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A hands-on workshop covering React fundamentals through interactive
            demos. Click any chapter to get started.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-6">
            Core Basics
          </h2>
          <ChapterGrid category="Core Basics" />
        </section>

        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-6">
            Managing State
          </h2>
          <ChapterGrid category="Managing State" />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-6">
            Intermediate
          </h2>
          <ChapterGrid category="Intermediate" />
        </section>
      </div>
    </div>
  )
}
