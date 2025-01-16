---
title: React Data Grid - Quick Filter component
productId: x-data-grid
components: QuickFilterRoot, QuickFilterControl, QuickFilterClear
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Quick Filter

<p class="description">A search field that lets users to filter data in the Data Grid.</p>

## Basic usage

The demo below shows the default quick filter configuration.

{{"demo": "GridQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { QuickFilter } from '@mui/x-data-grid';

<QuickFilter.Root>
  <QuickFilter.Control />
  <QuickFilter.Clear />
</QuickFilter.Root>;
```

### Root

`Root` is the top level component that provides context to child components.
It does not render any DOM elements.

### Control

`Control` takes user input and filters row data.
It renders the `baseTextField` slot.

### Clear

`Clear` is a button that resets the filter value.
It renders the `baseIconButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components—Usage](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Quick Filter.

## Accessibility

### ARIA

- You must render a `<label />` with a `for` attribute set to the `id` of `<QuickFilter.Control />`, or apply an `aria-label` attribute to the `<QuickFilter.Control />`.
- You must apply a text label or an `aria-label` attribute to the `<QuickFilter.Clear />`.

### Keyboard

|                          Keys | Description                                            |
| ----------------------------: | :----------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Resets the filter value whilst focused on the control. |
