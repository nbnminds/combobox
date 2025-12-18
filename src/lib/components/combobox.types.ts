/**
 * Type definitions for Combobox component
 * @nbnminds/combobox
 */

// Generic option type
export type Option<T = any> = T;

// Grouped options structure
export interface GroupedOption<T = any> {
	group: string;
	options: T[];
}

// Responsive configuration
export interface ResponsiveConfig {
	mobile?: { maxCount?: number };
	tablet?: { maxCount?: number };
	desktop?: { maxCount?: number };
}

// Option accessor functions
export type OptionLabelGetter<T = any> = (option: T) => string;
export type OptionValueGetter<T = any> = (option: T) => string | number;
export type OptionDisabledGetter<T = any> = (option: T) => boolean;
export type OptionStyleGetter<T = any> = (option: T) => string | Record<string, string> | undefined;

// API fetch function type
export type FetchOptionsFunction<T = any> = (search: string) => Promise<T[]>;

// Main component props interface
export interface ComboboxProps<T = any> {
	// Value management
	value?: T | T[];
	defaultValue?: T | T[];
	onValueChange?: (value: T | T[]) => void;

	// Options (static or async)
	options?: T[] | GroupedOption<T>[];
	fetchOptions?: FetchOptionsFunction<T>;

	// Option accessors (for generic objects)
	getOptionLabel?: OptionLabelGetter<T>;
	getOptionValue?: OptionValueGetter<T>;
	getOptionDisabled?: OptionDisabledGetter<T>;
	getOptionStyle?: OptionStyleGetter<T>;

	// Appearance
	placeholder?: string;
	maxCount?: number; // Max badges to show before "+X more"

	// Behavior
	searchable?: boolean;
	hideSelectAll?: boolean;
	closeOnSelect?: boolean;
	singleSelect?: boolean;
	disabled?: boolean;
	deduplicateOptions?: boolean;

	// Advanced
	responsive?: ResponsiveConfig;
	modalPopover?: boolean;

	// API/Async
	debounceMs?: number;
	minSearchLength?: number;
	loading?: boolean;
	error?: string;

	// Customization
	emptyMessage?: string;
	selectAllLabel?: string;

	// Styling - class props for all visual sub-elements
	triggerClass?: string;
	contentClass?: string;
	searchInputClass?: string;
	searchContainerClass?: string;
	searchIconClass?: string;
	listContainerClass?: string;
	listClass?: string;
	itemClass?: string;
	itemCheckboxClass?: string;
	itemLabelClass?: string;
	emptyClass?: string;
	selectAllClass?: string;
	selectAllCheckboxClass?: string;
	selectAllLabelClass?: string;
	groupClass?: string;
	groupLabelClass?: string;
	groupOptionsClass?: string;
	loadingClass?: string;
	errorClass?: string;
	badgeClass?: string;
	badgeContainerClass?: string;
	removeButtonClass?: string;
	placeholderClass?: string;
	hideClearAll?: boolean;
	clearAllIconClass?: string;
	hideArrow?: boolean;
	arrowIconClass?: string;
	iconsContainerClass?: string;

	// Additional props
	class?: string;
	id?: string;
}

// Internal state type
export interface ComboboxState<T = any> {
	searchQuery: string;
	selectedValues: T[];
	options: T[];
	loading: boolean;
	error: string | null;
	open: boolean;
	filteredOptions: T[];
	groupedOptions: GroupedOption<T>[] | null;
}

// Helper type to check if options are grouped
export function isGrouped<T>(options: T[] | GroupedOption<T>[]): options is GroupedOption<T>[] {
	return (
		Array.isArray(options) &&
		options.length > 0 &&
		typeof options[0] === 'object' &&
		options[0] !== null &&
		'group' in options[0] &&
		'options' in options[0]
	);
}
