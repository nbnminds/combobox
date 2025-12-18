# @nbnminds/combobox

A powerful, flexible Svelte 5 dropdown component with single-select, multi-select, and AJAX autocomplete capabilities.

## Features

- 🎯 Single and multi-select modes
- 🔍 AJAX autocomplete support
- ⚡ Built with Svelte 5 and TypeScript
- 🎨 Consumer-controlled styling (bring your own Tailwind/CSS classes)
- ♿ Fully accessible via Bits UI primitives
- 🎭 Highly customizable with class props for every visual element
- 📱 Responsive design support

## Philosophy

This component follows a **"behavior from Bits UI, styling from consumer"** approach:

- **No hardcoded Tailwind classes** - All styling is provided by you via class props
- **Data attributes for state** - Style based on component state using `data-selected`, `data-state`, `data-disabled`, etc.
- **No Tailwind scanning required** - All Tailwind classes live in your code, so your Tailwind setup naturally picks them up
- **Minimal structural classes** - Only essential layout/functionality classes are used internally

## Installation

```bash
npm install @nbnminds/combobox
```

### Peer Dependencies

```bash
npm install svelte@^5.0.0 bits-ui@^2.0.0 @lucide/svelte@^0.400.0 clsx@^2.0.0 tailwind-merge@^2.0.0
```

**Note:** Tailwind CSS is not required as a peer dependency. Use it in your project if you want to style the components with Tailwind classes, or use any other CSS approach you prefer.

All UI primitives (Badge, Checkbox, Input, Popover) are bundled with the package and follow the same styling philosophy - you provide all visual classes.

## Usage

### Minimal Working Styled Example

Here's a complete, copy-paste ready example with Tailwind classes:

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  import { cn } from '@nbnminds/combobox'; // or use your own cn utility
  
  const options = ['Option 1', 'Option 2', 'Option 3'];
  let selected = $state([]);
</script>

<Combobox 
  options={options} 
  bind:value={selected}
  placeholder="Select options"
  triggerClass={cn(
    "flex min-h-10 w-full items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
    "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
    "disabled:cursor-not-allowed disabled:opacity-50"
  )}
  contentClass="w-[var(--bits-popover-anchor-width)] rounded-md border bg-popover p-0 shadow-md"
  searchContainerClass="border-b px-3 py-2"
  searchInputClass="h-9 pl-8"
  listContainerClass="max-h-[300px] overflow-y-auto"
  listClass="p-1"
  itemClass={cn(
    "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
    "hover:bg-accent hover:text-accent-foreground",
    "focus:bg-accent focus:text-accent-foreground",
    "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground",
    "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
  )}
  itemCheckboxClass="h-4 w-4"
  badgeClass="inline-flex items-center rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-xs font-semibold gap-1"
  removeButtonClass="ml-1 rounded-full hover:bg-black/20"
  placeholderClass="text-muted-foreground"
  emptyClass="py-6 text-center text-sm text-muted-foreground"
  selectAllClass="flex items-center gap-2 border-b px-2 py-1.5"
  selectAllCheckboxClass="h-4 w-4"
  selectAllLabelClass="text-sm font-medium"
  groupClass="space-y-1"
  groupLabelClass="px-2 py-1.5 text-xs font-medium text-muted-foreground"
  groupOptionsClass="space-y-0.5"
/>
```

### Default Styled Example Using cn()

For easier maintenance, define your styles once and reuse:

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  import { cn } from 'clsx';
  import { twMerge } from 'tailwind-merge';
  
  function cn(...classes) {
    return twMerge(clsx(classes));
  }
  
  const options = ['Option 1', 'Option 2', 'Option 3'];
  let selected = $state([]);
  
  // Define your component styles
  const styles = {
    trigger: cn(
      "flex min-h-10 w-full items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm",
      "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]"
    ),
    item: cn(
      "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
      "hover:bg-accent hover:text-accent-foreground",
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
    ),
    // ... more styles
  };
</script>

<Combobox 
  options={options} 
  bind:value={selected}
  triggerClass={styles.trigger}
  itemClass={styles.item}
  // ... other class props
/>
```

### Single Select Mode

In single select mode, the component returns a single value (not an array) and displays plain text instead of badges:

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  
  const languages = ['JavaScript', 'TypeScript', 'Python', 'Java'];
  let selected = $state(undefined); // Single value, not array
</script>

<Combobox 
  options={languages}
  bind:value={selected}
  singleSelect={true}
  placeholder="Choose one language"
  searchable={false} // Optional: hide search bar
  // Add your class props for styling
/>

{#if selected}
  <p>Selected: {selected}</p>
{/if}
```

**Note:** When `singleSelect={true}`:
- `value` returns `T | undefined` instead of `T[]`
- Selected value displays as plain text (no badges)
- No remove buttons are shown
- Picker automatically closes after selection

### With Custom Objects

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  let selected = $state([]);
</script>

<Combobox 
  options={users}
  getOptionLabel={(user) => user.name}
  getOptionValue={(user) => user.id}
  bind:value={selected}
  placeholder="Select users"
  // Add your class props for styling
/>
```

### Single Select with Custom Objects

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  
  interface User {
    id: number;
    name: string;
    email: string;
  }
  
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  let selected = $state<User | undefined>(undefined); // Single object, not array
</script>

<Combobox 
  options={users}
  getOptionLabel={(user) => user.name}
  getOptionValue={(user) => user.id}
  bind:value={selected}
  singleSelect={true}
  placeholder="Select a user"
  // Add your class props for styling
/>

{#if selected}
  <p>Selected: {selected.name} ({selected.email})</p>
{/if}
```

### With AJAX Autocomplete

```svelte
<script>
  import { Combobox } from '@nbnminds/combobox';
  
  async function fetchUsers(search: string) {
    const response = await fetch(`/api/users?search=${search}`);
    return response.json();
  }
  
  let selected = $state([]);
</script>

<Combobox 
  fetchOptions={fetchUsers}
  getOptionLabel={(user) => user.name}
  getOptionValue={(user) => user.id}
  bind:value={selected}
  placeholder="Search users..."
  minSearchLength={2}
  debounceMs={300}
  // Add your class props for styling
/>
```

### Styling with Data Attributes

The component uses data attributes for state-based styling. You can target these in your CSS:

```css
/* Style selected items */
[data-selected="true"] {
  @apply bg-accent text-accent-foreground;
}

/* Style disabled items */
[data-disabled="true"] {
  @apply cursor-not-allowed opacity-50;
}

/* Style open popover */
[data-state="open"] {
  /* your styles */
}
```

### Animations

Since the component doesn't include animations, add them using Svelte transitions or your own CSS:

```svelte
<script>
  import { fade, slide } from 'svelte/transition';
</script>

<style>
  :global([data-state="open"]) {
    animation: fadeIn 0.2s ease-out;
  }
  
  :global([data-state="closed"]) {
    animation: fadeOut 0.2s ease-in;
  }
</style>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `T \| T[]` | `undefined` or `[]` | Selected value(s) - single value when `singleSelect={true}`, array otherwise (bindable) |
| `defaultValue` | `T \| T[]` | `undefined` or `[]` | Default selected value(s) |
| `options` | `T[] \| GroupedOption<T>[]` | - | Static options array |
| `fetchOptions` | `(search: string) => Promise<T[]>` | - | Async function to fetch options |
| `getOptionLabel` | `(option: T) => string` | Auto | Function to get option label |
| `getOptionValue` | `(option: T) => string \| number` | Auto | Function to get option value |
| `placeholder` | `string` | `'Select options'` | Placeholder text |
| `maxCount` | `number` | - | Max badges to show before "+X more" |
| `singleSelect` | `boolean` | `false` | Enable single-select mode (returns single value, shows plain text) |
| `searchable` | `boolean` | `true` | Enable search functionality |
| `hideSelectAll` | `boolean` | `false` | Hide select all option |
| `disabled` | `boolean` | `false` | Disable the component |
| `minSearchLength` | `number` | `0` | Minimum characters for search |
| `debounceMs` | `number` | `300` | Debounce delay for search |

### Class Props

All visual styling is controlled via class props:

- `triggerClass` - Trigger button styling
- `contentClass` - Popover content container
- `searchInputClass` - Search input field
- `searchContainerClass` - Search input container
- `listContainerClass` - Scrollable list container
- `listClass` - List padding wrapper
- `itemClass` - Individual selectable item
- `itemCheckboxClass` - Item checkbox
- `itemLabelClass` - Item label text
- `emptyClass` - Empty state message
- `selectAllClass` - Select all row container
- `selectAllCheckboxClass` - Select all checkbox
- `selectAllLabelClass` - Select all label
- `groupClass` - Option group container
- `groupLabelClass` - Group label
- `groupOptionsClass` - Group options container
- `loadingClass` - Loading state
- `errorClass` - Error state
- `badgeClass` - Selected value badge
- `badgeContainerClass` - Badge container
- `removeButtonClass` - Badge remove button
- `placeholderClass` - Placeholder text

### Data Attributes

The component exposes data attributes for styling:

- `data-selected="true|false"` - Item selection state
- `data-disabled="true|false"` - Disabled state
- `data-state="open|closed"` - Popover state (from Bits UI)
- `data-loading="true|false"` - Loading state
- `data-error="true|false"` - Error state

See the [type definitions](./src/lib/components/combobox.types.ts) for complete API documentation.

## What's Included

This package is self-contained and includes all necessary UI components:

- **Combobox** - Main component and all sub-components (Trigger, Content, Item, Empty, Group, SelectAll)
- **UI Primitives** - Badge, Checkbox, Input, and Popover components (all follow the same styling philosophy)
- **Utilities** - Debounce utility and class name merging utilities

## Migration from Variant-Based API

If you're upgrading from an older version that used variants:

**Before:**
```svelte
<Combobox variant="destructive" options={options} />
```

**After:**
```svelte
<Combobox 
  options={options}
  triggerClass="border-destructive"
  badgeClass="bg-destructive text-white"
  // ... other class props
/>
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build package
npm run package

# Run type checking
npm run check
```

## License

MIT © [NBN Minds Private Limited](https://github.com/nbnminds)

## Support

- 📧 Email: support@nbnminds.com
- 🐛 Issues: [GitHub Issues](https://github.com/nbnminds/combobox/issues)
- 💼 Company: [NBN Minds](https://nbnminds.com)