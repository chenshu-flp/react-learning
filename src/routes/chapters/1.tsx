import { createFileRoute } from "@tanstack/react-router";
import ChapterLayout from "#/components/ChapterLayout";

export const Route = createFileRoute("/chapters/1")({ component: Chapter1 });

function Chapter1() {
	const name = "React";
	const items = [
		"HTML-like syntax",
		"JavaScript expressions",
		"Component composition",
	];
	const imgUrl = "https://picsum.photos/seed/jsx/300/200";

	return (
		<ChapterLayout chapterNumber={1}>
			<div className="space-y-8">
				<div>
					<h3 className="text-lg font-semibold mb-3">Embedding Expressions</h3>
					<p className="text-gray-300 mb-3">
						JSX lets you put any JavaScript expression inside curly braces:
					</p>
					<div className="bg-gray-900 rounded-lg p-4 space-y-2">
						<p>
							Hello, <span className="text-cyan-400 font-semibold">{name}</span>
							!
						</p>
						<p>
							2 + 2 ={" "}
							<span className="text-cyan-400 font-semibold">{2 + 2}</span>
						</p>
						<p>
							Current time:{" "}
							<span className="text-cyan-400 font-semibold">
								{new Date().toLocaleTimeString()}
							</span>
						</p>
						<p>
							Random number:{" "}
							<span className="text-cyan-400 font-semibold">
								{Math.floor(Math.random() * 100)}
							</span>
						</p>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						JSX vs HTML Differences
					</h3>
					<div className="bg-gray-900 rounded-lg p-4 space-y-3">
						<div>
							<span className="text-gray-500 text-sm">
								className instead of class:
							</span>
							<div className="mt-1 text-cyan-400 font-semibold bg-gray-800 rounded px-3 py-1.5 inline-block">
								I have a className
							</div>
						</div>
						<div>
							<span className="text-gray-500 text-sm">
								htmlFor instead of for:
							</span>
							<div className="mt-1 flex items-center gap-2">
								<label htmlFor="demo-input" className="text-gray-300">
									Label:
								</label>
								<input
									id="demo-input"
									className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm"
									defaultValue="I'm linked to the label"
								/>
							</div>
						</div>
						<div>
							<span className="text-gray-500 text-sm">
								style takes an object, not a string:
							</span>
							<div
								className="mt-1"
								style={{
									color: "#22d3ee",
									fontWeight: "bold",
									fontSize: "1.1rem",
								}}
							>
								Styled with a JS object
							</div>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Rendering a List with .map()
					</h3>
					<div className="bg-gray-900 rounded-lg p-4">
						<p className="text-gray-400 text-sm mb-2">JSX supports:</p>
						<ul className="list-disc list-inside space-y-1">
							{items.map((item) => (
								<li key={item} className="text-gray-300">
									{item}
								</li>
							))}
						</ul>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Using Images & Self-Closing Tags
					</h3>
					<div className="bg-gray-900 rounded-lg p-4">
						<img src={imgUrl} alt="Random placeholder" className="rounded-lg" />
						<p className="text-gray-500 text-sm mt-2">
							Images use self-closing tags: &lt;img /&gt;
						</p>
					</div>
				</div>
			</div>
		</ChapterLayout>
	);
}
