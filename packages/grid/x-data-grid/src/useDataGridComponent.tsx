import { DataGridProcessedProps } from './internals/models/props/DataGridProps';
import { GridApiCommunity } from './internals/models/api/gridApiCommunity';

import { useGridInitialization } from './internals/hooks/core';

import { useGridClipboard } from './internals/hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from './internals/hooks/features/columnMenu/useGridColumnMenu';
import {
  useGridColumns,
  columnsStateInitializer,
} from './internals/hooks/features/columns/useGridColumns';
import { useGridDensity } from './internals/hooks/features/density/useGridDensity';
import { useGridCsvExport } from './internals/hooks/features/export/useGridCsvExport';
import { useGridPrintExport } from './internals/hooks/features/export/useGridPrintExport';
import {
  useGridFilter,
  filterStateInitializer,
} from './internals/hooks/features/filter/useGridFilter';
import { useGridFocus } from './internals/hooks/features/focus/useGridFocus';
import { useGridKeyboard } from './internals/hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from './internals/hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from './internals/hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from './internals/hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing } from './internals/hooks/features/editRows/useGridEditing';
import { useGridRows, rowsStateInitializer } from './internals/hooks/features/rows/useGridRows';
import { useGridParamsApi } from './internals/hooks/features/rows/useGridParamsApi';
import { useGridSelection } from './internals/hooks/features/selection/useGridSelection';
import {
  useGridSorting,
  sortingStateInitializer,
} from './internals/hooks/features/sorting/useGridSorting';
import { useGridScroll } from './internals/hooks/features/scroll/useGridScroll';
import { useGridEvents } from './internals/hooks/features/events/useGridEvents';
import { useGridDimensions } from './internals/hooks/features/dimensions/useGridDimensions';
import { useGridRowsMeta } from './internals/hooks/features/rows/useGridRowsMeta';
import { useGridStatePersistence } from './internals/hooks/features/statePersistence/useGridStatePersistence';
import { useGridSelectionPreProcessors } from './internals/hooks/features/selection/useGridSelectionPreProcessors';
import { useGridInitializeState } from './internals/hooks/utils/useGridInitializeState';
import { pageSizeStateInitializer } from './internals/hooks/features/pagination/useGridPageSize';
import { pageStateInitializer } from './internals/hooks/features/pagination/useGridPage';

export const useDataGridComponent = (props: DataGridProcessedProps) => {
  const apiRef = useGridInitialization<GridApiCommunity>(undefined, props);

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
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridEditing(apiRef, props);
  useGridFocus(apiRef, props);
  useGridSorting(apiRef, props);
  useGridPreferencesPanel(apiRef, props);
  useGridFilter(apiRef, props);
  useGridDensity(apiRef, props);
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
