# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate the Data Grid from v5 to v6.</p>

## Start using the alpha release

In `package.json`, change the version of the data grid package to `next`.

```diff
-"@mui/x-data-grid": "latest",
+"@mui/x-data-grid": "next",
```

Using `next` ensures that it will always use the latest v6 alpha release, but you can also use a fixed version, like `6.0.0-alpha.0`.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v6. You can run `v6.0.0/data-grid/preset-safe` targeting only Data Grid or `v6.0.0/preset-safe` to target Date and Time pickers as well.
It should be only applied **once per folder.**

```sh
// Data Grid specific
npx @mui/x-codemod v6.0.0/data-grid/preset-safe <path>
// Target Date and Time pickers as well
npx @mui/x-codemod v6.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/next/packages/x-codemod/README.md#preset-safe-for-data-grid) for more details.
:::

Breaking changes that are handled by this codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen.

If you have already applied the `v6.0.0/data-grid/preset-safe` (or `v6.0.0/preset-safe`) codemod, then you most proabably should not need to take any further action on these items. If there's a specific part of the breaking change that is not part of the codemod or needs some manual work, it will be listed in the end of each section.

All other changes must be handled manually.

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
  | `showCellRightBorder`      | `showCellVerticalBorder`      |
  | `showColumnRightBorder`    | `showColumnVerticalBorder`    |

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
- The `gridTotalHeaderHeightSelector` selector was removed.
- The `gridDensityRowHeightSelector` selector was removed.
- The `gridDensityHeaderHeightSelector` selector was removed.
- The `apiRef.current.state.density.headerHeight` property was removed.
- The `apiRef.current.state.density.rowHeight` property was removed.

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

### ✅ Column menu

- The column menu components have been renamed or merged with the new design for consistency and API improvement, the new components are following:

  | Old name                                                            | New name                        |
  | ------------------------------------------------------------------- | ------------------------------- |
  | `GridFilterMenuItem`                                                | `GridColumnMenuFilterItem`      |
  | `HideGridColMenuItem`                                               | `GridColumnMenuHideItem`        |
  | `GridColumnsMenuItem`                                               | `GridColumnMenuColumnsItem`     |
  | `SortGridMenuItems`                                                 | `GridColumnMenuSortItem`        |
  | `GridColumnPinningMenuItems`                                        | `GridColumnMenuPinningItem`     |
  | `GridAggregationColumnMenuItem`                                     | `GridColumnMenuAggregationItem` |
  | `GridRowGroupingColumnMenuItems`, `GridRowGroupableColumnMenuItems` | `GridColumnMenuGroupingItem`    |

- The `GridFilterItemProps` has been renamed to `GridColumnMenuItemProps`.
- Props `column` and `currentColumn` passed to `GridColumnMenu` and column menu items have been renamed to `colDef`

These changes are not part of `preset-safe` codemod and you need to handle them manually:

- If you are using `GridRowGroupingColumnMenuItems` or `GridRowGroupableColumnMenuItems`, you need to replace them with `GridColumnMenuGroupingItem` which provides a better api.
- Type `GridFilterItemProps` should be renamed to `GridColumnMenuItemProps`.
- If you are using Custom Column Menu using `components.ColumnMenu` slot, it now recieves `colDef` prop instead of `currentColumn`, you need to fix it manually

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
- The `apiRef.current.setDensity` signature was changed. It only accepts `density: GridDensity` as a single parameter.
- Some internal undocumented `apiRef` methods and properties were removed.

  If you don't use undocumented properties - you can skip the list below.
  Otherwise, please check the list and [open an issue](https://github.com/mui/mui-x/issues/new/choose) if there's something missing in the `apiRef`.

    <details>
    <summary markdown="span">List of removed undocumented methods and properties</summary>

  |                                                   |
  | ------------------------------------------------- |
  | `getLogger`                                       |
  | `windowRef`                                       |
  | `footerRef`                                       |
  | `headerRef`                                       |
  | `columnHeadersElementRef`                         |
  | `columnHeadersContainerElementRef`                |
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
- The `GridColumns` type was removed. Use `GridColDef[]` instead.
- The `GridActionsColDef` interface was removed. Use `GridColDef` instead.
- The `GridEnrichedColDef` type was removed. Use `GridColDef` instead.
- The `GridStateColDef` type was removed.
- The `GridDensityTypes` enum was removed. Use `GridDensity` type instead.

  If you use it to type `searchPredicate` - use `GridColumnsPanelProps['searchPredicate']` instead.

  If you use it to type `getApplyFilterFn` - use `GridFilterOperator['getApplyFilterFn']` instead.

- The `GridHeaderPlaceholder` component was removed.
- The `GridValueGetterFullParams` type was removed.
- The `GridSortModelParams` interface was removed.
- The `GridApiRef` type was removed. Use `React.MutableRefObject<GridApi>` instead.
- The `GridCellValue` type was removed. Use `any` or the `V` generic passed to most interfaces.
- The `GridRowData` type was removed. Use `GridRowModel` instead.
- The `filterPanelOperators` translation key was renamed to `filterPanelOperator`
- The `MAX_PAGE_SIZE` constant was removed.
- The `DATA_GRID_DEFAULT_SLOTS_COMPONENTS` export was removed.
- The `useGridScrollFn` hook was removed.

### CSS classes

- Some CSS classes were removed or renamed

  | MUI X v5 classes          | MUI X v6 classes               | Note                                            |
  | ------------------------- | ------------------------------ | ----------------------------------------------- |
  | `.MuiDataGrid-withBorder` | `.MuiDataGrid-withBorderColor` | The class only sets `border-color` CSS property |

<!--
### Virtualization

TBD

### Removals from the public API

TBD
-->
