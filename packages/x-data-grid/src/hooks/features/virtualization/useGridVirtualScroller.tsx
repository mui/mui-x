import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  unstable_useEventCallback as useEventCallback,
} from '@mui/utils';
import { useTheme, Theme } from '@mui/material/styles';
import { defaultMemoize } from 'reselect';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import { useLazyRef } from '../../utils/useLazyRef';
import { useResizeObserver } from '../../utils/useResizeObserver';
import { useRunOnce } from '../../utils/useRunOnce';
import {
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  gridColumnPositionsSelector,
} from '../columns/gridColumnsSelector';
import { gridDimensionsSelector } from '../dimensions/gridDimensionsSelectors';
import { gridPinnedRowsSelector } from '../rows/gridRowsSelector';
import { GridPinnedRowsPosition } from '../rows/gridRowsInterfaces';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';
import { useGridVisibleRows, getVisibleRows } from '../../utils/useGridVisibleRows';
import { clamp } from '../../../utils/utils';
import { GridRenderContext, GridRowEntry, GridRowId } from '../../../models';
import { selectedIdsLookupSelector } from '../rowSelection/gridRowSelectionSelector';
import { gridRowsMetaSelector } from '../rows/gridRowsMetaSelector';
import { GridStateColDef } from '../../../models/colDef/gridColDef';
import { getFirstNonSpannedColumnToRender } from '../columns/gridColumnsUtils';
import { getMinimalContentHeight } from '../rows/gridRowsUtils';
import { GridRowProps } from '../../../components/GridRow';
import {
  gridOffsetsSelector,
  gridRenderContextSelector,
  gridVirtualizationEnabledSelector,
  gridVirtualizationColumnEnabledSelector,
} from './gridVirtualizationSelectors';
import { EMPTY_RENDER_CONTEXT } from './useGridVirtualization';

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
  const pinnedRows = useGridSelector(apiRef, gridPinnedRowsSelector);
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);
  const hasBottomPinnedRows = pinnedRows.bottom.length > 0;
  const [panels, setPanels] = React.useState(EMPTY_DETAIL_PANELS);

  const theme = useTheme();
  const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  const rowsMeta = useGridSelector(apiRef, gridRowsMetaSelector);
  const selectedRowsLookup = useGridSelector(apiRef, selectedIdsLookupSelector);
  const currentPage = useGridVisibleRows(apiRef, rootProps);
  const gridRootRef = apiRef.current.rootElementRef;
  const mainRef = apiRef.current.mainElementRef;
  const scrollerRef = apiRef.current.virtualScrollerRef;
  const scrollbarVerticalRef = React.useRef<HTMLDivElement>(null);
  const scrollbarHorizontalRef = React.useRef<HTMLDivElement>(null);
  const contentHeight = dimensions.contentSize.height;
  const columnsTotalWidth = dimensions.columnsTotalWidth;

  useResizeObserver(mainRef, () => apiRef.current.resize());

  const previousContext = React.useRef(EMPTY_RENDER_CONTEXT);
  const previousRowContext = React.useRef(EMPTY_RENDER_CONTEXT);
  const offsets = useGridSelector(apiRef, gridOffsetsSelector);
  const renderContext = useGridSelector(apiRef, gridRenderContextSelector);
  const scrollPosition = React.useRef({ top: 0, left: 0 }).current;
  const prevTotalWidth = React.useRef(columnsTotalWidth);

  const getRenderedColumns = useLazyRef(createGetRenderedColumns).current;

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

  const updateRenderContext = React.useCallback(
    (nextRenderContext: GridRenderContext, rawRenderContext: GridRenderContext) => {
      if (
        areRenderContextsEqual(nextRenderContext, apiRef.current.state.virtualization.renderContext)
      ) {
        return;
      }

      const didRowsIntervalChange =
        nextRenderContext.firstRowIndex !== previousRowContext.current.firstRowIndex ||
        nextRenderContext.lastRowIndex !== previousRowContext.current.lastRowIndex;

      const nextOffsets = computeOffsets(
        apiRef,
        nextRenderContext,
        theme.direction,
        pinnedColumns.left.length,
      );

      apiRef.current.setState((state) => {
        return {
          ...state,
          virtualization: {
            ...state.virtualization,
            renderContext: nextRenderContext,
            offsets: nextOffsets,
          },
        };
      });

      // The lazy-loading hook is listening to `renderedRowsIntervalChange`,
      // but only does something if the dimensions are also available.
      // So we wait until we have valid dimensions before publishing the first event.
      if (dimensions.isReady && didRowsIntervalChange) {
        previousRowContext.current = nextRenderContext;
        apiRef.current.publishEvent('renderedRowsIntervalChange', nextRenderContext);
      }

      previousContext.current = rawRenderContext;
      prevTotalWidth.current = dimensions.columnsTotalWidth;
    },
    [
      apiRef,
      pinnedColumns.left.length,
      theme.direction,
      dimensions.isReady,
      dimensions.columnsTotalWidth,
    ],
  );

  const triggerUpdateRenderContext = () => {
    const inputs = inputsSelector(apiRef, rootProps, enabled, enabledForColumns);
    const [nextRenderContext, rawRenderContext] = computeRenderContext(inputs, scrollPosition);

    // Since previous render, we have scrolled...
    const topRowsScrolled = Math.abs(
      rawRenderContext.firstRowIndex - previousContext.current.firstRowIndex,
    );
    const bottomRowsScrolled = Math.abs(
      rawRenderContext.lastRowIndex - previousContext.current.lastRowIndex,
    );

    const topColumnsScrolled = Math.abs(
      rawRenderContext.firstColumnIndex - previousContext.current.firstColumnIndex,
    );
    const bottomColumnsScrolled = Math.abs(
      rawRenderContext.lastColumnIndex - previousContext.current.lastColumnIndex,
    );

    const shouldUpdate =
      topRowsScrolled >= rootProps.rowThreshold ||
      bottomRowsScrolled >= rootProps.rowThreshold ||
      topColumnsScrolled >= rootProps.columnThreshold ||
      bottomColumnsScrolled >= rootProps.columnThreshold ||
      prevTotalWidth.current !== dimensions.columnsTotalWidth;

    if (!shouldUpdate) {
      return previousContext.current;
    }

    // Prevents batching render context changes
    ReactDOM.flushSync(() => {
      updateRenderContext(nextRenderContext, rawRenderContext);
    });

    return nextRenderContext;
  };

  const forceUpdateRenderContext = () => {
    const inputs = inputsSelector(apiRef, rootProps, enabled, enabledForColumns);
    const [nextRenderContext, rawRenderContext] = computeRenderContext(inputs, scrollPosition);
    updateRenderContext(nextRenderContext, rawRenderContext);
  };

  const handleScroll = useEventCallback((event: React.UIEvent) => {
    const { scrollTop, scrollLeft } = event.currentTarget;

    scrollPosition.top = scrollTop;
    scrollPosition.left = scrollLeft;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (scrollTop < 0) {
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

    const nextRenderContext = triggerUpdateRenderContext();

    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollTop,
      left: scrollLeft,
      renderContext: nextRenderContext,
    });
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
    const isLastSection =
      (!hasBottomPinnedRows && params.position === undefined) ||
      (hasBottomPinnedRows && params.position === 'bottom');
    const isPinnedSection = params.position !== undefined;

    let rowIndexOffset;
    // FIXME: Why is the switch check exhaustiveness not validated with typescript-eslint?
    // eslint-disable-next-line default-case
    switch (params.position) {
      case 'top':
        rowIndexOffset = 0;
        break;
      case 'bottom':
        rowIndexOffset = pinnedRows.top.length + currentPage.rows.length;
        break;
      case undefined:
        rowIndexOffset = pinnedRows.top.length;
        break;
    }

    const firstRowToRender = renderContext.firstRowIndex;
    const lastRowToRender = renderContext.lastRowIndex;
    const firstColumnToRender = renderContext.firstColumnIndex;
    const lastColumnToRender = renderContext.lastColumnIndex;

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

      const rowIndexInPage = (currentPage?.range?.firstRowIndex || 0) + firstRowToRender + i;
      let index = rowIndexOffset + rowIndexInPage;
      if (isRowWithFocusedCellNotInRange && cellFocus?.id === id) {
        index = indexOfRowWithFocusedCell;
        isRowWithFocusedCellRendered = true;
      } else if (isRowWithFocusedCellRendered) {
        index -= 1;
      }

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
      if (params.position === undefined) {
        isFirstVisible = rowIndexInPage === 0;
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
          offsets={offsets}
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
      }) as React.CSSProperties,
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
    columnsTotalWidth,
    contentHeight,
    needsHorizontalScrollbar,
    rootProps.autoHeight,
    currentPage.rows.length,
  ]);

  React.useEffect(() => {
    apiRef.current.publishEvent('virtualScrollerContentSizeChange');
  }, [apiRef, contentSize]);

  useEnhancedEffect(() => {
    // FIXME: Is this really necessary?
    apiRef.current.resize();
  }, [apiRef, rowsMeta.currentPageTotalHeight]);

  useEnhancedEffect(() => {
    if (enabled) {
      // TODO a scroll reset should not be necessary
      scrollerRef.current!.scrollLeft = 0;
      scrollerRef.current!.scrollTop = 0;
    }
  }, [enabled, gridRootRef, scrollerRef]);

  useRunOnce(outerSize.width !== 0, () => {
    const inputs = inputsSelector(apiRef, rootProps, enabled, enabledForColumns);

    const [initialRenderContext, rawRenderContext] = computeRenderContext(inputs, scrollPosition);
    updateRenderContext(initialRenderContext, rawRenderContext);

    apiRef.current.publishEvent('scrollPositionChange', {
      top: scrollPosition.top,
      left: scrollPosition.left,
      renderContext: initialRenderContext,
    });
  });

  apiRef.current.register('private', {
    updateRenderContext: forceUpdateRenderContext,
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
      tabIndex: -1,
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
    getRenderZoneProps: () => ({ role: 'rowgroup' }),
    getScrollbarVerticalProps: () => ({ ref: scrollbarVerticalRef, role: 'presentation' }),
    getScrollbarHorizontalProps: () => ({ ref: scrollbarHorizontalRef, role: 'presentation' }),
  };
};

function createGetRenderedColumns() {
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
  );
}

type ScrollPosition = { top: number; left: number };
type RenderContextInputs = {
  enabled: boolean;
  enabledForColumns: boolean;
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>;
  autoHeight: boolean;
  rowBuffer: number;
  columnBuffer: number;
  leftPinnedWidth: number;
  columnsTotalWidth: number;
  viewportInnerWidth: number;
  viewportInnerHeight: number;
  rowsMeta: ReturnType<typeof gridRowsMetaSelector>;
  columnPositions: ReturnType<typeof gridColumnPositionsSelector>;
  rows: ReturnType<typeof useGridVisibleRows>['rows'];
  range: ReturnType<typeof useGridVisibleRows>['range'];
  pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>;
  visibleColumns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>;
};

function inputsSelector(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  rootProps: ReturnType<typeof useGridRootProps>,
  enabled: boolean,
  enabledForColumns: boolean,
): RenderContextInputs {
  const dimensions = gridDimensionsSelector(apiRef.current.state);
  const currentPage = getVisibleRows(apiRef, rootProps);
  return {
    enabled,
    enabledForColumns,
    apiRef,
    autoHeight: rootProps.autoHeight,
    rowBuffer: rootProps.rowBuffer,
    columnBuffer: rootProps.columnBuffer,
    leftPinnedWidth: dimensions.leftPinnedWidth,
    columnsTotalWidth: dimensions.columnsTotalWidth,
    viewportInnerWidth: dimensions.viewportInnerSize.width,
    viewportInnerHeight: dimensions.viewportInnerSize.height,
    rowsMeta: gridRowsMetaSelector(apiRef.current.state),
    columnPositions: gridColumnPositionsSelector(apiRef),
    rows: currentPage.rows,
    range: currentPage.range,
    pinnedColumns: gridVisiblePinnedColumnDefinitionsSelector(apiRef),
    visibleColumns: gridVisibleColumnDefinitionsSelector(apiRef),
  };
}

function computeRenderContext(inputs: RenderContextInputs, scrollPosition: ScrollPosition) {
  let renderContext: GridRenderContext;

  if (!inputs.enabled) {
    renderContext = {
      firstRowIndex: 0,
      lastRowIndex: inputs.rows.length,
      firstColumnIndex: 0,
      lastColumnIndex: inputs.visibleColumns.length,
    };
  } else {
    const { top, left } = scrollPosition;
    const realLeft = Math.abs(left) + inputs.leftPinnedWidth;

    // Clamp the value because the search may return an index out of bounds.
    // In the last index, this is not needed because Array.slice doesn't include it.
    const firstRowIndex = Math.min(
      getNearestIndexToRender(inputs, top),
      inputs.rowsMeta.positions.length - 1,
    );

    const lastRowIndex = inputs.autoHeight
      ? firstRowIndex + inputs.rows.length
      : getNearestIndexToRender(inputs, top + inputs.viewportInnerHeight);

    let firstColumnIndex = 0;
    let lastColumnIndex = inputs.columnPositions.length;

    if (inputs.enabledForColumns) {
      let hasRowWithAutoHeight = false;

      const [firstRowToRender, lastRowToRender] = getIndexesToRender({
        firstIndex: firstRowIndex,
        lastIndex: lastRowIndex,
        minFirstIndex: 0,
        maxLastIndex: inputs.rows.length,
        buffer: inputs.rowBuffer,
      });

      for (let i = firstRowToRender; i < lastRowToRender && !hasRowWithAutoHeight; i += 1) {
        const row = inputs.rows[i];
        hasRowWithAutoHeight = inputs.apiRef.current.rowHasAutoHeight(row.id);
      }

      if (!hasRowWithAutoHeight) {
        firstColumnIndex = binarySearch(realLeft, inputs.columnPositions, {
          atStart: true,
          lastPosition: inputs.columnsTotalWidth,
        });
        lastColumnIndex = binarySearch(
          realLeft + inputs.viewportInnerWidth,
          inputs.columnPositions,
        );
      }
    }

    renderContext = {
      firstRowIndex,
      lastRowIndex,
      firstColumnIndex,
      lastColumnIndex,
    };
  }

  const actualRenderContext = deriveRenderContext(
    inputs.apiRef,
    inputs.rowBuffer,
    inputs.columnBuffer,
    inputs.rows,
    inputs.pinnedColumns,
    inputs.visibleColumns,
    renderContext,
  );

  return [actualRenderContext, renderContext];
}

function getNearestIndexToRender(inputs: RenderContextInputs, offset: number) {
  const lastMeasuredIndexRelativeToAllRows = inputs.apiRef.current.getLastMeasuredRowIndex();
  let allRowsMeasured = lastMeasuredIndexRelativeToAllRows === Infinity;
  if (inputs.range?.lastRowIndex && !allRowsMeasured) {
    // Check if all rows in this page are already measured
    allRowsMeasured = lastMeasuredIndexRelativeToAllRows >= inputs.range.lastRowIndex;
  }

  const lastMeasuredIndexRelativeToCurrentPage = clamp(
    lastMeasuredIndexRelativeToAllRows - (inputs.range?.firstRowIndex || 0),
    0,
    inputs.rowsMeta.positions.length,
  );

  if (
    allRowsMeasured ||
    inputs.rowsMeta.positions[lastMeasuredIndexRelativeToCurrentPage] >= offset
  ) {
    // If all rows were measured (when no row has "auto" as height) or all rows before the offset
    // were measured, then use a binary search because it's faster.
    return binarySearch(offset, inputs.rowsMeta.positions);
  }

  // Otherwise, use an exponential search.
  // If rows have "auto" as height, their positions will be based on estimated heights.
  // In this case, we can skip several steps until we find a position higher than the offset.
  // Inspired by https://github.com/bvaughn/react-virtualized/blob/master/source/Grid/utils/CellSizeAndPositionManager.js
  return exponentialSearch(
    offset,
    inputs.rowsMeta.positions,
    lastMeasuredIndexRelativeToCurrentPage,
  );
}

/**
 * Accepts as input a raw render context (the area visible in the viewport) and adds
 * computes the actual render context based on pinned elements, buffer dimensions and
 * spanning.
 */
function deriveRenderContext(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  rowBuffer: number,
  columnBuffer: number,
  rows: ReturnType<typeof useGridVisibleRows>['rows'],
  pinnedColumns: ReturnType<typeof gridVisiblePinnedColumnDefinitionsSelector>,
  visibleColumns: ReturnType<typeof gridVisibleColumnDefinitionsSelector>,
  nextRenderContext: GridRenderContext,
) {
  const [firstRowToRender, lastRowToRender] = getIndexesToRender({
    firstIndex: nextRenderContext.firstRowIndex,
    lastIndex: nextRenderContext.lastRowIndex,
    minFirstIndex: 0,
    maxLastIndex: rows.length,
    buffer: rowBuffer,
  });

  const [initialFirstColumnToRender, lastColumnToRender] = getIndexesToRender({
    firstIndex: nextRenderContext.firstColumnIndex,
    lastIndex: nextRenderContext.lastColumnIndex,
    minFirstIndex: pinnedColumns.left.length,
    maxLastIndex: visibleColumns.length - pinnedColumns.right.length,
    buffer: columnBuffer,
  });

  const firstColumnToRender = getFirstNonSpannedColumnToRender({
    firstColumnToRender: initialFirstColumnToRender,
    apiRef,
    firstRowToRender,
    lastRowToRender,
    visibleRows: rows,
  });

  return {
    firstRowIndex: firstRowToRender,
    lastRowIndex: lastRowToRender,
    firstColumnIndex: firstColumnToRender,
    lastColumnIndex: lastColumnToRender,
  };
}

type SearchOptions = {
  atStart: boolean;
  lastPosition: number;
};

/**
 * Use binary search to avoid looping through all possible positions.
 * The `options.atStart` provides the possibility to match for the first element that
 * intersects the screen, even if said element's start position is before `offset`. In
 * other words, we search for `offset + width`.
 */
function binarySearch(
  offset: number,
  positions: number[],
  options: SearchOptions | undefined = undefined,
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
  const position = positions[pivot];

  let isBefore: boolean;
  if (options?.atStart) {
    const width =
      (pivot === positions.length - 1 ? options.lastPosition : positions[pivot + 1]) - position;
    isBefore = offset - width < position;
  } else {
    isBefore = offset <= position;
  }

  return isBefore
    ? binarySearch(offset, positions, options, sliceStart, pivot)
    : binarySearch(offset, positions, options, pivot + 1, sliceEnd);
}

function exponentialSearch(offset: number, positions: number[], index: number): number {
  let interval = 1;

  while (index < positions.length && Math.abs(positions[index]) < offset) {
    index += interval;
    interval *= 2;
  }

  return binarySearch(
    offset,
    positions,
    undefined,
    Math.floor(index / 2),
    Math.min(index, positions.length),
  );
}

function getIndexesToRender({
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
}) {
  return [
    clamp(firstIndex - buffer, minFirstIndex, maxLastIndex),
    clamp(lastIndex + buffer, minFirstIndex, maxLastIndex),
  ];
}

export function areRenderContextsEqual(context1: GridRenderContext, context2: GridRenderContext) {
  if (context1 === context2) {
    return true;
  }
  return (
    context1.firstRowIndex === context2.firstRowIndex &&
    context1.lastRowIndex === context2.lastRowIndex &&
    context1.firstColumnIndex === context2.firstColumnIndex &&
    context1.lastColumnIndex === context2.lastColumnIndex
  );
}

function computeOffsets(
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  renderContext: GridRenderContext,
  direction: Theme['direction'],
  pinnedLeftLength: number,
) {
  const factor = direction === 'ltr' ? 1 : -1;
  const rowPositions = gridRowsMetaSelector(apiRef.current.state).positions;
  const columnPositions = gridColumnPositionsSelector(apiRef);

  const top = rowPositions[renderContext.firstRowIndex] ?? 0;
  const left =
    factor * (columnPositions[renderContext.firstColumnIndex] ?? 0) -
    (columnPositions[pinnedLeftLength] ?? 0);

  return { top, left };
}
