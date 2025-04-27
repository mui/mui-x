---
title: Data Grid - Pivot Panel component
productId: x-data-grid
components: PivotPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'component: data grid'
---

# Data Grid - Pivot Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

<p class="description">Customize the Data Grid's pivot panel.</p>

:::warning
This component is incomplete.

Currently, the Pivot Panel Trigger is the only part of the Pivot Panel component available.
Future versions of the Pivot Panel component will make it possible to compose each of its parts to create a custom pivot panel.

:::

## Basic usage

The demo below shows how to add a pivot panel trigger to a custom toolbar.

{{"demo": "GridPivotPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { PivotPanelTrigger } from '@mui/x-data-grid-premium';

<PivotPanelTrigger />;
```

### Pivot Panel Trigger

`<PivotPanelTrigger />` is a button that opens and closes the pivot panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<PivotPanelTrigger />`.
