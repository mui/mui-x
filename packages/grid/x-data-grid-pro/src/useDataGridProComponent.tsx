import * as React from 'react';
import { useGridInitialization } from '@mui/x-data-grid/internals/hooks/core/useGridInitialization';
import { useGridClipboard } from '@mui/x-data-grid/internals/hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from '@mui/x-data-grid/internals/hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns } from '@mui/x-data-grid/internals/hooks/features/columns/useGridColumns';
import { useGridDensity } from '@mui/x-data-grid/internals/hooks/features/density/useGridDensity';
import { useGridCsvExport } from '@mui/x-data-grid/internals/hooks/features/export/useGridCsvExport';
import { useGridPrintExport } from '@mui/x-data-grid/internals/hooks/features/export/useGridPrintExport';
import { useGridFilter } from '@mui/x-data-grid/internals/hooks/features/filter/useGridFilter';
import { useGridFocus } from '@mui/x-data-grid/internals/hooks/features/focus/useGridFocus';
import { useGridKeyboard } from '@mui/x-data-grid/internals/hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '@mui/x-data-grid/internals/hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from '@mui/x-data-grid/internals/hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from '@mui/x-data-grid/internals/hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing } from '@mui/x-data-grid/internals/hooks/features/editRows/useGridEditing';
import { useGridRows } from '@mui/x-data-grid/internals/hooks/features/rows/useGridRows';
import { useGridRowsMeta } from '@mui/x-data-grid/internals/hooks/features/rows/useGridRowsMeta';
import { useGridParamsApi } from '@mui/x-data-grid/internals/hooks/features/rows/useGridParamsApi';
import { useGridSelection } from '@mui/x-data-grid/internals/hooks/features/selection/useGridSelection';
import { useGridSorting } from '@mui/x-data-grid/internals/hooks/features/sorting/useGridSorting';
import { useGridScroll } from '@mui/x-data-grid/internals/hooks/features/scroll/useGridScroll';
import { useGridEvents } from '@mui/x-data-grid/internals/hooks/features/events/useGridEvents';
import { useGridDimensions } from '@mui/x-data-grid/internals/hooks/features/dimensions/useGridDimensions';
import { useGridStatePersistence } from '@mui/x-data-grid/internals/hooks/features/statePersistence/useGridStatePersistence';

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
