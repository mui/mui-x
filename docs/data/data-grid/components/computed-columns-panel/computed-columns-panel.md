---
title: Data Grid - Computed Columns Panel component
productId: x-data-grid
components: ComputedColumnsPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - Computed Columns Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

<p class="description">Customize the Data Grid's computed columns panel.</p>

:::warning
This component is incomplete.

Currently, the Computed Columns Panel Trigger is the only part of the Computed Columns Panel component available.
Future versions of the Computed Columns Panel component will make it possible to compose each of its parts to create a custom computed columns panel.

:::

The computed columns panel is part of the [computed columns feature](/x/react-data-grid/computed-columns/) and is enabled by default when `showToolbar` is passed to the `<DataGridPremium />` component and the formula feature is injected through `featureDependencies`.

You can use the Computed Columns Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the computed columns panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add a computed columns panel trigger to a custom toolbar.

{{"demo": "GridComputedColumnsPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { ComputedColumnsPanelTrigger } from '@mui/x-data-grid-premium';

<ComputedColumnsPanelTrigger />;
```

### Computed Columns Panel Trigger

`<ComputedColumnsPanelTrigger />` is a button that opens and closes the computed columns panel.
It renders the `baseButton` slot.

The trigger renders nothing when computed columns are not available: when the formula feature is not injected through `featureDependencies`, or when the `disableComputedColumns`, `disableFormulas`, or `dataSource` prop is set.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<ComputedColumnsPanelTrigger />`.
