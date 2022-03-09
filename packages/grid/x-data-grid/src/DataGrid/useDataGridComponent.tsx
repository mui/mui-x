import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

import { useGridInitialization } from '../hooks/core/useGridInitialization';
import { useGridInitializeState } from '../hooks/utils/useGridInitializeState';

import { useGridClipboard } from '../hooks/features/clipboard/useGridClipboard';
import {
  columnMenuStateInitializer,
  useGridColumnMenu,
} from '../hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns, columnsStateInitializer } from '../hooks/features/columns/useGridColumns';
import { densityStateInitializer, useGridDensity } from '../hooks/features/density/useGridDensity';
import { useGridCsvExport } from '../hooks/features/export/useGridCsvExport';
import { useGridPrintExport } from '../hooks/features/export/useGridPrintExport';
import { useGridFilter, filterStateInitializer } from '../hooks/features/filter/useGridFilter';
import { focusStateInitializer, useGridFocus } from '../hooks/features/focus/useGridFocus';
import { useGridKeyboard } from '../hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '../hooks/features/keyboard/useGridKeyboardNavigation';
import {
  useGridPagination,
  paginationStateInitializer,
} from '../hooks/features/pagination/useGridPagination';
import {
  useGridPreferencesPanel,
  preferencePanelStateInitializer,
} from '../hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing, editingStateInitializer } from '../hooks/features/editRows/useGridEditing';
import { useGridRows, rowsStateInitializer } from '../hooks/features/rows/useGridRows';
import { useGridParamsApi } from '../hooks/features/rows/useGridParamsApi';
import {
  selectionStateInitializer,
  useGridSelection,
} from '../hooks/features/selection/useGridSelection';
import { useGridSelectionPreProcessors } from '../hooks/features/selection/useGridSelectionPreProcessors';
import { useGridSorting, sortingStateInitializer } from '../hooks/features/sorting/useGridSorting';
import { useGridScroll } from '../hooks/features/scroll/useGridScroll';
import { useGridEvents } from '../hooks/features/events/useGridEvents';
import { useGridDimensions } from '../hooks/features/dimensions/useGridDimensions';
import { rowsMetaStateInitializer, useGridRowsMeta } from '../hooks/features/rows/useGridRowsMeta';
import { useGridStatePersistence } from '../hooks/features/statePersistence/useGridStatePersistence';

export const useDataGridComponent = (props: DataGridProcessedProps) => {
  const { publicApiRef, internalApiRef } = useGridInitialization<GridApiCommunity>(
    undefined,
    props,
  );

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(internalApiRef, props);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(selectionStateInitializer, internalApiRef, props);
  useGridInitializeState(columnsStateInitializer, internalApiRef, props);
  useGridInitializeState(rowsStateInitializer, internalApiRef, props);
  useGridInitializeState(editingStateInitializer, internalApiRef, props);
  useGridInitializeState(focusStateInitializer, internalApiRef, props);
  useGridInitializeState(sortingStateInitializer, internalApiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, internalApiRef, props);
  useGridInitializeState(filterStateInitializer, internalApiRef, props);
  useGridInitializeState(densityStateInitializer, internalApiRef, props);
  useGridInitializeState(paginationStateInitializer, internalApiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, internalApiRef, props);
  useGridInitializeState(columnMenuStateInitializer, internalApiRef, props);

  useGridSelection(internalApiRef, props);
  useGridColumns(internalApiRef, props);
  useGridRows(internalApiRef, props);
  useGridParamsApi(internalApiRef);
  useGridEditing(internalApiRef, props);
  useGridFocus(internalApiRef, props);
  useGridSorting(internalApiRef, props);
  useGridPreferencesPanel(internalApiRef);
  useGridFilter(internalApiRef, props);
  useGridDensity(internalApiRef, props);
  useGridPagination(internalApiRef, props);
  useGridRowsMeta(internalApiRef, props);
  useGridScroll(internalApiRef, props);
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
