import NoSsr from '@material-ui/core/NoSsr';
import { useForkRef } from '@material-ui/core/utils';
import clsx from 'clsx';
import * as React from 'react';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridRoot } from './components/containers/GridRoot';
import { GridWindow } from './components/containers/GridWindow';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridApiContext } from './components/GridApiContext';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { GRID_UNMOUNT } from './constants/eventsConstants';
import { GridComponentProps } from './GridComponentProps';
import { useGridColumnMenu } from './hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumnReorder } from './hooks/features/columnReorder/useGridColumnReorder';
import { useGridColumnResize } from './hooks/features/columnResize/useGridColumnResize';
import { useGridColumns } from './hooks/features/columns/useGridColumns';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { useGridDensity } from './hooks/features/density/useGridDensity';
import { useGridCsvExport } from './hooks/features/export/useGridCsvExport';
import { visibleGridRowCountSelector } from './hooks/features/filter/gridFilterSelector';
import { useGridFilter } from './hooks/features/filter/useGridFilter';
import { useGridFocus } from './hooks/features/focus/useGridFocus';
import { useGridInfiniteLoader } from './hooks/features/infiniteLoader/useGridInfiniteLoader';
import { useGridKeyboard } from './hooks/features/keyboard/useGridKeyboard';
import { useGridKeyboardNavigation } from './hooks/features/keyboard/useGridKeyboardNavigation';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';
import { useGridPagination } from './hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from './hooks/features/preferencesPanel/useGridPreferencesPanel';
import { gridRowCountSelector } from './hooks/features/rows/gridRowsSelector';
import { useGridEditRows } from './hooks/features/rows/useGridEditRows';
import { useGridFreezeRows } from './hooks/features/rows/useGridFreezeRows';
import { useGridParamsApi } from './hooks/features/rows/useGridParamsApi';
import { useGridRows } from './hooks/features/rows/useGridRows';
import { useGridSelection } from './hooks/features/selection/useGridSelection';
import { useGridSorting } from './hooks/features/sorting/useGridSorting';
import { useGridComponents } from './hooks/features/useGridComponents';
import { useGridVirtualRows } from './hooks/features/virtualization/useGridVirtualRows';
import { useApi } from './hooks/root/useApi';
import { useEvents } from './hooks/root/useEvents';
import { useGridContainerProps } from './hooks/root/useGridContainerProps';
import { optionsSelector } from './hooks/utils/optionsSelector';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { useLogger, useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useStateProp } from './hooks/utils/useStateProp';
import { GridRootContainerRef } from './models/gridRootContainerRef';
import pipe from './pipe';

// export const GridPluginImplementation = React.forwardRef<HTMLDivElement, GridComponentProps>(
//   function GridPluginImplementation(props, ref) {
//     const apiRef = React.useContext(GridApiContext)!;
//     pipe(
//       useLoggerFactory,
//       useOptionsProp,
//       useApi,
//       useErrorHandler,
//       useEvents,
//       useLocaleText,
//       useResizeContainer,
//       useGridFreezeRows,
//       useGridColumns,
//       useGridParamsApi,
//       useGridRows,
//       useGridEditRows,
//       useGridFocus,
//       useGridKeyboard,
//       useGridKeyboardNavigation,
//       useGridSelection,
//       useGridSorting,
//       useGridColumnMenu,
//       useGridPreferencesPanel,
//       useGridFilter,
//       useGridContainerProps,
//       useGridDensity,
//       useGridVirtualRows,
//       useGridColumnReorder,
//       useGridColumnResize,
//       useGridPagination,
//       useGridCsvExport,
//       useGridInfiniteLoader,
//       useGridComponents,
//       useStateProp,
//       useRenderInfoLog,
//     )(apiRef, props)
// });

export function ErrorHandler(props) {
  const logger = useLogger('GridErrorHandler');
  const apiRef = React.useContext(GridApiContext)!;
  const errorState = useErrorHandler(apiRef, props);

  return (
    <ErrorBoundary
      hasError={errorState != null}
      componentProps={errorState}
      api={apiRef!}
      logger={logger}
      render={(errorProps) => (
        <GridMainContainer>
          <apiRef.current.components.ErrorOverlay
            {...errorProps}
            {...props.componentsProps?.errorOverlay}
          />
        </GridMainContainer>
      )}
    >
      {props.children}
    </ErrorBoundary>
  )
}
//TODO split this
export const GridBody = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridBody(props, ref) {
    const apiRef = React.useContext(GridApiContext)!;
    const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);
    const footerRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
    const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);
    const options = useGridSelector(apiRef, optionsSelector);

    const showNoRowsOverlay = !props.loading && totalRowCount === 0;
    const showNoResultsOverlay = !props.loading && totalRowCount > 0 && visibleRowCount === 0;

      apiRef.current.rootElementRef = rootContainerRef;
      apiRef.current.columnHeadersContainerElementRef = columnsContainerRef;
      apiRef.current.columnHeadersElementRef = columnsHeaderRef;
      apiRef.current.windowRef = windowRef;
      apiRef.current.renderingZoneRef = renderingZoneRef;
      apiRef.current.headerRef = headerRef;
      apiRef.current.footerRef = footerRef;

      if(!apiRef.current) {
        return null;
      }
    return (
      <NoSsr>
        <GridRoot
          ref={handleRef}
          className={clsx(options.classes?.root, props.className)}
        >
          <ErrorHandler>
            <div ref={headerRef}>
              <apiRef.current.components.Header {...props.componentsProps?.header} />
            </div>
            <GridMainContainer>
              <Watermark licenseStatus={props.licenseStatus}/>
              <GridColumnsContainer ref={columnsContainerRef}>
                <GridColumnsHeader ref={columnsHeaderRef}/>
              </GridColumnsContainer>
              {showNoRowsOverlay && (
                <apiRef.current.components.NoRowsOverlay {...props.componentsProps?.noRowsOverlay} />
              )}
              {showNoResultsOverlay && (
                <apiRef.current.components.NoResultsOverlay {...props.componentsProps?.noResultsOverlay} />
              )}
              {props.loading && (
                <apiRef.current.components.LoadingOverlay {...props.componentsProps?.loadingOverlay} />
              )}
              <GridAutoSizer
                nonce={props.nonce}
                disableHeight={props.autoHeight}
              >
                {(size: any) => (
                  <GridWindow ref={windowRef} size={size}>
                    <GridViewport ref={renderingZoneRef}/>
                  </GridWindow>
                )}
              </GridAutoSizer>
            </GridMainContainer>
            {!options.hideFooter && (
              <div ref={footerRef}>
                <apiRef.current.components.Footer {...props.componentsProps?.footer} />
              </div>
            )}
          </ErrorHandler>
        </GridRoot>
      </NoSsr>
    );
  });
