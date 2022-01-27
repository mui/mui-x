import {
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
  useGridPageSize,
  useGridPage,
  useGridPreferencesPanel,
  useGridEditRows,
  useGridRows,
  useGridRowsMeta,
  useGridParamsApi,
  useGridSelection,
  useGridSorting,
  useGridScroll,
  useGridEvents,
  useGridDimensions,
} from '@mui/x-data-grid';

import { GridApiRefPro } from './internals/models';
import { DataGridProProcessedProps } from './internals/models/dataGridProProps';

import { useGridInitialization } from '../../_modules_/grid/hooks/core';

// Community features
// import { useGridClipboard } from '../../_modules_/grid/hooks/features/clipboard/useGridClipboard';
// import { useGridColumnMenu } from '../../_modules_/grid/hooks/features/columnMenu/useGridColumnMenu';
// import { useGridColumns } from '../../_modules_/grid/hooks/features/columns/useGridColumns';
// import { useGridDensity } from '../../_modules_/grid/hooks/features/density/useGridDensity';
// import { useGridCsvExport } from '../../_modules_/grid/hooks/features/export/useGridCsvExport';
// import { useGridPrintExport } from '../../_modules_/grid/hooks/features/export/useGridPrintExport';
// import { useGridFilter } from '../../_modules_/grid/hooks/features/filter/useGridFilter';
// import { useGridFocus } from '../../_modules_/grid/hooks/features/focus/useGridFocus';
// import { useGridKeyboard } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboard';
// import { useGridKeyboardNavigation } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboardNavigation';
// import { useGridPageSize } from '../../_modules_/grid/hooks/features/pagination/useGridPageSize';
// import { useGridPage } from '../../_modules_/grid/hooks/features/pagination/useGridPage';
// import { useGridPreferencesPanel } from '../../_modules_/grid/hooks/features/preferencesPanel/useGridPreferencesPanel';
// import { useGridEditRows } from '../../_modules_/grid/hooks/features/editRows/useGridEditRows';
// import { useGridRows } from '../../_modules_/grid/hooks/features/rows/useGridRows';
// import { useGridRowsMeta } from '../../_modules_/grid/hooks/features/rows/useGridRowsMeta';
// import { useGridParamsApi } from '../../_modules_/grid/hooks/features/rows/useGridParamsApi';
// import { useGridSelection } from '../../_modules_/grid/hooks/features/selection/useGridSelection';
// import { useGridSorting } from '../../_modules_/grid/hooks/features/sorting/useGridSorting';
// import { useGridScroll } from '../../_modules_/grid/hooks/features/scroll/useGridScroll';
// import { useGridEvents } from '../../_modules_/grid/hooks/features/events/useGridEvents';
// import { useGridDimensions } from '../../_modules_/grid/hooks/features/dimensions/useGridDimensions';

// Pro-only features
import { useGridInfiniteLoader } from './internals/hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridColumnReorder } from './internals/hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from './internals/hooks/features/columnResize/useGridColumnResize';
import { useGridTreeData } from './internals/hooks/features/treeData/useGridTreeData';
import { useGridRowGrouping } from './internals/hooks/features/rowGrouping/useGridRowGrouping';
import { useGridColumnPinning } from './internals/hooks/features/columnPinning/useGridColumnPinning';

export const useDataGridProComponent = (
  inputApiRef: GridApiRefPro | undefined,
  props: DataGridProProcessedProps,
) => {
  const apiRef = useGridInitialization(inputApiRef, props);
  useGridTreeData(apiRef, props);
  useGridRowGrouping(apiRef, props);
  useGridColumnPinning(apiRef, props);
  useGridSelection(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridEditRows(apiRef, props);
  useGridFocus(apiRef, props);
  useGridSorting(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridDensity(apiRef, props);
  useGridColumnReorder(apiRef, props);
  useGridColumnResize(apiRef, props);
  useGridPageSize(apiRef, props);
  useGridPage(apiRef, props);
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

  return apiRef;
};
