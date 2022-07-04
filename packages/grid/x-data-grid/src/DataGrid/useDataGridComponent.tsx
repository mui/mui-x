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
import { useGridKeyboardNavigation } from '../hooks/features/keyboardNavigation/useGridKeyboardNavigation';
import {
  useGridPagination,
  paginationStateInitializer,
} from '../hooks/features/pagination/useGridPagination';
import {
  useGridPreferencesPanel,
  preferencePanelStateInitializer,
} from '../hooks/features/preferencesPanel/useGridPreferencesPanel';
import {
  useGridEditing as useGridEditing_old,
  editingStateInitializer as editingStateInitializer_old,
} from '../hooks/features/editRows/useGridEditing.old';
import {
  useGridEditing as useGridEditing_new,
  editingStateInitializer as editingStateInitializer_new,
} from '../hooks/features/editRows/useGridEditing.new';
import { useGridRows, rowsStateInitializer } from '../hooks/features/rows/useGridRows';
import { useGridRowsPreProcessors } from '../hooks/features/rows/useGridRowsPreProcessors';
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
import { useGridColumnSpanning } from '../hooks/features/columns/useGridColumnSpanning';

export const useDataGridComponent = (props: DataGridProcessedProps) => {
  const apiRef = useGridInitialization<GridApiCommunity>(undefined, props);

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridSelectionPreProcessors(apiRef, props);
  useGridRowsPreProcessors(apiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(selectionStateInitializer, apiRef, props);
  useGridInitializeState(columnsStateInitializer, apiRef, props);
  useGridInitializeState(rowsStateInitializer, apiRef, props);
  useGridInitializeState(
    props.experimentalFeatures?.newEditingApi
      ? editingStateInitializer_new
      : editingStateInitializer_old,
    apiRef,
    props,
  );
  useGridInitializeState(focusStateInitializer, apiRef, props);
  useGridInitializeState(sortingStateInitializer, apiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, apiRef, props);
  useGridInitializeState(filterStateInitializer, apiRef, props);
  useGridInitializeState(densityStateInitializer, apiRef, props);
  useGridInitializeState(paginationStateInitializer, apiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, apiRef, props);
  useGridInitializeState(columnMenuStateInitializer, apiRef, props);

  useGridKeyboardNavigation(apiRef, props);
  useGridSelection(apiRef, props);
  useGridColumns(apiRef, props);
  useGridRows(apiRef, props);
  useGridParamsApi(apiRef);
  useGridColumnSpanning(apiRef);

  const useGridEditing = props.experimentalFeatures?.newEditingApi
    ? useGridEditing_new
    : useGridEditing_old;
  useGridEditing(apiRef, props);

  useGridFocus(apiRef, props);
  useGridPreferencesPanel(apiRef);
  useGridFilter(apiRef, props);
  useGridSorting(apiRef, props);
  useGridDensity(apiRef, props);
  useGridPagination(apiRef, props);
  useGridRowsMeta(apiRef, props);
  useGridScroll(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridCsvExport(apiRef);
  useGridPrintExport(apiRef, props);
  useGridClipboard(apiRef);
  useGridDimensions(apiRef, props);
  useGridEvents(apiRef, props);
  useGridStatePersistence(apiRef);

  return apiRef;
};
