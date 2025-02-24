---
title: React Data Grid - Filter Panel component
productId: x-data-grid
components: FilterPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Filter Panel 🚧

<p class="description">Customize the Data Grid's filter panel.</p>

:::warning
This component is incomplete.

Currently, the `FilterPanelTrigger` is the only part of the Filter Panel component available.
Future versions of the Filter Panel component will make it possible to compose each of its parts to create a custom filter panel.

In the meantime, it's still possible to deeply customize the panel's subcomponents using custom slots.
See [Filter customization—Custom filter panel](/x/react-data-grid/filtering/customization/#custom-filter-panel)
for more details.

:::

## Basic usage

The demo below shows how to add a filter panel trigger to a custom toolbar.

{{"demo": "GridFilterPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { FilterPanelTrigger } from '@mui/x-data-grid';

<FilterPanelTrigger />;
```

### FilterPanelTrigger

`FilterPanelTrigger` is a button that opens/closes the filter panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Filter Panel Trigger.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<FilterPanelTrigger />`.
