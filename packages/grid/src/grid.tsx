import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnsContainer, DataContainer, GridRoot, Window } from './components/styled-wrappers';
import { AutoSizerWrapper, ColumnsHeader, Viewport, RenderContext, LoadingOverlay, NoRowMessage } from './components';
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
} from './hooks';
import { Columns, DEFAULT_GRID_OPTIONS, ElementSize, GridOptions, RowsProp, GridApi } from './models';
import { debounce, mergeOptions } from './utils';
import { ApiContext } from './components/api-context';
import { OptionsContext } from './components/options-context';
import { GridChildrenProp } from './hooks/features/useChildren';
import { DATA_CONTAINER_CSS_CLASS } from './constants/cssClassesConstants';
import { useKeyboard } from './hooks/root/useKeyboard';
import { useSorting } from './hooks/root/useSorting';
import { DefaultFooter } from './components/default-footer';
import { Watermark } from './components/watermark';
import { useLicenseVerifier, LicenseInfo } from '@material-ui-x/license';

// This is the grid release date
// each grid version should update this const automatically when a new version of the grid is published to NPM
const RELEASE_INFO = '__RELEASE_INFO__';
export const version = '__VERSION__';
LicenseInfo.setReleaseInfo(RELEASE_INFO);

export type GridApiRef = React.MutableRefObject<GridApi | null | undefined>;
// eslint-disable-next-line react-hooks/rules-of-hooks
export const gridApiRef = (): GridApiRef => useRef<GridApi | null | undefined>();
export type GridRootRef = React.RefObject<HTMLDivElement>;
export type GridOptionsProp = Partial<GridOptions>;

export interface GridProps {
  rows: RowsProp;
  columns: Columns;
  options?: GridOptionsProp;
  apiRef?: GridApiRef;
  loading?: boolean;
  children?: GridChildrenProp;
}

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
      {size => (
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
