import React, { useEffect, useRef, useState } from 'react';
import { DataContainer, ColumnsContainer, Window, GridRoot } from './styled-wrappers';
import { ColumnsHeader, NoRowMessage, Viewport, AutoSizerWrapper, RenderContext, LoadingMessage } from './components';
import { useColumns, useVirtualRows, useLogger, useSelection, useApi, useRows } from './hooks';
import { Columns, DEFAULT_GRID_OPTIONS, ElementSize, GridOptions, RowsProp, GridApi } from './models';
import { debounce } from './utils';
import { useSorting } from './hooks/root/useSorting';
import { useKeyboard } from './hooks/root/useKeyboard';
import { ApiContext } from './components/api-context';
import { DATA_CONTAINER_CSS_CLASS } from './constants/cssClassesConstants';
import { useColumnResize } from './hooks/features/useColumnResize';

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
  const columnsHeaderRef = useRef<HTMLDivElement>(null);
  const columnsContainerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const renderingZoneRef = useRef<HTMLDivElement>(null);
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
  useSelection(internalOptions, rows, initialised, apiRef);
  useSorting(internalOptions, rows, columns, apiRef);

  const [renderCtx, resizeGrid] = useVirtualRows(
    columnsHeaderRef,
    windowRef,
    renderingZoneRef,
    internalColumns,
    internalRows,
    internalOptions,
    apiRef,
  );

  const onResizeColumn = useColumnResize(columnsHeaderRef, apiRef, internalOptions.headerHeight);

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
            <ColumnsContainer ref={columnsContainerRef}>
              <ColumnsHeader
                ref={columnsHeaderRef}
                columns={internalColumns.visible || []}
                hasScrollX={!!renderCtx?.hasScrollX}
                icons={internalOptions.icons.sortedColumns}
                headerHeight={internalOptions.headerHeight}
                onResizeColumn={onResizeColumn}
                renderCtx={renderCtx}
              />
            </ColumnsContainer>
            {!loading && internalRows.length === 0 && <NoRowMessage />}
            {loading && <LoadingMessage />}
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
          </ApiContext.Provider>
        </GridRoot>
      )}
    </AutoSizerWrapper>
  );
});

Grid.displayName = 'Grid';
