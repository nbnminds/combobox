<script lang="ts">
	import Checkbox from './checkbox.svelte';
	import { cn } from '../utils.js';
	import type { OptionLabelGetter, OptionValueGetter, OptionDisabledGetter, OptionStyleGetter } from './combobox.types.js';

	interface Props<T = any> {
		option: T;
		selected: boolean;
		getOptionLabel: OptionLabelGetter<T>;
		getOptionValue: OptionValueGetter<T>;
		getOptionDisabled?: OptionDisabledGetter<T>;
		getOptionStyle?: OptionStyleGetter<T>;
		onToggle: (option: T) => void;
		singleSelect?: boolean;
		class?: string;
		checkboxClass?: string;
		labelClass?: string;
	}

	let { 
		option, 
		selected, 
		getOptionLabel, 
		getOptionValue, 
		getOptionDisabled, 
		getOptionStyle, 
		onToggle, 
		singleSelect = false,
		class: className,
		checkboxClass,
		labelClass
	}: Props = $props();

	const label = getOptionLabel(option);
	const value = getOptionValue(option);
	const disabled = getOptionDisabled?.(option) ?? false;
	const customStyle = getOptionStyle?.(option);

	function handleClick() {
		if (!disabled) {
			onToggle(option);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (!disabled) {
				onToggle(option);
			}
		}
	}
</script>

<div
	role="option"
	aria-selected={selected}
	aria-disabled={disabled}
	tabindex={disabled ? -1 : 0}
	class={cn('combobox-item', className)}
	data-selected={selected}
	data-disabled={disabled}
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	{#if !singleSelect}
		<Checkbox checked={selected} disabled={disabled} class={cn('combobox-item-checkbox', checkboxClass)} />
	{/if}
	<span class={cn('combobox-item-label', labelClass)} style={typeof customStyle === 'string' ? customStyle : undefined}>
		{label}
	</span>
</div>
