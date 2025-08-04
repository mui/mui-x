import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRtl } from '@mui/system/RtlProvider';
import { RefObject } from '@mui/x-internals/types';
import { roundToDecimalPlaces } from '@mui/x-internals/math';
import { lruMemoize } from '@mui/x-internals/lruMemoize';
import { useStoreEffect } from '@mui/x-internals/store';
import { useVirtualizer, Dimensions } from '@mui/x-virtualizer';
import { useFirstRender } from '../utils/useFirstRender';
import { GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';
import { GridStateColDef } from '../../models/colDef/gridColDef';
import { createSelector } from '../../utils/createSelector';
import { useGridSelector } from '../utils/useGridSelector';
import {
  gridHasFillerSelector,
  gridVerticalScrollbarWidthSelector,
} from '../features/dimensions/gridDimensionsSelectors';
import { gridDensityFactorSelector } from '../features/density';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  gridHasColSpanSelector,
} from '../features/columns/gridColumnsSelector';
import { gridPinnedRowsSelector, gridRowCountSelector } from '../features/rows/gridRowsSelector';
import { useGridVisibleRows } from '../utils/useGridVisibleRows';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { gridPaginationSelector } from '../features/pagination';
import { gridFocusedVirtualCellSelector } from '../features/virtualization/gridFocusedVirtualCellSelector';
import { gridRowSelectionManagerSelector } from '../features/rowSelection';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../constants/dataGridPropsDefaultValues';
import {
  getValidRowHeight,
  minimalContentHeight,
  rowHeightWarning,
} from '../features/rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../features/columns/gridColumnsUtils';

function identity<T>(x: T) {
  return x;
}

type RootProps = DataGridProcessedProps;

const columnsTotalWidthSelector = createSelector(
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
  (visibleColumns, positions) => {
    const colCount = visibleColumns.length;
    if (colCount === 0) {
      return 0;
    }
    return roundToDecimalPlaces(
      positions[colCount - 1] + visibleColumns[colCount - 1].computedWidth,
      1,
    );
  },
);

/** Translates virtualizer state to grid state */
const addGridDimensionsCreator = () =>
  lruMemoize(
    (
      dimensions: Dimensions.State['dimensions'],
      headerHeight: number,
      groupHeaderHeight: number,
      headerFilterHeight: number,
      headersTotalHeight: number,
    ) => {
      return {
        ...dimensions,
        headerHeight,
        groupHeaderHeight,
        headerFilterHeight,
        headersTotalHeight,
      };
    },
    { maxSize: 1 },
  );

/**
 * Virtualizer setup
 */
export function useGridVirtualizer(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: RootProps,
): void {
  const isRtl = useRtl();
  const { listView } = rootProps;
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);

  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = gridVisiblePinnedColumnDefinitionsSelector(apiRef);

  const rowSelectionManager = useGridSelector(apiRef, gridRowSelectionManagerSelector);
  const isRowSelected = (id: any) =>
    rowSelectionManager.has(id) && apiRef.current.isRowSelectable(id);

  const currentPage = useGridVisibleRows(apiRef);

  const hasColSpan = useGridSelector(apiRef, gridHasColSpanSelector);

  const verticalScrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
  const hasFiller = useGridSelector(apiRef, gridHasFillerSelector);
  const { autoHeight } = rootProps;

  const scrollReset = listView;

  // <DIMENSIONS>
  const density = useGridSelector(apiRef, gridDensityFactorSelector);

  const baseRowHeight = getValidRowHeight(
    rootProps.rowHeight,
    DATA_GRID_PROPS_DEFAULT_VALUES.rowHeight,
    rowHeightWarning,
  );
  const rowHeight = Math.floor(baseRowHeight * density);
  const headerHeight = Math.floor(rootProps.columnHeaderHeight * density);
  const groupHeaderHeight = Math.floor(
    (rootProps.columnGroupHeaderHeight ?? rootProps.columnHeaderHeight) * density,
  );
  const headerFilterHeight = Math.floor(
    (rootProps.headerFilterHeight ?? rootProps.columnHeaderHeight) * density,
  );
  const columnsTotalWidth = useGridSelector(apiRef, columnsTotalWidthSelector);
  const headersTotalHeight = getTotalHeaderHeight(apiRef, rootProps);

  const leftPinnedWidth = pinnedColumns.left.reduce((w, col) => w + col.computedWidth, 0);
  const rightPinnedWidth = pinnedColumns.right.reduce((w, col) => w + col.computedWidth, 0);

  const dimensionsParams = {
    rowHeight,
    headerHeight,
    columnsTotalWidth,
    leftPinnedWidth,
    rightPinnedWidth,
    topPinnedHeight: headersTotalHeight,
    bottomPinnedHeight: 0,
    scrollbarSize: rootProps.scrollbarSize,
  };

  const addGridDimensions = useLazyRef(addGridDimensionsCreator).current;

  // </DIMENSIONS>

  // <ROWS_META>
  const dataRowCount = useGridSelector(apiRef, gridRowCountSelector);
  const pagination = useGridSelector(apiRef, gridPaginationSelector);
  const rowCount = Math.min(
    pagination.enabled ? pagination.paginationModel.pageSize : dataRowCount,
    dataRowCount,
  );
  const { getRowHeight, getEstimatedRowHeight, getRowSpacing } = rootProps;
  // </ROWS_META>

  const focusedVirtualCell = useGridSelector(apiRef, gridFocusedVirtualCellSelector);

  const virtualizer = useVirtualizer({
    refs: {
      container: apiRef.current.mainElementRef,
      scroller: apiRef.current.virtualScrollerRef,
      scrollbarVertical: apiRef.current.virtualScrollbarVerticalRef,
      scrollbarHorizontal: apiRef.current.virtualScrollbarHorizontalRef,
    },

    dimensions: dimensionsParams,
    virtualization: {
      isRtl,
      rowBufferPx: rootProps.rowBufferPx,
      columnBufferPx: rootProps.columnBufferPx,
    },
    colspan: {
      enabled: hasColSpan,
      getColspan: (rowId, column) => {
        if (typeof column.colSpan === 'function') {
          const row = apiRef.current.getRow(rowId);
          const value = apiRef.current.getRowValue(row, column as GridStateColDef);
          return column.colSpan(value, row, column, apiRef) ?? 0;
        }
        return column.colSpan ?? 1;
      },
    },

    initialState: {
      scroll: rootProps.initialState?.scroll,
      rowSpanning: apiRef.current.state.rowSpanning,
      virtualization: apiRef.current.state.virtualization,
    },
    rows: currentPage.rows,
    range: currentPage.range,
    rowCount,
    columns: visibleColumns,
    pinnedRows,
    pinnedColumns,

    autoHeight,
    minimalContentHeight,
    getRowHeight: React.useMemo(() => {
      if (!getRowHeight) {
        return undefined;
      }
      return (rowEntry) => getRowHeight({ ...rowEntry, densityFactor: density });
    }, [getRowHeight, density]),
    getEstimatedRowHeight: React.useMemo(
      () =>
        getEstimatedRowHeight
          ? (rowEntry) => getEstimatedRowHeight({ ...rowEntry, densityFactor: density })
          : undefined,
      [getEstimatedRowHeight, density],
    ),
    getRowSpacing: React.useMemo(
      () =>
        getRowSpacing
          ? (rowEntry) => {
              const indexRelativeToCurrentPage = currentPage.rowIdToIndexMap.get(rowEntry.id) ?? -1;

              const visibility = {
                isFirstVisible: indexRelativeToCurrentPage === 0,
                isLastVisible: indexRelativeToCurrentPage === currentPage.rows.length - 1,
                indexRelativeToCurrentPage,
              };

              return getRowSpacing({
                ...rowEntry,
                ...visibility,
                indexRelativeToCurrentPage: apiRef.current.getRowIndexRelativeToVisibleRows(
                  rowEntry.id,
                ),
              });
            }
          : undefined,
      [apiRef, getRowSpacing, currentPage.rows, currentPage.rowIdToIndexMap],
    ),
    applyRowHeight: useEventCallback((entry, row) =>
      apiRef.current.unstable_applyPipeProcessors('rowHeight', entry, row),
    ),
    virtualizeColumnsWithAutoRowHeight: rootProps.virtualizeColumnsWithAutoRowHeight,

    focusedVirtualCell: useEventCallback(() => focusedVirtualCell),

    resizeThrottleMs: rootProps.resizeThrottleMs,
    onResize: useEventCallback((size) => apiRef.current.publishEvent('resize', size)),
    onWheel: useEventCallback((event: React.WheelEvent) => {
      apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
    }),
    onTouchMove: useEventCallback((event: React.TouchEvent) => {
      apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
    }),
    onRenderContextChange: useEventCallback((nextRenderContext) => {
      apiRef.current.publishEvent('renderedRowsIntervalChange', nextRenderContext);
    }),
    onScrollChange: (scrollPosition, nextRenderContext) => {
      apiRef.current.publishEvent('scrollPositionChange', {
        top: scrollPosition.top,
        left: scrollPosition.left,
        renderContext: nextRenderContext,
      });
    },

    scrollReset,

    renderRow: (params) => (
      <rootProps.slots.row
        key={params.id}
        row={params.model}
        rowId={params.id}
        index={params.rowIndex}
        selected={isRowSelected(params.id)}
        offsetLeft={params.offsetLeft}
        columnsTotalWidth={columnsTotalWidth}
        rowHeight={params.baseRowHeight}
        pinnedColumns={pinnedColumns}
        visibleColumns={visibleColumns}
        firstColumnIndex={params.firstColumnIndex}
        lastColumnIndex={params.lastColumnIndex}
        focusedColumnIndex={params.focusedColumnIndex}
        isFirstVisible={params.isFirstVisible}
        isLastVisible={params.isLastVisible}
        isNotVisible={params.isVirtualFocusRow}
        showBottomBorder={params.showBottomBorder}
        scrollbarWidth={verticalScrollbarWidth}
        gridHasFiller={hasFiller}
        {...rootProps.slotProps?.row}
      />
    ),

    renderInfiniteLoadingTrigger: (id) =>
      (apiRef as any).current.getInfiniteLoadingTriggerElement?.({ lastRowId: id }),
  });

  // HACK: Keep the grid's store in sync with the virtualizer store. We set up the
  // subscription in the render phase rather than in an effect because other grid
  // initialization code runs between those two moments.
  //
  // TODO(v9): Remove this
  useFirstRender(() => {
    apiRef.current.store.state.dimensions = addGridDimensions(
      virtualizer.store.state.dimensions,
      headerHeight,
      groupHeaderHeight,
      headerFilterHeight,
      headersTotalHeight,
    );
    apiRef.current.store.state.rowsMeta = virtualizer.store.state.rowsMeta;
    apiRef.current.store.state.virtualization = virtualizer.store.state.virtualization;
  });

  useStoreEffect(virtualizer.store, Dimensions.selectors.dimensions, (_, dimensions) => {
    apiRef.current.setState((gridState) => ({
      ...gridState,
      dimensions: addGridDimensions(
        dimensions,
        headerHeight,
        groupHeaderHeight,
        headerFilterHeight,
        headersTotalHeight,
      ),
    }));
  });

  useStoreEffect(virtualizer.store, identity, (_, state) => {
    if (state.rowsMeta !== apiRef.current.state.rowsMeta) {
      apiRef.current.setState((gridState) => ({
        ...gridState,
        rowsMeta: state.rowsMeta,
      }));
    }
    if (state.virtualization !== apiRef.current.state.virtualization) {
      apiRef.current.setState((gridState) => ({
        ...gridState,
        virtualization: state.virtualization,
      }));
    }
  });

  apiRef.current.register('private', {
    virtualizer,
  });
}
