import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Code, ChevronDown, ChevronRight, Clipboard, Check } from 'lucide-react'

export default function CodeBlock({
  code,
  title,
  startCollapsed = true,
}: {
  code: string
  title?: string
  startCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = useState(startCollapsed)
  const [copied, setCopied] = useState(false)

  const trimmed = code.trim()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trimmed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-750 transition-colors text-sm text-gray-400"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        <Code size={14} />
        <span className="font-medium">{title ?? 'Source Code'}</span>
      </button>
      {!collapsed && (
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-gray-400 hover:text-white z-10"
            aria-label="Copy code"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
          </button>
          <Highlight theme={themes.nightOwl} code={trimmed} language="tsx">
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className="p-4 overflow-x-auto text-[13px] leading-relaxed"
                style={{ ...style, margin: 0, background: '#1a1a2e' }}
              >
                {tokens.map((line, i) => (
                  <div key={`line-${i}`} {...getLineProps({ line })}>
                    <span className="inline-block w-8 text-right mr-4 text-gray-600 select-none text-xs">
                      {i + 1}
                    </span>
                    {line.map((token, j) => (
                      <span key={`token-${j}`} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      )}
    </div>
  )
}
