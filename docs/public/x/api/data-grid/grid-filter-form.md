# GridFilterForm API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [DataGrid](/x/react-data-grid/#mit-version-free-forever)
- [DataGridPro](/x/react-data-grid/#pro-version)
- [DataGridPremium](/x/react-data-grid/#premium-version)

## Import

```jsx
import { GridFilterForm } from '@mui/x-data-grid/components';
// or
import { GridFilterForm } from '@mui/x-data-grid';
// or
import { GridFilterForm } from '@mui/x-data-grid-pro';
// or
import { GridFilterForm } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| applyFilterChanges | `function(item: GridFilterItem) => void` | - | Yes |  |
| applyMultiFilterOperatorChanges | `function(operator: GridLogicOperator) => void` | - | Yes |  |
| deleteFilter | `function(item: GridFilterItem) => void` | - | Yes |  |
| hasMultipleFilters | `bool` | - | Yes |  |
| item | `{ field: string, id?: number \| string, operator: string, value?: any }` | - | Yes |  |
| columnInputProps | `any` | `{}` | No |  |
| columnsSort | `'asc' \| 'desc'` | - | No |  |
| deleteIconProps | `any` | `{}` | No |  |
| disableMultiFilterOperator | `bool` | - | No |  |
| filterColumns | `function(args: FilterColumnsArgs) => void` | - | No |  |
| focusElementRef | `func \| object` | - | No |  |
| logicOperatorInputProps | `any` | `{}` | No |  |
| logicOperators | `Array<'and' \| 'or'>` | `[GridLogicOperator.And, GridLogicOperator.Or]` | No |  |
| operatorInputProps | `any` | `{}` | No |  |
| readOnly | `bool` | `false` | No |  |
| showMultiFilterOperators | `bool` | - | No |  |
| valueInputProps | `any` | `{}` | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid/src/components/panel/filterPanel/GridFilterForm.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid/src/components/panel/filterPanel/GridFilterForm.tsx)