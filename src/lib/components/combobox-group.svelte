<script lang="ts">
	import { cn } from '../utils.js';
	import type { GroupedOption } from './combobox.types.js';

	interface Props<T = any> {
		group: GroupedOption<T>;
		children?: import('svelte').Snippet;
		class?: string;
		labelClass?: string;
		optionsClass?: string;
	}

	let { group, children, class: className, labelClass, optionsClass }: Props = $props();
</script>

<div class={cn('combobox-group', className)} role="group" aria-label={group.group}>
	<div class={cn('combobox-group-label', labelClass)}>{group.group}</div>
	<div class={cn('combobox-group-options', optionsClass)}>
		{@render children?.()}
	</div>
</div>
