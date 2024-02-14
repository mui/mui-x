---
productId: x-data-grid
---

# Migration from v5 to v6

<p class="description">This guide describes the changes needed to migrate the Data Grid from v5 to v6.</p>

## Introduction

To get started, check out [the blog post about the release of MUI X v6](https://mui.com/blog/mui-x-v6/).

## Start using the new release

In `package.json`, change the version of the data grid package to `^6.0.0`.

```diff
-"@mui/x-data-grid": "5.X.X",
+"@mui/x-data-grid": "^6.0.0",
```

Since v6 is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v5 to v6.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v6. You can run `v6.0.0/data-grid/preset-safe` targeting only Data Grid or `v6.0.0/preset-safe` to target Date and Time pickers as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
// Data Grid specific
npx @mui/x-codemod@latest v6.0.0/data-grid/preset-safe <path>
// Target Date and Time Pickers as well
npx @mui/x-codemod@latest v6.0.0/preset-safe <path>
```

:::success
Apart from the removed methods and exports that require manual intervention, around 50% of the DataGrid breaking changes are automatically handled by the `preset-safe` codemod 🎉.
:::

:::info
If you want to run the codemods one by one, check out the codemods included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/master/packages/x-codemod/README.md#preset-safe-for-data-grid-v600) for more details.
:::

Breaking changes that are handled by `preset-safe` codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen or next to the specific point that is handled by it.

If you have already applied the `v6.0.0/data-grid/preset-safe` (or `v6.0.0/preset-safe`) codemod, then you should not need to take any further action on these items. If there's a specific part of the breaking change that is not part of the codemod or needs some manual work, it will be listed in the end of each section.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DataGrid {...newProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Breaking changes

Since v6 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v5 to v6.

:::warning
The minimum supported Node.js version has been changed from 12.0.0 to 14.0.0, since [12.x.x reached end-of-life status](https://nodejs.org/en/blog/release/v12.22.12) in 2022.
:::

### ✅ Renamed props

- To avoid confusion with the props that will be added for the cell selection feature, some props related to row selection were renamed to have "row" in their name. The renamed props are the following:

  | Old name                   | New name                      |
  | :------------------------- | :---------------------------- |
  | `selectionModel`           | `rowSelectionModel`           |
  | `onSelectionModelChange`   | `onRowSelectionModelChange`   |
  | `disableSelectionOnClick`  | `disableRowSelectionOnClick`  |
  | `disableMultipleSelection` | `disableMultipleRowSelection` |
  | `showCellRightBorder`      | `showCellVerticalBorder`      |
  | `showColumnRightBorder`    | `showColumnVerticalBorder`    |
  | `headerHeight`             | `columnHeaderHeight`          |

- The corresponding type for `rowSelectionModel` (previously `selectionModel`) was renamed from `GridSelectionModel` to `GridRowSelectionModel`.

### Removed props

- The `disableIgnoreModificationsIfProcessingProps` prop was removed and its behavior when `true` was incorporated as the default behavior.
  The old behavior can be restored by using `apiRef.current.stopRowEditMode({ ignoreModifications: true })` or `apiRef.current.stopCellEditMode({ ignoreModifications: true })`.
- The `onColumnVisibilityChange` prop was removed. Use `onColumnVisibilityModelChange` instead.
- The `components.Header` slot was removed. Use `components.Toolbar` or `slots.toolbar` slot instead.
- ✅ The `disableExtendRowFullWidth` prop was removed. Use [`showCellVerticalBorder`](/x/api/data-grid/data-grid/#props) or [`showColumnVerticalBorder`](/x/api/data-grid/data-grid/#props) prop to show or hide right border for cells and header cells respectively.
- The `columnTypes` prop was removed. For custom column types see [Custom column types](/x/react-data-grid/column-definition/#custom-column-types) docs.
- ✅ The `onCellFocusOut` prop was removed. Use `slotProps.cell.onBlur` instead:
  ```tsx
  <DataGrid
    slotProps={{
      cell: {
        onBlur: (event) => {
          const cellElement = event.currentTarget;
          const field = cellElement.getAttribute('data-field');
          const rowId = cell.parentElement.getAttribute('data-id');
        },
      },
    }}
  />
  ```
- The `error` and `onError` props were removed - the grid no longer catches errors during rendering. To catch errors that happen during rendering use the [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary). The `components.ErrorOverlay` slot was also removed.

### State access

- ✅ The `gridSelectionStateSelector` selector was renamed to `gridRowSelectionStateSelector`.
- ✅ The `allGridColumnsFieldsSelector` selector was removed. Use `gridColumnFieldsSelector` instead.
- ✅ The `allGridColumnsSelector` selector was removed. Use `gridColumnDefinitionsSelector` instead.
- ✅ The `visibleGridColumnsSelector` selector was removed. Use `gridVisibleColumnDefinitionsSelector` instead.
- ✅ The `filterableGridColumnsSelector` selector was removed. Use `gridFilterableColumnDefinitionsSelector` instead.
- ✅ The `gridVisibleSortedRowIdsSelector` selector was renamed to `gridExpandedSortedRowIdsSelector`
- ✅ The `gridVisibleSortedRowEntriesSelector` selector was renamed to `gridExpandedSortedRowEntriesSelector`.
- ✅ The `gridVisibleRowCountSelector` selector was renamed to `gridExpandedRowCountSelector`.
- ✅ The `gridVisibleSortedTopLevelRowEntriesSelector` selector was renamed to `gridFilteredSortedTopLevelRowEntriesSelector`.
- ✅ The `gridVisibleTopLevelRowCountSelector` selector was renamed to `gridFilteredTopLevelRowCountSelector`.
- ✅ The `getGridNumericColumnOperators` selector was removed. Use `getGridNumericOperators` instead.
- The `gridVisibleRowsSelector` selector was removed. Use `gridExpandedSortedRowIdsSelector` instead.
- The `gridColumnsSelector` selector was removed. Use more specific grid columns selectors instead.
  ```diff
  -const { all, lookup, columnVisibilityModel } = gridColumnsSelector(apiRef);
  +const all = gridColumnFieldsSelector(apiRef);
  +const lookup = gridColumnLookupSelector(apiRef);
  +const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
  ```
- The `filterableGridColumnsIdsSelector` selector was removed. Use `gridFilterableColumnLookupSelector` instead.
  ```diff
  -const filterableFields = filterableGridColumnsIdsSelector(apiRef);
  +const lookup = gridFilterableColumnLookupSelector(apiRef);
  +const filterableFields = gridColumnFieldsSelector(apiRef).filter(field => lookup[field]);
  ```
- The `visibleGridColumnsLengthSelector` selector was removed. Use `gridVisibleColumnDefinitionsSelector` instead.
  ```diff
  -const visibleColumnsLength = visibleGridColumnsLengthSelector(apiRef);
  +const visibleColumnsLength = gridVisibleColumnDefinitionsSelector(apiRef).length;
  ```
- The `gridColumnsMetaSelector` selector was removed. Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` instead.
  ```diff
  -const { totalWidth, positions } = gridColumnsMetaSelector(apiRef);
  +const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  +const positions = gridColumnPositionsSelector(apiRef);
  ```
- The `gridRowGroupingStateSelector` selector was removed.
- The `gridFilterStateSelector` selector was removed.
- The `gridRowsStateSelector` selector was removed.
- The `gridSortingStateSelector` selector was removed.
- The `gridTotalHeaderHeightSelector` selector was removed.
- The `gridDensityRowHeightSelector` selector was removed.
- The `gridDensityHeaderHeightSelector` selector was removed.
- The `gridEditRowsStateSelector` selector was removed.
- The `apiRef.current.state.density.headerHeight` property was removed.
- The `apiRef.current.state.density.rowHeight` property was removed.

### Events

- ✅ The `selectionChange` event was renamed to `rowSelectionChange`.
- ✅ The `rowsScroll` event was renamed to `scrollPositionChange`.
- The `columnVisibilityChange` event was removed. Use [`columnVisibilityModelChange`](https://mui.com/x/react-data-grid/events/#catalog-of-events) instead.
- The `cellNavigationKeyDown` event was removed. Use `cellKeyDown` and check the key provided in the event argument.
- The `columnHeaderNavigationKeyDown` event was removed. Use `columnHeaderKeyDown` and check the key provided in the event argument.
- The `cellKeyDown` event will also be fired for keyboard events that occur inside components that use Portals.
  This affects specially custom edit components, where pressing a [shortcut key](/x/react-data-grid/editing/#stop-editing) will trigger the stop editing routine.
  For instance, pressing <kbd class="key">Enter</kbd> inside the Portal will cause the change to be saved.
  The `onCellEditStop` (or `onRowEditStop`) prop can be used to restore the old behavior.
  ```tsx
  <DataGrid
    onCellEditStop={(params, event) => {
      if (params.reason !== GridCellEditStopReasons.enterKeyDown) {
        return;
      }
      // Check if the target is inside a Portal
      if (
        (event.target as any).nodeType === 1 &&
        !event.currentTarget.contains(event.target)
      ) {
        event.defaultMuiPrevented = true;
      }
    }}
  />
  ```
- The `componentError` event was removed. Use the [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) to catch errors thrown during rendering.
- The `GridCallbackDetails['api']` was removed from event details. Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` instead.
- The `cellFocusIn` and `cellFocusOut` events are internal now. Use `slotProps.cell.onFocus` and `slotProps.cell.onBlur` props instead.

:::info
To know more about the supported events and their signatures, check the [events catalog](https://mui.com/x/react-data-grid/events/#catalog-of-events) page.
:::

### Columns

- The `GridColDef['hide']` property was removed. Use [`columnVisibilityModel`](https://mui.com/x/react-data-grid/column-visibility/#initialize-the-visible-columns) instead.
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

- The `onColumnOrderChange` prop callback now is called only when a column, that is being reordered, is dropped in another position.
- The `singleSelect` column type now has a default value formatter that returns the `label` corresponding to the selected value when `valueOptions` is an array of objects.
  As a consequence, any existing value formatter will not be applied to the individual options anymore, but only to the text of the cell.
  It is recommended to migrate `valueOptions` to an array of objects to be able to add a custom label for each value.
  To override the label used for each option when the cell is in edit mode or in the filter panel, the following components now support a `getOptionLabel` prop:

  - `GridEditSingleSelectCell`
  - `GridFilterInputSingleSelect`
  - `GridFilterInputMultipleSingleSelect`

  This prop accepts a callback that is called with the item from `valueOptions` and must return the string to use as new label.

- The `date` and `dateTime` columns now only support `Date` objects as values. To parse a string value, use the [`valueGetter`](https://mui.com/x/react-data-grid/column-definition/#value-getter):

  ```tsx
  <DataGrid
    columns={[
      {
        field: 'date',
        type: 'date',
        valueGetter: (params) => new Date(params.value),
      },
    ]}
  />
  ```

### ✅ Column menu

- The column menu components have been renamed or merged with the new design for consistency and API improvement, the new components are following:

  | Old name                                                            | New name                        |
  | :------------------------------------------------------------------ | :------------------------------ |
  | `GridFilterMenuItem`                                                | `GridColumnMenuFilterItem`      |
  | `HideGridColMenuItem`                                               | `GridColumnMenuHideItem`        |
  | `GridColumnsMenuItem`                                               | `GridColumnMenuColumnsItem`     |
  | `SortGridMenuItems`                                                 | `GridColumnMenuSortItem`        |
  | `GridColumnPinningMenuItems`                                        | `GridColumnMenuPinningItem`     |
  | `GridAggregationColumnMenuItem`                                     | `GridColumnMenuAggregationItem` |
  | `GridRowGroupingColumnMenuItems`, `GridRowGroupableColumnMenuItems` | `GridColumnMenuGroupingItem`    |

- The `GridFilterItemProps` type has been renamed to `GridColumnMenuItemProps`.
- Props `column` and `currentColumn` passed to `GridColumnMenu` and column menu items have been renamed to `colDef`
  ```diff
  -function CustomColumnMenu({ column }) {
  -  if (column.field === 'name') {
  +function CustomColumnMenu({ colDef }) {
  +  if (colDef.field === 'name') {
       return <div>Custom column menu for name field</div>;
     }
     return (
       <div>
         <GridFilterMenuItem colDef={colDef} />
         <GridColumnMenuColumnsItem colDef={colDef} />
       </div>
     );
   }
  ```

:::warning
Most of this breaking change is handled by `preset-safe` codemod but some further fixes may be needed:

- If you are using `GridRowGroupingColumnMenuItems` or `GridRowGroupableColumnMenuItems`, replace them with `GridColumnMenuGroupingItem` which provides a better API.
- If you are using Custom Column Menu using `components.ColumnMenu` or `slots.columnMenu` slot, change `currentColumn` prop passed to the column menu to `colDef`.

:::

### Rows

- The `GridRowParams['getValue']` property was removed. Use `params.row` instead.
- The `GridCellParams['getValue']` property was removed. Use `params.row` instead.
- The default type of `GridCellParams['value']` was changed from `any` to `unknown`.
- The `GridActionsCellProps['api']` property was removed. Use `useGridApiContext` hook instead to get `apiRef`.
- The `GridActionsCellProps['getValue']` property was removed. Use `params.row` instead.
- The `GridFooterCellProps['getValue']` property was removed. Use `params.row` instead.
- The `cellFocus`, `cellTabIndex` and `editRowsState` props are not passed to the `Row` slot anymore.
  Use the `focusedCell` and `tabbableCell` props instead.
  For the editing state, use the API methods.
  ```diff
   function CustomRow(props) {
  -  const focusedField = props.cellFocus.field;
  -  const tabIndex = props.cellTabIndex.field && cellMode === 'view' ? 0 : 1;
  +  const focusedField = props.focusedCell;
  +  const tabIndex = props.tabbableCell === column.field ? 0 : 1;
  ```
- Updating the [`rows` prop](/x/react-data-grid/row-updates/#the-rows-prop) or calling `apiRef.current.setRows` will now remove the expansion state of the grid as these methods are meant to replace the rows.
  For partial row updates, use the [`apiRef.current.updateRows`](/x/react-data-grid/row-updates/#the-updaterows-method) method instead.

### Pagination

- The `page` and `pageSize` props and their respective event handlers `onPageChange` and `onPageSizeChange` were removed. Use `paginationModel` and [`onPaginationModelChange`](/x/react-data-grid/pagination/#controlled-pagination-model) instead.

  ```diff
   <DataGrid
  -  page={page}
  -  pageSize={pageSize}
  -  onPageChange={handlePageChange}
  -  onPageSizeChange={handlePageSizeChange}
  +  paginationModel={{ page, pageSize }}
  +  onPaginationModelChange={(paginationModel) => handlePaginationModelChange(paginationModel)}
   />
  ```

- The properties `initialState.pagination.page` and `initialState.pagination.pageSize` were also removed. Use [`initialState.pagination.paginationModel`](/x/react-data-grid/pagination/#initializing-the-pagination-model) instead.

  ```diff
  -initialState={{ pagination: { page: 1, pageSize: 10 } }}
  +initialState={{ pagination: { paginationModel: { page: 1, pageSize: 10 } } }}
  ```

- ✅ The `rowsPerPageOptions` prop was renamed to [`pageSizeOptions`](/x/react-data-grid/pagination/#page-size-options).

  ```diff
  -<DataGrid rowsPerPageOptions={[10, 20, 50]} />
  +<DataGrid pageSizeOptions={[10, 20, 50]} />
  ```

### `apiRef` methods

- ✅ The `apiRef.current.getRowIndex` method was removed. Use `apiRef.current.getRowIndexRelativeToVisibleRows` instead.
- ✅ The `apiRef.current.setFilterLinkOperator` method was renamed to `apiRef.current.setFilterLogicOperator`.
- The `apiRef.current.updateColumn` method was removed. Use `apiRef.current.updateColumns` instead.
  ```diff
  -apiRef.current.updateColumn({ field: 'name', width: 100 });
  +apiRef.current.updateColumns([{ field: 'name', width: 100 }]);
  ```
- The `apiRef.current.getColumnsMeta` method was removed. Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` selectors instead.
  ```diff
  -const { totalWidth, positions } = apiRef.current.getColumnsMeta();
  +const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  +const positions = gridColumnPositionsSelector(apiRef);
  ```
- The `apiRef.current.setDensity` signature was changed. It only accepts `density: GridDensity` as a single parameter.
- The `apiRef.current.getVisibleRowModels` method was removed. Use `gridExpandedSortedRowEntriesSelector` selector instead.
- The `apiRef.current.showError` method was removed. The UI for errors is no longer handled by the grid.
- Some internal undocumented `apiRef` methods and properties were removed.

  If you don't use undocumented properties - you can skip the list below.
  Otherwise, please check the list and [open an issue](https://github.com/mui/mui-x/issues/new/choose) if there's something missing in the `apiRef`.

    <details>
    <summary markdown="span">List of removed undocumented methods and properties</summary>

  |                                                   |
  | :------------------------------------------------ |
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

- ✅ The `GridFilterItem['columnField']` was renamed to `GridFilterItem['field']`
- ✅ The `GridFilterItem['operatorValue']` was renamed to `GridFilterItem['operator']`
- The `GridFilterItem['operator']` is now required.
- The `GridFilterInputValue` component cannot be used with `singleSelect` columns anymore. Use `GridFilterInputSingleSelect` instead.
- ✅ The `GridLinkOperator` enum was renamed to `GridLogicOperator`.
- The `GridFilterModel['linkOperator']` type was renamed to `GridFilterModel['logicOperator']`.
- ✅ The `linkOperators` prop of `GridFilterForm` and `GridFilterPanel` components was renamed to `logicOperators`.
- ✅ The `linkOperatorInputProps` prop of `GridFilterForm` component was renamed to `logicOperatorInputProps`.
- ✅ The `filterFormProps.linkOperatorInputProps` prop in `GridFilterForm` component was renamed to `filterFormProps.logicOperatorInputProps`.
- ✅ The `GridLocaleText['filterPanelLinkOperator']` property was renamed to `GridLocaleText['filterPanelLogicOperator']`.

### Editing

- ✅ The editing API that is enabled by default was replaced with a new API that contains better support for server-side persistence, validation and customization. This new editing feature was already available in v5 under the `newEditingApi` experimental flag. In v6, this flag can be removed.
  ```diff
   <DataGrid
  -  experimentalFeatures={{ newEditingApi: true }}
   />
  ```
- ✅ The aggregation and row pinning are no longer experimental features. The flags `experimentalFeatures.aggregation` and `experimentalFeatures.rowPinning` can be removed now.
  ```diff
   <DataGridPremium
  -  experimentalFeatures={{
  -   aggregation: true,
  -   rowPinning: true,
  -  }}
   />
  ```
- The `editCellPropsChange` event was removed. If you still need it please file a new issue so we can propose an alternative.
- The `cellEditCommit` event was removed and the `processRowUpdate` prop can be used in place. More information, check the [docs](https://mui.com/x/react-data-grid/editing/#server-side-persistence) section about the topic.
- The `editRowsModel` and `onEditRowsModelChange` props were removed. The [`cellModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) or [`rowModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) props can be used to achieve the same goal.
- The `GridEditRowsModel` type was removed.
- The following API methods were removed:
  - Use `apiRef.current.stopCellEditMode` to replace `apiRef.current.commitCellChange`
  - Use `apiRef.current.startCellEditMode` to replace `apiRef.current.setCellMode(id, field, 'edit')`
  - Use `apiRef.current.stopRowEditMode` to replace `apiRef.current.commitRowChange`
  - Use `apiRef.current.startRowMode` to replace `apiRef.current.setRowMode(id, 'edit')`
  - Use the [`cellModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) or [`rowModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) props to replace `apiRef.current.setEditRowsModel`.

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
- The `GridCellParams` interface was changed. The row generic is now before the cell generic.

  ```diff
  -extends GridCellParams<V, R, F, N> {
  +extends GridCellParams<R, V, F, N> {
  ```

  This means that values for 2 generic arguments needs to be provided before the argument that you already have.

  ```diff
  -renderCell: (params: GridRenderCellParams<number>) => {
  +renderCell: (params: GridRenderCellParams<any, number>) => {
  ```

- The `GridErrorOverlay` component was removed.
- The `GridRowScrollEndParams["virtualRowsCount"]` param was renamed to `GridRowScrollEndParams["visibleRowsCount"]`.
- The `GridCellIdentifier` type was removed. Use `GridCellCoordinates` instead.

### ✅ CSS classes

- Some CSS classes were removed or renamed

  | MUI X v5 classes                           | MUI X v6 classes                            | Note                                            |
  | :----------------------------------------- | :------------------------------------------ | :---------------------------------------------- |
  | `.MuiDataGrid-withBorder`                  | `.MuiDataGrid-withBorderColor`              | The class only sets `border-color` CSS property |
  | `.MuiDataGrid-filterFormLinkOperatorInput` | `.MuiDataGrid-filterFormLogicOperatorInput` |                                                 |

### Removals from the public API

- The `getGridSingleSelectQuickFilterFn` function was removed.
  You can copy the old function and pass it to the `getApplyQuickFilterFn` property of the `singleSelect` column definition.

## Rename `components` to `slots` (optional)

The `components` and `componentsProps` props are being renamed to `slots` and `slotProps` props respectively.
This is a slow and ongoing effort between all the different libraries maintained by MUI.
To smooth the transition, data grid support both the `components` props which are deprecated, and the new `slots` props.

If you would like to use the new API and do not want to see deprecated prop usage, consider running `rename-components-to-slots` codemod handling the prop renaming.

```bash
npx @mui/x-codemod@latest v6.0.0/data-grid/rename-components-to-slots <path>
```

Take a look at [the RFC](https://github.com/mui/material-ui/issues/33416) for more information.
