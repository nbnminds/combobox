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
		singleSelect?: boolean;
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
		singleSelect = false,
		children,
		portalProps
	}: Props = $props();
</script>

<PopoverContent
	class={cn('combobox-content', rootClassName, className)}
	portalProps={portalProps}
	onOpenAutoFocus={(e) => {
		// Prevent auto-focus on first item when searchable is false
		if (!searchable) {
			e.preventDefault();
		}
	}}
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
	<div class={cn('combobox-list-container', listContainerClass)} role="listbox" aria-multiselectable={!singleSelect}>
		<div class={cn('combobox-list', listClass)}>
			{@render children?.()}
		</div>
	</div>
</PopoverContent>
