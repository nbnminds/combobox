<script lang="ts">
	import { cn } from '../utils.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		value?: string | number | null;
		class?: string;
	}

	let {
		value = $bindable(),
		class: className,
		...restProps
	}: Props = $props();
</script>

<input
	class={cn(className)}
	bind:value
	{...restProps}
/>
