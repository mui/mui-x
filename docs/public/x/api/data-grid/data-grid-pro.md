# DataGridPro API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [DataGrid](/x/react-data-grid/#mit-version-free-forever)
- [DataGridPro](/x/react-data-grid/#pro-version)
- [DataGridPremium](/x/react-data-grid/#premium-version)

## Import

```jsx
import { DataGridPro } from '@mui/x-data-grid-pro/DataGridPro';
// or
import { DataGridPro } from '@mui/x-data-grid-pro';
// or
import { DataGridPro } from '@mui/x-data-grid-premium';
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| columns | `Array<object>` | - | Yes |  |
| apiRef | `{ current?: object }` | - | No |  |
| aria-label | `string` | - | No |  |
| aria-labelledby | `string` | - | No |  |
| autoHeight (deprecated) | `bool` | `false` | No | ⚠️ Use flex parent container instead: [https://mui.com/x/react-data-grid/layout/#flex-parent-container](https://mui.com/x/react-data-grid/layout/#flex-parent-container) |
| autoPageSize | `bool` | `false` | No |  |
| autosizeOnMount | `bool` | `false` | No |  |
| autosizeOptions | `{ columns?: Array<string>, disableColumnVirtualization?: bool, expand?: bool, includeHeaders?: bool, includeOutliers?: bool, outliersFactor?: number }` | - | No |  |
| cellModesModel | `object` | - | No |  |
| checkboxSelection | `bool` | `false` | No |  |
| checkboxSelectionVisibleOnly | `bool` | `false` | No |  |
| classes | `object` | - | No | Override or extend the styles applied to the component. |
| clipboardCopyCellDelimiter | `string` | `'\t'` | No |  |
| columnBufferPx | `number` | `150` | No |  |
| columnGroupHeaderHeight | `number` | - | No |  |
| columnHeaderHeight | `number` | `56` | No |  |
| columnVisibilityModel | `object` | - | No |  |
| dataSource | `{ getChildrenCount?: func, getGroupKey?: func, getRows: func, updateRow?: func }` | - | No |  |
| dataSourceCache | `{ clear: func, get: func, set: func }` | - | No |  |
| defaultGroupingExpansionDepth | `number` | `0` | No |  |
| density | `'comfortable' \| 'compact' \| 'standard'` | `"standard"` | No |  |
| detailPanelExpandedRowIds | `Set` | - | No |  |
| disableAutosize | `bool` | `false` | No |  |
| disableChildrenFiltering | `bool` | `false` | No |  |
| disableChildrenSorting | `bool` | `false` | No |  |
| disableColumnFilter | `bool` | `false` | No |  |
| disableColumnMenu | `bool` | `false` | No |  |
| disableColumnPinning | `bool` | `false` | No |  |
| disableColumnReorder | `bool` | `false` | No |  |
| disableColumnResize | `bool` | `false` | No |  |
| disableColumnSelector | `bool` | `false` | No |  |
| disableColumnSorting | `bool` | `false` | No |  |
| disableDensitySelector | `bool` | `false` | No |  |
| disableEval | `bool` | `false` | No |  |
| disableMultipleColumnsFiltering | `bool` | `false` | No |  |
| disableMultipleColumnsSorting | `bool` | `false` | No |  |
| disableMultipleRowSelection | `bool` | `false (`!props.checkboxSelection` for MIT Data Grid)` | No |  |
| disableRowSelectionOnClick | `bool` | `false` | No |  |
| disableVirtualization | `bool` | `false` | No |  |
| editMode | `'cell' \| 'row'` | `"cell"` | No |  |
| estimatedRowCount | `number` | - | No |  |
| experimentalFeatures | `{ warnIfFocusStateIsNotSynced?: bool }` | - | No |  |
| filterDebounceMs | `number` | `150` | No |  |
| filterMode | `'client' \| 'server'` | `"client"` | No |  |
| filterModel | `{ items: Array<{ field: string, id?: number \| string, operator: string, value?: any }>, logicOperator?: 'and' \| 'or', quickFilterExcludeHiddenColumns?: bool, quickFilterLogicOperator?: 'and' \| 'or', quickFilterValues?: array }` | - | No |  |
| getCellClassName | `function(params: GridCellParams) => string` | - | No |  |
| getDetailPanelContent | `function(params: GridRowParams) => React.JSX.Element` | - | No |  |
| getDetailPanelHeight | `function(params: GridRowParams) => number \| string` | `"() => 500"` | No |  |
| getEstimatedRowHeight | `function(params: GridRowHeightParams) => number \| null` | - | No |  |
| getRowClassName | `function(params: GridRowClassNameParams) => string` | - | No |  |
| getRowHeight | `function(params: GridRowHeightParams) => GridRowHeightReturnValue` | - | No |  |
| getRowId | `func` | - | No |  |
| getRowSpacing | `function(params: GridRowSpacingParams) => GridRowSpacing` | - | No |  |
| getTreeDataPath | `function(row: R) => Array<string>` | - | No |  |
| groupingColDef | `func \| object` | - | No |  |
| headerFilterHeight | `number` | - | No |  |
| headerFilters | `bool` | `false` | No |  |
| hideFooter | `bool` | `false` | No |  |
| hideFooterPagination | `bool` | `false` | No |  |
| hideFooterRowCount | `bool` | `false` | No |  |
| hideFooterSelectedRowCount | `bool` | `false` | No |  |
| ignoreDiacritics | `bool` | `false` | No |  |
| ignoreValueFormatterDuringExport | `{ clipboardExport?: bool, csvExport?: bool } \| bool` | `false` | No |  |
| initialState | `object` | - | No |  |
| isCellEditable | `function(params: GridCellParams) => boolean` | - | No |  |
| isGroupExpandedByDefault | `function(node: GridGroupNode) => boolean` | - | No |  |
| isRowSelectable | `function(params: GridRowParams) => boolean` | - | No |  |
| keepColumnPositionIfDraggedOutside | `bool` | `false` | No |  |
| keepNonExistentRowsSelected | `bool` | `false` | No |  |
| label | `string` | - | No |  |
| lazyLoading | `bool` | `false` | No |  |
| lazyLoadingRequestThrottleMs | `number` | `500` | No |  |
| listView | `bool` | - | No |  |
| listViewColumn | `{ align?: 'center' \| 'left' \| 'right', cellClassName?: func \| string, display?: 'flex' \| 'text', field: string, renderCell?: func }` | - | No |  |
| loading | `bool` | `false` | No |  |
| localeText | `object` | - | No |  |
| logger | `{ debug: func, error: func, info: func, warn: func }` | `console` | No |  |
| logLevel | `'debug' \| 'error' \| 'info' \| 'warn' \| false` | `"error" ("warn" in dev mode)` | No |  |
| multipleColumnsSortingMode | `'always' \| 'withModifierKey'` | `"withModifierKey"` | No |  |
| nonce | `string` | - | No |  |
| onCellClick | `function(params: GridCellParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onCellDoubleClick | `function(params: GridCellParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onCellEditStart | `function(params: GridCellParams, event: MuiEvent<React.KeyboardEvent \| React.MouseEvent>) => void` | - | No |  |
| onCellEditStop | `function(params: GridCellParams, event: MuiEvent<MuiBaseEvent>) => void` | - | No |  |
| onCellKeyDown | `function(params: GridCellParams, event: MuiEvent<React.KeyboardEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onCellModesModelChange | `function(cellModesModel: GridCellModesModel, details: GridCallbackDetails) => void` | - | No |  |
| onClipboardCopy | `function(data: string) => void` | - | No |  |
| onColumnHeaderClick | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnHeaderContextMenu | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>) => void` | - | No |  |
| onColumnHeaderDoubleClick | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnHeaderEnter | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnHeaderLeave | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnHeaderOut | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnHeaderOver | `function(params: GridColumnHeaderParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnOrderChange | `function(params: GridColumnOrderChangeParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnResize | `function(params: GridColumnResizeParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onColumnVisibilityModelChange | `function(model: GridColumnVisibilityModel, details: GridCallbackDetails) => void` | - | No |  |
| onColumnWidthChange | `function(params: GridColumnResizeParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onDataSourceError | `function(error: GridGetRowsError \| GridUpdateRowError) => void` | - | No |  |
| onDensityChange | `function(density: GridDensity) => void` | - | No |  |
| onDetailPanelExpandedRowIdsChange | `function(ids: Array<GridRowId>, details: GridCallbackDetails) => void` | - | No |  |
| onFetchRows (deprecated) | `function(params: GridFetchRowsParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No | ⚠️ Use the {@link [https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading) Server-side data-Viewport loading} instead. |
| onFilterModelChange | `function(model: GridFilterModel, details: GridCallbackDetails) => void` | - | No |  |
| onMenuClose | `function(params: GridMenuParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onMenuOpen | `function(params: GridMenuParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onPaginationMetaChange | `function(paginationMeta: GridPaginationMeta) => void` | - | No |  |
| onPaginationModelChange | `function(model: GridPaginationModel, details: GridCallbackDetails) => void` | - | No |  |
| onPinnedColumnsChange | `function(pinnedColumns: GridPinnedColumnFields, details: GridCallbackDetails) => void` | - | No |  |
| onPreferencePanelClose | `function(params: GridPreferencePanelParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onPreferencePanelOpen | `function(params: GridPreferencePanelParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onProcessRowUpdateError | `function(error: any) => void` | - | No |  |
| onResize | `function(containerSize: ElementSize, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onRowClick | `function(params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onRowCountChange | `function(count: number) => void` | - | No |  |
| onRowDoubleClick | `function(params: GridRowParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => void` | - | No |  |
| onRowEditStart | `function(params: GridRowParams, event: MuiEvent<React.KeyboardEvent \| React.MouseEvent>) => void` | - | No |  |
| onRowEditStop | `function(params: GridRowParams, event: MuiEvent<MuiBaseEvent>) => void` | - | No |  |
| onRowModesModelChange | `function(rowModesModel: GridRowModesModel, details: GridCallbackDetails) => void` | - | No |  |
| onRowOrderChange | `function(params: GridRowOrderChangeParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No |  |
| onRowSelectionModelChange | `function(rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void` | - | No |  |
| onRowsScrollEnd (deprecated) | `function(params: GridRowScrollEndParams, event: MuiEvent<{}>, details: GridCallbackDetails) => void` | - | No | ⚠️ Use the {@link [https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#infinite-loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#infinite-loading) Server-side data-Infinite loading} instead. |
| onSortModelChange | `function(model: GridSortModel, details: GridCallbackDetails) => void` | - | No |  |
| pageSizeOptions | `Array<number \| { label: string, value: number }>` | `[25, 50, 100]` | No |  |
| pagination | `bool` | `false` | No |  |
| paginationMeta | `{ hasNextPage?: bool }` | - | No |  |
| paginationMode | `'client' \| 'server'` | `"client"` | No |  |
| paginationModel | `{ page: number, pageSize: number }` | - | No |  |
| pinnedColumns | `object` | - | No |  |
| pinnedRows | `{ bottom?: Array<object>, top?: Array<object> }` | - | No |  |
| processRowUpdate | `function(newRow: R, oldRow: R, params: { rowId: GridRowId }) => Promise<R> \| R` | - | No |  |
| resizeThrottleMs | `number` | `60` | No |  |
| rowBufferPx | `number` | `150` | No |  |
| rowCount | `number` | - | No |  |
| rowHeight | `number` | `52` | No |  |
| rowModesModel | `object` | - | No |  |
| rowReordering | `bool` | `false` | No |  |
| rows | `Array<object>` | `[]` | No |  |
| rowSelection | `bool` | `true` | No |  |
| rowSelectionModel | `{ ids: Set, type: 'exclude' \| 'include' }` | - | No |  |
| rowSelectionPropagation | `{ descendants?: bool, parents?: bool }` | `{ parents: true, descendants: true }` | No |  |
| rowsLoadingMode (deprecated) | `'client' \| 'server'` | `"client"` | No | ⚠️ Use the {@link [https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/#viewport-loading) Server-side data-Viewport loading} instead. |
| rowSpacingType | `'border' \| 'margin'` | `"margin"` | No |  |
| rowSpanning | `bool` | `false` | No |  |
| scrollbarSize | `number` | - | No |  |
| scrollEndThreshold | `number` | `80` | No |  |
| showCellVerticalBorder | `bool` | `false` | No |  |
| showColumnVerticalBorder | `bool` | `false` | No |  |
| showToolbar | `bool` | `false` | No |  |
| slotProps | `object` | - | No |  |
| slots | `object` | - | No |  |
| sortingMode | `'client' \| 'server'` | `"client"` | No |  |
| sortingOrder | `Array<'asc' \| 'desc'>` | `['asc', 'desc', null]` | No |  |
| sortModel | `Array<{ field: string, sort?: 'asc' \| 'desc' }>` | - | No |  |
| sx | `Array<func \| object \| bool> \| func \| object` | - | No | The system prop that allows defining system overrides as well as additional CSS styles. |
| throttleRowsMs | `number` | `0` | No |  |
| treeData | `bool` | `false` | No |  |
| virtualizeColumnsWithAutoRowHeight | `bool` | `false` | No |  |

> **Note**: The `ref` is forwarded to the root element (GridRoot).

## Slots

| Name | Default | Class | Description |
|------|---------|-------|-------------|
| headerFilterCell | `GridHeaderFilterCell` | - | Component responsible for showing menu adornment in Header filter row |
| headerFilterMenu | `GridHeaderFilterMenu` | - | Component responsible for showing menu in Header filter row |
| bottomContainer | `GridBottomContainer` | - | Component rendered for the bottom container. |
| cell | `GridCell` | `.MuiDataGridPro-cell` | Component rendered for each cell. |
| skeletonCell | `GridSkeletonCell` | - | Component rendered for each skeleton cell. |
| columnHeaderFilterIconButton | `GridColumnHeaderFilterIconButton` | - | Filter icon component rendered in each column header. |
| columnHeaderSortIcon | `GridColumnHeaderSortIcon` | - | Sort icon component rendered in each column header. |
| columnMenu | `GridColumnMenu` | - | Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers. |
| columnHeaders | `GridColumnHeaders` | `.MuiDataGridPro-columnHeaders` | Component responsible for rendering the column headers. |
| detailPanels | `GridDetailPanels` | - | Component responsible for rendering the detail panels. |
| footer | `GridFooter` | - | Footer component rendered at the bottom of the grid viewport. |
| footerRowCount | `GridRowCount` | - | Row count component rendered in the footer |
| toolbar | `undefined` | `.MuiDataGridPro-toolbar` | Toolbar component rendered in the grid header. |
| loadingOverlay | `GridLoadingOverlay` | - | Loading overlay component rendered when the grid is in a loading state. |
| noResultsOverlay | `GridNoResultsOverlay` | - | No results overlay component rendered when the grid has no results after filtering. |
| noRowsOverlay | `GridNoRowsOverlay` | - | No rows overlay component rendered when the grid has no rows. |
| noColumnsOverlay | `GridNoColumnsOverlay` | - | No columns overlay component rendered when the grid has no columns. |
| pagination | `Pagination` | - | Pagination component rendered in the grid footer by default. |
| filterPanel | `GridFilterPanel` | - | Filter panel component rendered when clicking the filter button. |
| columnsPanel | `GridColumnsPanel` | - | GridColumns panel component rendered when clicking the columns button. |
| columnsManagement | `GridColumnsManagement` | `.MuiDataGridPro-columnsManagement` | Component used inside Grid Columns panel to manage columns. |
| panel | `GridPanel` | `.MuiDataGridPro-panel` | Panel component wrapping the filters and columns panels. |
| row | `GridRow` | `.MuiDataGridPro-row` | Component rendered for each row. |
| baseAutocomplete | `Autocomplete` | - | The custom Autocomplete component used in the grid for both header and cells. |
| baseBadge | `Badge` | - | The custom Badge component used in the grid for both header and cells. |
| baseCheckbox | `Checkbox` | - | The custom Checkbox component used in the grid for both header and cells. |
| baseChip | `Chip` | - | The custom Chip component used in the grid. |
| baseCircularProgress | `CircularProgress` | - | The custom CircularProgress component used in the grid. |
| baseDivider | `Divider` | - | The custom Divider component used in the grid. |
| baseLinearProgress | `LinearProgress` | - | The custom LinearProgress component used in the grid. |
| baseMenuList | `MenuList` | - | The custom MenuList component used in the grid. |
| baseMenuItem | `MenuItem` | - | The custom MenuItem component used in the grid. |
| baseTextField | `TextField` | - | The custom TextField component used in the grid. |
| baseSelect | `Select` | - | The custom Select component used in the grid. |
| baseButton | `Button` | - | The custom Button component used in the grid. |
| baseIconButton | `IconButton` | - | The custom IconButton component used in the grid. |
| baseInput | `Input` | - | The custom Input component used in the grid. |
| baseTooltip | `Tooltip` | - | The custom Tooltip component used in the grid. |
| basePagination | `Pagination` | - | The custom Pagination component used in the grid. |
| basePopper | `Popper` | - | The custom Popper component used in the grid. |
| baseSelectOption | `SelectOption` | - | The custom SelectOption component used in the grid. |
| baseSkeleton | `Skeleton` | - | The custom Skeleton component used in the grid. |
| baseSwitch | `Switch` | - | The custom Switch component used in the grid. |
| booleanCellTrueIcon | `GridCheckIcon` | - | Icon displayed on the boolean cell to represent the true value. |
| booleanCellFalseIcon | `GridCloseIcon` | - | Icon displayed on the boolean cell to represent the false value. |
| columnMenuIcon | `GridTripleDotsVerticalIcon` | - | Icon displayed on the side of the column header title to display the filter input component. |
| openFilterButtonIcon | `GridFilterListIcon` | - | Icon displayed on the open filter button present in the toolbar by default. |
| columnFilteredIcon | `GridFilterAltIcon` | - | Icon displayed on the column header menu to show that a filter has been applied to the column. |
| columnSelectorIcon | `GridColumnIcon` | - | Icon displayed on the column menu selector tab. |
| columnSortedAscendingIcon | `GridArrowUpwardIcon` | - | Icon displayed on the side of the column header title when sorted in ascending order. |
| columnSortedDescendingIcon | `GridArrowDownwardIcon` | - | Icon displayed on the side of the column header title when sorted in descending order. |
| columnResizeIcon | `GridSeparatorIcon` | - | Icon displayed in between two column headers that allows to resize the column header. |
| densityCompactIcon | `GridViewHeadlineIcon` | - | Icon displayed on the compact density option in the toolbar. |
| densityStandardIcon | `GridTableRowsIcon` | - | Icon displayed on the standard density option in the toolbar. |
| densityComfortableIcon | `GridViewStreamIcon` | - | Icon displayed on the "comfortable" density option in the toolbar. |
| exportIcon | `GridDownloadIcon` | - | Icon displayed on the open export button present in the toolbar by default. |
| moreActionsIcon | `GridMoreVertIcon` | - | Icon displayed on the `actions` column type to open the menu. |
| treeDataExpandIcon | `GridKeyboardArrowRight` | - | Icon displayed on the tree data toggling column when the children are collapsed |
| treeDataCollapseIcon | `GridExpandMoreIcon` | - | Icon displayed on the tree data toggling column when the children are expanded |
| groupingCriteriaExpandIcon | `GridKeyboardArrowRight` | - | Icon displayed on the grouping column when the children are collapsed |
| groupingCriteriaCollapseIcon | `GridExpandMoreIcon` | - | Icon displayed on the grouping column when the children are expanded |
| detailPanelExpandIcon | `GridAddIcon` | - | Icon displayed on the detail panel toggle column when collapsed. |
| detailPanelCollapseIcon | `GridRemoveIcon` | - | Icon displayed on the detail panel toggle column when expanded. |
| filterPanelAddIcon | `GridAddIcon` | - | Icon displayed for deleting the filter from filter panel. |
| filterPanelDeleteIcon | `GridDeleteIcon` | - | Icon displayed for deleting the filter from filter panel. |
| filterPanelRemoveAllIcon | `GridDeleteForeverIcon` | - | Icon displayed for deleting all the active filters from filter panel. |
| rowReorderIcon | `GridDragIcon` | `.MuiDataGridPro-rowReorderIcon` | Icon displayed on the `reorder` column type to reorder a row. |
| quickFilterIcon | `GridSearchIcon` | - | Icon displayed on the quick filter input. |
| quickFilterClearIcon | `GridCloseIcon` | - | Icon displayed on the quick filter reset input. |
| columnMenuHideIcon | `GridVisibilityOffIcon` | - | Icon displayed in column menu for hiding column |
| columnMenuSortAscendingIcon | `GridArrowUpwardIcon` | - | Icon displayed in column menu for ascending sort |
| columnMenuSortDescendingIcon | `GridArrowDownwardIcon` | - | Icon displayed in column menu for descending sort |
| columnMenuUnsortIcon | `null` | - | Icon displayed in column menu for unsort |
| columnMenuFilterIcon | `GridFilterAltIcon` | - | Icon displayed in column menu for filter |
| columnMenuManageColumnsIcon | `GridViewColumnIcon` | - | Icon displayed in column menu for showing all columns |
| columnMenuClearIcon | `GridClearIcon` | - | Icon displayed in column menu for clearing values |
| loadIcon | `GridLoadIcon` | - | Icon displayed on the input while processing. |
| columnReorderIcon | `GridDragIcon` | - | Icon displayed on the column reorder button. |
| menuItemCheckIcon | `GridCheckIcon` | - | Icon displayed to indicate that a menu item is selected. |
| columnMenuPinLeftIcon | `GridPushPinLeftIcon` | - | Icon displayed in column menu for left pinning |
| columnMenuPinRightIcon | `GridPushPinRightIcon` | - | Icon displayed in column menu for right pinning |

## CSS

### Rule name

| Global class | Rule name | Description |
|--------------|-----------|-------------|
| - | actionsCell | Styles applied to the root element of the cell with type="actions". |
| - | aggregationColumnHeader | Styles applied to the root element of the column header when aggregated. |
| - | aggregationColumnHeader--alignCenter | Styles applied to the root element of the header when aggregation if `headerAlign="center"`. |
| - | aggregationColumnHeader--alignLeft | Styles applied to the root element of the header when aggregation if `headerAlign="left"`. |
| - | aggregationColumnHeader--alignRight | Styles applied to the root element of the header when aggregation if `headerAlign="right"`. |
| - | aggregationColumnHeaderLabel | Styles applied to the aggregation label in the column header when aggregated. |
| - | aggregationRowOverlayWrapper | Styles applied to the aggregation row overlay wrapper. |
| - | aiAssistantPanel | Styles applied to the root element of the AI assistant panel. |
| - | aiAssistantPanelBody | Styles applied to the AI assistant panel body. |
| - | aiAssistantPanelConversation | Styles applied to the AI assistant panel conversation. |
| - | aiAssistantPanelConversationList | Styles applied to the AI assistant panel conversation list. |
| - | aiAssistantPanelConversationTitle | Styles applied to the AI assistant panel conversation title. |
| - | aiAssistantPanelEmptyText | Styles applied to the AI assistant panel empty text. |
| - | aiAssistantPanelFooter | Styles applied to the AI assistant panel footer. |
| - | aiAssistantPanelHeader | Styles applied to the AI assistant panel header. |
| - | aiAssistantPanelSuggestions | Styles applied to the AI assistant panel suggestions. |
| - | aiAssistantPanelSuggestionsItem | Styles applied to the AI assistant panel suggestions item. |
| - | aiAssistantPanelSuggestionsLabel | Styles applied to the AI assistant panel suggestions label. |
| - | aiAssistantPanelSuggestionsList | Styles applied to the AI assistant panel suggestions list. |
| - | aiAssistantPanelTitle | Styles applied to the AI assistant panel title. |
| - | aiAssistantPanelTitleContainer | Styles applied to the AI assistant panel title container. |
| - | autoHeight | Styles applied to the root element if `autoHeight={true}`. |
| - | autosizing | Styles applied to the root element while it is being autosized. |
| - | booleanCell | Styles applied to the icon of the boolean cell. |
| - | cell--editable | Styles applied to the cell element if the cell is editable. |
| - | cell--editing | Styles applied to the cell element if the cell is in edit mode. |
| - | cell--flex | Styles applied to the cell element in flex display mode. |
| - | cell--pinnedLeft | Styles applied to the cell element if it is pinned to the left. |
| - | cell--pinnedRight | Styles applied to the cell element if it is pinned to the right. |
| - | cell--rangeBottom | Styles applied to the cell element if it is at the bottom edge of a cell selection range. |
| - | cell--rangeLeft | Styles applied to the cell element if it is at the left edge of a cell selection range. |
| - | cell--rangeRight | Styles applied to the cell element if it is at the right edge of a cell selection range. |
| - | cell--rangeTop | Styles applied to the cell element if it is at the top edge of a cell selection range. |
| - | cell--selectionMode | Styles applied to the cell element if it is in a cell selection range. |
| - | cell--textCenter | Styles applied to the cell element if `align="center"`. |
| - | cell--textLeft | Styles applied to the cell element if `align="left"`. |
| - | cell--textRight | Styles applied to the cell element if `align="right"`. |
| - | cell--withLeftBorder | Styles applied the cell if `showColumnVerticalBorder={true}`. |
| - | cell--withRightBorder | Styles applied the cell if `showColumnVerticalBorder={true}`. |
| - | cellCheckbox | Styles applied to the cell checkbox element. |
| - | cellEmpty | Styles applied to the empty cell element. |
| - | cellSkeleton | Styles applied to the skeleton cell element. |
| - | checkboxInput | Styles applied to the selection checkbox element. |
| - | collapsible | Styles applied to the collapsible element. |
| - | collapsibleIcon | Styles applied to the collapsible icon element. |
| - | collapsiblePanel | Styles applied to the collapsible panel element. |
| - | collapsibleTrigger | Styles applied to the collapsible trigger element. |
| - | columnHeader | Styles applied to the column header element. |
| - | columnHeader--alignCenter | Styles applied to the column header if `headerAlign="center"`. |
| - | columnHeader--alignLeft | Styles applied to the column header if `headerAlign="left"`. |
| - | columnHeader--alignRight | Styles applied to the column header if `headerAlign="right"`. |
| - | columnHeader--dragging | Styles applied to the floating column header element when it is dragged. |
| - | columnHeader--emptyGroup | Styles applied to the empty column group header cell. |
| - | columnHeader--filledGroup | Styles applied to the column group header cell if not empty. |
| - | columnHeader--filter | Styles applied to the header filter cell. |
| - | columnHeader--filtered | Styles applied to the column header if the column has a filter applied to it. |
| - | columnHeader--last | Styles applied to the last column header element. |
| - | columnHeader--moving | Styles applied to the column header if it is being dragged. |
| - | columnHeader--numeric | Styles applied to the column header if the type of the column is `number`. |
| - | columnHeader--pinnedLeft |  |
| - | columnHeader--pinnedRight |  |
| - | columnHeader--sortable | Styles applied to the column header if the column is sortable. |
| - | columnHeader--sorted | Styles applied to the column header if the column is sorted. |
| - | columnHeader--withLeftBorder |  |
| - | columnHeader--withRightBorder | Styles applied the column header if `showColumnVerticalBorder={true}`. |
| - | columnHeaderCheckbox | Styles applied to the header checkbox cell element. |
| - | columnHeaderDraggableContainer | Styles applied to the column header's draggable container element. |
| - | columnHeaderFilterInput | Styles applied to the header filter input element. |
| - | columnHeaderFilterOperatorLabel | Styles applied to the header filter operator label element. |
| - | columnHeaderTitle | Styles applied to the column header's title element; |
| - | columnHeaderTitleContainer | Styles applied to the column header's title container element. |
| - | columnHeaderTitleContainerContent | Styles applied to the column header's title excepted buttons. |
| - | columnSeparator | Styles applied to the column header separator element. |
| - | columnSeparator--resizable | Styles applied to the column header separator if the column is resizable. |
| - | columnSeparator--resizing | Styles applied to the column header separator if the column is being resized. |
| - | columnSeparator--sideLeft | Styles applied to the column header separator if the side is "left". |
| - | columnSeparator--sideRight | Styles applied to the column header separator if the side is "right". |
| - | columnsManagementEmptyText | Styles applied to the columns management empty text element. |
| - | columnsManagementFooter | Styles applied to the columns management footer element. |
| - | columnsManagementHeader | Styles applied to the columns management header element. |
| - | columnsManagementRow | Styles applied to the columns management row element. |
| - | columnsManagementScrollArea | Styles applied to the columns management scroll area element. |
| - | columnsManagementSearchInput | Styles applied to the columns management search input element. |
| - | container--bottom | Styles applied to the bottom container. |
| - | container--top | Styles applied to the top container. |
| - | detailPanel | Styles applied to the detail panel element. |
| - | detailPanelToggleCell | Styles applied to the detail panel toggle cell element. |
| - | detailPanelToggleCell--expanded | Styles applied to the detail panel toggle cell element if expanded. |
| - | editBooleanCell | Styles applied to root of the boolean edit component. |
| - | editInputCell | Styles applied to the root of the input component. |
| - | filterForm | Styles applied to the root of the filter form component. |
| - | filterFormColumnInput | Styles applied to the column input of the filter form component. |
| - | filterFormDeleteIcon | Styles applied to the delete icon of the filter form component. |
| - | filterFormLogicOperatorInput | Styles applied to the link operator input of the filter form component. |
| - | filterFormOperatorInput | Styles applied to the operator input of the filter form component. |
| - | filterFormValueInput | Styles applied to the value input of the filter form component. |
| - | filterIcon | Styles applied to the filter icon element. |
| - | footerCell | Styles applied to the root element of the cell inside a footer row. |
| - | footerContainer | Styles applied to the footer container element. |
| - | groupingCriteriaCell | Styles applied to the root element of the grouping criteria cell |
| - | groupingCriteriaCellToggle | Styles applied to the toggle of the grouping criteria cell |
| - | headerFilterRow | Styles applied to the column header filter row. |
| - | iconButtonContainer | Styles applied to the column header icon's container. |
| - | iconSeparator | Styles applied to the column header separator icon element. |
| - | main | Styles applied to the main container element. |
| - | main--hasPinnedRight | Styles applied to the main container element when it has right pinned columns. |
| - | mainContent |  |
| - | menu | Styles applied to the menu element. |
| - | menuIcon | Styles applied to the menu icon element. |
| - | menuIconButton | Styles applied to the menu icon button element. |
| - | menuList | Styles applied to the menu list element. |
| - | menuOpen | Styles applied to the menu icon element if the menu is open. |
| - | overlay | Styles applied to the overlay element. |
| - | overlayWrapper | Styles applied to the overlay wrapper element. |
| - | overlayWrapperInner | Styles applied to the overlay wrapper inner element. |
| - | panelContent | Styles applied to the panel content element. |
| - | panelFooter | Styles applied to the panel footer element. |
| - | panelHeader | Styles applied to the panel header element. |
| - | panelWrapper | Styles applied to the panel wrapper element. |
| - | paper | Styles applied to the paper element. |
| - | pinnedRows | Styles applied to the pinned rows container. |
| - | pinnedRows--bottom | Styles applied to the bottom pinned rows container. |
| - | pinnedRows--top | Styles applied to the top pinned rows container. |
| - | pivotPanelAvailableFields | Styles applied to the pivot panel available fields. |
| - | pivotPanelBody | Styles applied to the pivot panel body. |
| - | pivotPanelField | Styles applied to the pivot panel field. |
| - | pivotPanelField--sorted | Styles applied to the pivot panel field when sorted. |
| - | pivotPanelFieldActionContainer | Styles applied to the pivot panel field action container. |
| - | pivotPanelFieldCheckbox | Styles applied to the pivot panel field checkbox. |
| - | pivotPanelFieldDragIcon | Styles applied to the pivot panel field drag icon. |
| - | pivotPanelFieldList | Styles applied to the pivot panel field list. |
| - | pivotPanelFieldName | Styles applied to the pivot panel field name. |
| - | pivotPanelHeader | Styles applied to the pivot panel header. |
| - | pivotPanelPlaceholder | Styles applied to the pivot panel placeholder. |
| - | pivotPanelScrollArea | Styles applied to the pivot panel scroll area. |
| - | pivotPanelSearchContainer | Styles applied to the pivot panel search container. |
| - | pivotPanelSection | Styles applied to the pivot panel section. |
| - | pivotPanelSections | Styles applied to the pivot panel sections. |
| - | pivotPanelSectionTitle | Styles applied to the pivot panel section title. |
| - | pivotPanelSwitch | Styles applied to the pivot panel switch. |
| - | pivotPanelSwitchLabel | Styles applied to the pivot panel switch label. |
| - | prompt | Styles applied to the prompt root element. |
| - | promptAction | Styles applied to the prompt action element. |
| - | promptChangeList | Styles applied to the prompt change list element. |
| - | promptChangesToggle | Styles applied to the prompt changes toggle element. |
| - | promptChangesToggleIcon | Styles applied to the prompt changes toggle icon element. |
| - | promptContent | Styles applied to the prompt content element. |
| - | promptError | Styles applied to the prompt error element. |
| - | promptFeedback | Styles applied to the prompt feedback element. |
| - | promptIcon | Styles applied to the prompt icon element. |
| - | promptIconContainer | Styles applied to the prompt icon element. |
| - | promptText | Styles applied to the prompt text element. |
| - | resizablePanelHandle | Styles applied to resizable panel handles. |
| - | resizablePanelHandle--horizontal | Styles applied to horizontal resizable panel handles. |
| - | resizablePanelHandle--vertical | Styles applied to vertical resizable panel handles. |
| - | root | Styles applied to the root element. |
| - | root--densityComfortable | Styles applied to the root element if density is "comfortable". |
| - | root--densityCompact | Styles applied to the root element if density is "compact". |
| - | root--densityStandard | Styles applied to the root element if density is "standard" (default). |
| - | root--disableUserSelection | Styles applied to the root element when user selection is disabled. |
| - | row--beingDragged | Styles applied to the row element when it is being dragged (entire row). |
| - | row--detailPanelExpanded | Styles applied to the row if its detail panel is open. |
| - | row--dragging | Styles applied to the floating special row reorder cell element when it is dragged. |
| - | row--dropAbove | Styles applied to the row element when it is a drop target above. |
| - | row--dropBelow | Styles applied to the row element when it is a drop target below. |
| - | row--dynamicHeight | Styles applied to the row if it has dynamic row height. |
| - | row--editable | Styles applied to the row element if the row is editable. |
| - | row--editing | Styles applied to the row element if the row is in edit mode. |
| - | row--firstVisible | Styles applied to the first visible row element on every page of the grid. |
| - | row--lastVisible | Styles applied to the last visible row element on every page of the grid. |
| - | rowCount | Styles applied to the footer row count element to show the total number of rows.
Only works when pagination is disabled. |
| - | rowReorderCell | Styles applied to the root element of the row reorder cell |
| - | rowReorderCell--draggable | Styles applied to the root element of the row reorder cell when dragging is allowed |
| - | rowReorderCellContainer | Styles applied to the row reorder cell container element. |
| - | rowReorderCellPlaceholder | Styles applied to the row's draggable placeholder element inside the special row reorder cell. |
| - | rowSkeleton | Styles applied to the skeleton row element. |
| - | scrollArea | Styles applied to both scroll area elements. |
| - | scrollArea--down | Styles applied to the bottom scroll area element. |
| - | scrollArea--left | Styles applied to the left scroll area element. |
| - | scrollArea--right | Styles applied to the right scroll area element. |
| - | scrollArea--up | Styles applied to the top scroll area element. |
| - | scrollbar | Styles applied to the scrollbars. |
| - | scrollbar--horizontal | Styles applied to the horizontal scrollbar. |
| - | scrollbar--vertical | Styles applied to the horizontal scrollbar. |
| - | selectedRowCount | Styles applied to the footer selected row count element. |
| - | sidebar | Styles applied to the sidebar element. |
| - | sidebarHeader | Styles applied to the sidebar header element. |
| - | sortButton | Styles applied to the sort button element. |
| - | sortIcon | Styles applied to the sort button icon element. |
| - | toolbarContainer | Styles applied to the toolbar container element. |
| - | toolbarDivider | Styles applied to the toolbar divider element. |
| - | toolbarFilterList | Styles applied to the toolbar filter list element. |
| - | toolbarLabel | Styles applied to the toolbar label element. |
| - | toolbarQuickFilter | Styles applied to the toolbar quick filter root element. |
| - | toolbarQuickFilterControl | Styles applied to the toolbar quick filter control element. |
| - | toolbarQuickFilterTrigger | Styles applied to the toolbar quick filter trigger element. |
| - | treeDataGroupingCell | Styles applied to the root of the grouping column of the tree data. |
| - | treeDataGroupingCellToggle | Styles applied to the toggle of the grouping cell of the tree data. |
| - | virtualScroller | Styles applied to the virtualization container. |
| - | virtualScrollerContent | Styles applied to the virtualization content. |
| - | virtualScrollerContent--overflowed | Styles applied to the virtualization content when its height is bigger than the virtualization container. |
| - | virtualScrollerRenderZone | Styles applied to the virtualization render zone. |
| - | withBorderColor | Styles applied to cells, column header and other elements that have border.
Sets border color only. |
| - | withSidePanel |  |
| - | withVerticalBorder | Styles applied the grid if `showColumnVerticalBorder={true}`. |

## Source code

If you did not find the information on this page, consider having a look at the implementation of the component for more detail.

- [/packages/x-data-grid-pro/src/DataGridPro/DataGridPro.tsx](https://github.com/mui/material-ui/tree/HEAD/packages/x-data-grid-pro/src/DataGridPro/DataGridPro.tsx)