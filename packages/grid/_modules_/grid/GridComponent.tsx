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
  Pagination,
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

/**
 * Data Grid component implementing [[GridComponentProps]].
 * @returns JSX.Element
 */
export const GridComponent = React.forwardRef<HTMLDivElement, GridComponentProps>(function DataGrid(
  props,
  ref,
) {
  const [internalOptions, setInternalOptions] = useOptionsProp(props);
  useLoggerFactory(internalOptions?.logger, internalOptions?.logLevel);
  const gridLogger = useLogger('Material-UI Data Grid');

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

  const initialised = useApi(rootContainerRef, apiRef);

  const errorHandler = (args: any) => {
    // We are handling error here, to set up the handler as early as possible and be able to catch error thrown at init time.
    setErrorState(args);
  };
  React.useEffect(() => apiRef!.current.subscribeEvent(COMPONENT_ERROR, errorHandler), [apiRef]);

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
      if (size.height === 0) {
        gridLogger.warn(
          [
            'The parent of the grid has an empty height.',
            'You need to make sure the container has an intrinsic height.',
            'The grid displays with a height of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://material-ui.com/components/data-grid/rendering/#layout',
          ].join('\n'),
        );
      }
      if (size.width === 0) {
        gridLogger.warn(
          [
            'The parent of the grid has an empty width.',
            'You need to make sure the container has an intrinsic width.',
            'The grid displays with a width of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://material-ui.com/components/data-grid/rendering/#layout',
          ].join('\n'),
        );
      }

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
    <AutoSizer onResize={debouncedOnResize}>
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
                      onResizeColumn={onResizeColumn}
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
    </AutoSizer>
  );
});
