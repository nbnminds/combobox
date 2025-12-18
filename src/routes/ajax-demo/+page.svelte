<script lang="ts">
	import Combobox from '$lib/components/combobox.svelte';
	import { cn } from '$lib/utils.js';

	// State for selected values
	let selectedUsers = $state<any[]>([]);
	let selectedCountries = $state<any[]>([]);

	// Mock API function to simulate fetching users
	async function fetchUsers(search: string): Promise<any[]> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Mock user data
		const allUsers = [
			{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
			{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
			{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
			{ id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Developer' },
			{ id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Designer' },
			{ id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Manager' },
			{ id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'Developer' },
			{ id: 8, name: 'Fiona Apple', email: 'fiona@example.com', role: 'Designer' }
		];

		// Filter based on search query
		if (!search.trim()) {
			return allUsers;
		}

		const query = search.toLowerCase();
		return allUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query) ||
				user.role.toLowerCase().includes(query)
		);
	}

	// Mock API function to fetch countries (using a real-world example)
	async function fetchCountries(search: string): Promise<any[]> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Sample countries data
		const countries = [
			{ code: 'US', name: 'United States', continent: 'North America' },
			{ code: 'GB', name: 'United Kingdom', continent: 'Europe' },
			{ code: 'CA', name: 'Canada', continent: 'North America' },
			{ code: 'AU', name: 'Australia', continent: 'Oceania' },
			{ code: 'DE', name: 'Germany', continent: 'Europe' },
			{ code: 'FR', name: 'France', continent: 'Europe' },
			{ code: 'JP', name: 'Japan', continent: 'Asia' },
			{ code: 'CN', name: 'China', continent: 'Asia' },
			{ code: 'IN', name: 'India', continent: 'Asia' },
			{ code: 'BR', name: 'Brazil', continent: 'South America' },
			{ code: 'MX', name: 'Mexico', continent: 'North America' },
			{ code: 'IT', name: 'Italy', continent: 'Europe' },
			{ code: 'ES', name: 'Spain', continent: 'Europe' },
			{ code: 'RU', name: 'Russia', continent: 'Europe/Asia' },
			{ code: 'KR', name: 'South Korea', continent: 'Asia' }
		];

		// Filter based on search query
		if (!search.trim()) {
			return countries;
		}

		const query = search.toLowerCase();
		return countries.filter(
			(country) =>
				country.name.toLowerCase().includes(query) ||
				country.code.toLowerCase().includes(query) ||
				country.continent.toLowerCase().includes(query)
		);
	}

	// Enhanced styling with animations
	const triggerStyles = cn(
		'flex min-h-12 w-full items-center gap-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm shadow-sm',
		'transition-all duration-300 ease-out',
		'focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:shadow-lg',
		'hover:border-gray-300 hover:shadow-md',
		'disabled:cursor-not-allowed disabled:opacity-50'
	);

	const contentStyles = cn(
		'w-[var(--bits-popover-anchor-width)] rounded-xl border-2 border-gray-200 bg-white p-0 shadow-2xl',
		'opacity-0 scale-95 translate-y-[-8px] transition-all duration-300 ease-out',
		'data-[state=open]:opacity-100 data-[state=open]:scale-100 data-[state=open]:translate-y-0',
		'backdrop-blur-sm bg-white/95'
	);

	const itemStyles = cn(
		'relative flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-none',
		'transition-all duration-200 ease-out',
		'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-900 hover:shadow-sm hover:translate-x-1',
		'focus:bg-gradient-to-r focus:from-blue-50 focus:to-indigo-50 focus:text-blue-900',
		'data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-blue-100 data-[selected=true]:to-indigo-100 data-[selected=true]:text-blue-900 data-[selected=true]:font-medium',
		'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50'
	);

	const badgeStyles = 'inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-xs font-semibold gap-1.5 h-6 shadow-md hover:shadow-lg transition-shadow';

	const checkboxStyles = cn(
		'h-4 w-4 flex items-center justify-center rounded border-2 border-gray-300 bg-white',
		'transition-all duration-300 ease-out',
		'data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white data-[state=checked]:shadow-md',
		'data-[state=indeterminate]:bg-gradient-to-br data-[state=indeterminate]:from-blue-600 data-[state=indeterminate]:to-indigo-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:text-white',
		'[&>div]:text-inherit [&>div]:transition-transform [&>div]:duration-300',
		'shrink-0 hover:scale-110'
	);

	const searchContainerStyles = 'relative px-4 py-3';
	const searchIconStyles = 'absolute left-5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none z-10';

	const loadingStyles = 'flex flex-col items-center justify-center py-10 gap-3 [&>svg]:h-8 [&>svg]:w-8 [&>svg]:animate-spin [&>svg]:text-blue-600 [&>svg]:transition-transform';

	// Icons container and icon styles
	const iconsContainerStyles = 'flex items-center gap-1 shrink-0';
	const clearAllIconStyles = 'h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer';
	const arrowIconStyles = 'h-5 w-5 text-gray-400 shrink-0';
</script>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.fade-in-up {
		animation: fadeInUp 0.6s ease-out forwards;
	}

	.fade-in {
		animation: fadeIn 0.4s ease-out forwards;
	}

	.slide-in-right {
		animation: slideInRight 0.3s ease-out forwards;
	}

	.card-hover {
		transition: all 0.3s ease-out;
	}

	.card-hover:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.selected-item {
		animation: slideInRight 0.3s ease-out;
	}
</style>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
	<div class="container mx-auto max-w-5xl">
		<!-- Header with animation -->
		<header class="mb-16 text-center fade-in-up">
			<div class="mb-6">
				<h1 class="mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
					AJAX Autocomplete
				</h1>
				<div class="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>
			</div>
			<p class="mx-auto max-w-2xl text-lg text-gray-600">
				Demonstrating async option fetching with search and debouncing. Options are loaded dynamically as you type with smooth animations.
			</p>
			<a
				href="/"
				class="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-blue-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
			>
				<svg
					class="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Back to Main Demo
			</a>
		</header>

		<div class="space-y-10">
			<!-- Example 1: User Search with animation -->
			<div
				class="card-hover rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm fade-in-up"
				style="animation-delay: 0.1s; opacity: 0;"
			>
				<div class="mb-6">
					<div class="mb-3 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<h2 class="text-2xl font-bold text-gray-900">User Search Autocomplete</h2>
					</div>
					<p class="ml-13 text-sm text-gray-600">
						Search users by name, email, or role. Options are fetched asynchronously with a 300ms debounce delay and smooth loading animations.
					</p>
				</div>

				<Combobox
					fetchOptions={fetchUsers}
					bind:value={selectedUsers}
					getOptionLabel={(user) => `${user.name} - ${user.email}`}
					getOptionValue={(user) => user.id}
					placeholder="Search users by name, email, or role..."
					debounceMs={300}
					minSearchLength={0}
					triggerClass={triggerStyles}
					contentClass={contentStyles}
					searchContainerClass={searchContainerStyles}
					searchInputClass="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
					searchIconClass={searchIconStyles}
					listContainerClass="max-h-[320px] overflow-y-auto"
					listClass="p-2"
					itemClass={itemStyles}
					itemCheckboxClass={checkboxStyles}
					badgeClass={badgeStyles}
					badgeContainerClass="flex flex-wrap gap-2 flex-1 min-w-0"
					iconsContainerClass={iconsContainerStyles}
					clearAllIconClass={clearAllIconStyles}
					arrowIconClass={arrowIconStyles}
					removeButtonClass="ml-1.5 rounded-full hover:bg-white/30 p-1 transition-all duration-200 hover:scale-110"
					placeholderClass="text-gray-400"
					emptyClass="py-8 text-center text-sm text-gray-500"
					selectAllClass="flex items-center gap-2 border-b-2 border-gray-100 px-3 py-2.5 bg-gradient-to-r from-gray-50 to-white"
					selectAllCheckboxClass={checkboxStyles}
					selectAllLabelClass="text-sm font-semibold text-gray-700"
					loadingClass={loadingStyles}
					errorClass="py-8 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg mx-2 my-2"
				/>

				{#if selectedUsers.length > 0}
					<div
						class="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-md fade-in"
						style="animation-delay: 0.2s;"
					>
						<p class="mb-3 text-sm font-semibold text-gray-700">Selected Users ({selectedUsers.length}):</p>
						<ul class="space-y-2 text-sm text-gray-700">
							{#each selectedUsers as user, index}
								<li class="selected-item flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 shadow-sm" style="animation-delay: {index * 0.05}s;">
									<span class="flex h-2 w-2 rounded-full bg-blue-600"></span>
									<span class="font-medium">{user.name}</span>
									<span class="text-gray-500">({user.email})</span>
									<span class="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{user.role}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>

			<!-- Example 2: Country Search with Single Select -->
			<div
				class="card-hover rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-sm fade-in-up"
				style="animation-delay: 0.2s; opacity: 0;"
			>
				<div class="mb-6">
					<div class="mb-3 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
							<svg
								class="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h2 class="text-2xl font-bold text-gray-900">Country Search (Single Select)</h2>
					</div>
					<p class="ml-13 text-sm text-gray-600">
						Search countries by name or code. Single select mode with 2 second delay to showcase loading animations. Watch the smooth spinner!
					</p>
				</div>

				<Combobox
					fetchOptions={fetchCountries}
					bind:value={selectedCountries}
					singleSelect={true}
					getOptionLabel={(country) => `${country.name} (${country.code})`}
					getOptionValue={(country) => country.code}
					placeholder="Search countries..."
					debounceMs={400}
					minSearchLength={0}
					triggerClass={triggerStyles}
					contentClass={contentStyles}
					searchContainerClass={searchContainerStyles}
					searchInputClass="h-10 w-full rounded-full border border-gray-300 bg-white pl-11 pr-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
					searchIconClass={searchIconStyles}
					listContainerClass="max-h-[320px] overflow-y-auto"
					listClass="p-2"
					itemClass={itemStyles}
					itemCheckboxClass={checkboxStyles}
					badgeClass={badgeStyles}
					badgeContainerClass="flex flex-wrap gap-2 flex-1 min-w-0"
					iconsContainerClass={iconsContainerStyles}
					clearAllIconClass={clearAllIconStyles}
					arrowIconClass={arrowIconStyles}
					removeButtonClass="ml-1.5 rounded-full hover:bg-white/30 p-1 transition-all duration-200 hover:scale-110"
					placeholderClass="text-gray-400"
					emptyClass="py-8 text-center text-sm text-gray-500"
					loadingClass={loadingStyles}
					errorClass="py-8 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg mx-2 my-2"
				/>

				{#if selectedCountries.length > 0}
					<div
						class="mt-6 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5 shadow-md fade-in"
						style="animation-delay: 0.2s;"
					>
						<p class="mb-3 text-sm font-semibold text-gray-700">Selected Country:</p>
						<div class="rounded-lg bg-white/60 p-4 shadow-sm">
							<div class="flex items-center gap-4">
								<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg">
									{selectedCountries[0]?.code}
								</div>
								<div>
									<p class="font-bold text-gray-900">{selectedCountries[0]?.name}</p>
									<p class="text-sm text-gray-600">{selectedCountries[0]?.continent}</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- API Documentation with enhanced styling -->
			<div
				class="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white shadow-2xl fade-in-up"
				style="animation-delay: 0.3s; opacity: 0;"
			>
				<h2 class="mb-6 text-3xl font-bold">AJAX Implementation Details</h2>
				<div class="space-y-6 text-sm text-gray-200">
					<div class="rounded-xl bg-white/5 p-5 backdrop-blur-sm">
						<h3 class="mb-3 text-lg font-semibold text-white">fetchOptions Prop</h3>
						<p class="mb-3 text-gray-300">
							The <code class="rounded bg-white/10 px-2 py-1 font-mono text-xs text-blue-300">fetchOptions</code> prop accepts an async function that receives a search query string and returns a Promise of options array.
						</p>
						<pre class="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-green-400"><code>fetchOptions={async (search: string) => {
  const response = await fetch(`/api/users?q=${search}`);
  return response.json();
}}</code></pre>
					</div>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="rounded-xl bg-white/5 p-5 backdrop-blur-sm">
							<h3 class="mb-3 text-lg font-semibold text-white">Configuration Options</h3>
							<ul class="space-y-2 text-gray-300">
								<li><code class="rounded bg-white/10 px-2 py-1 font-mono text-xs text-blue-300">debounceMs</code> - Delay before fetching (default: 300ms)</li>
								<li><code class="rounded bg-white/10 px-2 py-1 font-mono text-xs text-blue-300">minSearchLength</code> - Minimum characters before fetching (default: 0)</li>
								<li><code class="rounded bg-white/10 px-2 py-1 font-mono text-xs text-blue-300">loading</code> - External loading state control</li>
								<li><code class="rounded bg-white/10 px-2 py-1 font-mono text-xs text-blue-300">error</code> - External error message</li>
							</ul>
						</div>

						<div class="rounded-xl bg-white/5 p-5 backdrop-blur-sm">
							<h3 class="mb-3 text-lg font-semibold text-white">Features</h3>
							<ul class="space-y-2 text-gray-300">
								<li class="flex items-center gap-2">
									<span class="text-green-400">✓</span>
									Automatic request cancellation
								</li>
								<li class="flex items-center gap-2">
									<span class="text-green-400">✓</span>
									Animated loading indicators
								</li>
								<li class="flex items-center gap-2">
									<span class="text-green-400">✓</span>
									Error handling and display
								</li>
								<li class="flex items-center gap-2">
									<span class="text-green-400">✓</span>
									Multi & single-select modes
								</li>
								<li class="flex items-center gap-2">
									<span class="text-green-400">✓</span>
									Custom label/value getters
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
