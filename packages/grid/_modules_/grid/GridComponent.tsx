/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { AutoSizer } from './components/AutoSizer';
import { ColumnsHeader } from './components/columnHeaders/ColumnHeaders';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GridColumnHeaderMenu } from './components/menu/columnMenu/GridColumnHeaderMenu';
import { GridColumnsContainer } from './components/containers/GridColumnsContainer';
import { GridMainContainer } from './components/containers/GridMainContainer';
import { GridRoot } from './components/containers/GridRoot';
import { GridWindow } from './components/containers/GridWindow';
import { Viewport } from './components/Viewport';
import { Watermark } from './components/Watermark';
import { GridComponentProps } from './GridComponentProps';
import { useColumnMenu } from './hooks/features/columnMenu/useColumnMenu';
import { useColumns } from './hooks/features/columns/useColumns';
import { useGridState } from './hooks/features/core/useGridState';
import { usePagination } from './hooks/features/pagination/usePagination';
import { usePreferencesPanel } from './hooks/features/preferencesPanel/usePreferencesPanel';
import { useRows } from './hooks/features/rows/useRows';
import { useSorting } from './hooks/features/sorting/useSorting';
import { useApiRef } from './hooks/features/useApiRef';
import { useColumnReorder } from './hooks/features/columnReorder';
import { useBaseComponentProps } from './hooks/features/useBaseComponentProps';
import { useColumnResize } from './hooks/features/useColumnResize';
import { useComponents } from './hooks/features/useComponents';
import { useSelection } from './hooks/features/selection/useSelection';
import { useApi } from './hooks/root/useApi';
import { useContainerProps } from './hooks/root/useContainerProps';
import { useEvents } from './hooks/root/useEvents';
import { useKeyboard } from './hooks/features/keyboard/useKeyboard';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { useLogger, useLoggerFactory } from './hooks/utils/useLogger';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useRenderInfoLog } from './hooks/utils/useRenderInfoLog';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useVirtualRows } from './hooks/features/virtualization/useVirtualRows';
import { useDensity } from './hooks/features/density';
import { useStateProp } from './hooks/utils/useStateProp';
import { RootContainerRef } from './models/rootContainerRef';
import { ApiContext } from './components/api-context';
import { useFilter } from './hooks/features/filter/useFilter';
import { useLocaleText } from './hooks/features/localeText/useLocaleText';

export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);

    const footerRef = React.useRef<HTMLDivElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const apiRef = useApiRef(props.apiRef);
    const [gridState] = useGridState(apiRef);

    const internalOptions = useOptionsProp(apiRef, props);

    useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
    const logger = useLogger('GridComponent');

    useApi(rootContainerRef, columnsContainerRef, apiRef);
    const errorState = useErrorHandler(apiRef, props);
    useEvents(rootContainerRef, apiRef);
    useLocaleText(apiRef);
    const onResize = useResizeContainer(apiRef);

    useColumns(props.columns, apiRef);
    useRows(props.rows, apiRef);
    useKeyboard(rootContainerRef, apiRef);
    useSelection(apiRef);
    useSorting(apiRef, props.rows);
    useColumnMenu(apiRef);
    usePreferencesPanel(apiRef);
    useFilter(apiRef, props.rows);
    useContainerProps(windowRef, apiRef);
    useDensity(apiRef);
    useVirtualRows(columnsHeaderRef, windowRef, renderingZoneRef, apiRef);
    useColumnReorder(apiRef);
    useColumnResize(columnsHeaderRef, apiRef);
    usePagination(apiRef);

    const components = useComponents(props.components, props.componentsProps, apiRef);
    useStateProp(apiRef, props.state);
    useRenderInfoLog(apiRef, logger);
    const componentBaseProps = useBaseComponentProps(apiRef);

    const showNoRowsOverlay = !props.loading && gridState.rows.totalRowCount === 0;
    return (
      <ApiContext.Provider value={apiRef}>
        <AutoSizer onResize={onResize} nonce={props.nonce}>
          {(size: any) => (
            <GridRoot
              ref={handleRef}
              className={props.className}
              size={size}
              header={headerRef}
              footer={footerRef}
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
                      {...componentBaseProps}
                      {...props.componentsProps?.errorOverlay}
                    />
                  </GridMainContainer>
                )}
              >
                <div ref={headerRef}>
                  <components.Header {...componentBaseProps} {...props.componentsProps?.header} />
                </div>
                <GridMainContainer>
                  <GridColumnHeaderMenu
                    ContentComponent={components.ColumnMenu}
                    contentComponentProps={{
                      ...componentBaseProps,
                      ...props.componentsProps?.columnMenu,
                    }}
                  />
                  <Watermark licenseStatus={props.licenseStatus} />
                  <GridColumnsContainer ref={columnsContainerRef}>
                    <ColumnsHeader ref={columnsHeaderRef} />
                  </GridColumnsContainer>
                  {showNoRowsOverlay && (
                    <components.NoRowsOverlay
                      {...componentBaseProps}
                      {...props.componentsProps?.noRowsOverlay}
                    />
                  )}
                  {props.loading && (
                    <components.LoadingOverlay
                      {...componentBaseProps}
                      {...props.componentsProps?.loadingOverlay}
                    />
                  )}
                  <GridWindow ref={windowRef}>
                    <Viewport ref={renderingZoneRef} />
                  </GridWindow>
                </GridMainContainer>
                {!gridState.options.hideFooter && (
                  <div ref={footerRef}>
                    <components.Footer {...componentBaseProps} {...props.componentsProps?.footer} />
                  </div>
                )}
              </ErrorBoundary>
            </GridRoot>
          )}
        </AutoSizer>
      </ApiContext.Provider>
    );
  },
);
