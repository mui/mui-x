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
  useGridEditing_new,
  useGridEditing_old,
  editingStateInitializer_old,
  editingStateInitializer_new,
  useGridRows,
  useGridRowsPreProcessors,
  rowsStateInitializer,
  useGridRowsMeta,
  useGridParamsApi,
  useGridSelection,
  useGridSorting,
  sortingStateInitializer,
  useGridScroll,
  useGridEvents,
  useGridDimensions,
  useGridStatePersistence,
  useGridSelectionPreProcessors,
  columnMenuStateInitializer,
  densityStateInitializer,
  focusStateInitializer,
  preferencePanelStateInitializer,
  rowsMetaStateInitializer,
  selectionStateInitializer,
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
  useGridDetailPanelCache,
  useGridDetailPanelPreProcessors,
  useGridInfiniteLoader,
  useGridColumnSpanning,
  useGridRowReorder,
  useGridRowReorderPreProcessors,
} from '@mui/x-data-grid-pro/internals';

import { GridApiPremium } from '../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../models/dataGridPremiumProps';

// Premium-only features
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from '../hooks/features/rowGrouping/useGridRowGrouping';
import { useGridRowGroupingPreProcessors } from '../hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import { useGridExcelExport } from '../hooks/features/export/useGridExcelExport';

export const useDataGridPremiumComponent = (
  inputApiRef: React.MutableRefObject<GridApiPremium> | undefined,
  props: DataGridPremiumProcessedProps,
) => {
  const apiRef = useGridInitialization(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(apiRef, props);
  useGridRowReorderPreProcessors(apiRef, props);
  useGridRowGroupingPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDetailPanelPreProcessors(apiRef, props);
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  useGridColumnPinningPreProcessors(apiRef, props);
  useGridRowsPreProcessors(apiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(rowGroupingStateInitializer, apiRef, props);
  useGridInitializeState(selectionStateInitializer, apiRef, props);
  useGridInitializeState(detailPanelStateInitializer, apiRef, props);
  useGridInitializeState(columnPinningStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);
  useGridInitializeState(rowsStateInitializer, apiRef, props);
  useGridInitializeState(
    props.experimentalFeatures?.newEditingApi
      ? editingStateInitializer_new
      : editingStateInitializer_old,
    apiRef,
    props,
  );
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

  useGridRowGrouping(apiRef, props);
  useGridTreeData(apiRef);
  useGridKeyboardNavigation(apiRef, props);
  useGridSelection(apiRef, props);
  useGridDetailPanel(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridColumnSpanning(apiRef);
  useGridDetailPanelCache(apiRef, props);

  const useGridEditing = props.experimentalFeatures?.newEditingApi
    ? useGridEditing_new
    : useGridEditing_old;
  useGridEditing(apiRef, props);

  useGridFocus(apiRef, props);
  useGridPreferencesPanel(apiRef);
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
  useGridColumnMenu(apiRef);
  useGridCsvExport(apiRef);
  useGridPrintExport(apiRef, props);
  useGridExcelExport(apiRef);
  useGridClipboard(apiRef);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);

  return apiRef;
};
