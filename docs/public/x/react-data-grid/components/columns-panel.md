---
productId: x-data-grid
components: ColumnsPanelTrigger
packageName: '@mui/x-data-grid'
githubLabel: 'scope: data grid'
---

# Data Grid - Columns Panel component 🚧

Customize the Data Grid's columns panel.

:::warning
This component is incomplete.

Currently, the Columns Panel Trigger is the only part of the Columns Panel component available.
Future versions of the Columns Panel component will make it possible to compose each of its parts to create a custom columns panel.

In the meantime, it's still possible to deeply customize the panel's subcomponents using custom slots.
See [Custom subcomponents—Columns panel](/x/react-data-grid/components/#columns-panel) for more details.

:::

The columns panel is part of the [column visibility feature](/x/react-data-grid/column-visibility/) and is enabled by default.
Users can trigger the columns panel via the column menu, as well as from the toolbar when `showToolbar` is passed to the `<DataGrid />` component.

You can use the Columns Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the columns panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add a columns panel trigger to a custom toolbar.

```tsx
import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridColumnsPanelTrigger() {
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
import { ColumnsPanelTrigger } from '@mui/x-data-grid';

<ColumnsPanelTrigger />;
```

### Columns Panel Trigger

`<ColumnsPanelTrigger />` is a button that opens and closes the columns panel.
It renders the `baseButton` slot.

## Custom elements

Use the `render` prop to replace default elements.
See [Components usage—Customization](/x/react-data-grid/components/usage/#customization) for more details, and [Toolbar—Custom elements demo](/x/react-data-grid/components/toolbar/#custom-elements) for an example of a custom Columns Panel Trigger.

## Accessibility

### ARIA

You must apply a text label or an `aria-label` attribute to the `<ColumnsPanelTrigger />`.


# ColumnsPanelTrigger API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Data Grid - Columns Panel component 🚧](/x/react-data-grid/components/columns-panel)

## Import

```jsx
import { ColumnsPanelTrigger } from '@mui/x-data-grid/components';
// or
import { ColumnsPanelTrigger } from '@mui/x-data-grid';
// or
import { ColumnsPanelTrigger } from '@mui/x-data-grid-pro';
// or
import { ColumnsPanelTrigger } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/columnsPanel/ColumnsPanelTrigger.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/columnsPanel/ColumnsPanelTrigger.tsx)