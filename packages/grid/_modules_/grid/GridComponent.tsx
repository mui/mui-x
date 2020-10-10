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
import { ElementSize, RootContainerRef } from './models';
import { COMPONENT_ERROR, DATA_CONTAINER_CSS_CLASS } from './constants';
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
  GridWindow,
} from './components';
import { useApi, useColumns, useKeyboard, useRows } from './hooks/root';
import { useLogger, useLoggerFactory } from './hooks/utils';
import { debounce } from './utils';
import { useEvents } from './hooks/root/useEvents';
import { ErrorBoundary } from './components/error-boundary';
import { useOptionsProp } from './hooks/utils/useOptionsProp';
import {useResizeContainer} from "./hooks/utils/useResizeContainer";
import {useErrorHandler} from "./hooks/utils/useErrorHandler";
import {getCurryTotalHeight} from "./utils/getTotalHeight";
import {useRowsReducer} from "./hooks/features/core/useRowsReducer";

/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(function GridComponent(
  props,
  ref,
) {
  const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);

  const footerRef = React.useRef<HTMLDivElement>(null);
  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);

  const apiRef = useApiRef(props.apiRef);
  const internalOptions = useOptionsProp(apiRef, props);

  useLoggerFactory(internalOptions.logger, internalOptions.logLevel);
  const gridLogger = useLogger('GridComponent');

  const initialised = useApi(rootContainerRef, apiRef);
  const errorState =  useErrorHandler(apiRef, props)
  const onResize = useResizeContainer(apiRef);

  useEvents(rootContainerRef, internalOptions, apiRef);
  const internalColumns = useColumns(internalOptions, props.columns, apiRef);

  const internalRows = useRowsReducer(props.rows, apiRef);
  useKeyboard(internalOptions, initialised, apiRef);
  useSelection(internalOptions, props.rows, initialised, apiRef);
  useSorting(internalOptions, props.rows, props.columns, apiRef);

  const renderCtx = useVirtualRows(
    columnsHeaderRef,
    windowRef,
    renderingZoneRef,
    internalColumns,
    internalRows,
    internalOptions,
    apiRef,
  );

  const onColumnReorder = useColumnReorder(columnsHeaderRef, apiRef);
  const separatorProps = useColumnResize(columnsHeaderRef, apiRef);
  const paginationProps = usePagination(internalRows, internalColumns, apiRef);

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
  const getTotalHeight = React.useCallback((size)=> getCurryTotalHeight(internalOptions, renderCtx, footerRef)(size),
    [internalOptions, renderCtx, footerRef]);

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
                      hasScrollX={!!renderCtx?.hasScrollX}
                      separatorProps={separatorProps}
                      onColumnHeaderDragOver={onColumnReorder.handleColumnHeaderDragOver}
                      onColumnDragStart={onColumnReorder.handleDragStart}
                      onColumnDragEnter={onColumnReorder.handleDragEnter}
                      onColumnDragOver={onColumnReorder.handleDragOver}
                      renderCtx={renderCtx}
                    />
                  </GridColumnsContainer>
                  {!props.loading && internalRows.length === 0 && customComponents.noRowsComponent}
                  {props.loading && customComponents.loadingComponent}
                  <GridWindow ref={windowRef}>
                    <GridDataContainer
                      ref={gridRef}
                      className={DATA_CONTAINER_CSS_CLASS}
                      style={{
                        minHeight: renderCtx?.dataContainerSizes?.height,
                        minWidth: renderCtx?.dataContainerSizes?.width,
                      }}
                    >
                      {renderCtx != null && (
                        <RenderContext.Provider value={renderCtx}>
                          <Viewport
                            ref={renderingZoneRef}
                            options={internalOptions}
                            rows={internalRows}
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
                      // !!internalOptions.pagination &&
                      // paginationProps.pageSize != null &&
                      // !internalOptions.hideFooterPagination &&
                      // (customComponents.paginationComponent || (
                      //   <Pagination
                      //     setPage={paginationProps.setPage}
                      //     currentPage={paginationProps.page}
                      //     pageCount={paginationProps.pageCount}
                      //     pageSize={paginationProps.pageSize}
                      //     rowCount={paginationProps.rowCount}
                      //     setPageSize={paginationProps.setPageSize}
                      //     rowsPerPageOptions={internalOptions.rowsPerPageOptions}
                      //   />
                      // ))
                      null
                    }
                    rowCount={0
                      // internalOptions.rowCount == null
                      //   ? internalRows.length
                      //   : internalOptions.rowCount
                    }
                    options={internalOptions}
                  />
                )}
              </OptionsContext.Provider>
            </ApiContext.Provider>
          </ErrorBoundary>
        </GridRoot>
      )}
    </AutoSizer>
  );
});
