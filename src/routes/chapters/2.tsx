import { createFileRoute } from "@tanstack/react-router";
import ChapterLayout from "#/components/ChapterLayout";

export const Route = createFileRoute("/chapters/2")({ component: Chapter2 });

function UserCard({
	name,
	role,
	avatarSeed,
}: {
	name: string;
	role: string;
	avatarSeed: string;
}) {
	return (
		<div className="flex items-center gap-4 bg-gray-900 rounded-lg p-4">
			<img
				src={`https://api.dicebear.com/9.x/initials/svg?seed=${avatarSeed}`}
				alt={name}
				className="w-12 h-12 rounded-full"
			/>
			<div>
				<h4 className="font-semibold text-white">{name}</h4>
				<p className="text-sm text-gray-400">{role}</p>
			</div>
		</div>
	);
}

function Alert({
	variant = "info",
	children,
}: {
	variant?: "info" | "warning" | "success";
	children: React.ReactNode;
}) {
	const colors = {
		info: "border-blue-500 bg-blue-500/10 text-blue-300",
		warning: "border-yellow-500 bg-yellow-500/10 text-yellow-300",
		success: "border-green-500 bg-green-500/10 text-green-300",
	};

	return (
		<div className={`border-l-4 rounded-r-lg p-4 ${colors[variant]}`}>
			{children}
		</div>
	);
}

function Container({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="bg-gray-900 rounded-lg overflow-hidden">
			<div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
				<h4 className="text-sm font-semibold text-gray-300">{title}</h4>
			</div>
			<div className="p-4">{children}</div>
		</div>
	);
}

function Chapter2() {
	return (
		<ChapterLayout chapterNumber={2}>
			<div className="space-y-8">
				<div>
					<h3 className="text-lg font-semibold mb-3">Passing Props</h3>
					<p className="text-gray-300 mb-3">
						Each card below is the same component rendered with different props:
					</p>
					<div className="space-y-3">
						<UserCard
							name="Alice Johnson"
							role="Frontend Developer"
							avatarSeed="alice"
						/>
						<UserCard
							name="Bob Smith"
							role="Backend Developer"
							avatarSeed="bob"
						/>
						<UserCard
							name="Carol Williams"
							role="Designer"
							avatarSeed="carol"
						/>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Props with Default Values
					</h3>
					<p className="text-gray-300 mb-3">
						The Alert component has a{" "}
						<code className="text-cyan-400">variant</code> prop that defaults to
						"info":
					</p>
					<div className="space-y-3">
						<Alert>This uses the default "info" variant.</Alert>
						<Alert variant="warning">This is a warning alert.</Alert>
						<Alert variant="success">This is a success alert.</Alert>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-semibold mb-3">
						Children Prop (Composition)
					</h3>
					<p className="text-gray-300 mb-3">
						The Container component wraps whatever you put inside it:
					</p>
					<div className="space-y-3">
						<Container title="User Profile">
							<UserCard
								name="Dana Lee"
								role="Full-Stack Developer"
								avatarSeed="dana"
							/>
						</Container>
						<Container title="System Status">
							<Alert variant="success">All systems operational.</Alert>
						</Container>
					</div>
				</div>
			</div>
		</ChapterLayout>
	);
}
