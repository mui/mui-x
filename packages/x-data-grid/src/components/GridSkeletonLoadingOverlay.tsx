import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/system';
import useForkRef from '@mui/utils/useForkRef';
import composeClasses from '@mui/utils/composeClasses';
import { useGridApiContext } from '../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import {
  GridPinnedColumnPosition,
  gridColumnPositionsSelector,
  gridColumnsTotalWidthSelector,
  gridDimensionsSelector,
  gridVisibleColumnDefinitionsSelector,
  gridVisiblePinnedColumnDefinitionsSelector,
  useGridApiEventHandler,
  useGridSelector,
} from '../hooks';
import { GridEventListener } from '../models';
import { DataGridProcessedProps } from '../models/props/DataGridProps';
import { getDataGridUtilityClass, gridClasses } from '../constants/gridClasses';
import { getPinnedCellOffset } from '../internals/utils/getPinnedCellOffset';
import { shouldCellShowLeftBorder, shouldCellShowRightBorder } from '../utils/cellBorderUtils';
import { escapeOperandAttributeSelector } from '../utils/domUtils';
import { GridScrollbarFillerCell } from './GridScrollbarFillerCell';

const SkeletonOverlay = styled('div', {
  name: 'MuiDataGrid',
  slot: 'SkeletonLoadingOverlay',
  overridesResolver: (props, styles) => styles.skeletonLoadingOverlay,
})({
  minWidth: '100%',
  width: 'max-content', // prevents overflow: clip; cutting off the x axis
  height: '100%',
  overflow: 'clip', // y axis is hidden while the x axis is allowed to overflow
});

type OwnerState = { classes: DataGridProcessedProps['classes'] };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['skeletonLoadingOverlay'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const getColIndex = (el: HTMLElement) => parseInt(el.getAttribute('data-colindex')!, 10);

const GridSkeletonLoadingOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function GridSkeletonLoadingOverlay(props, forwardedRef) {
  const rootProps = useGridRootProps();
  const { slots } = rootProps;
  const classes = useUtilityClasses({ classes: rootProps.classes });
  const ref = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkRef(ref, forwardedRef);
  const apiRef = useGridApiContext();
  const dimensions = useGridSelector(apiRef, gridDimensionsSelector);
  const viewportHeight = dimensions?.viewportInnerSize.height ?? 0;
  const skeletonRowsCount = Math.ceil(viewportHeight / dimensions.rowHeight);
  const totalWidth = useGridSelector(apiRef, gridColumnsTotalWidthSelector);
  const positions = useGridSelector(apiRef, gridColumnPositionsSelector);
  const inViewportCount = React.useMemo(
    () => positions.filter((value) => value <= totalWidth).length,
    [totalWidth, positions],
  );
  const allVisibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);
  const columns = React.useMemo(
    () => allVisibleColumns.slice(0, inViewportCount),
    [allVisibleColumns, inViewportCount],
  );
  const pinnedColumns = useGridSelector(apiRef, gridVisiblePinnedColumnDefinitionsSelector);

  const getPinnedStyle = React.useCallback(
    (computedWidth: number, index: number, position: GridPinnedColumnPosition) => {
      const pinnedOffset = getPinnedCellOffset(
        position,
        computedWidth,
        index,
        positions,
        dimensions,
      );
      return { [position]: pinnedOffset } as const;
    },
    [dimensions, positions],
  );

  const getPinnedPosition = React.useCallback(
    (field: string) => {
      if (pinnedColumns.left.findIndex((col) => col.field === field) !== -1) {
        return GridPinnedColumnPosition.LEFT;
      }
      if (pinnedColumns.right.findIndex((col) => col.field === field) !== -1) {
        return GridPinnedColumnPosition.RIGHT;
      }
      return undefined;
    },
    [pinnedColumns.left, pinnedColumns.right],
  );

  const children = React.useMemo(() => {
    const array: React.ReactNode[] = [];

    for (let i = 0; i < skeletonRowsCount; i += 1) {
      const rowCells: React.ReactNode[] = [];

      for (let colIndex = 0; colIndex < columns.length; colIndex += 1) {
        const column = columns[colIndex];
        const pinnedPosition = getPinnedPosition(column.field);
        const isPinnedLeft = pinnedPosition === GridPinnedColumnPosition.LEFT;
        const isPinnedRight = pinnedPosition === GridPinnedColumnPosition.RIGHT;
        const sectionLength = pinnedPosition
          ? pinnedColumns[pinnedPosition].length // pinned section
          : columns.length - pinnedColumns.left.length - pinnedColumns.right.length; // middle section
        const sectionIndex = pinnedPosition
          ? pinnedColumns[pinnedPosition].findIndex((col) => col.field === column.field) // pinned section
          : colIndex - pinnedColumns.left.length; // middle section
        const pinnedStyle =
          pinnedPosition && getPinnedStyle(column.computedWidth, colIndex, pinnedPosition);
        const gridHasFiller = dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;
        const showRightBorder = shouldCellShowRightBorder(
          pinnedPosition,
          sectionIndex,
          sectionLength,
          rootProps.showCellVerticalBorder,
          gridHasFiller,
        );
        const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, sectionIndex);
        const isLastColumn = colIndex === columns.length - 1;
        const isFirstPinnedRight = isPinnedRight && sectionIndex === 0;
        const hasFillerBefore = isFirstPinnedRight && gridHasFiller;
        const hasFillerAfter = isLastColumn && !isFirstPinnedRight && gridHasFiller;
        const expandedWidth = dimensions.viewportOuterSize.width - dimensions.columnsTotalWidth;
        const emptyCellWidth = Math.max(0, expandedWidth);
        const emptyCell = (
          <slots.skeletonCell key={`skeleton-filler-column-${i}`} width={emptyCellWidth} empty />
        );
        const scrollbarWidth = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
        const hasScrollbarFiller = isLastColumn && scrollbarWidth !== 0;

        if (hasFillerBefore) {
          rowCells.push(emptyCell);
        }

        rowCells.push(
          <slots.skeletonCell
            key={`skeleton-column-${i}-${column.field}`}
            field={column.field}
            type={column.type}
            align={column.align}
            width="var(--width)"
            height={dimensions.rowHeight}
            data-colindex={colIndex}
            className={clsx(
              isPinnedLeft && gridClasses['cell--pinnedLeft'],
              isPinnedRight && gridClasses['cell--pinnedRight'],
              showRightBorder && gridClasses['cell--withRightBorder'],
              showLeftBorder && gridClasses['cell--withLeftBorder'],
            )}
            style={
              { '--width': `${column.computedWidth}px`, ...pinnedStyle } as React.CSSProperties
            }
          />,
        );

        if (hasFillerAfter) {
          rowCells.push(emptyCell);
        }

        if (hasScrollbarFiller) {
          rowCells.push(
            <GridScrollbarFillerCell
              key={`skeleton-scrollbar-filler-${i}`}
              pinnedRight={pinnedColumns.right.length > 0}
            />,
          );
        }
      }

      array.push(
        <div
          key={`skeleton-row-${i}`}
          className={clsx(
            gridClasses.row,
            gridClasses.rowSkeleton,
            i === 0 && gridClasses['row--firstVisible'],
          )}
        >
          {rowCells}
        </div>,
      );
    }
    return array;
  }, [
    slots,
    columns,
    pinnedColumns,
    skeletonRowsCount,
    rootProps.showCellVerticalBorder,
    dimensions.columnsTotalWidth,
    dimensions.viewportOuterSize.width,
    dimensions.rowHeight,
    dimensions.hasScrollY,
    dimensions.scrollbarSize,
    getPinnedPosition,
    getPinnedStyle,
  ]);

  // Sync the column resize of the overlay columns with the grid
  const handleColumnResize: GridEventListener<'columnResize'> = (params) => {
    const { colDef, width } = params;
    const cells = ref.current?.querySelectorAll<HTMLElement>(
      `[data-field="${escapeOperandAttributeSelector(colDef.field)}"]`,
    );

    if (!cells) {
      throw new Error('MUI X: Expected skeleton cells to be defined with `data-field` attribute.');
    }

    const resizedColIndex = columns.findIndex((col) => col.field === colDef.field);
    const pinnedPosition = getPinnedPosition(colDef.field);
    const isPinnedLeft = pinnedPosition === GridPinnedColumnPosition.LEFT;
    const isPinnedRight = pinnedPosition === GridPinnedColumnPosition.RIGHT;
    const currentWidth = getComputedStyle(cells[0]).getPropertyValue('--width');
    const delta = parseInt(currentWidth, 10) - width;

    if (cells) {
      cells.forEach((element) => {
        element.style.setProperty('--width', `${width}px`);
      });
    }

    if (isPinnedLeft) {
      const pinnedCells = ref.current?.querySelectorAll<HTMLElement>(
        `.${gridClasses['cell--pinnedLeft']}`,
      );
      pinnedCells?.forEach((element) => {
        const colIndex = getColIndex(element);
        if (colIndex > resizedColIndex) {
          element.style.left = `${parseInt(getComputedStyle(element).left, 10) - delta}px`;
        }
      });
    }

    if (isPinnedRight) {
      const pinnedCells = ref.current?.querySelectorAll<HTMLElement>(
        `.${gridClasses['cell--pinnedRight']}`,
      );
      pinnedCells?.forEach((element) => {
        const colIndex = getColIndex(element);
        if (colIndex < resizedColIndex) {
          element.style.right = `${parseInt(getComputedStyle(element).right, 10) + delta}px`;
        }
      });
    }
  };

  useGridApiEventHandler(apiRef, 'columnResize', handleColumnResize);

  return (
    <SkeletonOverlay className={classes.root} ref={handleRef} {...props}>
      {children}
    </SkeletonOverlay>
  );
});

export { GridSkeletonLoadingOverlay };
