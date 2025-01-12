---
title: React Data Grid - Quick Filter component
productId: x-data-grid
components: QuickFilterRoot, QuickFilterControl, QuickFilterClear
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Quick Filter

<p class="description">A search field that enables users to filter data in the Data Grid.</p>

## Basic usage

The demo below shows the default quick filter configuration.

{{"demo": "GridQuickFilter.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { QuickFilter } from '@mui/x-data-grid/primitives';

<QuickFilter.Root>
  <QuickFilter.Control />
  <QuickFilter.Clear />
</QuickFilter.Root>;
```

### Root

The top level component that provides context to child components.

Does not render any DOM elements.

### Control

A control that takes user input.

Renders the `baseTextField` slot.

### Clear

A button to reset the filter value.

Renders the `baseIconButton` slot.

## Custom elements

The default elements can be replaced using the `render` prop. See [Grid components—Customization](/x/react-data-grid/components/overview/#customization).

See the [Toolbar—Custom elements demo](/x/react-data-grid/primitives/toolbar/#custom-elements) for an example.

## Accessibility

### ARIA

- The element rendered by the `<QuickFilter.Control />` component should have a label associated to it, or an `aria-label` attribute set.

### Keyboard

|                          Keys | Description                                            |
| ----------------------------: | :----------------------------------------------------- |
| <kbd class="key">Escape</kbd> | Resets the filter value whilst focused on the control. |
