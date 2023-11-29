import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { useTheme } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import { useLazyRef } from '../../utils/useLazyRef';
import { useResizeObserver } from '../../../hooks/utils/useResizeObserver';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnsTotalWidthSelector,
  gridColumnPositionsSelector,
} from '../columns/gridColumnsSelector';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';
import { GridPinnedRowsPosition } from '../rows/gridRowsInterfaces';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';
import { useGridVisibleRows } from '../../utils/useGridVisibleRows';
import { clamp } from '../../../utils/utils';
import { GridRenderContext, GridRowEntry, GridRowId } from '../../../models';
import { selectedIdsLookupSelector } from '../rowSelection/gridRowSelectionSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { getFirstNonSpannedColumnToRender } from '../columns/gridColumnsUtils';
import { getMinimalContentHeight } from '../rows/gridRowsUtils';
import { GridRowProps } from '../../../components/GridRow';
import {
  gridVirtualizationEnabledSelector,
  gridVirtualizationColumnEnabledSelector,
} from './gridVirtualizationSelectors';

// Uses binary search to avoid looping through all possible positions
export function binarySearch(
  offset: number,
  positions: number[],
  sliceStart = 0,
  sliceEnd = positions.length,
): number {
  if (positions.length <= 0) {
    return -1;
  }

  if (sliceStart >= sliceEnd) {
    return sliceStart;
  }

  const pivot = sliceStart + Math.floor((sliceEnd - sliceStart) / 2);
  const itemOffset = positions[pivot];
  return offset <= itemOffset
    ? binarySearch(offset, positions, sliceStart, pivot)
    : binarySearch(offset, positions, pivot + 1, sliceEnd);
}

function exponentialSearch(offset: number, positions: number[], index: number): number {
  let interval = 1;

  while (index < positions.length && Math.abs(positions[index]) < offset) {
    index += interval;
    interval *= 2;
  }

  return binarySearch(offset, positions, Math.floor(index / 2), Math.min(index, positions.length));
}

export const getIndexesToRender = ({
  firstIndex,
  lastIndex,
  buffer,
  minFirstIndex,
  maxLastIndex,
}: {
  firstIndex: number;
  lastIndex: number;
  buffer: number;
  minFirstIndex: number;
  maxLastIndex: number;
}) => {
  return [
    clamp(firstIndex - buffer, minFirstIndex, maxLastIndex),
    clamp(lastIndex + buffer, minFirstIndex, maxLastIndex),
  ];
};

export const areRenderContextsEqual = (
  context1: GridRenderContext,
  context2: GridRenderContext,
) => {
  if (context1 === context2) {
    return true;
  }
  return (
    context1.firstRowIndex === context2.firstRowIndex &&
    context1.lastRowIndex === context2.lastRowIndex &&
    context1.firstColumnIndex === context2.firstColumnIndex &&
    context1.lastColumnIndex === context2.lastColumnIndex
  );
};

const EMPTY_RENDER_CONTEXT = {
  firstRowIndex: 0,
  lastRowIndex: 0,
  firstColumnIndex: 0,
  lastColumnIndex: 0,
};

export const EMPTY_PINNED_COLUMNS = {
  left: [] as GridStateColDef[],
  right: [] as GridStateColDef[],
};

export const EMPTY_DETAIL_PANELS = Object.freeze(new Map<GridRowId, React.ReactNode>());

export type VirtualScroller = ReturnType<typeof useGridVirtualScroller>;

export const useGridVirtualScroller = () => {
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const enabled = useGridSelector(apiRef, gridVirtualizationEnabledSelector);
  const enabledForColumns = useGridSelector(apiRef, gridVirtualizationColumnEnabledSelector);
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const outerSize = dimensions.viewportOuterSize;
  const innerSize = dimensions.viewportInnerSize;
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const hasTopPinnedRows = pinnedRows.top.length > 0;
  const hasBottomPinnedRows = pinnedRows.bottom.length > 0;
  const [panels, setPanels] = React.useState(EMPTY_DETAIL_PANELS);

  const theme = useTheme();
  const columnPositions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const columnsTotalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const selectedRowsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const gridRootRef = apiRef.current.rootElementRef;
  const mainRef = apiRef.current.mainElementRef;
  const scrollerRef = apiRef.current.virtualScrollerRef;
  const renderZoneRef = React.useRef<HTMLDivElement>(null);
  const scrollbarVerticalRef = React.useRef<HTMLDivElement>(null);
  const scrollbarHorizontalRef = React.useRef<HTMLDivElement>(null);
  const contentHeight = dimensions.contentSize.height;

  useResizeObserver(mainRef, () => apiRef.current.resize());

  const [renderContext, setRenderContext] = React.useState(EMPTY_RENDER_CONTEXT);
  const [realRenderContext, setRealRenderContext] = React.useState(EMPTY_RENDER_CONTEXT);
  const prevRenderContext = React.useRef(renderContext);
  const scrollPosition = React.useRef({ top: 0, left: 0 }).current;
  const prevTotalWidth = React.useRef(columnsTotalWidth);

  const getRenderedColumns = useLazyRef(createGetRenderedColumns).current;

  const getRenderContext = () => realRenderContext;

  const indexOfRowWithFocusedCell = React.useMemo<number>(() => {
    if (cellFocus !== null) {
      return currentPage.rows.findIndex((row) => row.id === cellFocus.id);
    }
    return -1;
  }, [cellFocus, currentPage.rows]);

  const indexOfColumnWithFocusedCell = React.useMemo<number>(() => {
    if (cellFocus !== null) {
      return visibleColumns.findIndex((column) => column.field === cellFocus.field);
    }
    return -1;
  }, [cellFocus, visibleColumns]);

  const getNearestIndexToRender = React.useCallback(
    (offset: number) => {
      const lastMeasuredIndexRelativeToAllRows = apiRef.current.getLastMeasuredRowIndex();
      let allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
      if (currentPage.range?.lastRowIndex && !allRowsMeasured) {
        // Check if all rows in this page are already measured
        allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= currentPage.range.lastRowIndex;
      }

      const lastMeasuredIndexRelativeToCurrentPage = clamp(
        lastMeasuredIndexRelativeToAllRows - (currentPage.range?.firstRowIndex || 0),
        0,
        rowsMeta.positions.length,
      );

      if (allRowsMeasured || rowsMeta.positions[lastMeasuredIndexRelativeToCurrentPage] >= offset) {
        // If all rows were measured (when no row has "auto" as height) or all rows before the offset
        // were measured, then use a binary search because it's faster.
        return binarySearch(offset, rowsMeta.positions);
      }

      // Otherwise, use an exponential search.
      // If rows have "auto" as height, their positions will be based on estimated heights.
      // In this case, we can skip several steps until we find a position higher than the offset.
      // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
      return exponentialSearch(offset, rowsMeta.positions, lastMeasuredIndexRelativeToCurrentPage);
    },
    [apiRef, currentPage.range?.firstRowIndex, currentPage.range?.lastRowIndex, rowsMeta.positions],
  );

  const computeRenderContext = React.useCallback(() => {
    if (!enabled) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length,
      };
    }

    const { top, left } = scrollPosition;

    // Clamp the value because the search may return an index out of bounds.
    // In the last index, this is not needed because Array.slice doesn't include it.
    const firstRowIndex = Math.min(getNearestIndexToRender(top), rowsMeta.positions.length - 1);

    const lastRowIndex = rootProps.autoHeight
      ? firstRowIndex + currentPage.rows.length
      : getNearestIndexToRender(top + innerSize.height);

    let firstColumnIndex = 0;
    let lastColumnIndex = columnPositions.length;

    if (enabledForColumns) {
      let hasRowWithAutoHeight = false;

      const [firstRowToRender, lastRowToRender] = getIndexesToRender({
        firstIndex: firstRowIndex,
        lastIndex: lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer,
      });

      for (let i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
        const row = currentPage.rows[i];
        hasRowWithAutoHeight = apiRef.current.rowHasAutoHeight(row.id);
      }

      if (!hasRowWithAutoHeight) {
        firstColumnIndex = binarySearch(Math.abs(left), columnPositions);
        lastColumnIndex = binarySearch(Math.abs(left) + innerSize.width, columnPositions);
      }
    }

    return {
      firstRowIndex,
      lastRowIndex,
      firstColumnIndex,
      lastColumnIndex,
    };
  }, [
    enabled,
    enabledForColumns,
    getNearestIndexToRender,
    rowsMeta.positions.length,
    rootProps.autoHeight,
    rootProps.rowBuffer,
    currentPage.rows,
    columnPositions,
    visibleColumns.length,
    apiRef,
    innerSize,
  ]);

  const computeRealRenderContext = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      const [firstRowToRender, lastRowToRender] = getIndexesToRender({
        firstIndex: nextRenderContext.firstRowIndex,
        lastIndex: nextRenderContext.lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: currentPage.rows.length,
        buffer: rootProps.rowBuffer,
      });

      const [initialFirstColumnToRender, lastColumnToRender] = getIndexesToRender({
        firstIndex: nextRenderContext.firstColumnIndex,
        lastIndex: nextRenderContext.lastColumnIndex,
        minFirstIndex: pinnedColumns.left.length,
        maxLastIndex: visibleColumns.length - pinnedColumns.right.length,
        buffer: rootProps.columnBuffer,
      });

      const firstColumnToRender = getFirstNonSpannedColumnToRender({
        firstColumnToRender: initialFirstColumnToRender,
        apiRef,
        firstRowToRender,
        lastRowToRender,
        visibleRows: currentPage.rows,
      });

      return {
        firstRowIndex: firstRowToRender,
        lastRowIndex: lastRowToRender,
        firstColumnIndex: firstColumnToRender,
        lastColumnIndex: lastColumnToRender,
      };
    },
    [visibleColumns.length, rootProps.rowBuffer, rootProps.columnBuffer, currentPage.rows],
  );

  const updateRenderZonePosition = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      const direction = theme.direction === 'ltr' ? 1 : -1;
      const columnPositions = gridColumnPositionsSelector(apiRef);

      const top = gridRowsMetaSelector(apiRef.current.state).positions[
        nextRenderContext.firstRowIndex
      ];
      const left =
        direction * columnPositions[nextRenderContext.firstColumnIndex] -
        columnPositions[pinnedColumns.left.length];

      gridRootRef.current!.style.setProperty('--DataGrid-offsetTop', `${top}px`);
      gridRootRef.current!.style.setProperty('--DataGrid-offsetLeft', `${left}px`);
    },
    [apiRef, computeRealRenderContext, theme.direction],
  );

  const updateRenderContext = React.useCallback(
    (nextRenderContext: GridRenderContext) => {
      if (areRenderContextsEqual(nextRenderContext, prevRenderContext.current)) {
        return;
      }

      const realRenderContext = computeRealRenderContext(nextRenderContext);

      setRenderContext(nextRenderContext);
      setRealRenderContext(realRenderContext);

      updateRenderZonePosition(realRenderContext);

      const didRowIntervalChange =
        nextRenderContext.firstRowIndex !== prevRenderContext.current.firstRowIndex ||
        nextRenderContext.lastRowIndex !== prevRenderContext.current.lastRowIndex;

      // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
      // but only does something if the dimensions are also available.
      // So we wait until we have valid dimensions before publishing the first event.
      if (dimensions.isReady && didRowIntervalChange) {
        apiRef.current.publishEvent('renderedRowsIntervalChange', {
          firstRowToRender: realRenderContext.firstRowIndex,
          lastRowToRender: realRenderContext.lastRowIndex,
        });
      }

      prevRenderContext.current = nextRenderContext;
    },
    [
      apiRef,
      prevRenderContext,
      currentPage.rows.length,
      rootProps.rowBuffer,
      dimensions.isReady,
      updateRenderZonePosition,
    ],
  );

  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const { scrollTop, scrollLeft } = event.currentTarget;
    scrollPosition.top = scrollTop;
    scrollPosition.left = scrollLeft;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (!prevRenderContext.current || scrollTop < 0) {
      return;
    }
    if (theme.direction === 'ltr') {
      if (scrollLeft < 0) {
        return;
      }
    }
    if (theme.direction === 'rtl') {
      if (scrollLeft > 0) {
        return;
      }
    }

    // When virtualization is disabled, the context never changes during scroll
    const nextRenderContext = enabled ? computeRenderContext() : prevRenderContext.current;

    const topRowsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex,
    );
    const bottomRowsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.lastRowIndex - prevRenderContext.current.lastRowIndex,
    );

    const topColumnsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex,
    );
    const bottomColumnsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.lastColumnIndex - prevRenderContext.current.lastColumnIndex,
    );

    const shouldSetState =
      topRowsScrolledSincePreviousRender >= rootProps.rowThreshold ||
      bottomRowsScrolledSincePreviousRender >= rootProps.rowThreshold ||
      topColumnsScrolledSincePreviousRender >= rootProps.columnThreshold ||
      bottomColumnsScrolledSincePreviousRender >= rootProps.columnThreshold ||
      prevTotalWidth.current !== columnsTotalWidth;

    apiRef.current.publishEvent(
      'scrollPositionChange',
      {
        top: scrollTop,
        left: scrollLeft,
        renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current,
      },
      event,
    );

    if (shouldSetState) {
      // Prevents batching render context changes
      ReactDOM.flushSync(() => {
        updateRenderContext(nextRenderContext);
      });
      prevTotalWidth.current = columnsTotalWidth;
    }
  });

  const handleWheel = useEventCallback((event: React.WheelEvent) => {
    apiRef.current.publishEvent('virtualScrollerWheel', {}, event);
  });

  const handleTouchMove = useEventCallback((event: React.TouchEvent) => {
    apiRef.current.publishEvent('virtualScrollerTouchMove', {}, event);
  });

  const minFirstColumn = pinnedColumns.left.length;
  const maxLastColumn = visibleColumns.length - pinnedColumns.right.length;

  const getRows = (
    params: {
      rows?: GridRowEntry[];
      position?: GridPinnedRowsPosition;
    } = {},
  ) => {
    const isFirstSection =
      (!hasTopPinnedRows && params.position === undefined) ||
      (hasTopPinnedRows && params.position === 'top');
    const isLastSection =
      (!hasBottomPinnedRows && params.position === undefined) ||
      (hasBottomPinnedRows && params.position === 'bottom');
    const isPinnedSection = params.position !== undefined;

    const rowIndexOffset =
      isPinnedSection && params.position === 'top'
        ? 0
        : isPinnedSection && params.position === 'bottom'
        ? pinnedRows.top.length + currentPage.rows.length
        : pinnedRows.top.length;

    if (innerSize.width === 0) {
      return [];
    }

    const firstRowToRender = realRenderContext.firstRowIndex;
    const lastRowToRender = realRenderContext.lastRowIndex;
    const firstColumnToRender = realRenderContext.firstColumnIndex;
    const lastColumnToRender = realRenderContext.lastColumnIndex;

    if (!params.rows && !currentPage.range) {
      return [];
    }

    const renderedRows = params.rows ?? currentPage.rows.slice(firstRowToRender, lastRowToRender);

    // If the selected row is not within the current range of rows being displayed,
    // we need to render it at either the top or bottom of the rows,
    // depending on whether it is above or below the range.
    let isRowWithFocusedCellNotInRange = false;
    if (
      !isPinnedSection &&
      indexOfRowWithFocusedCell > -1 &&
      (firstRowToRender > indexOfRowWithFocusedCell || lastRowToRender < indexOfRowWithFocusedCell)
    ) {
      isRowWithFocusedCellNotInRange = true;

      const rowWithFocusedCell = currentPage.rows[indexOfRowWithFocusedCell];

      if (indexOfRowWithFocusedCell > firstRowToRender) {
        renderedRows.push(rowWithFocusedCell);
      } else {
        renderedRows.unshift(rowWithFocusedCell);
      }
    }

    let isColumnWihFocusedCellNotInRange = false;
    if (
      !isPinnedSection &&
      (firstColumnToRender > indexOfColumnWithFocusedCell ||
        lastColumnToRender < indexOfColumnWithFocusedCell)
    ) {
      isColumnWihFocusedCellNotInRange = true;
    }

    const { focusedCellColumnIndexNotInRange, renderedColumns } = getRenderedColumns(
      visibleColumns,
      firstColumnToRender,
      lastColumnToRender,
      minFirstColumn,
      maxLastColumn,
      isColumnWihFocusedCellNotInRange ? indexOfColumnWithFocusedCell : -1,
    );

    renderedRows.forEach((row) => {
      apiRef.current.calculateColSpan({
        rowId: row.id,
        minFirstColumn,
        maxLastColumn,
        columns: visibleColumns,
      });

      if (pinnedColumns.left.length > 0) {
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn: 0,
          maxLastColumn: pinnedColumns.left.length,
          columns: visibleColumns,
        });
      }

      if (pinnedColumns.right.length > 0) {
        apiRef.current.calculateColSpan({
          rowId: row.id,
          minFirstColumn: visibleColumns.length - pinnedColumns.right.length,
          maxLastColumn: visibleColumns.length,
          columns: visibleColumns,
        });
      }
    });

    const rows: React.ReactNode[] = [];
    const rowProps = rootProps.slotProps?.row;
    let isRowWithFocusedCellRendered = false;

    for (let i = 0; i < renderedRows.length; i += 1) {
      const { id, model } = renderedRows[i];
      const isRowNotVisible = isRowWithFocusedCellNotInRange && cellFocus!.id === id;

      const baseRowHeight = !apiRef.current.rowHasAutoHeight(id)
        ? apiRef.current.unstable_getRowHeight(id)
        : 'auto';

      let isSelected: boolean;
      if (selectedRowsLookup[id] == null) {
        isSelected = false;
      } else {
        isSelected = apiRef.current.isRowSelectable(id);
      }

      let isFirstVisible = false;
      if (isFirstSection) {
        isFirstVisible = i === 0;
      }

      let isLastVisible = false;
      if (isLastSection) {
        if (!isPinnedSection) {
          const lastIndex = currentPage.rows.length - 1;
          const isLastVisibleRowIndex = isRowWithFocusedCellNotInRange
            ? firstRowToRender + i === lastIndex + 1
            : firstRowToRender + i === lastIndex;

          if (isLastVisibleRowIndex) {
            isLastVisible = true;
          }
        } else {
          isLastVisible = i === renderedRows.length - 1;
        }
      }

      const focusedCell = cellFocus !== null && cellFocus.id === id ? cellFocus.field : null;

      const columnWithFocusedCellNotInRange =
        focusedCellColumnIndexNotInRange !== undefined &&
        visibleColumns[focusedCellColumnIndexNotInRange];

      const renderedColumnsWithFocusedCell =
        columnWithFocusedCellNotInRange && focusedCell
          ? [columnWithFocusedCellNotInRange, ...renderedColumns]
          : renderedColumns;

      let tabbableCell: GridRowProps['tabbableCell'] = null;
      if (cellTabIndex !== null && cellTabIndex.id === id) {
        const cellParams = apiRef.current.getCellParams(id, cellTabIndex.field);
        tabbableCell = cellParams.cellMode === 'view' ? cellTabIndex.field : null;
      }

      let index = rowIndexOffset + (currentPage?.range?.firstRowIndex || 0) + firstRowToRender + i;
      if (isRowWithFocusedCellNotInRange && cellFocus?.id === id) {
        index = indexOfRowWithFocusedCell;
        isRowWithFocusedCellRendered = true;
      } else if (isRowWithFocusedCellRendered) {
        index -= 1;
      }

      rows.push(
        <rootProps.slots.row
          key={id}
          row={model}
          rowId={id}
          index={index}
          rowHeight={baseRowHeight}
          focusedCell={focusedCell}
          tabbableCell={tabbableCell}
          focusedCellColumnIndexNotInRange={focusedCellColumnIndexNotInRange}
          renderedColumns={renderedColumnsWithFocusedCell}
          visibleColumns={visibleColumns}
          pinnedColumns={pinnedColumns}
          firstColumnToRender={firstColumnToRender}
          lastColumnToRender={lastColumnToRender}
          selected={isSelected}
          dimensions={dimensions}
          isFirstVisible={isFirstVisible}
          isLastVisible={isLastVisible}
          isNotVisible={isRowNotVisible}
          {...rowProps}
        />,
      );

      const panel = panels.get(id);
      if (panel) {
        rows.push(panel);
      }
    }

    return rows;
  };

  const needsHorizontalScrollbar = outerSize.width && columnsTotalWidth >= outerSize.width;

  const scrollerStyle = React.useMemo(
    () =>
      ({
        overflowX: !needsHorizontalScrollbar ? 'hidden' : undefined,
        overflowY: rootProps.autoHeight ? 'hidden' : undefined,
      } as React.CSSProperties),
    [needsHorizontalScrollbar, rootProps.autoHeight],
  );

  const contentSize = React.useMemo(() => {
    // In cases where the columns exceed the available width,
    // the horizontal scrollbar should be shown even when there're no rows.
    // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
    const height = Math.max(contentHeight, 1);

    const size: React.CSSProperties = {
      width: needsHorizontalScrollbar ? columnsTotalWidth : 'auto',
      height,
    };

    if (rootProps.autoHeight) {
      if (currentPage.rows.length === 0) {
        size.height = getMinimalContentHeight(apiRef); // Give room to show the overlay when there no rows.
      } else {
        size.height = contentHeight;
      }
    }

    return size;
  }, [
    apiRef,
    scrollerRef,
    columnsTotalWidth,
    contentHeight,
    needsHorizontalScrollbar,
    rootProps.autoHeight,
    rootProps.rowHeight,
    currentPage.rows.length,
  ]);

  React.useEffect(() => {
    apiRef.current.publishEvent('virtualScrollerContentSizeChange');
  }, [apiRef, contentSize]);

  useEnhancedEffect(() => {
    // FIXME: Is this really necessary?
    apiRef.current.resize();
  }, [rowsMeta.currentPageTotalHeight]);

  useEnhancedEffect(() => {
    if (enabled) {
      // TODO a scroll reset should not be necessary
      scrollerRef.current!.scrollLeft = 0;
      scrollerRef.current!.scrollTop = 0;
    } else {
      gridRootRef.current?.style.setProperty('--DataGrid-offsetTop', '0px');
      gridRootRef.current?.style.setProperty('--DataGrid-offsetLeft', '0px');
    }
  }, [enabled]);

  useEnhancedEffect(() => {
    if (outerSize.width == 0) {
      return;
    }

    const initialRenderContext = computeRenderContext();
    updateRenderContext(initialRenderContext);

    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollPosition.top,
      left: scrollPosition.left,
      renderContext: initialRenderContext,
    });
  }, [apiRef, outerSize.width, computeRenderContext, updateRenderContext]);

  apiRef.current.register('private', {
    getRenderContext,
  });

  return {
    renderContext,
    setPanels,
    getRows,
    getContainerProps: () => ({
      ref: mainRef,
    }),
    getScrollerProps: () => ({
      ref: scrollerRef,
      onScroll: handleScroll,
      onWheel: handleWheel,
      onTouchMove: handleTouchMove,
      style: scrollerStyle,
      role: 'presentation',
    }),
    getContentProps: () => ({
      style: contentSize,
      role: 'presentation',
    }),
    getRenderZoneProps: () => ({ ref: renderZoneRef, role: 'rowgroup' }),
    getScrollbarVerticalProps: () => ({ ref: scrollbarVerticalRef, role: 'presentation' }),
    getScrollbarHorizontalProps: () => ({ ref: scrollbarHorizontalRef, role: 'presentation' }),
  };
};

function createGetRenderedColumns() {
  // The `maxSize` is 3 so that reselect caches the `renderedColumns` values for the pinned left,
  // unpinned, and pinned right sections.
  const memoizeOptions = { maxSize: 3 };

  return defaultMemoize(
    (
      columns: GridStateColDef[],
      firstColumnToRender: number,
      lastColumnToRender: number,
      minFirstColumn: number,
      maxLastColumn: number,
      indexOfColumnWithFocusedCell: number,
    ) => {
      // If the selected column is not within the current range of columns being displayed,
      // we need to render it at either the left or right of the columns,
      // depending on whether it is above or below the range.
      let focusedCellColumnIndexNotInRange;

      const renderedColumns = columns.slice(firstColumnToRender, lastColumnToRender);

      if (indexOfColumnWithFocusedCell > -1) {
        // check if it is not on the left pinned column.
        if (
          firstColumnToRender > indexOfColumnWithFocusedCell &&
          indexOfColumnWithFocusedCell >= minFirstColumn
        ) {
          focusedCellColumnIndexNotInRange = indexOfColumnWithFocusedCell;
        }
        // check if it is not on the right pinned column.
        else if (
          lastColumnToRender < indexOfColumnWithFocusedCell &&
          indexOfColumnWithFocusedCell < maxLastColumn
        ) {
          focusedCellColumnIndexNotInRange = indexOfColumnWithFocusedCell;
        }
      }

      return {
        focusedCellColumnIndexNotInRange,
        renderedColumns,
      };
    },
    memoizeOptions,
  );
}
