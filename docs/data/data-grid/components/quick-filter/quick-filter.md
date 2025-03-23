---
title: React Data Grid - Quick Filter component
productId: x-data-grid
components: QuickFilter, QuickFilterControl, QuickFilterClear
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Quick Filter

<p class="description">Provide users with a search field to filter data in the Data Grid.</p>

## Basic usage

The demo below shows the default quick filter configuration.

{{"demo": "GridQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { QuickFilter, QuickFilterControl, QuickFilterClear } from '@mui/x-data-grid';

<QuickFilter>
  <QuickFilterControl />
  <QuickFilterClear />
</QuickFilter>;
```

### Quick Filter

`<QuickFilter />` is the top level component that provides context to child components.
It does not render any DOM elements.

### Quick Filter Control

`<QuickFilterControl />` takes user input and filters row data.
It renders the `baseTextField` slot.

### Quick Filter Clear

`<QuickFilterClear />` is a button that resets the filter value.
It renders the `baseIconButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Quick Filter.

## Accessibility

### ARIA

- You must render a `<label />` with a `for` attribute set to the `id` of `<QuickFilterControl />`, or apply an `aria-label` attribute to the `<QuickFilterControl />`.
- You must apply a text label or an `aria-label` attribute to the `<QuickFilterClear />`.

### Keyboard

|                          Keys | Description                                            |
| ----------------------------: | :----------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Resets the filter value whilst focused on the control. |
