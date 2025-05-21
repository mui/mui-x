---
productId: x-data-grid
components: FilterPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'component: data grid'
---

# Data Grid - Filter Panel component 🚧

<p class="description">Customize the Data Grid's filter panel.</p>

:::warning
This component is incomplete.

Currently, the Filter Panel Trigger is the only part of the Filter Panel component available.
Future versions of the Filter Panel component will make it possible to compose each of its parts to create a custom filter panel.

In the meantime, it's still possible to deeply customize the panel's subcomponents using custom slots.
See [Filter customization—Custom filter panel](/x/react-data-grid/filtering/customization/#custom-filter-panel)
for more details.

:::

The [filter panel](/x/react-data-grid/filtering/) is enabled by default.
Users can trigger the filter panel via the column menu, as well as from the toolbar when `showToolbar` is passed to the `<DataGrid />` component.

You can use the Filter Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the filter panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add a filter panel trigger to a custom toolbar.

{{"demo": "GridFilterPanelTrigger.js", "bg": "inline", "defaultCodeOpen": false}}

## Anatomy

```tsx
import { FilterPanelTrigger } from '@mui/x-data-grid';

<FilterPanelTrigger />;
```

### Filter Panel Trigger

`<FilterPanelTrigger />` is a button that opens and closes the filter panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Filter Panel Trigger.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<FilterPanelTrigger />`.
