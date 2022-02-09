import { DataGridProcessedProps } from '../../_modules_/grid/models/props/DataGridProps';

import { useGridInitialization } from '../../_modules_/grid/hooks/core';

import { useGridClipboard } from '../../_modules_/grid/hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from '../../_modules_/grid/hooks/features/columnMenu/useGridColumnMenu';
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
import { useGridKeyboard } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from '../../_modules_/grid/hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from '../../_modules_/grid/hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing } from '../../_modules_/grid/hooks/features/editRows/useGridEditing';
import {
  useGridRows,
  rowsStateInitializer,
} from '../../_modules_/grid/hooks/features/rows/useGridRows';
import { useGridParamsApi } from '../../_modules_/grid/hooks/features/rows/useGridParamsApi';
import { useGridSelection } from '../../_modules_/grid/hooks/features/selection/useGridSelection';
import {
  useGridSorting,
  sortingStateInitializer,
} from '../../_modules_/grid/hooks/features/sorting/useGridSorting';
import { useGridScroll } from '../../_modules_/grid/hooks/features/scroll/useGridScroll';
import { useGridEvents } from '../../_modules_/grid/hooks/features/events/useGridEvents';
import { useGridDimensions } from '../../_modules_/grid/hooks/features/dimensions/useGridDimensions';
import { useGridRowsMeta } from '../../_modules_/grid/hooks/features/rows/useGridRowsMeta';
import { useGridStatePersistence } from '../../_modules_/grid/hooks/features/statePersistence/useGridStatePersistence';
import { useGridInitializeState } from '../../_modules_/grid/hooks/utils/useGridInitializeState';
import { pageSizeStateInitializer } from '../../_modules_/grid/hooks/features/pagination/useGridPageSize';
import { pageStateInitializer } from '../../_modules_/grid/hooks/features/pagination/useGridPage';
import { useGridSelectionPreProcessors } from '../../_modules_/grid/hooks/features/selection/useGridSelectionPreProcessors';

export const useDataGridComponent = (props: DataGridProcessedProps) => {
  const apiRef = useGridInitialization(undefined, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(apiRef, props);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(filterStateInitializer, apiRef, props);
  useGridInitializeState(pageSizeStateInitializer, apiRef, props);
  useGridInitializeState(pageStateInitializer, apiRef, props);
  useGridInitializeState(rowsStateInitializer, apiRef, props);
  useGridInitializeState(sortingStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);

  useGridSelection(apiRef, props);
  useGridColumns(apiRef, props);
  useGridDensity(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridEditing(apiRef, props);
  useGridFocus(apiRef, props);
  useGridSorting(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowsMeta(apiRef, props);
  useGridScroll(apiRef, props);
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
