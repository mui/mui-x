---
title: React Data Grid - Columns Panel component
productId: x-data-grid
components: ColumnsPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Columns Panel 🚧

<p class="description">Customize the columns panel UI.</p>

:::warning
This component is incomplete.

Currently, the only part available for the Columns Panel component is the Trigger. In the future, this component will allow you to extend the Data Grid's columns panel.

In the meantime, see the following:

- [Custom subcomponents—Columns panel](/x/react-data-grid/components/#columns-panel)

:::

## Basic usage

The demo below shows how to add a columns panel trigger to a custom toolbar.

{{"demo": "GridColumnsPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { ColumnsPanel } from '@mui/x-data-grid';

<ColumnsPanel.Trigger />;
```

### Trigger

A button that opens the columns panel.

Renders the `baseButton` slot.

## Custom elements

The default elements can be replaced using the `render` prop. See [Grid components—Customization](/x/react-data-grid/components/overview/#customization).

See the [Toolbar—Custom elements demo](/x/react-data-grid/toolbar/#custom-elements) for an example.

## Accessibility

### ARIA

- The element rendered by the `<ColumnsPanel.Trigger />` component should have a text label, or an `aria-label` attribute set.
