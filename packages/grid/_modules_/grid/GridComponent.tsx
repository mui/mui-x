/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import NoSsr from '@material-ui/core/NoSsr';
import clsx from 'clsx';
import { GridAutoSizer } from './components/GridAutoSizer';
import { GridColumnsHeader } from './components/columnHeaders/GridColumnHeaders';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridRoot } from './components/containers/GridRoot';
import { GridWindow } from './components/containers/GridWindow';
import { GridViewport } from './components/GridViewport';
import { Watermark } from './components/Watermark';
import { GridComponentProps } from './GridComponentProps';
import { useGridColumnMenu } from './hooks/features/columnMenu/useGridColumnMenu';
import { useGridColumns } from './hooks/features/columns/useGridColumns';
import { useGridFocus } from './hooks/features/focus/useGridFocus';
import { useGridSelector } from './hooks/features/core/useGridSelector';
import { useGridKeyboardNavigation } from './hooks/features/keyboard/useGridKeyboardNavigation';
import { useGridPagination } from './hooks/features/pagination/useGridPagination';
import { useGridPreferencesPanel } from './hooks/features/preferencesPanel/useGridPreferencesPanel';
import { useGridParamsApi } from './hooks/features/rows/useGridParamsApi';
import { useGridRows } from './hooks/features/rows/useGridRows';
import { useGridEditRows } from './hooks/features/rows/useGridEditRows';
import { gridRowCountSelector } from './hooks/features/rows/gridRowsSelector';
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
import { useLogger, useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useGridVirtualRows } from './hooks/features/virtualization/useGridVirtualRows';
import { useGridDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { GridRootContainerRef } from './models/gridRootContainerRef';
import { GridApiContext } from './components/GridApiContext';
import { useGridFilter } from './hooks/features/filter/useGridFilter';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';
import { useGridCsvExport } from './hooks/features/export';
import { useGridInfiniteLoader } from './hooks/features/infiniteLoader';
import { visibleGridRowCountSelector } from './hooks/features/filter/gridFilterSelector';
import { useGridFreezeRows } from './hooks/features/rows/useGridFreezeRows';

export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const rootContainerRef: GridRootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);

    const footerRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const apiRef = useGridApiRef(props.apiRef);
    const totalRowCount = useGridSelector(apiRef, gridRowCountSelector);
    const visibleRowCount = useGridSelector(apiRef, visibleGridRowCountSelector);

    const internalOptions = useOptionsProp(apiRef, props);

    useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
    const logger = useLogger('GridComponent');

    useApi(rootContainerRef, columnsContainerRef, apiRef);
    const errorState = useErrorHandler(apiRef, props);
    useEvents(rootContainerRef, apiRef);
    useLocaleText(apiRef);
    const onResize = useResizeContainer(apiRef);

    // Freeze rows for immutability
    useGridFreezeRows(props.rows);

    useGridColumns(props.columns, apiRef);
    useGridParamsApi(apiRef);
    useGridRows(apiRef, props.rows, props.getRowId);
    useGridEditRows(apiRef);
    useGridFocus(apiRef);
    useGridKeyboard(rootContainerRef, apiRef);
    useGridKeyboardNavigation(rootContainerRef, apiRef);
    useGridSelection(apiRef);
    useGridSorting(apiRef, props.rows);
    useGridColumnMenu(apiRef);
    useGridPreferencesPanel(apiRef);
    useGridFilter(apiRef, props.rows);
    useGridContainerProps(windowRef, apiRef);
    useGridDensity(apiRef);
    useGridVirtualRows(columnsHeaderRef, windowRef, renderingZoneRef, apiRef);
    useGridColumnReorder(apiRef);
    useGridColumnResize(columnsHeaderRef, apiRef);
    useGridPagination(apiRef);
    useGridCsvExport(apiRef);
    useGridInfiniteLoader(apiRef);

    const components = useGridComponents(props.components, props.componentsProps, apiRef);
    useStateProp(apiRef, props.state);
    useRenderInfoLog(apiRef, logger);

    const showNoRowsOverlay = !props.loading && totalRowCount === 0;
    const showNoResultsOverlay = !props.loading && totalRowCount > 0 && visibleRowCount === 0;

    const ariaProps = {
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
    };
    return (
      <GridApiContext.Provider value={apiRef}>
        <NoSsr>
          <GridRoot
            ref={handleRef}
            className={clsx(internalOptions.classes?.root, props.className)}
            {...ariaProps}
          >
            <ErrorBoundary
              hasError={errorState != null}
              componentProps={errorState}
              api={apiRef!}
              logger={logger}
              render={(errorProps) => (
                <GridMainContainer>
                  <components.ErrorOverlay
                    {...errorProps}
                    {...props.componentsProps?.errorOverlay}
                  />
                </GridMainContainer>
              )}
            >
              <div ref={headerRef}>
                <components.Header {...props.componentsProps?.header} />
              </div>
              <GridMainContainer>
                <Watermark licenseStatus={props.licenseStatus} />
                <GridColumnsContainer ref={columnsContainerRef}>
                  <GridColumnsHeader ref={columnsHeaderRef} />
                </GridColumnsContainer>
                {showNoRowsOverlay && (
                  <components.NoRowsOverlay {...props.componentsProps?.noRowsOverlay} />
                )}
                {showNoResultsOverlay && (
                  <components.NoResultsOverlay {...props.componentsProps?.noResultsOverlay} />
                )}
                {props.loading && (
                  <components.LoadingOverlay {...props.componentsProps?.loadingOverlay} />
                )}
                <GridAutoSizer
                  onResize={onResize}
                  nonce={props.nonce}
                  disableHeight={props.autoHeight}
                >
                  {(size: any) => (
                    <GridWindow ref={windowRef} size={size}>
                      <GridViewport ref={renderingZoneRef} />
                    </GridWindow>
                  )}
                </GridAutoSizer>
              </GridMainContainer>
              {!internalOptions.hideFooter && (
                <div ref={footerRef}>
                  <components.Footer {...props.componentsProps?.footer} />
                </div>
              )}
            </ErrorBoundary>
          </GridRoot>
        </NoSsr>
      </GridApiContext.Provider>
    );
  },
);
