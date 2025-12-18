<script lang="ts">
	import Checkbox from './checkbox.svelte';
	import { cn } from '../utils.js';

	interface Props {
		checked: boolean;
		indeterminate: boolean;
		onToggle: () => void;
		label?: string;
		class?: string;
		checkboxClass?: string;
		labelClass?: string;
	}

	let { 
		checked, 
		indeterminate, 
		onToggle, 
		label = 'Select all', 
		class: className,
		checkboxClass,
		labelClass
	}: Props = $props();
</script>

<div
	class={cn('combobox-select-all', className)}
	role="button"
	tabindex={0}
	onclick={onToggle}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onToggle();
		}
	}}
>
	<Checkbox checked={checked} indeterminate={indeterminate} class={cn('combobox-select-all-checkbox', checkboxClass)} />
	<span class={cn('combobox-select-all-label', labelClass)}>{label}</span>
</div>
