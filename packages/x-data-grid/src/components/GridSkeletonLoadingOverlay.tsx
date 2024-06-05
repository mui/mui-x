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

const colWidthVar = (index: number) => `--colWidth-${index}`;

const SkeletonOverlay = styled('div', {
  name: 'MuiDataGrid',
  slot: 'SkeletonLoadingOverlay',
  overridesResolver: (props, styles) => styles.skeletonLoadingOverlay,
})({
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
  const columns = allVisibleColumns.slice(0, inViewportCount);
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
        const sectionLength = pinnedPosition ? pinnedColumns[pinnedPosition].length : 0;
        const sectionIndex = pinnedPosition
          ? pinnedColumns[pinnedPosition].findIndex((col) => col.field === column.field)
          : -1;
        const gridHasFiller = dimensions.columnsTotalWidth < dimensions.viewportOuterSize.width;
        const showRightBorder = shouldCellShowRightBorder(
          pinnedPosition,
          sectionIndex,
          sectionLength,
          rootProps.showCellVerticalBorder,
          gridHasFiller,
        );
        const showLeftBorder = shouldCellShowLeftBorder(pinnedPosition, sectionIndex);
        const style =
          pinnedPosition && getPinnedStyle(column.computedWidth, colIndex, pinnedPosition);

        const isFirstPinnedRight = isPinnedRight && sectionIndex === 0;

        if (isFirstPinnedRight) {
          const expandedWidth = dimensions.viewportOuterSize.width - dimensions.columnsTotalWidth;
          const emptyCellWidth = Math.max(0, expandedWidth);
          rowCells.push(
            <slots.skeletonCell key={`skeleton-filler-column-${i}`} width={emptyCellWidth} empty />,
          );
        }

        rowCells.push(
          <slots.skeletonCell
            key={`skeleton-column-${i}-${column.field}`}
            type={column.type}
            align={column.align}
            width={`var(${colWidthVar(colIndex)})`}
            height={dimensions.rowHeight}
            className={clsx(
              isPinnedLeft && gridClasses['cell--pinnedLeft'],
              isPinnedRight && gridClasses['cell--pinnedRight'],
              showRightBorder && gridClasses['cell--withRightBorder'],
              showLeftBorder && gridClasses['cell--withLeftBorder'],
            )}
            style={style}
          />,
        );
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
    getPinnedPosition,
    getPinnedStyle,
  ]);

  const initialColWidthVariables = columns.reduce<Record<string, string>>(
    (initialSize, column, i) => {
      const varName = colWidthVar(i);
      initialSize[varName] = `${column.computedWidth}px`;
      return initialSize;
    },
    {},
  );

  // Sync the column resize of the overlay columns with the grid
  const handleColumnResize: GridEventListener<'columnResize'> = (params) => {
    const columnIndex = columns.findIndex((column) => column.field === params.colDef.field);
    ref.current?.style.setProperty(colWidthVar(columnIndex), `${params.width}px`);
  };
  useGridApiEventHandler(apiRef, 'columnResize', handleColumnResize);

  return (
    <SkeletonOverlay
      className={classes.root}
      ref={handleRef}
      {...props}
      style={{
        ...initialColWidthVariables,
        ...props.style,
      }}
    >
      {children}
    </SkeletonOverlay>
  );
});

export { GridSkeletonLoadingOverlay };
