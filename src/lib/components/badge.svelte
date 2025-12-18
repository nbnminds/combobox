<script lang="ts">
	import { cn } from '../utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		children?: import('svelte').Snippet;
	}

	let {
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>

<span
	data-slot="badge"
	class={cn(className)}
	{...restProps}
>
	{@render children?.()}
</span>
