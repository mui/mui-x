import * as React from 'react';
import { useForkRef } from '@mui/material/utils';
import { GridRowId } from '../../../models/gridRows';
import { useGridApiContext } from '../../utils/useGridApiContext';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridSelector } from '../../utils/useGridSelector';
import {
  visibleGridColumnsSelector,
  gridColumnsMetaSelector,
} from '../columns/gridColumnsSelector';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { gridFocusCellSelector, gridTabIndexCellSelector } from '../focus/gridFocusStateSelector';
import { gridEditRowsStateSelector } from '../editRows/gridEditRowsSelector';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';
import { GridEventListener, GridEvents } from '../../../models/events';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { clamp } from '../../../utils/utils';
import { GridRenderContext } from '../../../models';

// Uses binary search to avoid looping through all possible positions
export function getIndexFromScroll(
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
    ? getIndexFromScroll(offset, positions, sliceStart, pivot)
    : getIndexFromScroll(offset, positions, pivot + 1, sliceEnd);
}

interface UseGridVirtualScrollerProps {
  ref: React.Ref<HTMLDivElement>;
  selectionLookup: Record<string, GridRowId>;
  disableVirtualization?: boolean;
  renderZoneMinColumnIndex?: number;
  renderZoneMaxColumnIndex?: number;
  onRenderZonePositioning?: (params: { top: number; left: number }) => void;
}

export const useGridVirtualScroller = (props: UseGridVirtualScrollerProps) => {
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const {
    ref,
    selectionLookup,
    disableVirtualization,
    onRenderZonePositioning,
    renderZoneMinColumnIndex = 0,
    renderZoneMaxColumnIndex = visibleColumns.length,
  } = props;

  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
  const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
  const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
  const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
  const currentPage = useCurrentPageRows(apiRef, rootProps);
  const renderZoneRef = React.useRef<HTMLDivElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef<HTMLDivElement>(ref, rootRef);
  const [renderContext, setRenderContext] = React.useState<GridRenderContext | null>(null);
  const prevRenderContext = React.useRef<GridRenderContext | null>(renderContext);
  const scrollPosition = React.useRef({ top: 0, left: 0 });
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
  const prevTotalWidth = React.useRef(columnsMeta.totalWidth);

  const computeRenderContext = React.useCallback(() => {
    if (disableVirtualization) {
      return {
        firstRowIndex: 0,
        lastRowIndex: currentPage.rows.length,
        firstColumnIndex: 0,
        lastColumnIndex: visibleColumns.length,
      };
    }

    const { top, left } = scrollPosition.current!;

    const numberOfRowsToRender = rootProps.autoHeight
      ? currentPage.rows.length
      : Math.floor(rootRef.current!.clientHeight / rowHeight);

    const firstRowIndex = Math.floor(top / rowHeight);
    const lastRowIndex = firstRowIndex + numberOfRowsToRender;

    const { positions } = gridColumnsMetaSelector(apiRef.current.state); // To avoid infinite loop
    const firstColumnIndex = getIndexFromScroll(left, positions);
    const lastColumnIndex = getIndexFromScroll(left + containerWidth!, positions);

    return {
      firstRowIndex,
      lastRowIndex,
      firstColumnIndex,
      lastColumnIndex,
    };
  }, [
    apiRef,
    containerWidth,
    rootProps.autoHeight,
    disableVirtualization,
    rowHeight,
    currentPage.rows.length,
    visibleColumns.length,
  ]);

  React.useEffect(() => {
    if (disableVirtualization) {
      renderZoneRef.current!.style.transform = `translate3d(0px, 0px, 0px)`;
    } else {
      // TODO a scroll reset should not be necessary
      rootRef.current!.scrollLeft = 0;
      rootRef.current!.scrollTop = 0;
    }

    setContainerWidth(rootRef.current!.clientWidth);
  }, [disableVirtualization]);

  React.useEffect(() => {
    if (containerWidth == null) {
      return;
    }

    const initialRenderContext = computeRenderContext();
    prevRenderContext.current = initialRenderContext;
    setRenderContext(initialRenderContext);

    const { top, left } = scrollPosition.current!;
    const params = { top, left, renderContext: initialRenderContext };
    apiRef.current.publishEvent(GridEvents.rowsScroll, params);
  }, [apiRef, computeRenderContext, containerWidth]);

  const handleResize = React.useCallback<GridEventListener<GridEvents.resize>>(() => {
    if (rootRef.current) {
      setContainerWidth(rootRef.current.clientWidth);
    }
  }, []);

  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);

  const getRenderableIndexes = ({ firstIndex, lastIndex, buffer, minFirstIndex, maxLastIndex }) => {
    return [
      clamp(firstIndex - buffer, minFirstIndex, maxLastIndex),
      clamp(lastIndex + buffer, minFirstIndex, maxLastIndex),
    ];
  };

  const updateRenderZonePosition = (nextRenderContext: GridRenderContext) => {
    const [firstRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.range?.lastRowIndex,
      buffer: rootProps.rowBuffer,
    });

    const [firstColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: renderZoneMinColumnIndex,
      maxLastIndex: renderZoneMaxColumnIndex,
      buffer: rootProps.columnBuffer,
    });

    const top = firstRowToRender * rowHeight;
    const left = gridColumnsMetaSelector(apiRef.current.state).positions[firstColumnToRender]; // Call directly the selector because it might be outdated when this method is called
    renderZoneRef.current!.style.transform = `translate3d(${left}px, ${top}px, 0px)`;

    if (typeof onRenderZonePositioning === 'function') {
      onRenderZonePositioning({ top, left });
    }
  };

  const handleScroll = (event: React.UIEvent) => {
    const { scrollTop, scrollLeft } = event.currentTarget;
    scrollPosition.current.top = scrollTop;
    scrollPosition.current.left = scrollLeft;

    // On iOS and macOS, negative offsets are possible when swiping past the start
    if (scrollLeft < 0 || scrollTop < 0 || !prevRenderContext.current) {
      return;
    }

    // When virtualization is disabled, the context never changes during scroll
    const nextRenderContext = disableVirtualization
      ? prevRenderContext.current
      : computeRenderContext();

    const rowsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.firstRowIndex - prevRenderContext.current.firstRowIndex,
    );

    const columnsScrolledSincePreviousRender = Math.abs(
      nextRenderContext.firstColumnIndex - prevRenderContext.current.firstColumnIndex,
    );

    const shouldSetState =
      rowsScrolledSincePreviousRender >= rootProps.rowThreshold ||
      columnsScrolledSincePreviousRender >= rootProps.columnThreshold ||
      prevTotalWidth.current !== columnsMeta.totalWidth;

    // TODO v6: rename event to a wider name, it's not only fired for row scrolling
    apiRef.current.publishEvent(GridEvents.rowsScroll, {
      top: scrollTop,
      left: scrollLeft,
      renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current,
    });

    if (shouldSetState) {
      setRenderContext(nextRenderContext);
      prevRenderContext.current = nextRenderContext;
      prevTotalWidth.current = columnsMeta.totalWidth;
      updateRenderZonePosition(nextRenderContext);
    }
  };

  const getRows = (
    params: {
      renderContext: GridRenderContext | null;
      minFirstColumn?: number;
      maxLastColumn?: number;
      availableSpace?: number | null;
    } = { renderContext },
  ) => {
    const {
      renderContext: nextRenderContext,
      minFirstColumn = renderZoneMinColumnIndex,
      maxLastColumn = renderZoneMaxColumnIndex,
      availableSpace = containerWidth,
    } = params;

    if (!currentPage.range || !nextRenderContext || availableSpace == null) {
      return null;
    }

    const rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
    const columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;

    const [firstRowToRender, lastRowToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstRowIndex,
      lastIndex: nextRenderContext.lastRowIndex,
      minFirstIndex: 0,
      maxLastIndex: currentPage.rows.length,
      buffer: rowBuffer,
    });

    const [firstColumnToRender, lastColumnToRender] = getRenderableIndexes({
      firstIndex: nextRenderContext.firstColumnIndex,
      lastIndex: nextRenderContext.lastColumnIndex,
      minFirstIndex: minFirstColumn,
      maxLastIndex: maxLastColumn,
      buffer: columnBuffer,
    });

    const renderedRows = currentPage.rows.slice(firstRowToRender, lastRowToRender);
    const renderedColumns = visibleColumns.slice(firstColumnToRender, lastColumnToRender);

    const rows: JSX.Element[] = [];

    for (let i = 0; i < renderedRows.length; i += 1) {
      const { id, model } = renderedRows[i];

      rows.push(
        <rootProps.components.Row
          key={i}
          row={model}
          rowId={id}
          rowHeight={rowHeight}
          cellFocus={cellFocus} // TODO move to inside the row
          cellTabIndex={cellTabIndex} // TODO move to inside the row
          editRowsState={editRowsState} // TODO move to inside the row
          renderedColumns={renderedColumns}
          visibleColumns={visibleColumns}
          firstColumnToRender={firstColumnToRender}
          lastColumnToRender={lastColumnToRender}
          selected={selectionLookup[id] !== undefined}
          index={currentPage.range.firstRowIndex + nextRenderContext.firstRowIndex! + i}
          containerWidth={availableSpace}
          {...rootProps.componentsProps?.row}
        />,
      );
    }

    return rows;
  };

  const needsHorizontalScrollbar = containerWidth && columnsMeta.totalWidth > containerWidth;

  const contentSize = React.useMemo(() => {
    const size = {
      width: needsHorizontalScrollbar ? columnsMeta.totalWidth : 'auto',
      // In cases where the columns exceed the available width,
      // the horizontal scrollbar should be shown even when there're no rows.
      // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
      height: Math.max(currentPage.rows.length * rowHeight, 1),
    };

    if (rootProps.autoHeight && currentPage.rows.length === 0) {
      size.height = 2 * rowHeight; // Give room to show the overlay when there no rows.
    }

    return size;
  }, [
    columnsMeta.totalWidth,
    currentPage.rows.length,
    needsHorizontalScrollbar,
    rootProps.autoHeight,
    rowHeight,
  ]);

  React.useEffect(() => {
    apiRef.current.publishEvent(GridEvents.virtualScrollerContentSizeChange);
  }, [apiRef, contentSize]);

  if (rootProps.autoHeight && currentPage.rows.length === 0) {
    contentSize.height = 2 * rowHeight; // Give room to show the overlay when there no rows.
  }

  const rootStyle = {} as React.CSSProperties;
  if (!needsHorizontalScrollbar) {
    rootStyle.overflowX = 'hidden';
  }

  return {
    renderContext,
    updateRenderZonePosition,
    getRows,
    getRootProps: ({ style = {}, ...other } = {}) => ({
      ref: handleRef,
      onScroll: handleScroll,
      style: { ...style, ...rootStyle },
      ...other,
    }),
    getContentProps: ({ style = {} } = {}) => ({ style: { ...style, ...contentSize } }),
    getRenderZoneProps: () => ({ ref: renderZoneRef }),
  };
};
