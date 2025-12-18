<script lang="ts">
	import Input from './input.svelte';
	import Badge from './badge.svelte';
	import { PopoverTrigger } from './popover/index.js';
	import { cn } from '../utils.js';
	import XIcon from '@lucide/svelte/icons/x';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { OptionLabelGetter, OptionValueGetter, OptionStyleGetter } from './combobox.types.js';

	interface Props {
		selectedValues: any[];
		searchQuery: string;
		searchable?: boolean;
		placeholder?: string;
		disabled?: boolean;
		getOptionLabel: OptionLabelGetter<any>;
		getOptionValue: OptionValueGetter<any>;
		getOptionStyle?: OptionStyleGetter<any>;
		maxCount?: number;
		onSearchChange: (value: string) => void;
		onRemove: (value: any) => void;
		onClearAll?: () => void;
		class?: string;
		badgeContainerClass?: string;
		badgeClass?: string;
		removeButtonClass?: string;
		placeholderClass?: string;
		inputClass?: string;
		hideClearAll?: boolean;
		clearAllIconClass?: string;
		hideArrow?: boolean;
		arrowIconClass?: string;
		iconsContainerClass?: string;
	}

	let {
		selectedValues,
		searchQuery,
		searchable = true,
		placeholder = 'Select options',
		disabled = false,
		getOptionLabel,
		getOptionValue,
		getOptionStyle,
		maxCount,
		onSearchChange,
		onRemove,
		onClearAll,
		class: className,
		badgeContainerClass,
		badgeClass,
		removeButtonClass,
		placeholderClass,
		inputClass,
		hideClearAll = false,
		clearAllIconClass,
		hideArrow = false,
		arrowIconClass,
		iconsContainerClass
	}: Props = $props();

	let inputRef: any = $state(null);

	// Calculate visible badges and remaining count
	const visibleBadges = $derived(
		maxCount && selectedValues.length > maxCount ? selectedValues.slice(0, maxCount) : selectedValues
	);
	const remainingCount = $derived(
		maxCount && selectedValues.length > maxCount ? selectedValues.length - maxCount : 0
	);

	function handleRemove(event: MouseEvent | KeyboardEvent, value: any) {
		event.stopPropagation();
		onRemove(value);
	}

	function handleKeydown(event: KeyboardEvent) {
		// Allow backspace to remove last item when input is empty
		if (event.key === 'Backspace' && !searchQuery && selectedValues.length > 0) {
			event.preventDefault();
			onRemove(selectedValues[selectedValues.length - 1]);
		}
	}

	function handleClearAll(event: MouseEvent | KeyboardEvent) {
		event.stopPropagation();
		onClearAll?.();
	}
</script>

<PopoverTrigger
	class={cn('combobox-trigger', className)}
	disabled={disabled}
>
	<div class={cn('combobox-badge-container', badgeContainerClass)}>
		{#each visibleBadges as value}
			{@const label = getOptionLabel(value)}
			{@const optionValue = getOptionValue(value)}
			{@const customStyle = getOptionStyle?.(value)}
			<Badge class={cn('combobox-badge', badgeClass)}>
				<span style={typeof customStyle === 'string' ? customStyle : undefined}>
					{label}
				</span>
				<button
					type="button"
					class={cn('combobox-remove-button', removeButtonClass)}
					onclick={(e) => handleRemove(e, value)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleRemove(e, value);
						}
					}}
					aria-label={`Remove ${label}`}
				>
					<XIcon />
				</button>
			</Badge>
		{/each}

		{#if remainingCount > 0}
			<Badge class={cn('combobox-badge', badgeClass)}>
				+{remainingCount} more
			</Badge>
		{/if}

		{#if selectedValues.length === 0}
			<span class={cn('combobox-placeholder', placeholderClass)}>{placeholder}</span>
		{/if}
	</div>

	{#if (!hideClearAll && selectedValues.length > 0) || !hideArrow}
		<div class={cn('combobox-icons-container', iconsContainerClass)}>
			{#if !hideClearAll && selectedValues.length > 0}
				<button
					type="button"
					class={cn('combobox-clear-all', clearAllIconClass)}
					onclick={handleClearAll}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleClearAll(e);
						}
					}}
					aria-label="Clear all selections"
				>
					<XIcon />
				</button>
			{/if}

			{#if !hideArrow}
				<ChevronDown class={cn('combobox-arrow', arrowIconClass)} />
			{/if}
		</div>
	{/if}
</PopoverTrigger>
