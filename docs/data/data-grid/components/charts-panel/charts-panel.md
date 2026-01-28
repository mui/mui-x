---
title: Data Grid - Charts Panel component
productId: x-data-grid
components: ChartsPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - Charts Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

<p class="description">Customize the Data Grid's Charts panel.</p>

:::warning
This component is incomplete.

Currently, the Charts Panel Trigger is the only part of the Charts Panel component available.
Future versions of the Charts Panel component will make it possible to compose each of its parts for full customization.

:::

The Charts panel is part of the [Charts integration feature](/x/react-data-grid/charts-integration/).

You can use the Charts Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the Charts panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add a Charts Panel Trigger to a custom toolbar.

{{"demo": "GridChartsPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { ChartsPanelTrigger } from '@mui/x-data-grid-premium';

<ChartsPanelTrigger />;
```

### Charts Panel Trigger

`<ChartsPanelTrigger />` is a button that opens and closes the Charts panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<ChartsPanelTrigger />`.
