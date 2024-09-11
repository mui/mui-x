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
  useGridColumnSpanning,
  columnMenuStateInitializer,
  densityStateInitializer,
  focusStateInitializer,
  preferencePanelStateInitializer,
  rowsMetaStateInitializer,
  rowSelectionStateInitializer,
  useGridColumnGrouping,
  columnGroupsStateInitializer,
  headerFilteringStateInitializer,
  useGridHeaderFiltering,
  virtualizationStateInitializer,
  useGridVirtualization,
  useGridColumnResize,
  columnResizeStateInitializer,
} from '@mui/x-data-grid/internals';
import { GridApiPro, GridPrivateApiPro } from '../models/gridApiPro';
import { DataGridProProcessedProps } from '../models/dataGridProProps';
// Pro-only features
import { useGridInfiniteLoader } from '../hooks/features/infiniteLoader/useGridInfiniteLoader';
import {
  useGridColumnReorder,
  columnReorderStateInitializer,
} from '../hooks/features/columnReorder/useGridColumnReorder';
import { useGridTreeData } from '../hooks/features/treeData/useGridTreeData';
import { useGridTreeDataPreProcessors } from '../hooks/features/treeData/useGridTreeDataPreProcessors';
import { useGridDataSourceTreeDataPreProcessors } from '../hooks/features/serverSideTreeData/useGridDataSourceTreeDataPreProcessors';
import {
  useGridColumnPinning,
  columnPinningStateInitializer,
} from '../hooks/features/columnPinning/useGridColumnPinning';
import { useGridColumnPinningPreProcessors } from '../hooks/features/columnPinning/useGridColumnPinningPreProcessors';
import {
  useGridDetailPanel,
  detailPanelStateInitializer,
} from '../hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelPreProcessors } from '../hooks/features/detailPanel/useGridDetailPanelPreProcessors';
import { useGridRowReorder } from '../hooks/features/rowReorder/useGridRowReorder';
import { useGridRowReorderPreProcessors } from '../hooks/features/rowReorder/useGridRowReorderPreProcessors';
import { useGridLazyLoader } from '../hooks/features/lazyLoader/useGridLazyLoader';
import { useGridLazyLoaderPreProcessors } from '../hooks/features/lazyLoader/useGridLazyLoaderPreProcessors';
import {
  useGridRowPinning,
  rowPinningStateInitializer,
} from '../hooks/features/rowPinning/useGridRowPinning';
import { useGridRowPinningPreProcessors } from '../hooks/features/rowPinning/useGridRowPinningPreProcessors';
import {
  useGridDataSource,
  dataSourceStateInitializer,
} from '../hooks/features/dataSource/useGridDataSource';

export const useDataGridProComponent = (
  inputApiRef: React.MutableRefObject<GridApiPro> | undefined,
  props: DataGridProProcessedProps,
) => {
  const apiRef = useGridInitialization<GridPrivateApiPro, GridApiPro>(inputApiRef, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridRowSelectionPreProcessors(apiRef, props);
  useGridRowReorderPreProcessors(apiRef, props);
  useGridTreeDataPreProcessors(apiRef, props);
  useGridDataSourceTreeDataPreProcessors(apiRef, props);
  useGridLazyLoaderPreProcessors(apiRef, props);
  useGridRowPinningPreProcessors(apiRef);
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
  useGridInitializeState(rowSelectionStateInitializer, apiRef, props);
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

  useGridHeaderFiltering(apiRef, props);
  useGridTreeData(apiRef, props);
  useGridKeyboardNavigation(apiRef, props);
  useGridRowSelection(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridRowPinning(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridDetailPanel(apiRef, props);
  useGridColumnSpanning(apiRef);
  useGridColumnGrouping(apiRef, props);
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
  useGridClipboard(apiRef, props);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);
  useGridVirtualization(apiRef, props);
  useGridDataSource(apiRef, props);

  return apiRef;
};
