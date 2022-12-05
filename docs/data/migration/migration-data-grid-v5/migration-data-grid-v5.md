# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate the Data Grid from v5 to v6.</p>

## Start using the alpha release

In `package.json`, change the version of the data grid package to `next`.

```diff
-"@mui/x-data-grid": "latest",
+"@mui/x-data-grid": "next",
```

Using `next` ensures that it will always use the latest v6 alpha release, but you can also use a fixed version, like `6.0.0-alpha.0`.

## Breaking changes

Since v6 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v5 to v6.

:::warning
The minimum supported Node.js version has been changed from 12.0.0 to 14.0.0, since [12.x.x has reached end-of-life this year](https://nodejs.org/es/blog/release/v12.22.12/).
:::

### Renamed props

- To avoid confusion with the props that will be added for the cell selection feature, some props related to row selection were renamed to have "row" in their name. The renamed props are the following:

  | Old name                   | New name                      |
  | -------------------------- | ----------------------------- |
  | `selectionModel`           | `rowSelectionModel`           |
  | `onSelectionModelChange`   | `onRowSelectionModelChange`   |
  | `disableSelectionOnClick`  | `disableRowSelectionOnClick`  |
  | `disableMultipleSelection` | `disableMultipleRowSelection` |

### Removed props

- The `disableIgnoreModificationsIfProcessingProps` prop was removed and its behavior when `true` was incorporated as the default behavior.
  The old behavior can be restored by using `apiRef.current.stopRowEditMode({ ignoreModifications: true })` or `apiRef.current.stopCellEditMode({ ignoreModifications: true })`.
- The `onColumnVisibilityChange` prop was removed. Use `onColumnVisibilityModelChange` instead.
- The `components.Header` slot was removed. Use `components.Toolbar` slot instead.

### State access

- The `gridSelectionStateSelector` selector was renamed to `gridRowSelectionStateSelector`.
- The `gridColumnsSelector` selector was removed. Use more specific grid columns selectors instead.
- The `allGridColumnsFieldsSelector` selector was removed. Use `gridColumnFieldsSelector` instead.
- The `allGridColumnsSelector` selector was removed. Use `gridColumnDefinitionsSelector` instead.
- The `visibleGridColumnsSelector` selector was removed. Use `gridVisibleColumnDefinitionsSelector` instead.
- The `filterableGridColumnsSelector` selector was removed. Use `gridFilterableColumnDefinitionsSelector` instead.
- The `filterableGridColumnsIdsSelector` selector was removed. Use `gridFilterableColumnLookupSelector` instead.
- The `visibleGridColumnsLengthSelector` selector was removed. Use `gridVisibleColumnDefinitionsSelector` instead.
- The `gridColumnsMetaSelector` selector was removed. Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` instead.
- The `getGridNumericColumnOperators` selector was removed. Use `getGridNumericOperators` instead.
- The `gridVisibleRowsSelector` selector was removed. Use `gridVisibleSortedRowIdsSelector` instead.
- The `gridRowGroupingStateSelector` selector was removed.
- The `gridFilterStateSelector` selector was removed.
- The `gridRowsStateSelector` selector was removed.
- The `gridSortingStateSelector` selector was removed.

### Events

- The `selectionChange` event was renamed to `rowSelectionChange`.
- The `rowsScroll` event was renamed to `scrollPositionChange`.
- The `columnVisibilityChange` event was removed. Use `columnVisibilityModelChange` instead.
- The `cellNavigationKeyDown` event was removed. Use `cellKeyDown` and check the key provided in the event argument.
- The `columnHeaderNavigationKeyDown` event was removed. Use `columnHeaderKeyDown` and check the key provided in the event argument.
- The `GridCallbackDetails['api']` was removed from event details. Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` instead.

### Columns

- The `GridColDef['hide']` property was removed. Use `GridColDef['columnVisibility']` instead.
- Returning `null` in `column.renderCell` or `column.renderEditCell` now renders an empty cell instead of the default formatted value. To fall back to the default formatted value, return `undefined` instead of `null`.

  ```diff
   const renderCell = () => {
    if (condition) {
      return <CustomComponent />;
    }
  - return null;
  + return undefined;
   }
  ```

### Rows

- The `GridRowParams['getValue']` property was removed. Use `params.row` instead.
- The `GridCellParams['getValue']` property was removed. Use `params.row` instead.
- The `GridActionsCellProps['api']` property was removed. Use `useGridApiContext` hook instead to get `apiRef`.
- The `GridActionsCellProps['getValue']` property was removed. Use `params.row` instead.
- The `GridFooterCellProps['getValue']` property was removed. Use `params.row` instead.

### `apiRef` methods

- The `apiRef.current.updateColumn` method was removed. Use `apiRef.current.updateColumns` instead.
- The `apiRef.current.getColumnsMeta` method was removed. Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` selectors instead.
- The `apiRef.current.getRowIndex` method was removed. Use `apiRef.current.getRowIndexRelativeToVisibleRows` instead.
- Some internal undocumented `apiRef` methods and properties were removed.

  If you don't use undocumented properties - you can skip the list below.
  Otherwise, please check the list and [open an issue](https://github.com/mui/mui-x/issues/new/choose) if there's something missing in the `apiRef`.

    <details>
    <summary markdown="span">List of removed undocumented methods and properties</summary>

  |                                                   |
  | ------------------------------------------------- |
  | `getLogger`                                       |
  | `windowRef`                                       |
  | `unstable_caches`                                 |
  | `unstable_eventManager`                           |
  | `unstable_requestPipeProcessorsApplication`       |
  | `unstable_registerPipeProcessor`                  |
  | `unstable_registerPipeApplier`                    |
  | `unstable_storeDetailPanelHeight`                 |
  | `unstable_detailPanelHasAutoHeight`               |
  | `unstable_calculateColSpan`                       |
  | `unstable_rowHasAutoHeight`                       |
  | `unstable_getLastMeasuredRowIndex`                |
  | `unstable_getViewportPageSize`                    |
  | `unstable_updateGridDimensionsRef`                |
  | `unstable_getRenderContext`                       |
  | `unstable_registerStrategyProcessor`              |
  | `unstable_applyStrategyProcessor`                 |
  | `unstable_getActiveStrategy`                      |
  | `unstable_setStrategyAvailability`                |
  | `unstable_setCellEditingEditCellValue`            |
  | `unstable_getRowWithUpdatedValuesFromCellEditing` |
  | `unstable_setRowEditingEditCellValue`             |
  | `unstable_getRowWithUpdatedValuesFromRowEditing`  |
  | `unstable_runPendingEditCellValueMutation`        |
  | `unstable_moveFocusToRelativeCell`                |
  | `unstable_updateControlState`                     |
  | `unstable_registerControlState`                   |

    </details>

### Filtering

- The `GridFilterItem['columnField']` was renamed to `GridFilterItem['field']`
- The `GridFilterItem['operatorValue']` was renamed to `GridFilterItem['operator']`
- The `GridFilterItem['operator']` is now required.

### Other exports

- The `useGridApi` hook was removed. Use `apiRef.current` instead.
- The `useGridState` hook was removed. Use `apiRef.current.state`, `apiRef.current.setState` and `apiRef.current.forceUpdate` instead.
- The `getGridColDef` utility function was removed.
- The `GridValueGetterFullParams` type was removed.
- The `GridSortModelParams` interface was removed.
- The `GridApiRef` type was removed. Use `React.MutableRefObject<GridApi>` instead.
- The `GridCellValue` type was removed. Use `any` or the `V` generic passed to most interfaces.
- The `GridRowData` type was removed. Use `GridRowModel` instead.
- The `filterPanelOperators` translation key was renamed to `filterPanelOperator`

<!--
### CSS classes

TBD

### Virtualization

TBD

### Removals from the public API

TBD
-->
