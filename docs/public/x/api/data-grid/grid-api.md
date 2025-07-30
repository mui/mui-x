# GridApi API

## Demos

For examples and details on the usage of this React component, visit the component demo pages:

- [API object](/x/react-data-grid/api-object/)

## Import

```jsx
import { GridApi } from '@mui/x-data-grid-premium'
// or
import { GridApi } from '@mui/x-data-grid-pro'
// or
import { GridApi } from '@mui/x-data-grid'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| addRowGroupingCriteria | `(groupingCriteriaField: string, groupingIndex?: number) => void` | - | Yes |  |
| aiAssistant | `{ /** * Calls the `onPrompt()` callback to evaluate the prompt and get the necessary updates to the grid state. * Adds the prompt to the current conversation. * Updates the grid state based on the prompt response. * @param {string} value The prompt to process * @returns {Promise<PromptResponse \| Error>} The grid state updates or a processing error */ processPrompt: (value: string) => Promise<PromptResponse \| Error> /** * Sets the conversations. * @param {Conversation[] \| ((prevConversations: Conversation[]) => Conversation[])} conversations The new conversations. */ setConversations: (conversations: Conversation[] \| ((prevConversations: Conversation[]) => Conversation[])) => void /** * Sets the active conversation index. * @param {number} index The index of the conversation that should become active. * @returns {Conversation} The active conversation. * @throws {Error} If the conversation index does not exist. */ setActiveConversationIndex: (index: number) => Conversation }` | - | Yes |  |
| applySorting | `() => void` | - | Yes |  |
| autosizeColumns | `(options?: GridAutosizeOptions) => Promise<void>` | - | Yes |  |
| dataSource | `GridDataSourceApiBase` | - | Yes |  |
| deleteFilterItem | `(item: GridFilterItem) => void` | - | Yes |  |
| exportDataAsCsv | `(options?: GridCsvExportOptions) => void` | - | Yes |  |
| exportDataAsExcel | `(options?: GridExcelExportOptions) => Promise<void>` | - | Yes |  |
| exportDataAsPrint | `(options?: GridPrintExportOptions) => void` | - | Yes |  |
| exportState | `(params?: GridExportStateParams) => InitialState` | - | Yes |  |
| getAllColumns | `() => GridStateColDef[]` | - | Yes |  |
| getAllGroupDetails | `() => GridColumnGroupLookup` | - | Yes |  |
| getAllRowIds | `() => GridRowId[]` | - | Yes |  |
| getCellElement | `(id: GridRowId, field: string) => HTMLDivElement \| null` | - | Yes |  |
| getCellMode | `(id: GridRowId, field: string) => GridCellMode` | - | Yes |  |
| getCellParams | `<R extends GridValidRowModel = any, V = unknown, F = V, N extends GridTreeNode = GridTreeNode>(id: GridRowId, field: string) => GridCellParams<R, V, F, N>` | - | Yes |  |
| getCellSelectionModel | `() => GridCellSelectionModel` | - | Yes |  |
| getCellValue | `<V extends any = any>(id: GridRowId, field: string) => V` | - | Yes |  |
| getColumn | `(field: string) => GridStateColDef` | - | Yes |  |
| getColumnGroupPath | `(field: string) => GridColumnGroup['groupId'][]` | - | Yes |  |
| getColumnHeaderElement | `(field: string) => HTMLDivElement \| null` | - | Yes |  |
| getColumnHeaderParams | `(field: string) => GridColumnHeaderParams` | - | Yes |  |
| getColumnIndex | `(field: string, useVisibleColumns?: boolean) => number` | - | Yes |  |
| getColumnIndexRelativeToVisibleColumns | `(field: string) => number` | - | Yes |  |
| getColumnPosition | `(field: string) => number` | - | Yes |  |
| getDataAsCsv | `(options?: GridCsvExportOptions) => string` | - | Yes |  |
| getDataAsExcel | `(options?: GridExcelExportOptions) => Promise<Excel.Workbook> \| null` | - | Yes |  |
| getExpandedDetailPanels | `() => Set<GridRowId>` | - | Yes |  |
| getFilterState | `(filterModel: GridFilterModel) => GridStateCommunity['filter']` | - | Yes |  |
| getLocaleText | `<T extends GridTranslationKeys>(key: T) => GridLocaleText[T]` | - | Yes |  |
| getPinnedColumns | `() => GridPinnedColumnFields` | - | Yes |  |
| getPropagatedRowSelectionModel | `(inputSelectionModel: GridRowSelectionModel) => GridRowSelectionModel` | - | Yes |  |
| getRootDimensions | `() => GridDimensions` | - | Yes |  |
| getRow | `<R extends GridValidRowModel = any>(id: GridRowId) => R \| null` | - | Yes |  |
| getRowElement | `(id: GridRowId) => HTMLDivElement \| null` | - | Yes |  |
| getRowGroupChildren | `(params: GridRowGroupChildrenGetterParams) => GridRowId[]` | - | Yes |  |
| getRowId | `<R extends GridValidRowModel = any>(row: R) => GridRowId` | - | Yes |  |
| getRowIdFromRowIndex | `(index: number) => GridRowId` | - | Yes |  |
| getRowIndexRelativeToVisibleRows | `(id: GridRowId) => number` | - | Yes |  |
| getRowMode | `(id: GridRowId) => GridRowMode` | - | Yes |  |
| getRowModels | `() => Map<GridRowId, GridRowModel>` | - | Yes |  |
| getRowNode | `<N extends GridTreeNode>(id: GridRowId) => N \| null` | - | Yes |  |
| getRowParams | `(id: GridRowId) => GridRowParams` | - | Yes |  |
| getRowsCount | `() => number` | - | Yes |  |
| getRowWithUpdatedValues | `(id: GridRowId, field: string) => GridRowModel` | - | Yes |  |
| getScrollPosition | `() => GridScrollParams` | - | Yes |  |
| getSelectedCellsAsArray | `() => GridCellCoordinates[]` | - | Yes |  |
| getSelectedRows | `() => Map<GridRowId, GridRowModel>` | - | Yes |  |
| getSortedRowIds | `() => GridRowId[]` | - | Yes |  |
| getSortedRows | `() => GridRowModel[]` | - | Yes |  |
| getSortModel | `() => GridSortModel` | - | Yes |  |
| getVisibleColumns | `() => GridStateColDef[]` | - | Yes |  |
| hideColumnMenu | `() => void` | - | Yes |  |
| hideFilterPanel | `() => void` | - | Yes |  |
| hideHeaderFilterMenu | `() => void` | - | Yes |  |
| hidePreferences | `() => void` | - | Yes |  |
| ignoreDiacritics | `DataGridProcessedProps['ignoreDiacritics']` | - | Yes |  |
| isCellEditable | `(params: GridCellParams) => boolean` | - | Yes |  |
| isCellSelected | `(id: GridRowId, field: GridColDef['field']) => boolean` | - | Yes |  |
| isColumnPinned | `(field: string) => GridPinnedColumnPosition \| false` | - | Yes |  |
| isRowSelectable | `(id: GridRowId) => boolean` | - | Yes |  |
| isRowSelected | `(id: GridRowId) => boolean` | - | Yes |  |
| pinColumn | `(field: string, side: GridPinnedColumnPosition) => void` | - | Yes |  |
| publishEvent | `GridEventPublisher` | - | Yes |  |
| removeRowGroupingCriteria | `(groupingCriteriaField: string) => void` | - | Yes |  |
| resetRowHeights | `() => void` | - | Yes |  |
| restoreState | `(stateToRestore: InitialState) => void` | - | Yes |  |
| scroll | `(params: Partial<GridScrollParams>) => void` | - | Yes |  |
| scrollToIndexes | `(params: Partial<GridCellIndexCoordinates>) => boolean` | - | Yes |  |
| selectCellRange | `(start: GridCellCoordinates, end: GridCellCoordinates, keepOtherSelected?: boolean) => void` | - | Yes |  |
| selectRow | `(id: GridRowId, isSelected?: boolean, resetSelection?: boolean) => void` | - | Yes |  |
| selectRowRange | `(range: { startId: GridRowId; endId: GridRowId }, isSelected?: boolean, resetSelection?: boolean) => void` | - | Yes |  |
| selectRows | `(ids: GridRowId[], isSelected?: boolean, resetSelection?: boolean) => void` | - | Yes |  |
| setAggregationModel | `(model: GridAggregationModel) => void` | - | Yes |  |
| setCellFocus | `(id: GridRowId, field: string) => void` | - | Yes |  |
| setCellSelectionModel | `(newModel: GridCellSelectionModel) => void` | - | Yes |  |
| setColumnHeaderFilterFocus | `(field: string, event?: MuiBaseEvent) => void` | - | Yes |  |
| setColumnHeaderFocus | `(field: string, event?: MuiBaseEvent) => void` | - | Yes |  |
| setColumnIndex | `(field: string, targetIndexPosition: number) => void` | - | Yes |  |
| setColumnVisibility | `(field: string, isVisible: boolean) => void` | - | Yes |  |
| setColumnVisibilityModel | `(model: GridColumnVisibilityModel) => void` | - | Yes |  |
| setColumnWidth | `(field: string, width: number) => void` | - | Yes |  |
| setDensity | `(density: GridDensity) => void` | - | Yes |  |
| setEditCellValue | `(params: GridEditCellValueParams, event?: MuiBaseEvent) => Promise<boolean> \| void` | - | Yes |  |
| setExpandedDetailPanels | `(ids: Set<GridRowId>) => void` | - | Yes |  |
| setFilterLogicOperator | `(operator: GridLogicOperator) => void` | - | Yes |  |
| setFilterModel | `(model: GridFilterModel, reason?: GridControlledStateReasonLookup['filter']) => void` | - | Yes |  |
| setLoading | `(loading: boolean) => void` | - | Yes |  |
| setPage | `(page: number) => void` | - | Yes |  |
| setPageSize | `(pageSize: number) => void` | - | Yes |  |
| setPaginationMeta | `(paginationMeta: GridPaginationMeta) => void` | - | Yes |  |
| setPaginationModel | `(model: GridPaginationModel) => void` | - | Yes |  |
| setPinnedColumns | `(pinnedColumns: GridPinnedColumnFields) => void` | - | Yes |  |
| setPivotActive | `(active: boolean \| ((prev: boolean) => boolean)) => void` | - | Yes |  |
| setPivotModel | `(model: GridPivotModel \| ((prev: GridPivotModel) => GridPivotModel)) => void` | - | Yes |  |
| setPivotPanelOpen | `(open: boolean \| ((prev: boolean) => boolean)) => void` | - | Yes |  |
| setQuickFilterValues | `(values: any[]) => void` | - | Yes |  |
| setRowChildrenExpansion | `(id: GridRowId, isExpanded: boolean) => void` | - | Yes |  |
| setRowCount | `(rowCount: number) => void` | - | Yes |  |
| setRowGroupingCriteriaIndex | `(groupingCriteriaField: string, groupingIndex: number) => void` | - | Yes |  |
| setRowGroupingModel | `(model: GridRowGroupingModel) => void` | - | Yes |  |
| setRowIndex | `(rowId: GridRowId, targetIndex: number) => void` | - | Yes |  |
| setRows | `(rows: GridRowModel[]) => void` | - | Yes |  |
| setRowSelectionModel | `(rowSelectionModel: GridRowSelectionModel, reason?: GridControlledStateReasonLookup['rowSelection']) => void` | - | Yes |  |
| setSortModel | `(model: GridSortModel) => void` | - | Yes |  |
| showColumnMenu | `(field: string) => void` | - | Yes |  |
| showFilterPanel | `(targetColumnField?: string, panelId?: string, labelId?: string) => void` | - | Yes |  |
| showHeaderFilterMenu | `(field: GridColDef['field']) => void` | - | Yes |  |
| showPreferences | `(newValue: GridPreferencePanelsValue, panelId?: string, labelId?: string) => void` | - | Yes |  |
| sortColumn | `(field: GridColDef['field'], direction?: GridSortDirection, allowMultipleSorting?: boolean) => void` | - | Yes |  |
| startCellEditMode | `(params: GridStartCellEditModeParams) => void` | - | Yes |  |
| startHeaderFilterEditMode | `(field: GridColDef['field']) => void` | - | Yes |  |
| startRowEditMode | `(params: GridStartRowEditModeParams) => void` | - | Yes |  |
| state | `State` | - | Yes |  |
| stopCellEditMode | `(params: GridStopCellEditModeParams) => void` | - | Yes |  |
| stopHeaderFilterEditMode | `() => void` | - | Yes |  |
| stopRowEditMode | `(params: GridStopRowEditModeParams) => void` | - | Yes |  |
| subscribeEvent | `<E extends GridEvents>(event: E, handler: GridEventListener<E>, options?: EventListenerOptions) => () => void` | - | Yes |  |
| toggleColumnMenu | `(field: string) => void` | - | Yes |  |
| toggleDetailPanel | `(id: GridRowId) => void` | - | Yes |  |
| unpinColumn | `(field: string) => void` | - | Yes |  |
| unstable_replaceRows | `(firstRowToReplace: number, newRows: GridRowModel[]) => void` | - | Yes |  |
| unstable_setColumnVirtualization | `(enabled: boolean) => void` | - | Yes |  |
| unstable_setPinnedRows | `(pinnedRows?: GridPinnedRowsProp) => void` | - | Yes |  |
| unstable_setVirtualization | `(enabled: boolean) => void` | - | Yes |  |
| updateColumns | `(cols: GridColDef[]) => void` | - | Yes |  |
| updateRows | `(updates: GridRowModelUpdate[]) => void` | - | Yes |  |
| upsertFilterItem | `(item: GridFilterItem) => void` | - | Yes |  |
| upsertFilterItems | `(items: GridFilterItem[]) => void` | - | Yes |  |

> **Note**: The `ref` is forwarded to the root element.