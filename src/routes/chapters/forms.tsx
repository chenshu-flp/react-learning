import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/forms')({ component: Chapter7 })

function ControlledForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('developer')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState<Record<string, string | boolean> | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted({ name, email, role, agreed })
  }

  const isValid = name.trim().length > 0 && email.includes('@') && agreed

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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
          {email.length > 0 && !email.includes('@') && (
            <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded"
          />
          I agree to the terms
        </label>
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors font-medium text-sm"
        >
          Submit
        </button>
      </form>

      <div className="bg-gray-800 rounded-lg p-4 text-sm">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
          Live state
        </p>
        <pre className="text-cyan-400 font-mono text-xs">
          {JSON.stringify({ name, email, role, agreed }, null, 2)}
        </pre>
      </div>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-semibold text-sm mb-2">
            Form submitted!
          </p>
          <pre className="text-green-300 font-mono text-xs">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function MultipleInputs() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows={3}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
        />
      </div>
      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-sm text-gray-300">
          Preview: <span className="text-white font-semibold">{form.firstName} {form.lastName}</span>
        </p>
        {form.bio && (
          <p className="text-sm text-gray-400 mt-1">{form.bio}</p>
        )}
      </div>
    </div>
  )
}

function Chapter7() {
  return (
    <ChapterLayout slug="forms">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Controlled Form with Validation</h3>
          <p className="text-gray-300 mb-3">
            Every input is controlled by React state. The submit button is disabled
            until all validation rules pass:
          </p>
          <ControlledForm />
          <CodeBlock title="Controlled Form" code={`const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [agreed, setAgreed] = useState(false)

const isValid = name.trim().length > 0 && email.includes('@') && agreed

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // process form data...
}

<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <input value={email} onChange={(e) => setEmail(e.target.value)} />
  <label>
    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
    I agree
  </label>
  <button type="submit" disabled={!isValid}>Submit</button>
</form>`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Shared Change Handler</h3>
          <p className="text-gray-300 mb-3">
            Use a single handler with computed property names to manage
            multiple inputs with one state object:
          </p>
          <MultipleInputs />
          <CodeBlock title="Shared Change Handler" code={`const [form, setForm] = useState({
  firstName: '',
  lastName: '',
  bio: '',
})

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setForm({ ...form, [e.target.name]: e.target.value })
}

<input name="firstName" value={form.firstName} onChange={handleChange} />
<input name="lastName" value={form.lastName} onChange={handleChange} />
<textarea name="bio" value={form.bio} onChange={handleChange} />`} />
        </div>
      </div>
    </ChapterLayout>
  )
}
