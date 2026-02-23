import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/reactive-input')({ component: Chapter9 })

function submitForm(answer: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'lima') {
        resolve()
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'))
      }
    }, 1500)
  })
}

type FormStatus = 'typing' | 'submitting' | 'success'

function QuizForm() {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<FormStatus>('typing')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await submitForm(answer)
      setStatus('success')
    } catch (err) {
      setStatus('typing')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
        <p className="text-green-400 font-semibold text-xl mb-2">
          That's right!
        </p>
        <button
          onClick={() => {
            setStatus('typing')
            setAnswer('')
            setError(null)
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium mt-2"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div>
        <h4 className="font-semibold text-white mb-2">City Quiz</h4>
        <p className="text-gray-300 text-sm">
          In which city is there a billboard that turns air into drinkable water?
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={status === 'submitting'}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none disabled:opacity-50"
          rows={2}
          placeholder="Type your answer..."
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={answer.length === 0 || status === 'submitting'}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors text-sm font-medium"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit'}
          </button>
          {status === 'submitting' && (
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </form>
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Current status
        </p>
        <div className="flex gap-3">
          {(['typing', 'submitting', 'success'] as const).map((s) => (
            <span
              key={s}
              className={`px-2 py-1 rounded text-xs font-mono ${
                status === s
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-gray-700 text-gray-500'
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrafficLight() {
  const [light, setLight] = useState<'red' | 'yellow' | 'green'>('red')
  const [walk, setWalk] = useState(false)

  const nextLight = () => {
    if (light === 'red') {
      setLight('green')
      setWalk(true)
    } else if (light === 'green') {
      setLight('yellow')
      setWalk(false)
    } else {
      setLight('red')
      setWalk(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-6">
        <div className="bg-gray-800 rounded-xl p-3 flex flex-col gap-2 items-center">
          {(['red', 'yellow', 'green'] as const).map((color) => (
            <div
              key={color}
              className={`w-10 h-10 rounded-full transition-all ${
                light === color
                  ? color === 'red'
                    ? 'bg-red-500 shadow-lg shadow-red-500/50'
                    : color === 'yellow'
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                      : 'bg-green-500 shadow-lg shadow-green-500/50'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        <div className="space-y-3">
          <button
            onClick={nextLight}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
          >
            Next Light
          </button>
          <p className={`text-lg font-semibold ${walk ? 'text-green-400' : 'text-red-400'}`}>
            {walk ? '🚶 Walk' : '✋ Stop'}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500">
        The walk signal is derived from the light state -- it's not independent
        state. The UI is a function of the current state.
      </p>
    </div>
  )
}

function Chapter9() {
  return (
    <ChapterLayout slug="reactive-input">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Declarative UI with State Machines</h3>
          <p className="text-gray-300 mb-3">
            Instead of imperatively enabling/disabling UI elements, model your
            component as a state machine. The UI is a function of which state
            you're in (typing, submitting, success):
          </p>
          <QuizForm />
          <CodeBlock title="QuizForm — State Machine" code={`type FormStatus = 'typing' | 'submitting' | 'success'

const [answer, setAnswer] = useState('')
const [status, setStatus] = useState<FormStatus>('typing')

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setStatus('submitting')
  try {
    await submitForm(answer)
    setStatus('success')
  } catch (err) {
    setStatus('typing')
    setError(err.message)
  }
}

if (status === 'success') {
  return <p>That's right!</p>
}

<textarea
  disabled={status === 'submitting'}
  value={answer}
  onChange={(e) => setAnswer(e.target.value)}
/>
<button disabled={answer.length === 0 || status === 'submitting'}>
  Submit
</button>`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">State-Driven UI</h3>
          <p className="text-gray-300 mb-3">
            A traffic light where each state determines both the light display
            and the walk signal -- the UI reacts to state changes:
          </p>
          <TrafficLight />
          <CodeBlock title="TrafficLight" code={`const [light, setLight] = useState<'red' | 'yellow' | 'green'>('red')

// walk signal is DERIVED from light — not separate state
const walk = light === 'green'

const nextLight = () => {
  if (light === 'red') setLight('green')
  else if (light === 'green') setLight('yellow')
  else setLight('red')
}`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
