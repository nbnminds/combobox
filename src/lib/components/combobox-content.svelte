<script lang="ts">
	import { PopoverContent } from './popover/index.js';
	import Input from './input.svelte';
	import { cn } from '../utils.js';
	import type { ComponentProps } from 'svelte';
	import SearchIcon from '@lucide/svelte/icons/search';

	interface Props {
		class?: string;
		rootClassName?: string;
		searchContainerClass?: string;
		searchIconClass?: string;
		searchInputClass?: string;
		listContainerClass?: string;
		listClass?: string;
		modalPopover?: boolean;
		searchable?: boolean;
		searchQuery?: string;
		onSearchChange?: (value: string) => void;
		searchPlaceholder?: string;
		children?: import('svelte').Snippet;
		portalProps?: ComponentProps<typeof PopoverContent>['portalProps'];
	}

	let {
		class: className,
		rootClassName,
		searchContainerClass,
		searchIconClass,
		searchInputClass,
		listContainerClass,
		listClass,
		modalPopover = false,
		searchable = true,
		searchQuery = '',
		onSearchChange,
		searchPlaceholder = 'Search options...',
		children,
		portalProps
	}: Props = $props();
</script>

<PopoverContent
	class={cn('combobox-content', rootClassName, className)}
	portalProps={portalProps}
>
	{#if searchable}
		<div class={cn('combobox-search-container', searchContainerClass)}>
			<span class={cn('combobox-search-icon', searchIconClass)}>
				<SearchIcon />
			</span>
			<Input
				bind:value={searchQuery}
				placeholder={searchPlaceholder}
				class={cn('combobox-search-input', searchInputClass)}
				oninput={(e) => onSearchChange?.(e.currentTarget.value)}
			/>
		</div>
	{/if}
	<div class={cn('combobox-list-container', listContainerClass)} role="listbox" aria-multiselectable="true">
		<div class={cn('combobox-list', listClass)}>
			{@render children?.()}
		</div>
	</div>
</PopoverContent>
