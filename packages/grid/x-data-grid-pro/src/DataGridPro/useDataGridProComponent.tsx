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
  useGridKeyboard,
  useGridKeyboardNavigation,
  useGridPagination,
  pageStateInitializer,
  pageSizeStateInitializer,
  useGridPreferencesPanel,
  useGridEditing,
  useGridRows,
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
} from '@mui/x-data-grid/internals';

import { GridApiPro } from '../models/gridApiPro';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

// Pro-only features
import { useGridInfiniteLoader } from '../hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridColumnReorder } from '../hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from '../hooks/features/columnResize/useGridColumnResize';
import { useGridTreeData } from '../hooks/features/treeData/useGridTreeData';
import { useGridTreeDataPreProcessors } from '../hooks/features/treeData/useGridTreeDataPreProcessors';
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from '../hooks/features/rowGrouping/useGridRowGrouping';
import { useGridRowGroupingPreProcessors } from '../hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import {
  useGridColumnPinning,
  columnPinningStateInitializer,
} from '../hooks/features/columnPinning/useGridColumnPinning';
import { useGridColumnPinningPreProcessors } from '../hooks/features/columnPinning/useGridColumnPinningPreProcessors';
import { useGridDetailPanel } from '../hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelCache } from '../hooks/features/detailPanel/useGridDetailPanelCache';
import { useGridDetailPanelPreProcessors } from '../hooks/features/detailPanel/useGridDetailPanelPreProcessors';

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
