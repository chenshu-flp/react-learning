export interface Chapter {
  title: string
  description: string
  slug: string
  category: 'Core Basics' | 'Intermediate'
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
    category: 'Intermediate',
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
    title: 'React Rendering',
    description:
      'Understand when and why React re-renders components, and how element identity determines whether a subtree is skipped.',
    slug: 'react-rendering',
    category: 'Intermediate',
  },
  {
    title: 'Move State Down',
    description:
      'Improve performance by moving state into the component that actually uses it, so expensive siblings avoid unnecessary re-renders.',
    slug: 'move-state-down',
    category: 'Intermediate',
  },
  {
    title: 'Lift Content Up',
    description:
      "Use the children prop to keep expensive subtrees from re-rendering when a parent's state changes.",
    slug: 'lift-content-up',
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
