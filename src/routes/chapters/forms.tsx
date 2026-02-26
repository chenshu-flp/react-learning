import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/forms')({ component: Chapter7 })

function ControlledDemo() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null)

  const isValid = name.trim().length > 0 && email.includes('@')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitted({ name: name.trim(), email })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
          {name.length > 0 && name.trim().length === 0 && (
            <p className="text-red-400 text-xs mt-1">Name cannot be just whitespace</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
          {email.length > 0 && !email.includes('@') && (
            <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors font-medium text-sm"
        >
          Submit
        </button>
      </form>

      <div className="bg-gray-800 rounded-lg p-4 text-sm">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Live state (updates every keystroke)</p>
        <pre className="text-cyan-400 font-mono text-xs">
          {JSON.stringify({ name, email, isValid }, null, 2)}
        </pre>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-semibold text-sm mb-2">Submitted!</p>
          <pre className="text-green-300 font-mono text-xs">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function UncontrolledDemo() {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData(formRef.current!)
    setSubmitted({
      name: (data.get('name') as string).trim(),
      email: data.get('email') as string,
    })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            name="name"
            defaultValue=""
            placeholder="Your name"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            name="email"
            defaultValue=""
            placeholder="you@example.com"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors font-medium text-sm"
        >
          Submit
        </button>
      </form>

      <div className="bg-gray-800 rounded-lg p-4 text-sm">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
          No live state — values live in the DOM until submit
        </p>
        <p className="text-gray-400 text-xs font-mono">
          React does not re-render on keystrokes
        </p>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-semibold text-sm mb-2">Submitted (read via FormData)!</p>
          <pre className="text-green-300 font-mono text-xs">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function Chapter7() {
  return (
    <ChapterLayout slug="forms">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Controlled Inputs</h3>
          <p className="text-gray-300 mb-3">
            The component state is the single source of truth. You drive the input's value
            via <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">value</code> +{' '}
            <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">onChange</code>.
            Notice the live state panel updates on every keystroke, and the submit button
            stays disabled until validation passes.
          </p>
          <ControlledDemo />
          <CodeBlock title="Controlled Input" code={`const [name, setName] = useState('')
const [email, setEmail] = useState('')
const isValid = name.trim().length > 0 && email.includes('@')

<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  <button type="submit" disabled={!isValid}>Submit</button>
</form>`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Uncontrolled Inputs</h3>
          <p className="text-gray-300 mb-3">
            The DOM itself holds the value. You read it when you need it — typically
            via a ref or <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded">FormData</code> at
            submit time. React does not re-render on every keystroke.
          </p>
          <UncontrolledDemo />
          <CodeBlock title="Uncontrolled Input" code={`const formRef = useRef<HTMLFormElement>(null)

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const data = new FormData(formRef.current!)
  console.log(data.get('name'), data.get('email'))
}

<form ref={formRef} onSubmit={handleSubmit}>
  <input name="name" defaultValue="" />
  <input name="email" defaultValue="" />
  <button type="submit">Submit</button>
</form>`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Trade-offs</h3>
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-cyan-400 mb-3">Controlled</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-400 uppercase tracking-wider mb-2 font-semibold">Strengths</p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>Validate, transform, or reject input on every keystroke (e.g., force uppercase, limit length, mask credit card numbers).</li>
                    <li>Form state is always in sync with component state — easy to read, submit, or derive from.</li>
                    <li>Enables conditional logic that depends on the current value (e.g., disabling a submit button until the form is valid).</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-red-400 uppercase tracking-wider mb-2 font-semibold">Weaknesses</p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>Every keystroke triggers a state update and re-render. In large forms or heavy component trees this can matter.</li>
                    <li>More boilerplate — you need state + handler per field.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-5">
              <h4 className="text-md font-semibold text-cyan-400 mb-3">Uncontrolled</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-green-400 uppercase tracking-wider mb-2 font-semibold">Strengths</p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>Fewer re-renders — React doesn't re-render on every keystroke because state isn't changing.</li>
                    <li>Less boilerplate for simple forms where you only need the value at submission.</li>
                    <li>Works naturally with the native <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">{'<form>'}</code> + <code className="text-xs bg-gray-800 px-1 py-0.5 rounded">FormData</code> pattern.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-red-400 uppercase tracking-wider mb-2 font-semibold">Weaknesses</p>
                  <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                    <li>You can't easily do per-keystroke validation or transformation.</li>
                    <li>Harder to keep UI in sync with the input value (e.g., showing a character count or live preview).</li>
                    <li>Mixing controlled and uncontrolled on the same input is a common source of bugs.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">When to Use Which</h3>
          <div className="bg-gray-900 rounded-lg p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 pr-4 text-gray-400 font-medium">Scenario</th>
                    <th className="py-2 px-4 text-cyan-400 font-medium">Recommended</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Per-keystroke validation/formatting</td>
                    <td className="py-2 px-4">Controlled</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Derived UI from input value (live preview, char count)</td>
                    <td className="py-2 px-4">Controlled</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Simple form, only need values on submit</td>
                    <td className="py-2 px-4">Uncontrolled</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 pr-4">Integrating with non-React code / third-party DOM libs</td>
                    <td className="py-2 px-4">Uncontrolled</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Performance-critical form with many fields</td>
                    <td className="py-2 px-4">Uncontrolled (or a form library)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Most React codebases default to <strong className="text-gray-300">controlled inputs</strong> because the
              flexibility outweighs the small cost of extra re-renders. If you find yourself fighting performance or
              boilerplate, libraries like React Hook Form use uncontrolled inputs under the hood while giving you a
              controlled-like API — a good middle ground.
            </p>
          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
