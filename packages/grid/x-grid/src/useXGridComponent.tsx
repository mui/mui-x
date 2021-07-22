import { GridBaseComponentProps } from '../../_modules_/grid/GridBaseComponentProps';
import { useGridClipboard } from '../../_modules_/grid/hooks/features/clipboard/useGridClipboard';
import { useGridColumnMenu } from '../../_modules_/grid/hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumnReorder } from '../../_modules_/grid/hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from '../../_modules_/grid/hooks/features/columnResize/useGridColumnResize';
import { useGridColumns } from '../../_modules_/grid/hooks/features/columns/useGridColumns';
import { useGridControlState } from '../../_modules_/grid/hooks/features/core/useGridControlState';
import { useGridDensity } from '../../_modules_/grid/hooks/features/density/useGridDensity';
import { useGridCsvExport } from '../../_modules_/grid/hooks/features/export/useGridCsvExport';
import { useGridFilter } from '../../_modules_/grid/hooks/features/filter/useGridFilter';
import { useGridFocus } from '../../_modules_/grid/hooks/features/focus/useGridFocus';
import { useGridInfiniteLoader } from '../../_modules_/grid/hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridKeyboard } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from '../../_modules_/grid/hooks/features/keyboard/useGridKeyboardNavigation';
import { useLocaleText } from '../../_modules_/grid/hooks/features/localeText/useLocaleText';
import { useGridPagination } from '../../_modules_/grid/hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from '../../_modules_/grid/hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridEditRows } from '../../_modules_/grid/hooks/features/rows/useGridEditRows';
import { useGridFreezeRows } from '../../_modules_/grid/hooks/features/rows/useGridFreezeRows';
import { useGridParamsApi } from '../../_modules_/grid/hooks/features/rows/useGridParamsApi';
import { useGridRows } from '../../_modules_/grid/hooks/features/rows/useGridRows';
import { useGridSelection } from '../../_modules_/grid/hooks/features/selection/useGridSelection';
import { useGridSorting } from '../../_modules_/grid/hooks/features/sorting/useGridSorting';
import { useGridComponents } from '../../_modules_/grid/hooks/features/useGridComponents';
import { useLicenseState } from '../../_modules_/grid/hooks/features/useLicenseState';
import { useGridVirtualRows } from '../../_modules_/grid/hooks/features/virtualization/useGridVirtualRows';
import { useApi } from '../../_modules_/grid/hooks/root/useApi';
import { useEvents } from '../../_modules_/grid/hooks/root/useEvents';
import { useGridContainerProps } from '../../_modules_/grid/hooks/root/useGridContainerProps';
import { useErrorHandler } from '../../_modules_/grid/hooks/utils/useErrorHandler';
import { useGridScrollbarSizeDetector } from '../../_modules_/grid/hooks/utils/useGridScrollbarSizeDetector';
import { useLoggerFactory } from '../../_modules_/grid/hooks/utils/useLogger';
import { useOptionsProp } from '../../_modules_/grid/hooks/utils/useOptionsProp';
import { useRenderInfoLog } from '../../_modules_/grid/hooks/utils/useRenderInfoLog';
import { useResizeContainer } from '../../_modules_/grid/hooks/utils/useResizeContainer';
import { useStateProp } from '../../_modules_/grid/hooks/utils/useStateProp';
import { GridApiRef } from '../../_modules_/grid/models/api/gridApiRef';

export const useXGridComponent = (apiRef: GridApiRef, props: GridBaseComponentProps) => {
  useLoggerFactory(apiRef, props);
  useLicenseState(apiRef);
  useApi(apiRef);
  useErrorHandler(apiRef, props);
  useGridControlState(apiRef);
  useGridScrollbarSizeDetector(apiRef, props);
  useOptionsProp(apiRef, props);
  useEvents(apiRef, props);
  useLocaleText(apiRef);
  useResizeContainer(apiRef, props);
  useGridFreezeRows(apiRef, props);
  useGridColumns(apiRef, props);
  useGridParamsApi(apiRef);
  useGridRows(apiRef, props);
  useGridEditRows(apiRef, props);
  useGridFocus(apiRef, props);
  useGridKeyboard(apiRef);
  useGridKeyboardNavigation(apiRef);
  useGridSelection(apiRef, props);
  useGridSorting(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridPreferencesPanel(apiRef);
  useGridFilter(apiRef, props);
  useGridContainerProps(apiRef);
  useGridDensity(apiRef);
  useGridVirtualRows(apiRef);
  useGridColumnReorder(apiRef);
  useGridColumnResize(apiRef, props);
  useGridPagination(apiRef);
  useGridCsvExport(apiRef);
  useGridInfiniteLoader(apiRef, props);
  useGridClipboard(apiRef);
  useGridComponents(apiRef, props);
  useStateProp(apiRef, props);
  useRenderInfoLog(apiRef);
};
