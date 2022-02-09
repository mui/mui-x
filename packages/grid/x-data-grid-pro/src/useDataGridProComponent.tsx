import type { GridApiRef } from '../../_modules_';
import { DataGridProProcessedProps } from '../../_modules_/grid/models/props/DataGridProProps';

import { useGridInitialization } from '../../_modules_/grid/hooks/core';

import { useGridClipboard } from '../../_modules_/grid/hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from '../../_modules_/grid/hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumnReorder } from '../../_modules_/grid/hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from '../../_modules_/grid/hooks/features/columnResize/useGridColumnResize';
import {
  columnsStateInitializer,
  useGridColumns,
} from '../../_modules_/grid/hooks/features/columns/useGridColumns';
import { useGridDensity } from '../../_modules_/grid/hooks/features/density/useGridDensity';
import { useGridCsvExport } from '../../_modules_/grid/hooks/features/export/useGridCsvExport';
import { useGridPrintExport } from '../../_modules_/grid/hooks/features/export/useGridPrintExport';
import {
  useGridFilter,
  filterStateInitializer,
} from '../../_modules_/grid/hooks/features/filter/useGridFilter';
import { useGridFocus } from '../../_modules_/grid/hooks/features/focus/useGridFocus';
import { useGridInfiniteLoader } from '../../_modules_/grid/hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridKeyboard } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from '../../_modules_/grid/hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from '../../_modules_/grid/hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing } from '../../_modules_/grid/hooks/features/editRows/useGridEditing';
import {
  rowsStateInitializer,
  useGridRows,
} from '../../_modules_/grid/hooks/features/rows/useGridRows';
import { useGridRowsMeta } from '../../_modules_/grid/hooks/features/rows/useGridRowsMeta';
import { useGridParamsApi } from '../../_modules_/grid/hooks/features/rows/useGridParamsApi';
import { useGridSelection } from '../../_modules_/grid/hooks/features/selection/useGridSelection';
import {
  sortingStateInitializer,
  useGridSorting,
} from '../../_modules_/grid/hooks/features/sorting/useGridSorting';
import { useGridScroll } from '../../_modules_/grid/hooks/features/scroll/useGridScroll';
import { useGridEvents } from '../../_modules_/grid/hooks/features/events/useGridEvents';
import { useGridDimensions } from '../../_modules_/grid/hooks/features/dimensions/useGridDimensions';
import { useGridTreeData } from '../../_modules_/grid/hooks/features/treeData/useGridTreeData';
import {
  useGridRowGrouping,
  rowGroupingStateInitializer,
} from '../../_modules_/grid/hooks/features/rowGrouping/useGridRowGrouping';
import {
  columnPinningStateInitializer,
  useGridColumnPinning,
} from '../../_modules_/grid/hooks/features/columnPinning/useGridColumnPinning';
import { useGridStatePersistence } from '../../_modules_/grid/hooks/features/statePersistence/useGridStatePersistence';
import { useGridDetailPanel } from '../../_modules_/grid/hooks/features/detailPanel/useGridDetailPanel';
import { useGridDetailPanelCache } from '../../_modules_/grid/hooks/features/detailPanel/useGridDetailPanelCache';
import { useGridInitializeState } from '../../_modules_/grid/hooks/utils/useGridInitializeState';
import { pageSizeStateInitializer } from '../../_modules_/grid/hooks/features/pagination/useGridPageSize';
import { pageStateInitializer } from '../../_modules_/grid/hooks/features/pagination/useGridPage';
import { useGridSelectionPreProcessors } from '../../_modules_/grid/hooks/features/selection/useGridSelectionPreProcessors';
import { useGridColumnPinningPreProcessors } from '../../_modules_/grid/hooks/features/columnPinning/useGridColumnPinningPreProcessors';
import { useGridRowGroupingPreProcessors } from '../../_modules_/grid/hooks/features/rowGrouping/useGridRowGroupingPreProcessors';
import { useGridTreeDataPreProcessors } from '../../_modules_/grid/hooks/features/treeData/useGridTreeDataPreProcessors';
import { useGridDetailPanelPreProcessors } from '../../_modules_/grid/hooks/features/detailPanel/useGridDetailPanelPreProcessors';

export const useDataGridProComponent = (
  inputApiRef: GridApiRef | undefined,
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
