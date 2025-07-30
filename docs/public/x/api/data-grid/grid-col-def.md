# GridColDef API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [Column definition](/x/react-data-grid/column-definition/)

## Import

```jsx
import { GridColDef } from '@mui/x-data-grid-premium'
// or
import { GridColDef } from '@mui/x-data-grid-pro'
// or
import { GridColDef } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| field | `string` | - | Yes |  |
| aggregable | `boolean` | `true` | No |  |
| align | `GridAlignment` | - | No |  |
| availableAggregationFunctions | `string[]` | - | No |  |
| cellClassName | `GridCellClassNamePropType<R, V>` | - | No |  |
| colSpan | `number \| GridColSpanFn<R, V, F>` | `1` | No |  |
| description | `string` | - | No |  |
| disableColumnMenu | `boolean` | `false` | No |  |
| disableExport | `boolean` | `false` | No |  |
| disableReorder | `boolean` | `false` | No |  |
| display | `'text' \| 'flex'` | - | No |  |
| editable | `boolean` | `false` | No |  |
| examples | `V[]` | - | No |  |
| filterable | `boolean` | `true` | No |  |
| filterOperators | `readonly GridFilterOperator<R, V, F, any>[]` | - | No |  |
| flex | `number` | - | No |  |
| getApplyQuickFilterFn | `GetApplyQuickFilterFn<R, V>` | - | No |  |
| getSortComparator | `(sortDirection: GridSortDirection) => GridComparatorFn<V> \| undefined` | - | No |  |
| groupable | `boolean` | `true` | No |  |
| groupingValueGetter | `GridGroupingValueGetter<R>` | - | No |  |
| headerAlign | `GridAlignment` | - | No |  |
| headerClassName | `GridColumnHeaderClassNamePropType` | - | No |  |
| headerName | `string` | - | No |  |
| hideable | `boolean` | `true` | No |  |
| hideSortIcons | `boolean` | `false` | No |  |
| maxWidth | `number` | `Infinity` | No |  |
| minWidth | `number` | `50` | No |  |
| pastedValueParser | `GridPastedValueParser<R, V, F>` | - | No |  |
| pinnable | `boolean` | `true` | No |  |
| pivotable | `boolean` | `true` | No |  |
| preProcessEditCellProps | `(params: GridPreProcessEditCellProps) => GridEditCellProps \| Promise<GridEditCellProps>` | - | No |  |
| renderCell | `(params: GridRenderCellParams<R, V, F>) => React.ReactNode` | - | No |  |
| renderEditCell | `(params: GridRenderEditCellParams<R, V, F>) => React.ReactNode` | - | No |  |
| renderHeader | `(params: GridColumnHeaderParams<R, V, F>) => React.ReactNode` | - | No |  |
| renderHeaderFilter | `(params: GridRenderHeaderFilterProps) => React.ReactNode` | - | No |  |
| resizable | `boolean` | `true` | No |  |
| rowSpanValueGetter | `GridValueGetter<R, V, F>` | - | No |  |
| sortable | `boolean` | `true` | No |  |
| sortComparator | `GridComparatorFn<V>` | - | No |  |
| sortingOrder | `readonly GridSortDirection[]` | - | No |  |
| type | `GridColType` | `'singleSelect'` | No |  |
| valueFormatter | `GridValueFormatter<R, V, F>` | - | No |  |
| valueGetter | `GridValueGetter<R, V, F>` | - | No |  |
| valueParser | `GridValueParser<R, V, F>` | - | No |  |
| valueSetter | `GridValueSetter<R, V, F>` | - | No |  |
| width | `number` | `100` | No |  |

> **Note**: The `ref` is forwarded to the root element.