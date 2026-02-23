import { createFileRoute } from '@tanstack/react-router'
import { useReducer, useState } from 'react'
import ChapterLayout from '#/components/ChapterLayout'
import CodeBlock from '#/components/CodeBlock'

export const Route = createFileRoute('/chapters/use-reducer')({ component: Chapter14 })

interface Todo {
  id: number
  text: string
  done: boolean
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' }

interface TodoState {
  todos: Todo[]
  nextId: number
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.text, done: false },
        ],
        nextId: state.nextId + 1,
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t,
        ),
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      }
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((t) => !t.done),
      }
    case 'TOGGLE_ALL': {
      const allDone = state.todos.every((t) => t.done)
      return {
        ...state,
        todos: state.todos.map((t) => ({ ...t, done: !allDone })),
      }
    }
  }
}

const initialState: TodoState = {
  todos: [
    { id: 1, text: 'Learn useReducer', done: false },
    { id: 2, text: 'Build a todo app', done: false },
    { id: 3, text: 'Understand dispatch', done: true },
  ],
  nextId: 4,
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  const filteredTodos = state.todos.filter((t) => {
    if (filter === 'active') return !t.done
    if (filter === 'completed') return t.done
    return true
  })

  const remaining = state.todos.filter((t) => !t.done).length

  return (
    <div className="bg-gray-900 rounded-lg p-6 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (input.trim()) {
            dispatch({ type: 'ADD', text: input.trim() })
            setInput('')
          }
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
        >
          Add
        </button>
      </form>

      {state.todos.length > 0 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ALL' })}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
          >
            Toggle All
          </button>
          <button
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
          >
            Clear Completed
          </button>
          <span className="text-xs text-gray-500 ml-auto">
            {remaining} item{remaining !== 1 && 's'} left
          </span>
        </div>
      )}

      <ul className="space-y-1">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 bg-gray-800 rounded-lg px-3 py-2"
          >
            <button
              onClick={() => dispatch({ type: 'TOGGLE', id: todo.id })}
              className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                todo.done
                  ? 'bg-cyan-600 border-cyan-600'
                  : 'border-gray-500 hover:border-cyan-500'
              }`}
            >
              {todo.done && <span className="text-white text-xs">&#10003;</span>}
            </button>
            <span
              className={`flex-1 text-sm ${
                todo.done ? 'line-through text-gray-500' : 'text-gray-300'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
              className="text-red-400 hover:text-red-300 text-sm px-1"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {state.todos.length > 0 && (
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          Dispatched Actions Log (state shape)
        </p>
        <pre className="text-cyan-400 font-mono text-xs overflow-x-auto">
          {JSON.stringify({ todoCount: state.todos.length, nextId: state.nextId, remaining }, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function Chapter14() {
  return (
    <ChapterLayout slug="use-reducer">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Todo App with useReducer</h3>
          <p className="text-gray-300 mb-3">
            All state changes go through a reducer function via dispatch. Each
            action describes what happened -- the reducer decides how state changes:
          </p>
          <TodoApp />
          <CodeBlock title="useReducer Todo App" code={`type Action =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return {
        todos: [...state.todos, { id: state.nextId, text: action.text, done: false }],
        nextId: state.nextId + 1,
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      }
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      }
  }
}

const [state, dispatch] = useReducer(reducer, initialState)

dispatch({ type: 'ADD', text: 'Learn useReducer' })
dispatch({ type: 'TOGGLE', id: 1 })
dispatch({ type: 'DELETE', id: 1 })`} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">When to Use useReducer</h3>
          <div className="bg-gray-900 rounded-lg p-6 space-y-3 text-sm text-gray-300">
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>Multiple sub-values in state (todos array + nextId counter)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>Complex state transitions (toggle all depends on current state)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>Actions are easy to test -- pure functions with predictable outputs</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-cyan-400 flex-shrink-0">&#10003;</span>
              <p>State logic can be extracted and reused</p>
            </div>
          </div>
        </div>
      </div>
    </ChapterLayout>
  )
}
