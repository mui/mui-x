# GridFilterPanel API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [DataGrid](/x/react-data-grid/#mit-version-free-forever)
- [DataGridPro](/x/react-data-grid/#pro-version)
- [DataGridPremium](/x/react-data-grid/#premium-version)

## Import

```jsx
import { GridFilterPanel } from '@mui/x-data-grid/components';
// or
import { GridFilterPanel } from '@mui/x-data-grid';
// or
import { GridFilterPanel } from '@mui/x-data-grid-pro';
// or
import { GridFilterPanel } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columnsSort | `'asc' \| 'desc'` | - | No |  |
| disableAddFilterButton | `bool` | `false` | No |  |
| disableRemoveAllButton | `bool` | `false` | No |  |
| filterFormProps | `{ columnInputProps?: any, columnsSort?: 'asc' \| 'desc', deleteIconProps?: any, filterColumns?: func, logicOperatorInputProps?: any, operatorInputProps?: any, valueInputProps?: any }` | - | No |  |
| getColumnForNewFilter | `function(args: GetColumnForNewFilterArgs) => void` | - | No |  |
| logicOperators | `Array<'and' \| 'or'>` | `[GridLogicOperator.And, GridLogicOperator.Or]` | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/panel/filterPanel/GridFilterPanel.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/panel/filterPanel/GridFilterPanel.tsx)