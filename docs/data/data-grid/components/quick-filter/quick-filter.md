---
title: React Data Grid - Quick Filter component
productId: x-data-grid
components: QuickFilter, QuickFilterControl, QuickFilterClear, QuickFilterTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Quick Filter

<p class="description">Provide users with an expandable search field to filter data in the Data Grid.</p>

## Basic usage

The demo below shows the default quick filter configuration.

{{"demo": "GridQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import {
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid';

<QuickFilter>
  <QuickFilterTrigger />
  <QuickFilterControl />
  <QuickFilterClear />
</QuickFilter>;
```

### Quick Filter

`<QuickFilter />` is the top level component that provides context to child components.
It renders a `<div />` element.

### Quick Filter Control

`<QuickFilterControl />` takes user input and filters row data.
It renders the `baseTextField` slot.

### Quick Filter Clear

`<QuickFilterClear />` is a button that resets the filter value.
It renders the `baseIconButton` slot.

### Quick Filter Trigger

`<QuickFilterTrigger />` is a button that expands and collapses the quick filter.
It renders the `baseIconButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Quick Filter.

## Recipes

Below are some ways the Quick Filter component can be used.

### Default expanded state

The quick filter is uncontrolled by default and can be toggled via the trigger. The `defaultExpanded` prop can be used to set the default expanded state.

{{"demo": "GridUncontrolledQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

### Expand quick filter via keyboard

The demo below shows how to control the quick filter state using the `expanded` and `onExpandedChange` props to support expanding the quick filter via keyboard. You can try it by clicking on any cell to ensure the data grid has focus, and then pressing <kbd class="key">Cmd</kbd> (or <kbd class="key">Ctrl</kbd> on Windows)+<kbd class="key">P</kbd>.

{{"demo": "GridControlledQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

### Persistent quick filter

The demo below shows how to display a persistent quick filter by passing the `expanded` prop to the `<QuickFilter />` component.

{{"demo": "GridPersistentQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

## Accessibility

### ARIA

- You must render a `<label />` with a `for` attribute set to the `id` of `<QuickFilterControl />`, or apply an `aria-label` attribute to the `<QuickFilterControl />`.
- You must apply a text label or an `aria-label` attribute to the `<QuickFilterClear />` and `<QuickFilterTrigger />`.

### Keyboard

|                          Keys | Description                                                        |
| ----------------------------: | :----------------------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Clears quick filter value. If already empty, collapses the filter. |
