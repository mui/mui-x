import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsContainer, DataContainer, GridRoot, Window } from '@material-ui/x-grid-modules';
import {
  AutoSizerWrapper,
  ColumnsHeader,
  Viewport,
  RenderContext,
  LoadingOverlay,
  NoRowMessage,
  ApiContext,
  OptionsContext,
  DefaultFooter,
} from '@material-ui/x-grid-modules';
import {
  useColumns,
  useLogger,
  useApi,
  useLoggerFactory,
  useRows,
  useVirtualRows,
  useColumnResize,
  useSelection,
  usePagination,
  useChildren,
  useSorting,
  useKeyboard,
} from '@material-ui/x-grid-modules';
import { DEFAULT_GRID_OPTIONS, ElementSize, GridOptions, GridApi } from '@material-ui/x-grid-modules';
import { debounce, mergeOptions } from '@material-ui/x-grid-modules';
import { DATA_CONTAINER_CSS_CLASS } from '@material-ui/x-grid-modules';
import { useLicenseVerifier } from '@material-ui/x-license';
import { GridRootRef } from '@material-ui/x-grid-modules';
import { GridProps } from './gridProps';
import { Watermark } from './components/watermark';

export const Grid: React.FC<GridProps> = React.memo(({ rows, columns, options, apiRef, loading, children }) => {
  useLoggerFactory(options?.logger, options?.logLevel);
  const licenseStatus = useLicenseVerifier();
  const logger = useLogger('Grid');
  const gridRootRef: GridRootRef = useRef<HTMLDivElement>(null);
  const columnsHeaderRef = useRef<HTMLDivElement>(null);
  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const renderingZoneRef = useRef<HTMLDivElement>(null);
  const internalApiRef = useRef<GridApi | null | undefined>();

  const [internalOptions, setInternalOptions] = useState<GridOptions>(mergeOptions(DEFAULT_GRID_OPTIONS, options));
  useEffect(() => {
    setInternalOptions(previousState => mergeOptions(previousState, options));
  }, [options]);

  if (!apiRef) {
    apiRef = internalApiRef;
  }

  const initialised = useApi(gridRootRef, windowRef, internalOptions, apiRef);
  const internalColumns = useColumns(internalOptions, columns, apiRef);
  const internalRows = useRows(internalOptions, rows, initialised, apiRef);
  useKeyboard(internalOptions, initialised, apiRef);
  useSelection(internalOptions, rows, initialised, apiRef);
  useSorting(internalOptions, rows, columns, apiRef);

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

  useEffect(() => {
    setInternalOptions(previousState => {
      if (previousState.paginationPageSize !== paginationProps.pageSize) {
        return { ...previousState, paginationPageSize: paginationProps.pageSize };
      }
      return previousState;
    });
  }, [paginationProps.pageSize, setInternalOptions]);

  const [footerChildNode, headerChildNode] = useChildren(
    internalColumns,
    internalRows,
    internalOptions,
    paginationProps,
    apiRef,
    gridRootRef,
    children,
  );

  const onResize = useCallback(
    (size: ElementSize) => {
      logger.info('resized...', size);
      if (apiRef && apiRef.current) {
        apiRef.current.resize();
      }
    },
    [logger, apiRef],
  );
  const debouncedOnResize = useMemo(() => debounce(onResize, 100), [onResize]) as any;

  useEffect(() => {
    return () => {
      logger.info('canceling resize...');
      debouncedOnResize.cancel();
    };
  }, [logger, debouncedOnResize]);

  logger.info(
    `Rendering, page: ${renderCtx?.page}, col: ${renderCtx?.firstColIdx}-${renderCtx?.lastColIdx}, row: ${renderCtx?.firstRowIdx}-${renderCtx?.lastRowIdx}`,
    renderCtx,
  );

  const loadingComponent = useMemo(
    () => (internalOptions.loadingOverlayComponent ? internalOptions.loadingOverlayComponent : <LoadingOverlay />),
    [internalOptions.loadingOverlayComponent],
  );
  const noRowsComponent = useMemo(
    () => (internalOptions.noRowsOverlayComponent ? internalOptions.noRowsOverlayComponent : <NoRowMessage />),
    [internalOptions.noRowsOverlayComponent],
  );

  return (
    <AutoSizerWrapper onResize={debouncedOnResize}>
      {(size: any) => (
        <GridRoot
          ref={gridRootRef}
          options={internalOptions}
          style={{ width: size.width, height: size.height }}
          role={'grid'}
          aria-colcount={internalColumns.visible.length}
          aria-rowcount={internalRows.length + 1}
          tabIndex={0}
          aria-label={'Grid'}
          aria-multiselectable={internalOptions.enableMultipleSelection}
        >
          <ApiContext.Provider value={apiRef}>
            <OptionsContext.Provider value={internalOptions}>
              {headerChildNode}
              <div className={'main-grid-container'}>
                <Watermark licenseStatus={licenseStatus} />
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
                {!loading && internalRows.length === 0 && noRowsComponent}
                {loading && loadingComponent}
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
              <DefaultFooter
                paginationProps={paginationProps}
                rowCount={internalRows.length}
                options={internalOptions}
              />
              {footerChildNode}
            </OptionsContext.Provider>
          </ApiContext.Provider>
        </GridRoot>
      )}
    </AutoSizerWrapper>
  );
});

Grid.displayName = 'Grid';
