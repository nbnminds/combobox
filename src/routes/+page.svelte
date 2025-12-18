<script lang="ts">
	import Combobox from '$lib/components/combobox.svelte';
	import type { GroupedOption } from '$lib/components/combobox.types.js';

	// Example 1: Simple array options
	const simpleOptions = [
		'JavaScript',
		'TypeScript',
		'Python',
		'Java',
		'C++',
		'Go',
		'Rust',
		'Ruby',
		'PHP',
		'Swift'
	];
	let selectedLanguages = $state<string[]>(['Simple Array']);

	// Example 2: Custom objects
	interface User {
		id: number;
		name: string;
		email: string;
		role: string;
	}

	const users: User[] = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
		{ id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Developer' },
		{ id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Designer' }
	];
	let selectedUsers = $state<User[]>([]);

	// Example 3: Grouped options
	const groupedOptions: GroupedOption<string>[] = [
		{
			group: 'Frontend',
			options: ['React', 'Vue', 'Angular', 'Svelte']
		},
		{
			group: 'Backend',
			options: ['Node.js', 'Django', 'Laravel', 'Spring']
		},
		{
			group: 'Database',
			options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis']
		}
	];
	let selectedTech = $state<string[]>([]);

	// Example 4: Styled variation state
	let selectedVariation = $state<string[]>([]);

	// Example 5: Single select
	let selectedSingle = $state<string | undefined>(undefined);
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
	<div class="container mx-auto max-w-6xl">
		<!-- Header -->
		<header class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900">Combobox Component</h1>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				A powerful, flexible Svelte 5 dropdown component with single-select, multi-select, and AJAX autocomplete capabilities.
			</p>
			<div class="mt-6 flex gap-3 justify-center">
				<a
					href="/ajax-demo"
					class="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
				>
					View AJAX Autocomplete Examples →
				</a>
				<a
					href="/tech-stack"
					class="inline-block rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700"
				>
					View Tech Stack Example →
				</a>
			</div>
		</header>

		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Example 1: Simple Array -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900">Simple Array Example</h2>
					<p class="text-sm text-gray-600">Basic multi-select with string array options</p>
				</div>

				<Combobox
					class="demo-example-1"
					options={simpleOptions}
					bind:value={selectedLanguages}
					placeholder="Select programming languages"
				/>

				{#if selectedLanguages.length > 0}
					<div class="mt-4 rounded-md bg-blue-50 p-3">
						<p class="mb-2 text-sm font-medium text-gray-700">Selected:</p>
						<p class="text-sm text-gray-600">{selectedLanguages.join(', ')}</p>
					</div>
				{/if}
			</div>

			<!-- Example 2: Custom Objects -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900">Custom Objects Example</h2>
					<p class="text-sm text-gray-600">Using objects with custom label/value getters</p>
				</div>

				<Combobox
					class="demo-example-2"
					options={users}
					bind:value={selectedUsers}
					getOptionLabel={(user) => `${user.name} (${user.role})`}
					getOptionValue={(user) => user.id}
					placeholder="Select team members"
					maxCount={2}
				/>

				{#if selectedUsers.length > 0}
					<div class="mt-4 rounded-md bg-blue-50 p-3">
						<p class="mb-2 text-sm font-medium text-gray-700">Selected ({selectedUsers.length}):</p>
						<ul class="space-y-1 text-sm text-gray-600">
							{#each selectedUsers as user}
								<li>• {user.name} - {user.email}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Example 3: Grouped Options -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900">Grouped Options Example</h2>
					<p class="text-sm text-gray-600">Options organized by categories</p>
				</div>

				<Combobox
					class="demo-example-3"
					options={groupedOptions}
					bind:value={selectedTech}
					placeholder="Select technologies"
				/>

				{#if selectedTech.length > 0}
					<div class="mt-4 rounded-md bg-blue-50 p-3">
						<p class="mb-2 text-sm font-medium text-gray-700">Selected ({selectedTech.length}):</p>
						<p class="text-sm text-gray-600">{selectedTech.join(', ')}</p>
					</div>
				{/if}
			</div>

			<!-- Example 4: Styled Variation -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900">Styled Variation</h2>
					<p class="text-sm text-gray-600">Custom styling with enhanced visual design</p>
				</div>

				<Combobox
					class="demo-example-4"
					options={simpleOptions.slice(0, 6)}
					bind:value={selectedVariation}
					placeholder="Choose your favorite..."
					maxCount={3}
				/>
			</div>

			<!-- Example 5: Single Select -->
			<div class="rounded-xl bg-white p-6 shadow-lg">
				<div class="mb-4">
					<h2 class="mb-2 text-xl font-semibold text-gray-900">Single Select Example</h2>
					<p class="text-sm text-gray-600">Single selection mode - picker closes after selection</p>
				</div>

				<Combobox
					class="demo-example-5"
					options={simpleOptions}
					bind:value={selectedSingle}
					singleSelect={true}
					placeholder="Choose one language"
					searchable={false}
				/>

				{#if selectedSingle}
					<div class="mt-4 rounded-md bg-blue-50 p-3">
						<p class="mb-2 text-sm font-medium text-gray-700">Selected:</p>
						<p class="text-sm text-gray-600">{selectedSingle}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Footer Info -->
		<div class="mt-12 rounded-xl bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">Features Demonstrated</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<div>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Multi-select support</h3>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Single-select mode</h3>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Search functionality</h3>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Custom objects with getters</h3>
				</div>
				<div>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Grouped options</h3>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Badge display with maxCount</h3>
					<h3 class="mb-2 font-semibold text-gray-800">✓ Fully customizable styling</h3>
				</div>
			</div>
		</div>
	</div>
</div>
