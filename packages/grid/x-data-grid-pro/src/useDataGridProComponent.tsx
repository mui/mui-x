import * as React from 'react';
import {
  unstable_useGridInitialization as useGridInitialization,
  unstable_useGridClipboard as useGridClipboard,
  unstable_useGridColumnMenu as useGridColumnMenu,
  unstable_useGridColumns as useGridColumns,
  unstable_useGridDensity as useGridDensity,
  unstable_useGridCsvExport as useGridCsvExport,
  unstable_useGridPrintExport as useGridPrintExport,
  unstable_useGridFilter as useGridFilter,
  unstable_useGridFocus as useGridFocus,
  unstable_useGridKeyboard as useGridKeyboard,
  unstable_useGridKeyboardNavigation as useGridKeyboardNavigation,
  unstable_useGridPagination as useGridPagination,
  unstable_useGridPreferencesPanel as useGridPreferencesPanel,
  unstable_useGridEditing as useGridEditing,
  unstable_useGridRows as useGridRows,
  unstable_useGridRowsMeta as useGridRowsMeta,
  unstable_useGridParamsApi as useGridParamsApi,
  unstable_useGridSelection as useGridSelection,
  unstable_useGridSorting as useGridSorting,
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
import { useGridRowGrouping } from './internals/hooks/features/rowGrouping/useGridRowGrouping';
import { useGridColumnPinning } from './internals/hooks/features/columnPinning/useGridColumnPinning';
import { useGridDetailPanel } from './internals/hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelCache } from './internals/hooks/features/detailPanel/useGridDetailPanelCache';

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
