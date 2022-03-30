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
} from '@mui/x-data-grid/internals';

import { GridApiPro } from '../models/gridApiPro';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

// Pro-only features
import { useGridInfiniteLoader } from '../hooks/features/infiniteLoader/useGridInfiniteLoader';
import {
  useGridColumnReorder,
  columnReorderStateInitializer,
} from '../hooks/features/columnReorder/useGridColumnReorder';
import {
  useGridColumnResize,
  columnResizeStateInitializer,
} from '../hooks/features/columnResize/useGridColumnResize';
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
import {
  useGridDetailPanel,
  detailPanelStateInitializer,
} from '../hooks/features/detailPanel/useGridDetailPanel';
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
  // The column pinning `hydrateColumns` pre-processor must be after every other `hydrateColumns` pre-processors
  // Because it changes the order of the columns.
  useGridColumnPinningPreProcessors(internalApiRef, props);
  useGridRowsPreProcessors(internalApiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(rowGroupingStateInitializer, internalApiRef, props);
  useGridInitializeState(selectionStateInitializer, internalApiRef, props);
  useGridInitializeState(detailPanelStateInitializer, internalApiRef, props);
  useGridInitializeState(columnPinningStateInitializer, internalApiRef, props);
  useGridInitializeState(columnsStateInitializer, internalApiRef, props);
  useGridInitializeState(rowsStateInitializer, internalApiRef, props);
  useGridInitializeState(
    props.experimentalFeatures?.newEditingApi
      ? editingStateInitializer_new
      : editingStateInitializer_old,
    internalApiRef,
    props,
  );
  useGridInitializeState(focusStateInitializer, internalApiRef, props);
  useGridInitializeState(sortingStateInitializer, internalApiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, internalApiRef, props);
  useGridInitializeState(filterStateInitializer, internalApiRef, props);
  useGridInitializeState(densityStateInitializer, internalApiRef, props);
  useGridInitializeState(columnReorderStateInitializer, internalApiRef, props);
  useGridInitializeState(columnResizeStateInitializer, internalApiRef, props);
  useGridInitializeState(paginationStateInitializer, internalApiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, internalApiRef, props);
  useGridInitializeState(columnMenuStateInitializer, internalApiRef, props);

  useGridRowGrouping(internalApiRef, props);
  useGridTreeData(internalApiRef);
  useGridKeyboardNavigation(internalApiRef, props);
  useGridSelection(internalApiRef, props);
  useGridDetailPanel(internalApiRef, props);
  useGridColumnPinning(internalApiRef, props);
  useGridColumns(internalApiRef, props);
  useGridRows(internalApiRef, props);
  useGridParamsApi(internalApiRef);
  useGridDetailPanelCache(internalApiRef, props);

  const useGridEditing = props.experimentalFeatures?.newEditingApi
    ? useGridEditing_new
    : useGridEditing_old;
  useGridEditing(internalApiRef, props);

  useGridFocus(internalApiRef, props);
  useGridSorting(internalApiRef, props);
  useGridPreferencesPanel(internalApiRef);
  useGridFilter(internalApiRef, props);
  useGridDensity(internalApiRef, props);
  useGridColumnReorder(internalApiRef, props);
  useGridColumnResize(internalApiRef, props);
  useGridPagination(internalApiRef, props);
  useGridRowsMeta(internalApiRef, props);
  useGridScroll(internalApiRef, props);
  useGridInfiniteLoader(internalApiRef, props);
  useGridColumnMenu(internalApiRef);
  useGridCsvExport(internalApiRef);
  useGridPrintExport(internalApiRef, props);
  useGridClipboard(internalApiRef);
  useGridDimensions(internalApiRef, props);
  useGridEvents(internalApiRef, props);
  useGridStatePersistence(internalApiRef);

  return { publicApiRef, internalApiRef };
};
