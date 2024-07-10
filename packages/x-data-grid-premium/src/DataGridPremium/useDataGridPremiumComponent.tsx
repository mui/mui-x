import * as React from 'react';
import {
  useGridInitialization,
  useGridInitializeState,
  useGridClipboard,
  useGridColumnMenu,
  useGridColumns,
  columnsStateInitializer,
  useGridDensity,
  useGridCsvExport,
  useGridPrintExport,
  useGridFilter,
  filterStateInitializer,
  useGridFocus,
  useGridKeyboardNavigation,
  useGridPagination,
  paginationStateInitializer,
  useGridPreferencesPanel,
  useGridEditing,
  editingStateInitializer,
  useGridRows,
  useGridRowsPreProcessors,
  rowsStateInitializer,
  useGridRowsMeta,
  useGridParamsApi,
  useGridRowSelection,
  useGridSorting,
  sortingStateInitializer,
  useGridScroll,
  useGridEvents,
  dimensionsStateInitializer,
  useGridDimensions,
  useGridStatePersistence,
  useGridRowSelectionPreProcessors,
  columnMenuStateInitializer,
  densityStateInitializer,
  focusStateInitializer,
  preferencePanelStateInitializer,
  rowsMetaStateInitializer,
  rowSelectionStateInitializer,
  useGridColumnReorder,
  columnReorderStateInitializer,
  useGridColumnResize,
  columnResizeStateInitializer,
  useGridTreeData,
  useGridTreeDataPreProcessors,
  useGridColumnPinning,
  columnPinningStateInitializer,
  useGridColumnPinningPreProcessors,
  useGridDetailPanel,
  detailPanelStateInitializer,
  useGridDetailPanelPreProcessors,
  useGridInfiniteLoader,
  useGridColumnSpanning,
  useGridRowReorder,
  useGridRowReorderPreProcessors,
  useGridRowPinning,
  useGridRowPinningPreProcessors,
  rowPinningStateInitializer,
  useGridColumnGrouping,
  columnGroupsStateInitializer,
  useGridLazyLoader,
  useGridLazyLoaderPreProcessors,
  headerFilteringStateInitializer,
  useGridHeaderFiltering,
  virtualizationStateInitializer,
  useGridVirtualization,
  useGridDataSourceTreeDataPreProcessors,
  useGridDataSource,
  dataSourceStateInitializer,
} from '@mui/x-data-grid-pro/internals';
import { GridApiPremium, GridPrivateApiPremium } from '../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';
// Premium-only features
import {
  useGridAggregation,
  aggregationStateInitializer,
} from '../hooks/features/aggregation/useGridAggregation';
import { useGridAggregationPreProcessors } from '../hooks/features/aggregation/useGridAggregationPreProcessors';
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from '../hooks/features/rowGrouping/useGridRowGrouping';
import { useGridRowGroupingPreProcessors } from '../hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import { useGridExcelExport } from '../hooks/features/export/useGridExcelExport';
import {
  cellSelectionStateInitializer,
  useGridCellSelection,
} from '../hooks/features/cellSelection/useGridCellSelection';
import { useGridClipboardImport } from '../hooks/features/clipboard/useGridClipboardImport';

export const useDataGridPremiumComponent = (
  inputApiRef: React.MutableRefObject<GridApiPremium> | undefined,
  props: DataGridPremiumProcessedProps,
) => {
  const apiRef = useGridInitialization<GridPrivateApiPremium, GridApiPremium>(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridRowSelectionPreProcessors(apiRef, props);
  useGridRowReorderPreProcessors(apiRef, props);
  useGridRowGroupingPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDataSourceTreeDataPreProcessors(apiRef, props);
  useGridLazyLoaderPreProcessors(apiRef, props);
  useGridRowPinningPreProcessors(apiRef);
  useGridAggregationPreProcessors(apiRef, props);
  useGridDetailPanelPreProcessors(apiRef, props);
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  useGridColumnPinningPreProcessors(apiRef, props);
  useGridRowsPreProcessors(apiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(dimensionsStateInitializer, apiRef, props);
  useGridInitializeState(headerFilteringStateInitializer, apiRef, props);
  useGridInitializeState(rowGroupingStateInitializer, apiRef, props);
  useGridInitializeState(aggregationStateInitializer, apiRef, props);
  useGridInitializeState(rowSelectionStateInitializer, apiRef, props);
  useGridInitializeState(cellSelectionStateInitializer, apiRef, props);
  useGridInitializeState(detailPanelStateInitializer, apiRef, props);
  useGridInitializeState(columnPinningStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);
  useGridInitializeState(rowPinningStateInitializer, apiRef, props);
  useGridInitializeState(rowsStateInitializer, apiRef, props);
  useGridInitializeState(editingStateInitializer, apiRef, props);
  useGridInitializeState(focusStateInitializer, apiRef, props);
  useGridInitializeState(sortingStateInitializer, apiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, apiRef, props);
  useGridInitializeState(filterStateInitializer, apiRef, props);
  useGridInitializeState(densityStateInitializer, apiRef, props);
  useGridInitializeState(columnReorderStateInitializer, apiRef, props);
  useGridInitializeState(columnResizeStateInitializer, apiRef, props);
  useGridInitializeState(paginationStateInitializer, apiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, apiRef, props);
  useGridInitializeState(columnMenuStateInitializer, apiRef, props);
  useGridInitializeState(columnGroupsStateInitializer, apiRef, props);
  useGridInitializeState(virtualizationStateInitializer, apiRef, props);
  useGridInitializeState(dataSourceStateInitializer, apiRef, props);

  useGridRowGrouping(apiRef, props);
  useGridHeaderFiltering(apiRef, props);
  useGridTreeData(apiRef, props);
  useGridAggregation(apiRef, props);
  useGridKeyboardNavigation(apiRef, props);
  useGridRowSelection(apiRef, props);
  useGridCellSelection(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridRowPinning(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridDetailPanel(apiRef, props);
  useGridColumnSpanning(apiRef);
  useGridColumnGrouping(apiRef, props);
  useGridClipboardImport(apiRef, props);
  useGridEditing(apiRef, props);
  useGridFocus(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridSorting(apiRef, props);
  useGridDensity(apiRef, props);
  useGridColumnReorder(apiRef, props);
  useGridColumnResize(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowsMeta(apiRef, props);
  useGridRowReorder(apiRef, props);
  useGridScroll(apiRef, props);
  useGridInfiniteLoader(apiRef, props);
  useGridLazyLoader(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridCsvExport(apiRef, props);
  useGridPrintExport(apiRef, props);
  useGridExcelExport(apiRef, props);
  useGridClipboard(apiRef, props);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);
  useGridDataSource(apiRef, props);
  useGridVirtualization(apiRef, props);

  return apiRef;
};
