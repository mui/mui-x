# GridToolbarQuickFilter API

> ⚠️ **Warning**: This component is deprecated. Consider using an alternative component.

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [DataGrid](/x/react-data-grid/#mit-version-free-forever)
- [DataGridPro](/x/react-data-grid/#pro-version)
- [DataGridPremium](/x/react-data-grid/#premium-version)

## Import

```jsx
import { GridToolbarQuickFilter } from '@mui/x-data-grid/components';
// or
import { GridToolbarQuickFilter } from '@mui/x-data-grid';
// or
import { GridToolbarQuickFilter } from '@mui/x-data-grid-pro';
// or
import { GridToolbarQuickFilter } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| debounceMs | `number` | `150` | No |  |
| quickFilterFormatter | `function(values: Array<any>) => string` | `(values: string[]) => values.join(' ')` | No |  |
| quickFilterParser | `function(input: string) => Array<any>` | `(searchText: string) => searchText
  .split(' ')
  .filter((word) => word !== '')` | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/toolbar/GridToolbarQuickFilter.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/toolbar/GridToolbarQuickFilter.tsx)