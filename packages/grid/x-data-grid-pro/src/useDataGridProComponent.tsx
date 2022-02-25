import * as React from 'react';
import {
  unstable_useGridInitialization as useGridInitialization,
  unstable_useGridInitializeState as useGridInitializeState,
  unstable_useGridClipboard as useGridClipboard,
  unstable_useGridColumnMenu as useGridColumnMenu,
  unstable_useGridColumns as useGridColumns,
  unstable_columnsStateInitializer as columnsStateInitializer,
  unstable_useGridDensity as useGridDensity,
  unstable_useGridCsvExport as useGridCsvExport,
  unstable_useGridPrintExport as useGridPrintExport,
  unstable_useGridFilter as useGridFilter,
  unstable_filterStateInitializer as filterStateInitializer,
  unstable_useGridFocus as useGridFocus,
  unstable_useGridKeyboard as useGridKeyboard,
  unstable_useGridKeyboardNavigation as useGridKeyboardNavigation,
  unstable_useGridPagination as useGridPagination,
  unstable_pageSizeStateInitializer as pageSizeStateInitializer,
  unstable_pageStateInitializer as pageStateInitializer,
  unstable_useGridPreferencesPanel as useGridPreferencesPanel,
  unstable_useGridEditing as useGridEditing,
  unstable_useGridRows as useGridRows,
  unstable_rowsStateInitializer as rowsStateInitializer,
  unstable_useGridRowsMeta as useGridRowsMeta,
  unstable_useGridParamsApi as useGridParamsApi,
  unstable_useGridSelection as useGridSelection,
  unstable_useGridSelectionPreProcessors as useGridSelectionPreProcessors,
  unstable_useGridSorting as useGridSorting,
  unstable_sortingStateInitializer as sortingStateInitializer,
  unstable_useGridScroll as useGridScroll,
  unstable_useGridEvents as useGridEvents,
  unstable_useGridDimensions as useGridDimensions,
  unstable_useGridStatePersistence as useGridStatePersistence,
} from '@mui/x-data-grid';

import { GridApiPro } from './internals/models/gridApiPro';
import { DataGridProProcessedProps } from './internals/models/dataGridProProps';

// Pro-only features
import { useGridInfiniteLoader } from './internals/hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridColumnReorder } from './internals/hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from './internals/hooks/features/columnResize/useGridColumnResize';
import { useGridTreeData } from './internals/hooks/features/treeData/useGridTreeData';
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from './internals/hooks/features/rowGrouping/useGridRowGrouping';
import {
  useGridColumnPinning,
  columnPinningStateInitializer,
} from './internals/hooks/features/columnPinning/useGridColumnPinning';
import { useGridDetailPanel } from './internals/hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelCache } from './internals/hooks/features/detailPanel/useGridDetailPanelCache';
import { useGridRowGroupingPreProcessors } from './internals/hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import { useGridTreeDataPreProcessors } from './internals/hooks/features/treeData/useGridTreeDataPreProcessors';
import { useGridDetailPanelPreProcessors } from './internals/hooks/features/detailPanel/useGridDetailPanelPreProcessors';
import { useGridColumnPinningPreProcessors } from './internals/hooks/features/columnPinning/useGridColumnPinningPreProcessors';

export const useDataGridProComponent = (
  inputApiRef: React.MutableRefObject<GridApiPro> | undefined,
  props: DataGridProProcessedProps,
) => {
  const apiRef = useGridInitialization(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(apiRef, props);
  useGridRowGroupingPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDetailPanelPreProcessors(apiRef, props);
  useGridColumnPinningPreProcessors(apiRef, props); // Must be the last because it changes the order of the columns.

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(filterStateInitializer, apiRef, props);
  useGridInitializeState(pageSizeStateInitializer, apiRef, props);
  useGridInitializeState(pageStateInitializer, apiRef, props);
  useGridInitializeState(sortingStateInitializer, apiRef, props);
  useGridInitializeState(columnPinningStateInitializer, apiRef, props);
  useGridInitializeState(rowGroupingStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);
  useGridRowGrouping(apiRef, props); // FIXME Needs to be called before the rows state initialization because it registers a rows group builder
  useGridTreeData(apiRef, props); // FIXME Needs to be called before the rows state initialization because it registers a rows group builder
  useGridInitializeState(rowsStateInitializer, apiRef, props);

  useGridSelection(apiRef, props);
  useGridDetailPanel(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridDetailPanelCache(apiRef, props);
  useGridEditing(apiRef, props);
  useGridFocus(apiRef, props);
  useGridSorting(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridDensity(apiRef, props);
  useGridColumnReorder(apiRef, props);
  useGridColumnResize(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowsMeta(apiRef, props);
  useGridScroll(apiRef, props);
  useGridInfiniteLoader(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridKeyboard(apiRef);
  useGridKeyboardNavigation(apiRef, props);
  useGridCsvExport(apiRef);
  useGridPrintExport(apiRef, props);
  useGridClipboard(apiRef);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);

  return apiRef;
};
