<script lang="ts">
	import { Popover } from './popover/index.js';
	import ComboboxTrigger from './combobox-trigger.svelte';
	import ComboboxContent from './combobox-content.svelte';
	import ComboboxItem from './combobox-item.svelte';
	import ComboboxEmpty from './combobox-empty.svelte';
	import ComboboxGroup from './combobox-group.svelte';
	import ComboboxSelectAll from './combobox-select-all.svelte';
	import { debounce } from '../utils/debounce.js';
	import { cn } from '../utils.js';
	import type {
		ComboboxProps,
		GroupedOption,
		OptionLabelGetter,
		OptionValueGetter,
		OptionDisabledGetter,
		OptionStyleGetter,
		ResponsiveConfig
	} from './combobox.types.js';
	import { isGrouped } from './combobox.types.js';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	// Browser check (replaces SvelteKit's $app/environment)
	const browser = typeof window !== 'undefined';

	interface Props<T = any> extends ComboboxProps<T> {
		class?: string;
	}

	let {
		value = $bindable(undefined),
		defaultValue,
		onValueChange,
		options,
		fetchOptions,
		getOptionLabel = ((opt: any) => (typeof opt === 'string' || typeof opt === 'number' ? String(opt) : opt?.label ?? String(opt))) as OptionLabelGetter<any>,
		getOptionValue = ((opt: any) => (typeof opt === 'string' || typeof opt === 'number' ? opt : opt?.value ?? opt)) as OptionValueGetter<any>,
		getOptionDisabled,
		getOptionStyle,
		placeholder = 'Select options',
		maxCount,
		searchable = true,
		hideSelectAll = false,
		closeOnSelect = false,
		singleSelect = false,
		disabled = false,
		deduplicateOptions = false,
		responsive,
		modalPopover = false,
		debounceMs = 300,
		minSearchLength = 0,
		loading: externalLoading = false,
		error: externalError,
		emptyMessage = 'No options found',
		selectAllLabel = 'Select all',
		// Class props
		triggerClass,
		contentClass,
		searchInputClass,
		searchContainerClass,
		searchIconClass,
		listContainerClass,
		listClass,
		itemClass,
		itemCheckboxClass,
		itemLabelClass,
		emptyClass,
		selectAllClass,
		selectAllCheckboxClass,
		selectAllLabelClass,
		groupClass,
		groupLabelClass,
		groupOptionsClass,
		loadingClass,
		errorClass,
		badgeClass,
		badgeContainerClass,
		removeButtonClass,
		placeholderClass,
		hideClearAll = false,
		clearAllIconClass,
		hideArrow = false,
		arrowIconClass,
		iconsContainerClass,
		class: className,
		id,
		...restProps
	}: Props<any> = $props();

	// State
	let open = $state(false);
	let searchQuery = $state('');
	let internalOptions = $state<any[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let abortController: AbortController | null = null;

	// Helper to normalize value to array for internal state
	function normalizeToArray(val: any): any[] {
		if (val === null || val === undefined) return [];
		if (Array.isArray(val)) return [...val];
		return [val];
	}

	// Helper to normalize array to single value or array based on singleSelect
	function normalizeFromArray(arr: any[]): any | any[] {
		if (singleSelect) {
			return arr.length > 0 ? arr[0] : (undefined as any);
		}
		return arr;
	}

	// Initialize selected values
	let selectedValues = $state<any[]>(
		normalizeToArray(value ?? defaultValue)
	);

	// Sync with external value prop
	$effect(() => {
		if (value !== undefined) {
			selectedValues = normalizeToArray(value);
		}
	});

	// Calculate effective maxCount based on responsive config
	let effectiveMaxCount = $derived(() => {
		if (!responsive || !browser) return maxCount;
		
		const width = window.innerWidth;
		if (width < 768 && responsive.mobile?.maxCount !== undefined) {
			return responsive.mobile.maxCount;
		}
		if (width >= 768 && width < 1024 && responsive.tablet?.maxCount !== undefined) {
			return responsive.tablet.maxCount;
		}
		if (width >= 1024 && responsive.desktop?.maxCount !== undefined) {
			return responsive.desktop.maxCount;
		}
		return maxCount;
	});

	// Handle responsive window resize
	if (browser && responsive) {
		$effect(() => {
			const handleResize = () => {
				// Trigger reactivity by accessing effectiveMaxCount
				effectiveMaxCount();
			};
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		});
	}

	// Load initial options
	$effect(() => {
		if (options && !fetchOptions) {
			if (isGrouped(options)) {
				// Flatten grouped options
				internalOptions = options.flatMap((group) => group.options);
			} else {
				internalOptions = [...options];
			}
		}
	});

	// Debounced search function
	const debouncedSearch = debounce(async (query: string) => {
		if (!fetchOptions) return;

		// Cancel previous request
		if (abortController) {
			abortController.abort();
		}

		// Check min search length
		if (query.length < minSearchLength) {
			internalOptions = [];
			loading = false;
			return;
		}

		loading = true;
		error = null;
		abortController = new AbortController();

		try {
			const results = await fetchOptions(query);
			
			// Check if request was aborted
			if (abortController.signal.aborted) return;

			// Deduplicate if needed
			const processedResults = deduplicateOptions
				? deduplicate(results, getOptionValue)
				: results;

			internalOptions = processedResults;
		} catch (err: any) {
			if (err.name === 'AbortError') return;
			error = err.message || 'Failed to fetch options';
			internalOptions = [];
		} finally {
			if (!abortController.signal.aborted) {
				loading = false;
			}
		}
	}, debounceMs);

	// Watch search query changes
	$effect(() => {
		if (fetchOptions && searchQuery !== undefined) {
			debouncedSearch(searchQuery);
		}
	});

	// Filter options based on search (for static options)
	const filteredOptions = $derived(() => {
		if (fetchOptions) {
			return internalOptions;
		}

		if (!options) return [];

		let opts: any[] = [];
		if (isGrouped(options)) {
			opts = options.flatMap((group) => group.options);
		} else {
			opts = [...options];
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			opts = opts.filter((opt) => {
				const label = getOptionLabel(opt).toLowerCase();
				return label.includes(query);
			});
		}

		// Deduplicate if needed
		if (deduplicateOptions) {
			opts = deduplicate(opts, getOptionValue);
		}

		return opts;
	});

	// Grouped options for display
	const groupedOptions = $derived.by(() => {
		if (!options || !isGrouped(options)) return null;

		// Filter groups based on search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			const filtered = options
				.map((group) => ({
					...group,
					options: group.options.filter((opt) =>
						getOptionLabel(opt).toLowerCase().includes(query)
					)
				}))
				.filter((group) => group.options.length > 0);
			return filtered.length > 0 ? filtered : null;
		}

		return options;
	});

	// Check if all visible options are selected
	const allSelected = $derived(() => {
		const opts = filteredOptions();
		return opts.length > 0 && opts.every((opt) => isSelected(opt));
	});

	// Check if some (but not all) options are selected
	const someSelected = $derived(() => {
		const opts = filteredOptions();
		const selectedCount = opts.filter((opt) => isSelected(opt)).length;
		return selectedCount > 0 && selectedCount < opts.length;
	});

	// Helper functions
	function isSelected(option: any): boolean {
		const optionValue = getOptionValue(option);
		return selectedValues.some((selected) => getOptionValue(selected) === optionValue);
	}

	function toggleOption(option: any) {
		if (singleSelect) {
			// Single select mode: replace selection
			if (isSelected(option)) {
				// If already selected, deselect it
				selectedValues = [];
			} else {
				// Replace current selection with new one
				selectedValues = [option];
			}
			// Always close picker in single select mode
			open = false;
		} else {
			// Multi-select mode: toggle selection
			if (isSelected(option)) {
				selectedValues = selectedValues.filter(
					(selected) => getOptionValue(selected) !== getOptionValue(option)
				);
			} else {
				selectedValues = [...selectedValues, option];
			}

			// Close on select if enabled
			if (closeOnSelect) {
				open = false;
			}
		}

		// Update bindable value - normalize based on singleSelect mode
		const normalizedValue = normalizeFromArray(selectedValues);
		value = normalizedValue;
		onValueChange?.(normalizedValue);
	}

	function toggleSelectAll() {
		const opts = filteredOptions();
		if (allSelected()) {
			// Deselect all visible options
			const visibleValues = new Set(opts.map((opt) => getOptionValue(opt)));
			selectedValues = selectedValues.filter(
				(selected) => !visibleValues.has(getOptionValue(selected))
			);
		} else {
			// Select all visible options
			const newSelections = opts.filter((opt) => !isSelected(opt));
			selectedValues = [...selectedValues, ...newSelections];
		}

		const normalizedValue = normalizeFromArray(selectedValues);
		value = normalizedValue;
		onValueChange?.(normalizedValue);
	}

	function handleRemove(valueToRemove: any) {
		selectedValues = selectedValues.filter(
			(selected) => getOptionValue(selected) !== getOptionValue(valueToRemove)
		);
		const normalizedValue = normalizeFromArray(selectedValues);
		value = normalizedValue;
		onValueChange?.(normalizedValue);
	}

	function handleClearAll() {
		selectedValues = [];
		const normalizedValue = normalizeFromArray(selectedValues);
		value = normalizedValue;
		onValueChange?.(normalizedValue);
	}

	function handleSearchChange(query: string) {
		searchQuery = query;
	}

	function deduplicate(items: any[], getValue: OptionValueGetter<any>): any[] {
		const seen = new Set<string | number>();
		return items.filter((item) => {
			const val = getValue(item);
			if (seen.has(val)) return false;
			seen.add(val);
			return true;
		});
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (abortController) {
				abortController.abort();
			}
		};
	});
</script>

	<div class={cn('combobox', className)} id={id}  {...restProps}>
	<Popover bind:open={open}>
		<ComboboxTrigger
			{selectedValues}
			{searchQuery}
			{searchable}
			{placeholder}
			{disabled}
			{singleSelect}
			{getOptionLabel}
			{getOptionValue}
			{getOptionStyle}
			maxCount={effectiveMaxCount()}
			onSearchChange={handleSearchChange}
			onRemove={handleRemove}
			onClearAll={handleClearAll}
			class={triggerClass}
			{badgeContainerClass}
			{badgeClass}
			{removeButtonClass}
			{placeholderClass}
			inputClass={searchInputClass}
			{hideClearAll}
			{clearAllIconClass}
			{hideArrow}
			{arrowIconClass}
			{iconsContainerClass}
		/>

		<ComboboxContent
			{modalPopover}
			{searchable}
			{searchQuery}
			onSearchChange={handleSearchChange}
			searchPlaceholder="Search options..."
			class={contentClass}
			rootClassName={className}
			{searchContainerClass}
			{searchIconClass}
			{searchInputClass}
			{listContainerClass}
			{listClass}
		>
			{#if externalLoading || loading}
				<div class={cn('combobox-loading', loadingClass)} data-loading="true">
					<Loader2 />
				</div>
			{:else if externalError || error}
				<div class={cn('combobox-error', errorClass)} data-error="true">{externalError || error}</div>
			{:else if groupedOptions && Array.isArray(groupedOptions)}
				{#if !hideSelectAll && !singleSelect && groupedOptions.some((g) => g.options.length > 0)}
					<ComboboxSelectAll
						checked={allSelected()}
						indeterminate={someSelected()}
						onToggle={toggleSelectAll}
						label={selectAllLabel}
						class={selectAllClass}
						checkboxClass={selectAllCheckboxClass}
						labelClass={selectAllLabelClass}
					/>
				{/if}
				{#each groupedOptions as group (group.group)}
					<ComboboxGroup {group} class={groupClass} labelClass={groupLabelClass} optionsClass={groupOptionsClass}>
						{#each group.options as option (getOptionValue(option))}
							<ComboboxItem
								{option}
								selected={isSelected(option)}
								{getOptionLabel}
								{getOptionValue}
								{getOptionDisabled}
								{getOptionStyle}
								onToggle={toggleOption}
								class={itemClass}
								checkboxClass={itemCheckboxClass}
								labelClass={itemLabelClass}
							/>
						{/each}
					</ComboboxGroup>
				{/each}
				{#if groupedOptions.length === 0}
					<ComboboxEmpty {emptyMessage} class={emptyClass} />
				{/if}
			{:else if filteredOptions().length > 0}
				{#if !hideSelectAll && !singleSelect}
					<ComboboxSelectAll
						checked={allSelected()}
						indeterminate={someSelected()}
						onToggle={toggleSelectAll}
						label={selectAllLabel}
						class={selectAllClass}
						checkboxClass={selectAllCheckboxClass}
						labelClass={selectAllLabelClass}
					/>
				{/if}
				{#each filteredOptions() as option (getOptionValue(option))}
					<ComboboxItem
						{option}
						selected={isSelected(option)}
						{getOptionLabel}
						{getOptionValue}
						{getOptionDisabled}
						{getOptionStyle}
						onToggle={toggleOption}
						class={itemClass}
						checkboxClass={itemCheckboxClass}
						labelClass={itemLabelClass}
					/>
				{/each}
			{:else}
				<ComboboxEmpty {emptyMessage} class={emptyClass} />
			{/if}
		</ComboboxContent>
	</Popover>
</div>
