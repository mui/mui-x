---
productId: x-data-grid
components: FilterPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'scope: data grid'
---

# Data Grid - Filter Panel component 🚧

Customize the Data Grid's filter panel.

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

```tsx
import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  FilterPanelTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Filters">
        <FilterPanelTrigger render={<ToolbarButton />}>
          <FilterListIcon fontSize="small" />
        </FilterPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridFilterPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

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


# FilterPanelTrigger API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Filter Panel component 🚧](/x/react-data-grid/components/filter-panel)

## Import

```jsx
import { FilterPanelTrigger } from '@mui/x-data-grid/components';
// or
import { FilterPanelTrigger } from '@mui/x-data-grid';
// or
import { FilterPanelTrigger } from '@mui/x-data-grid-pro';
// or
import { FilterPanelTrigger } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/filterPanel/FilterPanelTrigger.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/filterPanel/FilterPanelTrigger.tsx)