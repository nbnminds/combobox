<script lang="ts">
	import { cn } from '../utils.js';

	let { emptyMessage = 'No options found', class: className }: { emptyMessage?: string; class?: string } =
		$props();
</script>

<div
	class={cn('combobox-empty', className)}
	role="status"
	aria-live="polite"
>
	{emptyMessage}
</div>
