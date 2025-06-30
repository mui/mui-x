import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useRtl } from '@mui/system/RtlProvider';
import { RefObject } from '@mui/x-internals/types';
import { roundToDecimalPlaces } from '@mui/x-internals/math';
import { useVirtualizer } from '@mui/x-virtualizer';
import { useFirstRender } from '../utils/useFirstRender';
import { GridApiCommunity, GridPrivateApiCommunity } from '../../models/api/gridApiCommunity';
import { createSelector } from '../../utils/createSelector';
import { useGridRootProps } from '../utils/useGridRootProps';
import { useGridSelector } from '../utils/useGridSelector';
import {
  gridDimensionsSelector,
  gridContentHeightSelector,
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
import { useGridVisibleRows, getVisibleRows } from '../utils/useGridVisibleRows';
import { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { gridPaginationSelector } from '../features/pagination';
import { gridRowsMetaSelector } from '../features/rows/gridRowsMetaSelector';
import { gridRowSpanningHiddenCellsOriginMapSelector } from '../features/rows/gridRowSpanningSelectors';
import { gridListColumnSelector } from '../features/listView/gridListViewSelectors';
import { minimalContentHeight } from '../features/rows/gridRowsUtils';
import { EMPTY_PINNED_COLUMN_FIELDS, GridPinnedColumns } from '../features/columns';
import { gridFocusedVirtualCellSelector } from '../features/virtualization/gridFocusedVirtualCellSelector';
import { gridRowSelectionManagerSelector } from '../features/rowSelection';
import { DATA_GRID_PROPS_DEFAULT_VALUES } from '../../constants/dataGridPropsDefaultValues';
import { getValidRowHeight, rowHeightWarning } from '../features/rows/gridRowsUtils';
import { getTotalHeaderHeight } from '../features/columns/gridColumnsUtils';

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

/**
 * Virtualizer setup
 */
export function useGridVirtualizer(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: RootProps,
): void {
  const isRtl = useRtl();
  const { listView } = rootProps;
  const visibleColumns = useGridSelector(apiRef, () => {
    if (listView) {
      const column = gridListColumnSelector(apiRef);
      return column ? [column] : [];
    }
    return gridVisibleColumnDefinitionsSelector(apiRef);
  });

  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = listView
    ? (EMPTY_PINNED_COLUMN_FIELDS as unknown as GridPinnedColumns)
    : gridVisiblePinnedColumnDefinitionsSelector(apiRef);

  const rowSelectionManager = useGridSelector(apiRef, gridRowSelectionManagerSelector);
  const isRowSelected = (id: any) =>
    rowSelectionManager.has(id) && apiRef.current.isRowSelectable(id);

  const currentPage = useGridVisibleRows(apiRef);

  const hasColSpan = useGridSelector(apiRef, gridHasColSpanSelector);

  /* TODO: extract dimensions code */
  const contentHeight = useGridSelector(apiRef, gridContentHeightSelector);
  const needsHorizontalScrollbar = useGridSelector(apiRef, needsHorizontalScrollbarSelector);
  const verticalScrollbarWidth = useGridSelector(apiRef, gridVerticalScrollbarWidthSelector);
  const hasFiller = useGridSelector(apiRef, gridHasFillerSelector);
  const { autoHeight } = rootProps;

  const focusedVirtualCell = useGridSelector(apiRef, gridFocusedVirtualCellSelector);

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

  const dimensions = {
    rowHeight,
    headerHeight,
    groupHeaderHeight,
    headerFilterHeight,
    columnsTotalWidth,
    headersTotalHeight,
    leftPinnedWidth,
    rightPinnedWidth,
  };

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

  const virtualizer = useVirtualizer({
    scrollbarSize: rootProps.scrollbarSize,
    dimensions,

    initialState: {
      scroll: rootProps.initialState?.scroll,
      dimensions: apiRef.current.state.dimensions,
      virtualization: apiRef.current.state.virtualization,
    },
    isRtl,
    rows: currentPage.rows,
    range: currentPage.range,
    rowIdToIndexMap: currentPage.rowIdToIndexMap,
    rowCount,
    columns: visibleColumns,
    pinnedRows,
    pinnedColumns,
    refs: {
      container: apiRef.current.mainElementRef,
      scroller: apiRef.current.virtualScrollerRef,
      scrollbarVertical: apiRef.current.virtualScrollbarVerticalRef,
      scrollbarHorizontal: apiRef.current.virtualScrollbarHorizontalRef,
    },
    hasColSpan,

    contentHeight,
    minimalContentHeight,
    needsHorizontalScrollbar: needsHorizontalScrollbar && !listView,
    autoHeight,
    getRowHeight,
    getEstimatedRowHeight: React.useMemo(
      () =>
        getEstimatedRowHeight
          ? (rowEntry) => getEstimatedRowHeight({ ...rowEntry, densityFactor: density })
          : undefined,
      [getEstimatedRowHeight],
    ),
    getRowSpacing: React.useMemo(
      () =>
        getRowSpacing
          ? (rowEntry, visibility) =>
              getRowSpacing({
                ...rowEntry,
                ...visibility,
                indexRelativeToCurrentPage: apiRef.current.getRowIndexRelativeToVisibleRows(
                  rowEntry.id,
                ),
              })
          : undefined,
      [getRowSpacing],
    ),
    applyRowHeight: (entry, row) =>
      apiRef.current.unstable_applyPipeProcessors('rowHeight', entry, row),

    focusedCell: focusedVirtualCell,
    rowBufferPx: rootProps.rowBufferPx,
    columnBufferPx: rootProps.columnBufferPx,

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

    fixme: {
      focusedVirtualCell: () => gridFocusedVirtualCellSelector(apiRef),
      inputs: (enabledForRows, enabledForColumns) =>
        inputsSelector(apiRef, rootProps, enabledForRows, enabledForColumns),

      calculateColSpan: (params) => apiRef.current.calculateColSpan(params as any),

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
          visibleColumns={params.columns as any}
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
    },
  });

  // HACK: Keep the grid's store in sync with the virtualizer store. We set up the
  // subscription in the render phase rather than in an effect because other grid
  // initialization code runs between those two moments.
  //
  // TODO(v9): Remove this
  const disposeRef = React.useRef<Function>(null);
  useFirstRender(() => {
    apiRef.current.store.state = virtualizer.store.state.dimensions;
    apiRef.current.store.state = virtualizer.store.state.rowsMeta;
    apiRef.current.store.state = virtualizer.store.state.virtualization;

    disposeRef.current = virtualizer.store.subscribe((state) => {
      if (state.dimensions !== apiRef.current.state.dimensions) {
        apiRef.current.setState((gridState) => ({
          ...gridState,
          dimensions: state.dimensions,
        }));
      }
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
  });
  // XXX: We don't cleanup because there are async issues with the autosizing promise
  // code in testing. This could cause a memory leak.
  // useOnMount(() => () => { disposeRef.current?.(); });

  apiRef.current.register('private', {
    virtualizer,
  });
}

function needsHorizontalScrollbarSelector(apiRef: RefObject<GridApiCommunity>) {
  return (
    apiRef.current.state.dimensions.viewportOuterSize.width > 0 &&
    apiRef.current.state.dimensions.columnsTotalWidth >
      apiRef.current.state.dimensions.viewportOuterSize.width
  );
}

type RenderContextInputs = {
  enabledForRows: boolean;
  enabledForColumns: boolean;
  apiRef: RefObject<GridPrivateApiCommunity>;
  autoHeight: boolean;
  rowBufferPx: number;
  columnBufferPx: number;
  leftPinnedWidth: number;
  columnsTotalWidth: number;
  viewportInnerWidth: number;
  viewportInnerHeight: number;
  lastRowHeight: number;
  lastColumnWidth: number;
  rowsMeta: ReturnType<typeof gridRowsMetaSelector>;
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
  rows: ReturnType<typeof useGridVisibleRows>['rows'];
  range: ReturnType<typeof useGridVisibleRows>['range'];
  pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;
  columns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>;
  hiddenCellsOriginMap: ReturnType<typeof gridRowSpanningHiddenCellsOriginMapSelector>;
  listView: boolean;
  virtualizeColumnsWithAutoRowHeight: DataGridProcessedProps['virtualizeColumnsWithAutoRowHeight'];
};

function inputsSelector(
  apiRef: RefObject<GridPrivateApiCommunity>,
  rootProps: ReturnType<typeof useGridRootProps>,
  enabledForRows: boolean,
  enabledForColumns: boolean,
): RenderContextInputs {
  const dimensions = gridDimensionsSelector(apiRef);
  const currentPage = getVisibleRows(apiRef, rootProps);
  const columns = rootProps.listView
    ? [gridListColumnSelector(apiRef)!]
    : gridVisibleColumnDefinitionsSelector(apiRef);
  const hiddenCellsOriginMap = gridRowSpanningHiddenCellsOriginMapSelector(apiRef);
  const lastRowId = apiRef.current.state.rows.dataRowIds.at(-1);
  const lastColumn = columns.at(-1);
  return {
    enabledForRows,
    enabledForColumns,
    apiRef,
    autoHeight: rootProps.autoHeight,
    rowBufferPx: rootProps.rowBufferPx,
    columnBufferPx: rootProps.columnBufferPx,
    leftPinnedWidth: dimensions.leftPinnedWidth,
    columnsTotalWidth: dimensions.columnsTotalWidth,
    viewportInnerWidth: dimensions.viewportInnerSize.width,
    viewportInnerHeight: dimensions.viewportInnerSize.height,
    lastRowHeight: lastRowId !== undefined ? apiRef.current.unstable_getRowHeight(lastRowId) : 0,
    lastColumnWidth: lastColumn?.computedWidth ?? 0,
    rowsMeta: gridRowsMetaSelector(apiRef),
    columnPositions: gridColumnPositionsSelector(apiRef),
    rows: currentPage.rows,
    range: currentPage.range,
    pinnedColumns: gridVisiblePinnedColumnDefinitionsSelector(apiRef),
    columns,
    hiddenCellsOriginMap,
    listView: rootProps.listView ?? false,
    virtualizeColumnsWithAutoRowHeight: rootProps.virtualizeColumnsWithAutoRowHeight,
  };
}
