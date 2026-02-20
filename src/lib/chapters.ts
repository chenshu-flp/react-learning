export interface Chapter {
  number: number
  title: string
  description: string
  path: string
  category: 'Core Basics' | 'Intermediate'
}

export const chapters: Chapter[] = [
  {
    number: 1,
    title: 'JSX',
    description:
      'Learn how JSX lets you write HTML-like syntax in JavaScript, embed expressions, and understand the differences between JSX and HTML.',
    path: '/chapters/1',
    category: 'Core Basics',
  },
  {
    number: 2,
    title: 'Components & Props',
    description:
      'Build reusable UI pieces with components and pass data between them using props.',
    path: '/chapters/2',
    category: 'Core Basics',
  },
  {
    number: 3,
    title: 'State (useState)',
    description:
      'Make your components interactive by adding state that triggers re-renders when it changes.',
    path: '/chapters/3',
    category: 'Core Basics',
  },
  {
    number: 4,
    title: 'Event Handling',
    description:
      'Respond to user interactions like clicks, keyboard input, and other DOM events.',
    path: '/chapters/4',
    category: 'Core Basics',
  },
  {
    number: 5,
    title: 'Conditional Rendering',
    description:
      'Show or hide UI elements based on conditions using ternaries, logical operators, and early returns.',
    path: '/chapters/5',
    category: 'Core Basics',
  },
  {
    number: 6,
    title: 'Lists & Keys',
    description:
      "Render dynamic lists of elements and understand why keys matter for React's reconciliation.",
    path: '/chapters/6',
    category: 'Core Basics',
  },
  {
    number: 7,
    title: 'Forms',
    description:
      'Handle user input with controlled components, form submission, and basic validation.',
    path: '/chapters/7',
    category: 'Core Basics',
  },
  {
    number: 8,
    title: 'Effects (useEffect)',
    description:
      'Synchronize your components with external systems using effects, and learn about cleanup.',
    path: '/chapters/8',
    category: 'Core Basics',
  },
  {
    number: 9,
    title: 'Refs (useRef)',
    description:
      'Access DOM elements directly and persist values across renders without triggering re-renders.',
    path: '/chapters/9',
    category: 'Intermediate',
  },
  {
    number: 10,
    title: 'Context',
    description:
      'Share state across deeply nested components without prop drilling.',
    path: '/chapters/10',
    category: 'Intermediate',
  },
  {
    number: 11,
    title: 'useReducer',
    description:
      'Manage complex state logic with reducers for predictable state transitions.',
    path: '/chapters/11',
    category: 'Intermediate',
  },
  {
    number: 12,
    title: 'Custom Hooks',
    description:
      'Extract and reuse stateful logic across components by building your own hooks.',
    path: '/chapters/12',
    category: 'Intermediate',
  },
  {
    number: 13,
    title: 'useMemo & useCallback',
    description:
      'Optimize performance by memoizing expensive computations and stabilizing callback references.',
    path: '/chapters/13',
    category: 'Intermediate',
  },
  {
    number: 14,
    title: 'Error Boundaries',
    description:
      "Catch and handle errors gracefully so a single component failure doesn't crash the whole app.",
    path: '/chapters/14',
    category: 'Intermediate',
  },
]
