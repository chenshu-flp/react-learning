import { Link } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { chapters } from '#/lib/chapters'

export default function ChapterLayout({
  chapterNumber,
  children,
}: {
  chapterNumber: number
  children: React.ReactNode
}) {
  const chapter = chapters.find((c) => c.number === chapterNumber)
  const prev = chapters.find((c) => c.number === chapterNumber - 1)
  const next = chapters.find((c) => c.number === chapterNumber + 1)

  if (!chapter) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
          >
            &larr; Back to Table of Contents
          </Link>
        </div>

        <header className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            Chapter {chapter.number} &middot; {chapter.category}
          </span>
          <h1 className="text-4xl font-bold mt-2 mb-4">{chapter.title}</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            {chapter.description}
          </p>
        </header>

        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
            Interactive Demo
          </h2>
          {children}
        </section>

        <nav className="flex items-center justify-between mt-10 pt-6 border-t border-gray-700">
          {prev ? (
            <Link
              to={prev.path}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ChevronLeft size={18} />
              <div className="text-left">
                <div className="text-xs uppercase tracking-wider">Previous</div>
                <div className="font-medium text-white">
                  {prev.number}. {prev.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={next.path}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider">Next</div>
                <div className="font-medium text-white">
                  {next.number}. {next.title}
                </div>
              </div>
              <ChevronRight size={18} />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </div>
  )
}
