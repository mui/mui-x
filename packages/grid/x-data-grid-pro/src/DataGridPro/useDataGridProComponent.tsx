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
  paginationStateInitializer,
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
  const { publicApiRef, internalApiRef } = useGridInitialization(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(internalApiRef, props);
  useGridRowGroupingPreProcessors(internalApiRef, props);
  useGridTreeDataPreProcessors(internalApiRef, props);
  useGridDetailPanelPreProcessors(internalApiRef, props);
  useGridColumnPinningPreProcessors(internalApiRef, props); // Must be the last because it changes the order of the columns.

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(filterStateInitializer, internalApiRef, props);
  useGridInitializeState(paginationStateInitializer, internalApiRef, props);
  useGridInitializeState(sortingStateInitializer, internalApiRef, props);
  useGridInitializeState(columnPinningStateInitializer, internalApiRef, props);
  useGridInitializeState(rowGroupingStateInitializer, internalApiRef, props);
  useGridInitializeState(columnsStateInitializer, internalApiRef, props);
  useGridRowGrouping(internalApiRef, props); // FIXME Needs to be called before the rows state initialization because it registers a rows group builder
  useGridTreeData(internalApiRef, props); // FIXME Needs to be called before the rows state initialization because it registers a rows group builder
  useGridInitializeState(rowsStateInitializer, internalApiRef, props);

  useGridSelection(internalApiRef, props);
  useGridDetailPanel(internalApiRef, props);
  useGridColumnPinning(internalApiRef, props);
  useGridColumns(internalApiRef, props);
  useGridRows(internalApiRef, props);
  useGridParamsApi(internalApiRef);
  useGridDetailPanelCache(internalApiRef, props);
  useGridEditing(internalApiRef, props);
  useGridFocus(internalApiRef, props);
  useGridSorting(internalApiRef, props);
  useGridPreferencesPanel(internalApiRef, props);
  useGridFilter(internalApiRef, props);
  useGridDensity(internalApiRef, props);
  useGridColumnReorder(internalApiRef, props);
  useGridColumnResize(internalApiRef, props);
  useGridPagination(internalApiRef, props);
  useGridRowsMeta(internalApiRef, props);
  useGridScroll(internalApiRef, props);
  useGridInfiniteLoader(internalApiRef, props);
  useGridColumnMenu(internalApiRef);
  useGridKeyboard(internalApiRef);
  useGridKeyboardNavigation(internalApiRef, props);
  useGridCsvExport(internalApiRef);
  useGridPrintExport(internalApiRef, props);
  useGridClipboard(internalApiRef);
  useGridDimensions(internalApiRef, props);
  useGridEvents(internalApiRef, props);
  useGridStatePersistence(internalApiRef);

  return { publicApiRef, internalApiRef };
};
