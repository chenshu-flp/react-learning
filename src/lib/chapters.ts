export interface Chapter {
  title: string
  description: string
  slug: string
  category: 'Core Basics' | 'Managing State' | 'Intermediate'
}

export const chapters: Chapter[] = [
  {
    title: 'JSX',
    description:
      'Learn how JSX lets you write HTML-like syntax in JavaScript, embed expressions, and understand the differences between JSX and HTML.',
    slug: 'jsx',
    category: 'Core Basics',
  },
  {
    title: 'Components & Props',
    description:
      'Build reusable UI pieces with components and pass data between them using props.',
    slug: 'components-props',
    category: 'Core Basics',
  },
  {
    title: 'State (useState)',
    description:
      'Make your components interactive by adding state that triggers re-renders when it changes.',
    slug: 'use-state',
    category: 'Core Basics',
  },
  {
    title: 'Event Handling',
    description:
      'Respond to user interactions like clicks, keyboard input, and other DOM events.',
    slug: 'events',
    category: 'Core Basics',
  },
  {
    title: 'Conditional Rendering',
    description:
      'Show or hide UI elements based on conditions using ternaries, logical operators, and early returns.',
    slug: 'conditional-rendering',
    category: 'Core Basics',
  },
  {
    title: 'Lists & Keys',
    description:
      "Render dynamic lists of elements and understand why keys matter for React's reconciliation.",
    slug: 'lists-keys',
    category: 'Core Basics',
  },
  {
    title: 'Forms',
    description:
      'Handle user input with controlled components, form submission, and basic validation.',
    slug: 'forms',
    category: 'Core Basics',
  },
  {
    title: 'Effects (useEffect)',
    description:
      'Synchronize your components with external systems using effects, and learn about cleanup.',
    slug: 'use-effect',
    category: 'Core Basics',
  },
  {
    title: 'Reacting to Input with State',
    description:
      'Think about UI changes as state changes. Model your components as state machines with declarative transitions.',
    slug: 'reactive-input',
    category: 'Managing State',
  },
  {
    title: 'Choosing the State Structure',
    description:
      'Structure your state to avoid redundancy and contradictions. Derive values instead of syncing them.',
    slug: 'state-structure',
    category: 'Managing State',
  },
  {
    title: 'Sharing State Between Components',
    description:
      'Lift state up to a common parent so sibling components can share and stay in sync.',
    slug: 'sharing-state',
    category: 'Managing State',
  },
  {
    title: 'Refs (useRef)',
    description:
      'Access DOM elements directly and persist values across renders without triggering re-renders.',
    slug: 'use-ref',
    category: 'Intermediate',
  },
  {
    title: 'Context',
    description:
      'Share state across deeply nested components without prop drilling.',
    slug: 'context',
    category: 'Intermediate',
  },
  {
    title: 'useReducer',
    description:
      'Manage complex state logic with reducers for predictable state transitions.',
    slug: 'use-reducer',
    category: 'Intermediate',
  },
  {
    title: 'Custom Hooks',
    description:
      'Extract and reuse stateful logic across components by building your own hooks.',
    slug: 'custom-hooks',
    category: 'Intermediate',
  },
  {
    title: 'useMemo & useCallback',
    description:
      'Optimize performance by memoizing expensive computations and stabilizing callback references.',
    slug: 'memoization',
    category: 'Intermediate',
  },
  {
    title: 'Error Boundaries',
    description:
      "Catch and handle errors gracefully so a single component failure doesn't crash the whole app.",
    slug: 'error-boundaries',
    category: 'Intermediate',
  },
]

export function chapterPath(slug: string) {
  return `/chapters/${slug}` as const
}
