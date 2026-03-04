import { createFileRoute } from "@tanstack/react-router";
import { memo, useRef, useState } from "react";
import ChapterLayout from "#/components/ChapterLayout";
import CodeBlock from "#/components/CodeBlock";

export const Route = createFileRoute("/chapters/component-design")({
	component: ComponentDesignChapter,
});

// --- Section 1: Object prop vs primitive props ---

function UserCardPrimitive({
	name,
	title,
	renderCount,
}: { name: string; title: string; renderCount: { current: number } }) {
	renderCount.current++;
	return (
		<div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
			<div className="w-8 h-8 rounded-full bg-cyan-700 flex items-center justify-center text-xs font-bold">
				{name[0]}
			</div>
			<div>
				<p className="text-sm font-medium text-white">{name}</p>
				<p className="text-xs text-gray-400">{title}</p>
			</div>
		</div>
	);
}

const MemoizedPrimitive = memo(UserCardPrimitive);

function UserCardObject({
	user,
	renderCount,
}: {
	user: { name: string; title: string };
	renderCount: { current: number };
}) {
	renderCount.current++;
	return (
		<div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
			<div className="w-8 h-8 rounded-full bg-cyan-700 flex items-center justify-center text-xs font-bold">
				{user.name[0]}
			</div>
			<div>
				<p className="text-sm font-medium text-white">{user.name}</p>
				<p className="text-xs text-gray-400">{user.title}</p>
			</div>
		</div>
	);
}

const MemoizedObject = memo(UserCardObject);

function PropShapeDemo() {
	const [count, setCount] = useState(0);
	const renderCountPrimitive = useRef(0);
	const renderCountObject = useRef(0);

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => setCount((c) => c + 1)}
					className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
				>
					Re-render parent ({count})
				</button>
				<span className="text-sm text-gray-500">
					Both cards are wrapped in React.memo
				</span>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
						Primitive props
					</h4>
					<MemoizedPrimitive
						name="Alice"
						title="Developer"
						renderCount={renderCountPrimitive}
					/>
					<RenderCount
						label="Renders"
						countRef={renderCountPrimitive}
						tick={count}
					/>
				</div>

				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
						Object prop (new literal each render)
					</h4>
					<MemoizedObject
						user={{ name: "Alice", title: "Developer" }}
						renderCount={renderCountObject}
					/>
					<RenderCount
						label="Renders"
						countRef={renderCountObject}
						tick={count}
					/>
				</div>
			</div>

			<p className="text-sm text-gray-500">
				Click the button. The primitive-props card stays at 1 render because{" "}
				<code className="text-cyan-400">"Alice" === "Alice"</code>. The
				object-prop card re-renders every time because{" "}
				<code className="text-cyan-400">{"{{}} !== {{}}"}</code> — a new object
				literal is created each render.
			</p>
		</div>
	);
}

function RenderCount({
	label,
	countRef,
	tick: _tick,
}: {
	label: string;
	countRef: { current: number };
	tick: number;
}) {
	return (
		<span className="text-xs text-gray-500 font-mono">
			{label}: <span className="text-cyan-400">{countRef.current}</span>
		</span>
	);
}

// --- Section 2: Prop spreading ---

// --- Section 3: Discriminated unions ---

type AsyncState<T> =
	| { status: "loading" }
	| { status: "error"; message: string }
	| { status: "success"; data: T };

function UserList(props: AsyncState<string[]>) {
	switch (props.status) {
		case "loading":
			return (
				<div className="flex items-center gap-2 text-gray-400 text-sm py-4">
					<div className="w-4 h-4 border-2 border-gray-500 border-t-cyan-400 rounded-full animate-spin" />
					Loading users...
				</div>
			);
		case "error":
			return (
				<div className="border-l-4 border-red-500 bg-red-500/10 rounded-r-lg p-3 text-red-300 text-sm">
					{props.message}
				</div>
			);
		case "success":
			return (
				<ul className="space-y-1">
					{props.data.map((name) => (
						<li
							key={name}
							className="text-sm text-gray-300 bg-gray-800 rounded px-3 py-1.5"
						>
							{name}
						</li>
					))}
				</ul>
			);
	}
}

function DiscriminatedUnionDemo() {
	const [state, setState] = useState<AsyncState<string[]>>({
		status: "loading",
	});

	const cycle = () => {
		setState((prev) => {
			if (prev.status === "loading")
				return { status: "success", data: ["Alice", "Bob", "Carol"] };
			if (prev.status === "success")
				return { status: "error", message: "Failed to fetch users" };
			return { status: "loading" };
		});
	};

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={cycle}
					className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
				>
					Cycle state
				</button>
				<span className="text-sm text-gray-400 font-mono">
					status: <span className="text-cyan-400">{state.status}</span>
				</span>
			</div>
			<UserList {...state} />
			<p className="text-sm text-gray-500">
				Each state variant carries only the fields that make sense. TypeScript
				narrows the type in each branch — you can't accidentally access{" "}
				<code className="text-cyan-400">data</code> in the error state.
			</p>
		</div>
	);
}

// --- Section 4: Components inside components ---

function BrokenInnerComponent() {
	const [filter, setFilter] = useState("");

	// biome-ignore lint/correctness/noNestedComponentDefinitions: intentionally demonstrating the anti-pattern
	function FilteredList() {
		const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
		const filtered = items.filter((item) =>
			item.toLowerCase().includes(filter.toLowerCase()),
		);
		return (
			<div className="space-y-1">
				{filtered.map((item) => (
					<div
						key={item}
						className="text-sm text-gray-300 bg-gray-800 rounded px-3 py-1.5"
					>
						{item}
					</div>
				))}
				<input
					placeholder="Type here, then filter..."
					className="mt-2 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
				/>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<input
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				placeholder="Filter fruits..."
				className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
			/>
			<FilteredList />
		</div>
	);
}

function FixedFilteredList({ filter }: { filter: string }) {
	const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
	const filtered = items.filter((item) =>
		item.toLowerCase().includes(filter.toLowerCase()),
	);
	return (
		<div className="space-y-1">
			{filtered.map((item) => (
				<div
					key={item}
					className="text-sm text-gray-300 bg-gray-800 rounded px-3 py-1.5"
				>
					{item}
				</div>
			))}
			<input
				placeholder="Type here, then filter..."
				className="mt-2 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
			/>
		</div>
	);
}

function FixedInnerComponent() {
	const [filter, setFilter] = useState("");

	return (
		<div className="space-y-3">
			<input
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				placeholder="Filter fruits..."
				className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
			/>
			<FixedFilteredList filter={filter} />
		</div>
	);
}

function InnerComponentDemo() {
	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider">
						Component defined inside parent
					</h4>
					<BrokenInnerComponent />
				</div>
				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
						Component defined outside parent
					</h4>
					<FixedInnerComponent />
				</div>
			</div>
			<p className="text-sm text-gray-500">
				Type in the bottom input inside each list, then type in the filter. On
				the left, the bottom input loses its text on every keystroke because{" "}
				<code className="text-cyan-400">FilteredList</code> is redefined each
				render — React sees a new component type and unmounts/remounts the
				entire subtree. On the right, the component identity is stable so state
				is preserved.
			</p>
		</div>
	);
}

// --- Section 5: Children vs config props ---

function ConfigCard({
	header,
	body,
}: {
	header: React.ReactNode;
	body: React.ReactNode;
}) {
	return (
		<div className="bg-gray-800 rounded-lg overflow-hidden">
			<div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
				{header}
			</div>
			<div className="p-4">{body}</div>
		</div>
	);
}

function ComposableCard({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-gray-800 rounded-lg overflow-hidden">{children}</div>
	);
}

function CardHeader({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
			{children}
		</div>
	);
}

function CardBody({ children }: { children: React.ReactNode }) {
	return <div className="p-4">{children}</div>;
}

function CompositionDemo() {
	const [showFooter, setShowFooter] = useState(false);

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-4">
			<div className="flex items-center gap-4">
				<label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
					<input
						type="checkbox"
						checked={showFooter}
						onChange={(e) => setShowFooter(e.target.checked)}
						className="rounded"
					/>
					Show footer
				</label>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
						Config props
					</h4>
					<ConfigCard
						header={
							<h4 className="text-sm font-semibold text-white">User Profile</h4>
						}
						body={<p className="text-sm text-gray-300">Alice — Developer</p>}
					/>
					<p className="text-xs text-gray-500">
						Adding a footer requires changing the Card component's API.
					</p>
				</div>

				<div className="space-y-2">
					<h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
						Composition
					</h4>
					<ComposableCard>
						<CardHeader>
							<h4 className="text-sm font-semibold text-white">User Profile</h4>
						</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-300">Alice — Developer</p>
						</CardBody>
						{showFooter && (
							<div className="px-4 py-2 border-t border-gray-600 bg-gray-750">
								<p className="text-xs text-gray-400">Last active 2 hours ago</p>
							</div>
						)}
					</ComposableCard>
					<p className="text-xs text-gray-500">
						Footer added without changing the Card component at all.
					</p>
				</div>
			</div>

			<p className="text-sm text-gray-500">
				Toggle the footer. The composition pattern lets the caller add sections
				without modifying the Card component. With config props, you'd need to
				add a new <code className="text-cyan-400">footer</code> prop and update
				the component.
			</p>
		</div>
	);
}

// --- Main chapter ---

function ComponentDesignChapter() {
	return (
		<ChapterLayout slug="component-design">
			<div className="space-y-8">
				<div>
					<h3 className="text-lg font-semibold mb-3">
						Object Prop vs. Primitive Props
					</h3>
					<p className="text-gray-300 mb-3">
						Passing an object literal as a prop creates a new reference every
						render, defeating <code className="text-cyan-400">React.memo</code>.
						Primitive props are compared by value, so memoization works
						naturally.
					</p>
					<PropShapeDemo />
					<CodeBlock
						title="Primitive props vs. object prop"
						code={`// GOOD: primitives — React.memo compares by value
<UserCard name="Alice" title="Developer" />
// "Alice" === "Alice" → skip re-render ✓

// CAREFUL: object literal — new reference every render
<UserCard user={{ name: "Alice", title: "Developer" }} />
// {} !== {} → always re-renders ✗

// OK: stable reference from state/query — no problem
const user = useUser(id) // same object between renders
<UserCard user={user} />  // memo works fine ✓`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">Prop Spreading</h3>
					<p className="text-gray-300 mb-3">
						Spreading props with{" "}
						<code className="text-cyan-400">{"...props"}</code> is convenient
						for wrapper components, but it can forward invalid DOM attributes
						and make the API harder to understand. Destructure what you need
						explicitly and spread the rest onto the target element.
					</p>
					<CodeBlock
						title="Controlled prop spreading"
						code={`// FRAGILE: spreads everything, including your custom props, onto the DOM
function TextInput(props: InputProps) {
  return <input {...props} />
  // If InputProps has 'label' or 'error', they leak to the DOM
}

// BETTER: destructure your props, spread the rest
function TextInput({ label, error, className, ...inputProps }: InputProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        {...inputProps}
        className={cn("base-styles", className)}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  )
}

// Only standard HTML attributes reach the <input> element.
// Your custom props (label, error) are handled explicitly.`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Discriminated Union Props
					</h3>
					<p className="text-gray-300 mb-3">
						When a component can be in several states, use a discriminated union
						instead of a bag of optional props. Each variant carries only the
						fields that make sense, and TypeScript prevents impossible
						combinations.
					</p>
					<DiscriminatedUnionDemo />
					<CodeBlock
						title="Discriminated union vs. optional props"
						code={`// BAD: nothing prevents { loading: true, error: "oops", data: [...] }
type Props = {
  loading?: boolean
  error?: string
  data?: User[]
}

// GOOD: exactly one variant at a time
type Props =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: User[] }

function UserList(props: Props) {
  switch (props.status) {
    case "loading":
      return <Spinner />
    case "error":
      return <Alert>{props.message}</Alert>  // TS knows message exists
    case "success":
      return <ul>{props.data.map(...)}</ul>  // TS knows data exists
  }
}`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Don't Define Components Inside Components
					</h3>
					<p className="text-gray-300 mb-3">
						A component defined inside another component gets a new function
						identity every render. React sees a different component type and
						unmounts/remounts the entire subtree — destroying all DOM state,
						focus, and internal state.
					</p>
					<InnerComponentDemo />
					<CodeBlock
						title="Inner component vs. outer component"
						code={`// BAD: FilteredList is redefined every render
function Dashboard() {
  const [filter, setFilter] = useState("")

  function FilteredList() {  // ← new identity each render!
    return <ul>...</ul>
  }

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <FilteredList />  {/* unmounts/remounts every keystroke */}
    </div>
  )
}

// GOOD: FilteredList has a stable identity
function FilteredList({ filter }: { filter: string }) {
  return <ul>...</ul>
}

function Dashboard() {
  const [filter, setFilter] = useState("")
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <FilteredList filter={filter} />  {/* stable — state preserved */}
    </div>
  )
}`}
					/>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Children vs. Config Props
					</h3>
					<p className="text-gray-300 mb-3">
						Config props (<code className="text-cyan-400">header</code>,{" "}
						<code className="text-cyan-400">body</code>,{" "}
						<code className="text-cyan-400">footer</code>) lock down the
						component's structure. Composition with{" "}
						<code className="text-cyan-400">children</code> lets the caller
						control what goes inside without modifying the component's API.
					</p>
					<CompositionDemo />
					<CodeBlock
						title="Config props vs. composition"
						code={`// CONFIG PROPS: rigid — adding a footer means changing the API
<Card
  header={<h4>Profile</h4>}
  body={<p>Alice</p>}
/>
// Want a footer? You need to add a 'footer' prop to Card.

// COMPOSITION: flexible — caller controls structure
<Card>
  <Card.Header>
    <h4>Profile</h4>
  </Card.Header>
  <Card.Body>
    <p>Alice</p>
  </Card.Body>
  {showFooter && (
    <Card.Footer>
      <p>Last active 2h ago</p>
    </Card.Footer>
  )}
</Card>
// Footer added without touching the Card component.`}
					/>
				</div>
			</div>
		</ChapterLayout>
	);
}
