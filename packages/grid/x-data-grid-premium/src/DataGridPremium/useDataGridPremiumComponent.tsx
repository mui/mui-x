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
  const privateApiRef = useGridInitialization<GridPrivateApiPremium, GridApiPremium>(
    inputApiRef,
    props,
  );

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridRowSelectionPreProcessors(privateApiRef, props);
  useGridRowReorderPreProcessors(privateApiRef, props);
  useGridRowGroupingPreProcessors(privateApiRef, props);
  useGridTreeDataPreProcessors(privateApiRef, props);
  useGridLazyLoaderPreProcessors(privateApiRef, props);
  useGridRowPinningPreProcessors(privateApiRef);
  useGridAggregationPreProcessors(privateApiRef, props);
  useGridDetailPanelPreProcessors(privateApiRef, props);
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  useGridColumnPinningPreProcessors(privateApiRef, props);
  useGridRowsPreProcessors(privateApiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(headerFilteringStateInitializer, privateApiRef, props);
  useGridInitializeState(rowGroupingStateInitializer, privateApiRef, props);
  useGridInitializeState(aggregationStateInitializer, privateApiRef, props);
  useGridInitializeState(rowSelectionStateInitializer, privateApiRef, props);
  useGridInitializeState(cellSelectionStateInitializer, privateApiRef, props);
  useGridInitializeState(detailPanelStateInitializer, privateApiRef, props);
  useGridInitializeState(columnPinningStateInitializer, privateApiRef, props);
  useGridInitializeState(columnsStateInitializer, privateApiRef, props);
  useGridInitializeState(rowPinningStateInitializer, privateApiRef, props);
  useGridInitializeState(rowsStateInitializer, privateApiRef, props);
  useGridInitializeState(editingStateInitializer, privateApiRef, props);
  useGridInitializeState(focusStateInitializer, privateApiRef, props);
  useGridInitializeState(sortingStateInitializer, privateApiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, privateApiRef, props);
  useGridInitializeState(filterStateInitializer, privateApiRef, props);
  useGridInitializeState(densityStateInitializer, privateApiRef, props);
  useGridInitializeState(columnReorderStateInitializer, privateApiRef, props);
  useGridInitializeState(columnResizeStateInitializer, privateApiRef, props);
  useGridInitializeState(paginationStateInitializer, privateApiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, privateApiRef, props);
  useGridInitializeState(columnMenuStateInitializer, privateApiRef, props);
  useGridInitializeState(columnGroupsStateInitializer, privateApiRef, props);

  useGridRowGrouping(privateApiRef, props);
  useGridHeaderFiltering(privateApiRef, props);
  useGridTreeData(privateApiRef);
  useGridAggregation(privateApiRef, props);
  useGridKeyboardNavigation(privateApiRef, props);
  useGridRowSelection(privateApiRef, props);
  useGridCellSelection(privateApiRef, props);
  useGridColumnPinning(privateApiRef, props);
  useGridRowPinning(privateApiRef, props);
  useGridColumns(privateApiRef, props);
  useGridRows(privateApiRef, props);
  useGridParamsApi(privateApiRef, props);
  useGridDetailPanel(privateApiRef, props);
  useGridColumnSpanning(privateApiRef);
  useGridColumnGrouping(privateApiRef, props);
  useGridClipboardImport(privateApiRef, props);
  useGridEditing(privateApiRef, props);
  useGridFocus(privateApiRef, props);
  useGridPreferencesPanel(privateApiRef, props);
  useGridFilter(privateApiRef, props);
  useGridSorting(privateApiRef, props);
  useGridDensity(privateApiRef, props);
  useGridColumnReorder(privateApiRef, props);
  useGridColumnResize(privateApiRef, props);
  useGridPagination(privateApiRef, props);
  useGridRowsMeta(privateApiRef, props);
  useGridRowReorder(privateApiRef, props);
  useGridScroll(privateApiRef, props);
  useGridInfiniteLoader(privateApiRef, props);
  useGridLazyLoader(privateApiRef, props);
  useGridColumnMenu(privateApiRef);
  useGridCsvExport(privateApiRef, props);
  useGridPrintExport(privateApiRef, props);
  useGridExcelExport(privateApiRef, props);
  useGridClipboard(privateApiRef, props);
  useGridDimensions(privateApiRef, props);
  useGridEvents(privateApiRef, props);
  useGridStatePersistence(privateApiRef);

  return privateApiRef;
};
