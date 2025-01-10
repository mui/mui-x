---
title: React Data Grid - Filter Panel component
productId: x-data-grid
components: FilterPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Filter Panel 🚧

<p class="description">Customize the filter panel UI.</p>

:::warning
This component is incomplete.

Currently, the only part available for the Filter Panel component is the Trigger. In the future, this component will allow you to extend the Data Grid's filter panel.

In the meantime, see the following:

- [Filter customization—Custom filter panel](/x/react-data-grid/filtering/customization/#custom-filter-panel)

:::

## Basic usage

The demo below shows how to add a filter panel trigger to a custom toolbar.

{{"demo": "GridFilterPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { FilterPanel } from '@mui/x-data-grid/primitives';

<FilterPanel.Trigger />;
```

### Trigger

A button that opens the filter panel.

Renders the `baseButton` slot.

## Custom elements

The default elements can be replaced using the `render` prop. See [Grid components—Customization](/x/react-data-grid/components/overview/#customization).

See the [Toolbar—Custom elements demo](/x/react-data-grid/primitives/toolbar/#custom-elements) for an example.

## Accessibility

### ARIA

- The element rendered by the `<FilterPanel.Trigger />` component should have a text label, or an `aria-label` attribute set.
