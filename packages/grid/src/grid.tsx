import React, { useEffect, useRef, useState } from 'react';
import { DataContainer, ColumnsContainer, Window, GridRoot } from './styled-wrappers';
import {ColumnsHeader, NoRowMessage, Viewport, AutoSizerWrapper, RenderContext, LoadingMessage} from './components';
import { useColumns, useVirtualRows, useLogger, useSelection, useApi, useRows } from './hooks';
import { Columns, DEFAULT_GRID_OPTIONS, ElementSize, GridOptions, RowsProp, GridApi } from './models';
import { debounce } from './utils';
import { useSorting } from './hooks/root/useSorting';
import { useKeyboard } from './hooks/root/useKeyboard';
import { ApiContext } from './components/api-context';
import { DATA_CONTAINER_CSS_CLASS } from './constants/cssClassesConstants';

export type GridApiRef = React.MutableRefObject<GridApi | null | undefined>;
export type GridOptionsProp = Partial<GridOptions>;

export interface GridProps {
  rows: RowsProp;
  columns: Columns;
  options?: GridOptionsProp;
  apiRef?: GridApiRef;
  loading?: boolean;
}

export const Grid: React.FC<GridProps> = React.memo(({ rows, columns, options, apiRef, loading }) => {
  const logger = useLogger('Grid');
  const gridRootRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const internalApiRef = useRef<GridApi | null | undefined>();
  const [internalOptions, setOptions] = useState<GridOptions>({
    ...DEFAULT_GRID_OPTIONS,
    ...options,
  });

  if (!apiRef) {
    apiRef = internalApiRef;
  }
  const initialised = useApi(gridRootRef, windowRef, internalOptions, apiRef);
  const internalColumns = useColumns(internalOptions, columns, apiRef);
  const internalRows = useRows(internalOptions, rows, initialised, apiRef);
  useKeyboard(initialised, apiRef);
  useSelection(internalOptions, internalRows, initialised, apiRef);
  useSorting(internalOptions, rows, columns, apiRef);

    const [renderCtx, resizeGrid] = useVirtualRows(
    colRef,
    windowRef,
    viewportRef,
    internalColumns,
    internalRows,
    internalOptions,
    apiRef,
  );

  useEffect(() => {
    setOptions({ ...DEFAULT_GRID_OPTIONS, ...options });
  }, [options]);

  const onResize = debounce((size: ElementSize) => {
    logger.info('resized...', size);
    resizeGrid();
  }, 100) as any;

  useEffect(() => {
    logger.info('canceling resize...');
    return () => onResize.cancel();
  }, []);

  logger.info(
    `Rendering, page: ${renderCtx?.page}, col: ${renderCtx?.firstColIdx}-${renderCtx?.lastColIdx}, row: ${renderCtx?.firstRowIdx}-${renderCtx?.lastRowIdx}`,
  );

  return (
    <AutoSizerWrapper onResize={onResize}>
      {size => (
        <GridRoot ref={gridRootRef} options={internalOptions} style={{ width: size.width, height: size.height }} role={'grid'}>
          <ApiContext.Provider value={apiRef}>
            <ColumnsContainer ref={colRef}>
              <ColumnsHeader
                columns={internalColumns.visible || []}
                hasScrollX={!!renderCtx?.hasScrollX}
                icons={internalOptions.icons.sortedColumns}
                headerHeight={internalOptions.headerHeight}
              />
            </ColumnsContainer>
            {!loading && internalRows.length === 0 && <NoRowMessage />}
            {loading && <LoadingMessage />}
            <Window ref={windowRef}>
              <DataContainer
                ref={gridRef}
                className={DATA_CONTAINER_CSS_CLASS}
                style={{ minHeight: renderCtx?.totalHeight, minWidth: renderCtx?.totalWidth }}
              >
                {renderCtx != null && (
                  <RenderContext.Provider value={renderCtx}>
                    <Viewport
                      ref={viewportRef}
                      options={internalOptions}
                      rows={internalRows}
                      visibleColumns={internalColumns.visible}
                    />
                  </RenderContext.Provider>
                )}
              </DataContainer>
            </Window>
          </ApiContext.Provider>
        </GridRoot>
      )}
    </AutoSizerWrapper>
  );
});

Grid.displayName = 'Grid';
