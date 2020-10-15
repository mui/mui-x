import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { GridComponentProps } from './GridComponentProps';
import {
  useApiRef,
  useColumnReorder,
  useColumnResize,
  useComponents,
  usePagination,
  useSelection,
  useSorting,
} from './hooks/features';
import { useGridState } from './hooks/features/core/useGridState';
import { RootContainerRef } from './models';
import { DATA_CONTAINER_CSS_CLASS } from './constants';
import { GridRoot } from './components/styled-wrappers/GridRoot';
import { GridDataContainer } from './components/styled-wrappers/GridDataContainer';
import { GridColumnsContainer } from './components/styled-wrappers/GridColumnsContainer';
import { useVirtualRows } from './hooks/virtualization';
import {
  ApiContext,
  AutoSizer,
  ColumnsHeader,
  DefaultFooter,
  OptionsContext,
  RenderContext,
  Viewport,
  Watermark,
  GridWindow, Pagination,
} from './components';
import { useApi, useColumns, useContainerProps, useKeyboard } from './hooks/root';
import { useLogger, useLoggerFactory } from './hooks/utils';
import { useEvents } from './hooks/root/useEvents';
import { ErrorBoundary } from './components/error-boundary';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import { useResizeContainer } from './hooks/utils/useResizeContainer';
import { useErrorHandler } from './hooks/utils/useErrorHandler';
import { getCurryTotalHeight } from './utils/getTotalHeight';
import { useRowsReducer } from './hooks/features/rows/useRowsReducer';

/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(
  function GridComponent(props, ref) {
    const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootContainerRef, ref);

    const footerRef = React.useRef<HTMLDivElement>(null);
    const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
    const columnsContainerRef = React.useRef<HTMLDivElement>(null);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const gridRef = React.useRef<HTMLDivElement>(null);
    const renderingZoneRef = React.useRef<HTMLDivElement>(null);

    const apiRef = useApiRef(props.apiRef);
    const [gridState] = useGridState(apiRef);
    const internalOptions = useOptionsProp(apiRef, props);

    useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
    const gridLogger = useLogger('GridComponent');

    const initialised = useApi(rootContainerRef, apiRef);
    const errorState = useErrorHandler(apiRef, props);
    useEvents(rootContainerRef, internalOptions, apiRef);
    const onResize = useResizeContainer(apiRef);

    const internalColumns = useColumns(props.columns, apiRef);

    const internalRows = useRowsReducer(props.rows, apiRef);
    useKeyboard(internalOptions, initialised, apiRef);
    useSelection(internalOptions, props.rows, initialised, apiRef);
    useSorting(internalOptions, props.rows, props.columns, apiRef);

    useContainerProps(windowRef, apiRef);
    const renderCtx = useVirtualRows(
      columnsHeaderRef,
      windowRef,
      renderingZoneRef,
      apiRef,
    );

    const onColumnReorder = useColumnReorder(columnsHeaderRef, apiRef);
  const separatorProps = useColumnResize(columnsHeaderRef, apiRef);
    const paginationProps = usePagination(internalColumns, apiRef);

    const customComponents = useComponents(
      internalColumns,
      internalRows,
      internalOptions,
      props.components,
      paginationProps,
      apiRef,
      rootContainerRef,
    );

    gridLogger.info(
      `Rendering, page: ${renderCtx?.page}, col: ${renderCtx?.firstColIdx}-${renderCtx?.lastColIdx}, row: ${renderCtx?.firstRowIdx}-${renderCtx?.lastRowIdx}`,
      renderCtx,
    );

    // TODO move that to renderCtx
    const getTotalHeight = React.useCallback(
      (size) => getCurryTotalHeight(internalOptions, gridState.containerSizes, footerRef)(size),
      [internalOptions, gridState.containerSizes],
    );

    return (
      <AutoSizer onResize={onResize}>
        {(size: any) => (
          <GridRoot
            ref={handleRef}
            className={props.className}
            style={{ width: size.width, height: getTotalHeight(size) }}
            role="grid"
            aria-colcount={internalColumns.visible.length}
            aria-rowcount={internalRows.length + 1}
            tabIndex={0}
            aria-label="grid"
            aria-multiselectable={!internalOptions.disableMultipleSelection}
          >
            <ErrorBoundary
              hasError={errorState != null}
              componentProps={errorState}
              api={apiRef!}
              logger={gridLogger}
              render={(errorProps) => (
                <div className="MuiDataGrid-mainGridContainer">
                  {customComponents.renderError(errorProps)}
                </div>
              )}
            >
              <ApiContext.Provider value={apiRef}>
                <OptionsContext.Provider value={internalOptions}>
                  {customComponents.headerComponent}
                  <div className="MuiDataGrid-mainGridContainer">
                    <Watermark licenseStatus={props.licenseStatus} />
                    <GridColumnsContainer
                      ref={columnsContainerRef}
                      height={internalOptions.headerHeight}
                    >
                      <ColumnsHeader
                        ref={columnsHeaderRef}
                        columns={internalColumns.visible || []}
                        hasScrollX={!!gridState.containerSizes?.hasScrollX}
                        separatorProps={separatorProps}
                      onColumnHeaderDragOver={onColumnReorder.handleColumnHeaderDragOver}
                      onColumnDragStart={onColumnReorder.handleDragStart}
                      onColumnDragEnter={onColumnReorder.handleDragEnter}
                      onColumnDragOver={onColumnReorder.handleDragOver}
                        renderCtx={renderCtx}
                      />
                    </GridColumnsContainer>
                    {!props.loading &&
                      internalRows.length === 0 &&
                      customComponents.noRowsComponent}
                    {props.loading && customComponents.loadingComponent}
                    <GridWindow ref={windowRef}>
                      <GridDataContainer
                        ref={gridRef}
                        className={DATA_CONTAINER_CSS_CLASS}
                        style={{
                          minHeight: gridState.containerSizes?.dataContainerSizes?.height,
                          minWidth: gridState.containerSizes?.dataContainerSizes?.width,
                        }}
                      >
                        {renderCtx != null && (
                          <RenderContext.Provider value={renderCtx}>
                            <Viewport
                              ref={renderingZoneRef}
                              visibleColumns={internalColumns.visible}
                            />
                          </RenderContext.Provider>
                        )}
                      </GridDataContainer>
                    </GridWindow>
                  </div>
                  {customComponents.footerComponent || (
                    <DefaultFooter
                      ref={footerRef}
                      paginationComponent={
                        !!gridState.options.pagination &&
                        gridState.pagination.pageSize != null &&
                        !gridState.options.hideFooterPagination &&
                        (customComponents.paginationComponent || (
                          <Pagination
                            setPage={apiRef.current.setPage}
                            currentPage={gridState.pagination.page}
                            pageCount={gridState.pagination.pageCount}
                            pageSize={gridState.pagination.pageSize}
                            rowCount={gridState.pagination.rowCount}
                            setPageSize={apiRef.current.setPageSize}
                            rowsPerPageOptions={gridState.options.rowsPerPageOptions}
                          />
                        ))
                      }
                    />
                  )}
                </OptionsContext.Provider>
              </ApiContext.Provider>
            </ErrorBoundary>
          </GridRoot>
        )}
      </AutoSizer>
    );
  },
);
