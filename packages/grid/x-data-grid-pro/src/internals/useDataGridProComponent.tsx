import * as React from 'react';
import {
  useGridInitialization,
  useGridClipboard,
  useGridColumnMenu,
  useGridColumns,
  useGridDensity,
  useGridCsvExport,
  useGridPrintExport,
  useGridFilter,
  useGridFocus,
  useGridKeyboard,
  useGridKeyboardNavigation,
  useGridPagination,
  useGridPreferencesPanel,
  useGridEditing,
  useGridRows,
  useGridRowsMeta,
  useGridParamsApi,
  useGridSelection,
  useGridSorting,
  useGridScroll,
  useGridEvents,
  useGridDimensions,
  useGridStatePersistence,
} from '@mui/x-data-grid/internals';

import { GridApiPro } from './models/gridApiPro';
import { DataGridProProcessedProps } from './models/dataGridProProps';

// Pro-only features
import { useGridInfiniteLoader } from './hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridColumnReorder } from './hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from './hooks/features/columnResize/useGridColumnResize';
import { useGridTreeData } from './hooks/features/treeData/useGridTreeData';
import { useGridRowGrouping } from './hooks/features/rowGrouping/useGridRowGrouping';
import { useGridColumnPinning } from './hooks/features/columnPinning/useGridColumnPinning';
import { useGridDetailPanel } from './hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelCache } from './hooks/features/detailPanel/useGridDetailPanelCache';

export const useDataGridProComponent = (
  inputApiRef: React.MutableRefObject<GridApiPro> | undefined,
  props: DataGridProProcessedProps,
) => {
  const apiRef = useGridInitialization(inputApiRef, props);
  useGridTreeData(apiRef, props);
  useGridRowGrouping(apiRef, props);
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
