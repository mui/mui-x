import * as React from 'react';
import { useForkRef } from '@material-ui/core/utils';
import { GridComponentProps } from './GridComponentProps';
import {
  useApiRef,
  useColumnResize,
  useComponents,
  usePagination,
  useSelection,
  useSorting,
} from './hooks/features';
import { DEFAULT_GRID_OPTIONS, ElementSize, RootContainerRef } from './models';
import { COMPONENT_ERROR, DATA_CONTAINER_CSS_CLASS } from './constants';
import { ColumnsContainer, DataContainer, GridRoot } from './components/styled-wrappers';
import { useVirtualRows } from './hooks/virtualization';
import {
  ApiContext,
  AutoSizerWrapper,
  ColumnsHeader,
  DefaultFooter,
  OptionsContext,
  Pagination,
  RenderContext,
  Viewport,
  Watermark,
  Window,
} from './components';
import { useApi, useColumns, useKeyboard, useRows } from './hooks/root';
import { useLogger, useLoggerFactory } from './hooks/utils';
import { debounce } from './utils';
import { useEvents } from './hooks/root/useEvents';
import { ErrorBoundary } from './components/error-boundary';
import { useOptionsProp } from './hooks/utils/useOptionsProp';

/**
 * Data Grid component implementing [[GridComponentProps]].
 *
 * @returns JSX.Element
 */
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(function DataGrid(
  props,
  ref,
) {
  const [internalOptions, setInternalOptions] = useOptionsProp(props);
  useLoggerFactory(
    internalOptions?.logger,
    internalOptions?.logLevel || DEFAULT_GRID_OPTIONS.logLevel,
  );
  const gridLogger = useLogger('Grid');

  const rootContainerRef: RootContainerRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(rootContainerRef, ref);

  const footerRef = React.useRef<HTMLDivElement>(null);
  const columnsHeaderRef = React.useRef<HTMLDivElement>(null);
  const columnsContainerRef = React.useRef<HTMLDivElement>(null);
  const windowRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const renderingZoneRef = React.useRef<HTMLDivElement>(null);
  const internalApiRef = useApiRef();
  const [errorState, setErrorState] = React.useState<any>(null);

  const apiRef = React.useMemo(() => (!props.apiRef ? internalApiRef : props.apiRef), [
    props.apiRef,
    internalApiRef,
  ]);

  const initialised = useApi(rootContainerRef, internalOptions, apiRef);

  const errorHandler = (args: any) => {
    // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
    setErrorState(args);
  };
  React.useEffect(() => {
    return apiRef!.current.subscribeEvent(COMPONENT_ERROR, errorHandler);
  }, [apiRef]);

  React.useEffect(() => {
    apiRef!.current.showError(props.error);
  }, [apiRef, props.error]);

  useEvents(rootContainerRef, internalOptions, apiRef);
  const internalColumns = useColumns(internalOptions, props.columns, apiRef);
  const internalRows = useRows(internalOptions, props.rows, initialised, apiRef);
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

  const onResizeColumn = useColumnResize(columnsHeaderRef, apiRef, internalOptions.headerHeight);
  const paginationProps = usePagination(internalRows, internalColumns, internalOptions, apiRef);

  React.useEffect(() => {
    setInternalOptions((previousState) => {
      if (previousState.pageSize !== paginationProps.pageSize) {
        return { ...previousState, pageSize: paginationProps.pageSize };
      }
      return previousState;
    });
  }, [paginationProps.pageSize, setInternalOptions]);

  const customComponents = useComponents(
    internalColumns,
    internalRows,
    internalOptions,
    props.components,
    paginationProps,
    apiRef,
    rootContainerRef,
  );

  const onResize = React.useCallback(
    (size: ElementSize) => {
      gridLogger.info('resized...', size);
      apiRef!.current.resize();
    },
    [gridLogger, apiRef],
  );
  const debouncedOnResize = React.useMemo(() => debounce(onResize, 100), [onResize]) as any;

  React.useEffect(() => {
    return () => {
      gridLogger.info('canceling resize...');
      debouncedOnResize.cancel();
    };
  }, [gridLogger, debouncedOnResize]);

  gridLogger.info(
    `Rendering, page: ${renderCtx?.page}, col: ${renderCtx?.firstColIdx}-${renderCtx?.lastColIdx}, row: ${renderCtx?.firstRowIdx}-${renderCtx?.lastRowIdx}`,
    renderCtx,
  );

  const getTotalHeight = React.useCallback(
    (size) => {
      if (!internalOptions.autoHeight) {
        return size.height;
      }
      const footerHeight =
        (footerRef.current && footerRef.current.getBoundingClientRect().height) || 0;
      let dataHeight = (renderCtx && renderCtx.dataContainerSizes!.height) || 0;
      if (dataHeight < internalOptions.rowHeight) {
        dataHeight = internalOptions.rowHeight * 2; // If we have no rows, we give the size of 2 rows to display the no rows overlay
      }

      return footerHeight + dataHeight + internalOptions.headerHeight;
    },
    [
      internalOptions.autoHeight,
      internalOptions.headerHeight,
      internalOptions.rowHeight,
      renderCtx,
    ],
  );

  return (
    <AutoSizerWrapper onResize={debouncedOnResize} style={{ height: 'unset', width: 'unset' }}>
      {(size: any) => (
        <GridRoot
          ref={handleRef}
          className={`material-grid MuiGrid ${props.className || ''}`}
          options={internalOptions}
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
              <div className="main-grid-container">{customComponents.renderError(errorProps)}</div>
            )}
          >
            <ApiContext.Provider value={apiRef}>
              <OptionsContext.Provider value={internalOptions}>
                {customComponents.headerComponent}
                <div className="main-grid-container">
                  <Watermark licenseStatus={props.licenseStatus} />
                  <ColumnsContainer ref={columnsContainerRef}>
                    <ColumnsHeader
                      ref={columnsHeaderRef}
                      columns={internalColumns.visible || []}
                      hasScrollX={!!renderCtx?.hasScrollX}
                      headerHeight={internalOptions.headerHeight}
                      onResizeColumn={onResizeColumn}
                      renderCtx={renderCtx}
                    />
                  </ColumnsContainer>
                  {!props.loading && internalRows.length === 0 && customComponents.noRowsComponent}
                  {props.loading && customComponents.loadingComponent}
                  <Window ref={windowRef}>
                    <DataContainer
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
                    </DataContainer>
                  </Window>
                </div>
                {customComponents.footerComponent || (
                  <DefaultFooter
                    ref={footerRef}
                    paginationComponent={
                      !!internalOptions.pagination &&
                      paginationProps.pageSize != null &&
                      !internalOptions.hideFooterPagination &&
                      (customComponents.paginationComponent || (
                        <Pagination
                          setPage={paginationProps.setPage}
                          currentPage={paginationProps.page}
                          pageCount={paginationProps.pageCount}
                          pageSize={paginationProps.pageSize}
                          rowCount={paginationProps.rowCount}
                          setPageSize={paginationProps.setPageSize}
                          rowsPerPageOptions={internalOptions.rowsPerPageOptions}
                        />
                      ))
                    }
                    rowCount={
                      internalOptions.rowCount == null
                        ? internalRows.length
                        : internalOptions.rowCount
                    }
                    options={internalOptions}
                  />
                )}
              </OptionsContext.Provider>
            </ApiContext.Provider>
          </ErrorBoundary>
        </GridRoot>
      )}
    </AutoSizerWrapper>
  );
});
