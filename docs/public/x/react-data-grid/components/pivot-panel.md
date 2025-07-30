---
title: Data Grid - Pivot Panel component
productId: x-data-grid
components: PivotPanelTrigger
packageName: '@mui/x-data-grid-premium'
githubLabel: 'scope: data grid'
---

# Data Grid - Pivot Panel component [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🚧

Customize the Data Grid's pivot panel.

:::warning
This component is incomplete.

Currently, the Pivot Panel Trigger is the only part of the Pivot Panel component available.
Future versions of the Pivot Panel component will make it possible to compose each of its parts to create a custom pivot panel.

:::

The pivot panel is part of the [pivoting feature](/x/react-data-grid/pivoting/) and is enabled by default when `showToolbar` is passed to the `<DataGridPremium />` component.

You can use the Pivot Panel Trigger and [Toolbar](/x/react-data-grid/components/toolbar/) components when you need to customize the pivot panel trigger, or when implementing a custom toolbar.

## Basic usage

The demo below shows how to add a pivot panel trigger to a custom toolbar.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  PivotPanelTrigger,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import PivotTableChartIcon from '@mui/icons-material/PivotTableChart';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Pivot">
        <PivotPanelTrigger
          render={(triggerProps, state) => (
            <ToolbarButton
              {...triggerProps}
              color={state.active ? 'primary' : 'default'}
            />
          )}
        >
          <PivotTableChartIcon fontSize="small" />
        </PivotPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridPivotPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
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


# PivotPanelTrigger API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- Data Grid - Pivot Panel component 🚧

## Import

```jsx
import { PivotPanelTrigger } from '@mui/x-data-grid-premium/components';
// or
import { PivotPanelTrigger } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `func \| string` | - | No |  |
| render | `element \| func` | - | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-premium/src/components/pivotPanel/PivotPanelTrigger.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-premium/src/components/pivotPanel/PivotPanelTrigger.tsx)