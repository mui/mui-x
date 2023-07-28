import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { GridApiCommunity, GridPrivateApiCommunity } from '../models/api/gridApiCommunity';
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
import { useGridEditing, editingStateInitializer } from '../hooks/features/editing/useGridEditing';
import { useGridRows, rowsStateInitializer } from '../hooks/features/rows/useGridRows';
import { useGridRowsPreProcessors } from '../hooks/features/rows/useGridRowsPreProcessors';
import { useGridParamsApi } from '../hooks/features/rows/useGridParamsApi';
import {
  rowSelectionStateInitializer,
  useGridRowSelection,
} from '../hooks/features/rowSelection/useGridRowSelection';
import { useGridRowSelectionPreProcessors } from '../hooks/features/rowSelection/useGridRowSelectionPreProcessors';
import { useGridSorting, sortingStateInitializer } from '../hooks/features/sorting/useGridSorting';
import { useGridScroll } from '../hooks/features/scroll/useGridScroll';
import { useGridEvents } from '../hooks/features/events/useGridEvents';
import { useGridDimensions } from '../hooks/features/dimensions/useGridDimensions';
import { rowsMetaStateInitializer, useGridRowsMeta } from '../hooks/features/rows/useGridRowsMeta';
import { useGridStatePersistence } from '../hooks/features/statePersistence/useGridStatePersistence';
import { useGridColumnSpanning } from '../hooks/features/columns/useGridColumnSpanning';
import {
  useGridColumnGrouping,
  columnGroupsStateInitializer,
} from '../hooks/features/columnGrouping/useGridColumnGrouping';

export const useDataGridComponent = (
  inputApiRef: React.MutableRefObject<GridApiCommunity> | undefined,
  props: DataGridProcessedProps,
) => {
  const privateApiRef = useGridInitialization<GridPrivateApiCommunity, GridApiCommunity>(
    inputApiRef,
    props,
  );

  /**
   * Register all pre-processors called during state initialization here.
   */
  useGridRowSelectionPreProcessors(privateApiRef, props);
  useGridRowsPreProcessors(privateApiRef);

  /**
   * Register all state initializers here.
   */
  useGridInitializeState(rowSelectionStateInitializer, privateApiRef, props);
  useGridInitializeState(columnsStateInitializer, privateApiRef, props);
  useGridInitializeState(rowsStateInitializer, privateApiRef, props);
  useGridInitializeState(editingStateInitializer, privateApiRef, props);
  useGridInitializeState(focusStateInitializer, privateApiRef, props);
  useGridInitializeState(sortingStateInitializer, privateApiRef, props);
  useGridInitializeState(preferencePanelStateInitializer, privateApiRef, props);
  useGridInitializeState(filterStateInitializer, privateApiRef, props);
  useGridInitializeState(densityStateInitializer, privateApiRef, props);
  useGridInitializeState(paginationStateInitializer, privateApiRef, props);
  useGridInitializeState(rowsMetaStateInitializer, privateApiRef, props);
  useGridInitializeState(columnMenuStateInitializer, privateApiRef, props);
  useGridInitializeState(columnGroupsStateInitializer, privateApiRef, props);

  useGridKeyboardNavigation(privateApiRef, props);
  useGridRowSelection(privateApiRef, props);
  useGridColumns(privateApiRef, props);
  useGridRows(privateApiRef, props);
  useGridParamsApi(privateApiRef, props);
  useGridColumnSpanning(privateApiRef);
  useGridColumnGrouping(privateApiRef, props);
  useGridEditing(privateApiRef, props);
  useGridFocus(privateApiRef, props);
  useGridPreferencesPanel(privateApiRef, props);
  useGridFilter(privateApiRef, props);
  useGridSorting(privateApiRef, props);
  useGridDensity(privateApiRef, props);
  useGridPagination(privateApiRef, props);
  useGridRowsMeta(privateApiRef, props);
  useGridScroll(privateApiRef, props);
  useGridColumnMenu(privateApiRef);
  useGridCsvExport(privateApiRef, props);
  useGridPrintExport(privateApiRef, props);
  useGridClipboard(privateApiRef, props);
  useGridDimensions(privateApiRef, props);
  useGridEvents(privateApiRef, props);
  useGridStatePersistence(privateApiRef);

  return privateApiRef;
};
