<script lang="ts">
	import Combobox from '$lib/components/combobox.svelte';

	const techOptions = [
		'TypeScript',
		'JavaScript',
		'Python',
		'Java',
		'C#',
		'Go',
		'Rust',
		'PHP',
		'Ruby',
		'Swift',
		'Kotlin',
		'Dart'
	];
	let selectedTech = $state<string[]>([]);
</script>

<div class="min-h-screen bg-white py-12 px-4">
	<div class="container mx-auto max-w-2xl">
		<!-- Header -->
		<header class="mb-8">
			<div class="flex items-center gap-2 mb-2">
				<svg
					class="h-5 w-5 text-violet-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				<h1 class="text-2xl font-semibold text-gray-900">Tech Stack</h1>
			</div>
		</header>

		<!-- Combobox Component -->
		<Combobox
			class="demo-tech-stack"
			options={techOptions}
			bind:value={selectedTech}
			placeholder="Select technologies"
		/>
	</div>
</div>
