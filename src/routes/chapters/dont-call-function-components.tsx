import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ChapterLayout from "#/components/ChapterLayout";
import CodeBlock from "#/components/CodeBlock";

export const Route = createFileRoute("/chapters/dont-call-function-components")(
	{
		component: DontCallFunctionComponentsChapter,
	},
);

function Counter() {
	const [count, setCount] = useState(0);
	const increment = () => setCount((c) => c + 1);
	return (
		<button
			type="button"
			onClick={increment}
			className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-white tabular-nums"
		>
			Count: {count}
		</button>
	);
}

function BrokenListDemo() {
	const [items, setItems] = useState<{ id: number }[]>([]);
	const [error, setError] = useState<string | null>(null);

	const addItem = () => {
		setError(null);
		try {
			setItems((prev) => [...prev, { id: prev.length }]);
		} catch (e) {
			setError(String(e));
		}
	};

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={addItem}
					className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
				>
					Add Item
				</button>
				<span className="text-sm text-gray-400">
					{items.length} item{items.length !== 1 ? "s" : ""} in list
				</span>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
						Calling the function{" "}
						<code className="normal-case text-xs bg-gray-800 px-1.5 py-0.5 rounded">
							items.map(Counter)
						</code>
					</h4>
					<div className="space-y-2 min-h-[48px]">
						{items.map((item) => {
							try {
								return <div key={item.id}>{Counter()}</div>;
							} catch {
								return (
									<div
										key={item.id}
										className="text-red-400 text-xs bg-red-950 rounded px-3 py-2"
									>
										Error: Rendered fewer hooks than expected
									</div>
								);
							}
						})}
					</div>
				</div>

				<div className="space-y-3">
					<h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider">
						Rendering as JSX{" "}
						<code className="normal-case text-xs bg-gray-800 px-1.5 py-0.5 rounded">
							{"<Counter />"}
						</code>
					</h4>
					<div className="space-y-2 min-h-[48px]">
						{items.map((item) => (
							<div key={item.id}>
								<Counter />
							</div>
						))}
					</div>
				</div>
			</div>

			{error && (
				<div className="text-red-400 text-sm bg-red-950 rounded px-3 py-2 font-mono">
					{error}
				</div>
			)}

			<p className="text-sm text-gray-500">
				Add two or more items. On the left, React throws an error because{" "}
				<code className="text-cyan-400">Counter()</code> is a plain function
				call — its hooks get registered under the parent component. On the
				right, each <code className="text-cyan-400">{"<Counter />"}</code> is
				its own component instance with its own hooks.
			</p>
		</div>
	);
}

function HookIdentityDemo() {
	const [showDirect, setShowDirect] = useState(true);

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => setShowDirect((v) => !v)}
					className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
				>
					Toggle: {showDirect ? "Counter()" : "<Counter />"}
				</button>
				<span className="text-sm text-gray-400 font-mono">
					Currently using:{" "}
					<span className={showDirect ? "text-red-400" : "text-green-400"}>
						{showDirect ? "Counter()" : "<Counter />"}
					</span>
				</span>
			</div>

			<div className="bg-gray-800 rounded-lg p-4 space-y-3">
				<p className="text-sm text-gray-300">Here is a counter:</p>
				{showDirect ? Counter() : <Counter />}
			</div>

			<p className="text-sm text-gray-500">
				This "works" in both modes because there's always exactly one Counter,
				so the hook count is stable. But with{" "}
				<code className="text-cyan-400">Counter()</code>, the useState belongs
				to the <em>parent</em> component — not to Counter. Toggle between modes
				and notice the count resets, because the hook ownership changes.
			</p>
		</div>
	);
}

function InlinedView() {
	return (
		<div className="space-y-4">
			<div className="bg-gray-900 rounded-lg p-5">
				<h4 className="text-sm font-semibold text-yellow-400 mb-3">
					Step 1: Passing a component function to .map()
				</h4>
				<pre className="text-xs bg-gray-800 rounded p-3 text-gray-300 overflow-x-auto font-mono leading-relaxed">
					{`// This looks innocent...
<div>{items.map(Counter)}</div>

// ...but it's the same as:
<div>{items.map(() => Counter())}</div>`}
				</pre>
			</div>

			<div className="bg-gray-900 rounded-lg p-5">
				<h4 className="text-sm font-semibold text-yellow-400 mb-3">
					Step 2: Inline the function body
				</h4>
				<pre className="text-xs bg-gray-800 rounded p-3 text-gray-300 overflow-x-auto font-mono leading-relaxed">
					{`// Now inline Counter()'s body:
<div>
  {items.map(() => {
    const [count, setCount] = useState(0)  // ← belongs to App!
    const increment = () => setCount(c => c + 1)
    return <button onClick={increment}>{count}</button>
  })}
</div>`}
				</pre>
			</div>

			<div className="bg-gray-900 rounded-lg p-5">
				<h4 className="text-sm font-semibold text-yellow-400 mb-3">
					Step 3: See the problem
				</h4>
				<p className="text-gray-300 text-sm mb-3">
					After inlining, it's clear:{" "}
					<code className="text-cyan-400">useState</code> is called inside{" "}
					<code className="text-cyan-400">.map()</code>, which means the number
					of hook calls changes whenever the list length changes. This violates
					the Rules of Hooks — hooks must be called the same number of times on
					every render.
				</p>
				<pre className="text-xs bg-gray-800 rounded p-3 text-gray-300 overflow-x-auto font-mono leading-relaxed">
					{`// React's perspective for App's hooks:
// Render 1 (0 items): [useState(items)]
// Render 2 (1 item):  [useState(items), useState(0)]      ← 1 new hook
// Render 3 (2 items): [useState(items), useState(0), useState(0)]
//
// The hook count keeps changing → React throws an error.`}
				</pre>
			</div>
		</div>
	);
}

function DontCallFunctionComponentsChapter() {
	return (
		<ChapterLayout slug="dont-call-function-components">
			<div className="space-y-8">
				<div>
					<h3 className="text-lg font-semibold mb-3">
						The Problem: Calling vs. Rendering
					</h3>
					<p className="text-gray-300 mb-3">
						A React function component looks like a regular function — so it's
						tempting to call it directly. But{" "}
						<code className="text-cyan-400">Counter()</code> and{" "}
						<code className="text-cyan-400">{"<Counter />"}</code> are
						fundamentally different. When you <em>call</em> a component, React
						has no idea it's a component. Its hooks get registered under whoever
						called it.
					</p>
					<BrokenListDemo />
					<CodeBlock
						title="Calling vs. Rendering"
						code={`function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>{count}</button>
}

function App() {
  const [items, setItems] = useState([])
  const addItem = () => setItems(i => [...i, { id: i.length }])

  return (
    <div>
      <button onClick={addItem}>Add Item</button>

      {/* BAD: calling the function — hooks belong to App */}
      <div>{items.map(Counter)}</div>

      {/* GOOD: rendering as a component — each gets its own hooks */}
      <div>{items.map(i => <Counter key={i.id} />)}</div>
    </div>
  )
}`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Why It Breaks: Walk Through the Inlining
					</h3>
					<p className="text-gray-300 mb-3">
						To understand why this happens, mentally inline the function call.
						Since <code className="text-cyan-400">items.map(Counter)</code> just
						calls <code className="text-cyan-400">Counter()</code> for each
						item, you can replace it with the function body — and the Rules of
						Hooks violation becomes obvious.
					</p>
					<InlinedView />
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						The Subtle Case: When It "Works"
					</h3>
					<p className="text-gray-300 mb-3">
						Sometimes calling a function component appears to work fine — for
						example, when there's always exactly one call. But the hooks still
						belong to the wrong component. This leads to subtle bugs: shared
						state, broken DevTools, and unexpected behavior when you refactor.
					</p>
					<HookIdentityDemo />
					<CodeBlock
						title="It 'works' but hooks are in the wrong place"
						code={`function Counter() {
  const [count, setCount] = useState(0)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      <div>Here is a counter:</div>
      {Counter()}
      {/* "Works" — but count state belongs to App, not Counter.
          React DevTools won't show a Counter component.
          If you later add another Counter() call, hook order may break. */}
    </div>
  )
}

// Always render components as JSX:
function App() {
  return (
    <div>
      <div>Here is a counter:</div>
      <Counter />
    </div>
  )
}`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">The Rule</h3>
					<p className="text-gray-400 text-sm mb-3">
						Based on{" "}
						<a
							href="https://kentcdodds.com/blog/dont-call-a-react-function-component"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-400 hover:underline"
						>
							"Don't call a React function component"
						</a>{" "}
						by Kent C. Dodds.
					</p>
					<div className="bg-gray-900 rounded-lg p-5 space-y-3">
						<p className="text-gray-300 text-sm">
							<strong className="text-white">
								Don't call function components. Render them.
							</strong>
						</p>
						<ul className="text-sm text-gray-400 space-y-2 ml-4 list-disc">
							<li>
								<code className="text-red-400">Counter()</code> — plain function
								call. React doesn't know it's a component. Hooks are registered
								under the caller.
							</li>
							<li>
								<code className="text-red-400">items.map(Counter)</code> — same
								thing; passes the function as a callback, each invocation is a
								plain call.
							</li>
							<li>
								<code className="text-green-400">{"<Counter />"}</code> — JSX
								creates a React element. React manages the component instance
								and its hooks independently.
							</li>
						</ul>
						<p className="text-gray-400 text-sm mt-3">
							This is a consequence of the{" "}
							<a
								href="https://react.dev/reference/rules/rules-of-hooks"
								target="_blank"
								rel="noopener noreferrer"
								className="text-cyan-400 hover:underline"
							>
								Rules of Hooks
							</a>
							: hooks must be called at the top level of a component, and the
							number of hook calls must be the same on every render. When you
							call a component as a function, its hooks become part of the
							caller's hook sequence — and if the call is conditional or inside
							a loop, the count changes between renders.
						</p>
					</div>
				</div>
			</div>
		</ChapterLayout>
	);
}
