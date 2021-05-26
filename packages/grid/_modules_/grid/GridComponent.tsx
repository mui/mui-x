/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import { useForkRef } from '@material-ui/core/utils';
import * as React from 'react';
import { GridRoot } from './components/containers/GridRoot';
import { ErrorHandler } from './ErrorHandler';
import { GridComponentProps } from './GridComponentProps';
import { GridBody } from './GridBody';
import { useGridColumnMenu } from './hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns } from './hooks/features/columns/useGridColumns';
import { useGridFocus } from './hooks/features/focus/useGridFocus';
import { useGridKeyboardNavigation } from './hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from './hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from './hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridParamsApi } from './hooks/features/rows/useGridParamsApi';
import { useGridRows } from './hooks/features/rows/useGridRows';
import { useGridEditRows } from './hooks/features/rows/useGridEditRows';
import { useGridSorting } from './hooks/features/sorting/useGridSorting';
import { useGridApiRef } from './hooks/features/useGridApiRef';
import { useGridColumnReorder } from './hooks/features/columnReorder';
import { useGridColumnResize } from './hooks/features/columnResize';
import { useGridComponents } from './hooks/features/useGridComponents';
import { useGridSelection } from './hooks/features/selection/useGridSelection';
import { useApi } from './hooks/root/useApi';
import { useGridContainerProps } from './hooks/root/useGridContainerProps';
import { useEvents } from './hooks/root/useEvents';
import { useGridKeyboard } from './hooks/features/keyboard/useGridKeyboard';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useGridVirtualRows } from './hooks/features/virtualization/useGridVirtualRows';
import { useGridDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { GridApiContext } from './components/GridApiContext';
import { useGridFilter } from './hooks/features/filter/useGridFilter';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';
import { useGridCsvExport } from './hooks/features/export';
import { useGridInfiniteLoader } from './hooks/features/infiniteLoader';
import { useGridFreezeRows } from './hooks/features/rows/useGridFreezeRows';
import { GridApiRef } from './models/api/gridApiRef';
import { GridRootContainerRef } from './models/gridRootContainerRef';

const useGridComponent = (apiRef: GridApiRef, props: GridComponentProps) => {
  useLoggerFactory(apiRef, props);
  useApi(apiRef);
  useErrorHandler(apiRef, props);
  useOptionsProp(apiRef, props);
  useEvents(apiRef);
  useLocaleText(apiRef);
  useResizeContainer(apiRef);
  useGridFreezeRows(apiRef, props);
  useGridColumns(apiRef, props);
  useGridParamsApi(apiRef);
  useGridRows(apiRef, props);
  useGridEditRows(apiRef);
  useGridFocus(apiRef);
  useGridKeyboard(apiRef);
  useGridKeyboardNavigation(apiRef);
  useGridSelection(apiRef);
  useGridSorting(apiRef, props);
  useGridColumnMenu(apiRef);
  useGridPreferencesPanel(apiRef);
  useGridFilter(apiRef, props);
  useGridContainerProps(apiRef);
  useGridDensity(apiRef);
  useGridVirtualRows(apiRef);
  useGridColumnReorder(apiRef);
  useGridColumnResize(apiRef);
  useGridPagination(apiRef);
  useGridCsvExport(apiRef);
  useGridInfiniteLoader(apiRef);
  useGridComponents(apiRef, props);
  useStateProp(apiRef, props);
  useRenderInfoLog(apiRef);
};
export const GridPropsContext = React.createContext<GridComponentProps | undefined>(undefined);

export const GridHeaderPlaceholder = () => {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;
  const headerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.headerRef = headerRef;

  return (
    <div ref={headerRef}>
      <apiRef.current.components.Header {...props.componentsProps?.header} />
    </div>
  );
};

export const GridFooterPlaceholder = () => {
  const apiRef = React.useContext(GridApiContext)!;
  const props = React.useContext(GridPropsContext)!;
  const footerRef = React.useRef<HTMLDivElement>(null);
  apiRef.current.footerRef = footerRef;
  if (props.hideFooter) {
    return null;
  }

  return (
    <div ref={footerRef}>
      <apiRef.current.components.Footer {...props.componentsProps?.footer} />
    </div>
  );
};

// TODO recompose the api type
//      register new api method
export const GridContextProvider = ({ apiRef, props, children }) => {
  return (
    <GridPropsContext.Provider value={props}>
      <GridApiContext.Provider value={apiRef}>{children}</GridApiContext.Provider>
    </GridPropsContext.Provider>
  );
};

export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const apiRef = useGridApiRef(props.apiRef);

    useGridComponent(apiRef, props);

    return (
      <GridContextProvider apiRef={apiRef} props={props}>
        <GridRoot ref={ref}>
          <ErrorHandler>
            <GridHeaderPlaceholder />
            <GridBody />
            <GridFooterPlaceholder />
          </ErrorHandler>
        </GridRoot>
      </GridContextProvider>
    );
  },
);
