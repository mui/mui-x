import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { GridApiCommunity } from '../models/api/gridApiCommunity';

import { useGridInitialization } from '../hooks/core/useGridInitialization';

import { useGridClipboard } from '../hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from '../hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns } from '../hooks/features/columns/useGridColumns';
import { useGridDensity } from '../hooks/features/density/useGridDensity';
import { useGridCsvExport } from '../hooks/features/export/useGridCsvExport';
import { useGridPrintExport } from '../hooks/features/export/useGridPrintExport';
import { useGridFilter } from '../hooks/features/filter/useGridFilter';
import { useGridFocus } from '../hooks/features/focus/useGridFocus';
import { useGridKeyboard } from '../hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '../hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from '../hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from '../hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditing } from '../hooks/features/editRows/useGridEditing';
import { useGridRows } from '../hooks/features/rows/useGridRows';
import { useGridParamsApi } from '../hooks/features/rows/useGridParamsApi';
import { useGridSelection } from '../hooks/features/selection/useGridSelection';
import { useGridSorting } from '../hooks/features/sorting/useGridSorting';
import { useGridScroll } from '../hooks/features/scroll/useGridScroll';
import { useGridEvents } from '../hooks/features/events/useGridEvents';
import { useGridDimensions } from '../hooks/features/dimensions/useGridDimensions';
import { useGridRowsMeta } from '../hooks/features/rows/useGridRowsMeta';
import { useGridStatePersistence } from '../hooks/features/statePersistence/useGridStatePersistence';

export const useDataGridComponent = (props: DataGridProcessedProps) => {
  const apiRef = useGridInitialization<GridApiCommunity>(undefined, props);
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
