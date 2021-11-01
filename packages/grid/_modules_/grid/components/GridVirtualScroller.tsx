import * as React from 'react';
import clsx from 'clsx';
import { useForkRef } from '@mui/material/utils';
import { styled } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridSelector } from '../hooks/utils/useGridSelector';
import { gridScrollBarSizeSelector } from '../hooks/features/container/gridContainerSizesSelector';
import {
  visibleGridColumnsSelector,
  gridColumnsMetaSelector,
} from '../hooks/features/columns/gridColumnsSelector';
import {
  gridFocusCellSelector,
  gridTabIndexCellSelector,
} from '../hooks/features/focus/gridFocusStateSelector';
import { gridDensityRowHeightSelector } from '../hooks/features/density/densitySelector';
import { gridEditRowsStateSelector } from '../hooks/features/editRows/gridEditRowsSelector';
import { GridEvents } from '../constants/eventsConstants';
import { useGridApiEventHandler } from '../hooks/utils/useGridApiEventHandler';
import { getDataGridUtilityClass } from '../gridClasses';
import { GridComponentProps } from '../GridComponentProps';
import { GridRowId } from '../models/gridRows';
import { useCurrentPageRows } from '../hooks/utils/useCurrentPageRows';

type OwnerState = { classes: GridComponentProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['virtualScroller'],
    content: ['virtualScrollerContent'],
    renderZone: ['virtualScrollerRenderZone'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const VirtualScrollerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'VirtualScroller',
  overridesResolver: (props, styles) => styles.virtualScroller,
})({
  overflow: 'auto',
  '@media print': {
    overflow: 'hidden',
  },
});

const VirtualScrollerContent = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Content',
  overridesResolver: (props, styles) => styles.content,
})({
  position: 'relative',
  overflow: 'hidden',
});

const VirtualScrollerRenderZone = styled('div', {
  name: 'MuiDataGrid',
  slot: 'RenderingZone',
  overridesResolver: (props, styles) => styles.renderingZone,
})({
  position: 'absolute',
});

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

export interface RenderContext {
  firstRowIndex: number;
  lastRowIndex: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
}

interface GridVirtualScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  selectionLookup: Record<string, GridRowId>;
  disableVirtualization?: boolean;
}

const GridVirtualScroller = React.forwardRef<HTMLDivElement, GridVirtualScrollerProps>(
  function GridVirtualScroller(props, ref) {
    const { className, selectionLookup, disableVirtualization, ...other } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
    const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
    const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);
    const cellFocus = useGridSelector(apiRef, gridFocusCellSelector);
    const cellTabIndex = useGridSelector(apiRef, gridTabIndexCellSelector);
    const editRowsState = useGridSelector(apiRef, gridEditRowsStateSelector);
    const scrollBarState = useGridSelector(apiRef, gridScrollBarSizeSelector);
    const currentPage = useCurrentPageRows(apiRef, rootProps);
    const renderZoneRef = React.useRef<HTMLDivElement>(null);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef<HTMLDivElement>(ref, rootRef);
    const [renderContext, setRenderContext] = React.useState<RenderContext | null>(null);
    const prevRenderContext = React.useRef<RenderContext | null>(renderContext);
    const scrollPosition = React.useRef({ top: 0, left: 0 });
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
    const ownerState = { classes: rootProps.classes };
    const classes = useUtilityClasses(ownerState);
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

    const handleResize = React.useCallback(() => {
      if (rootRef.current) {
        setContainerWidth(rootRef.current.clientWidth);
      }
    }, []);

    useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);

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

      // TODO rename event to a wider name, it's not only fired for row scrolling
      // TODO create a interface to type correctly the params
      apiRef.current.publishEvent(GridEvents.rowsScroll, {
        top: scrollTop,
        left: scrollLeft,
        renderContext: shouldSetState ? nextRenderContext : prevRenderContext.current,
      });

      if (shouldSetState) {
        setRenderContext(nextRenderContext);
        prevRenderContext.current = nextRenderContext;
        prevTotalWidth.current = columnsMeta.totalWidth;

        const top = Math.max(nextRenderContext.firstRowIndex - rootProps.rowBuffer, 0) * rowHeight;
        const firstColumnToRender = Math.max(
          nextRenderContext.firstColumnIndex - rootProps.columnBuffer,
          0,
        );
        const left = columnsMeta.positions[firstColumnToRender];
        renderZoneRef.current!.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
      }
    };

    const getRows = () => {
      if (!currentPage.range || !renderContext || containerWidth == null) {
        return null;
      }

      const rowBuffer = !disableVirtualization ? rootProps.rowBuffer : 0;
      const columnBuffer = !disableVirtualization ? rootProps.columnBuffer : 0;

      const firstRowToRender = Math.max(renderContext.firstRowIndex - rowBuffer, 0);
      const lastRowToRender = Math.min(
        renderContext.lastRowIndex! + rowBuffer,
        currentPage.rows.length,
      );

      const firstColumnToRender = Math.max(renderContext.firstColumnIndex - columnBuffer, 0);
      const lastColumnToRender = Math.min(
        renderContext.lastColumnIndex + columnBuffer,
        visibleColumns.length,
      );

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
            scrollBarState={scrollBarState} // TODO remove once useGridContainerProps is deleted
            renderedColumns={renderedColumns}
            visibleColumns={visibleColumns}
            firstColumnToRender={firstColumnToRender}
            lastColumnToRender={lastColumnToRender}
            selected={selectionLookup[id] !== undefined}
            index={currentPage.range.firstRowIndex + renderContext.firstRowIndex! + i}
            containerWidth={containerWidth}
            {...rootProps.componentsProps?.row}
          />,
        );
      }

      return rows;
    };

    const needsHorizontalScrollbar = containerWidth && columnsMeta.totalWidth > containerWidth;

    const contentSize = {
      width: needsHorizontalScrollbar ? columnsMeta.totalWidth : 'auto',
      // In cases where the columns exceed the available width,
      // the horizontal scrollbar should be shown even when there're no rows.
      // Keeping 1px as minimum height ensures that the scrollbar will visible if necessary.
      height: Math.max(currentPage.rows.length * rowHeight, 1),
    };

    if (rootProps.autoHeight && currentPage.rows.length === 0) {
      contentSize.height = 2 * rowHeight; // Give room to show the overlay when there no rows.
    }

    return (
      <VirtualScrollerRoot
        ref={handleRef}
        className={clsx(classes.root, className)}
        onScroll={handleScroll}
        {...other}
      >
        <VirtualScrollerContent className={classes.content} style={contentSize}>
          <VirtualScrollerRenderZone ref={renderZoneRef} className={classes.renderZone}>
            {getRows()}
          </VirtualScrollerRenderZone>
        </VirtualScrollerContent>
      </VirtualScrollerRoot>
    );
  },
);

export { GridVirtualScroller };
