import * as React from 'react';
import clsx from 'clsx';
import { GRID_SKELETON_CELL_CSS_CLASS } from '../../constants/cssClassesConstants';

export interface GridSkeletonCellProps {
  colIndex: number;
  height: number;
  rowIndex: number;
  showRightBorder?: boolean;
  width: number;
}

export const GridSkeletonCell = React.memo((props: GridSkeletonCellProps) => {
  const { colIndex, height, rowIndex, showRightBorder, width } = props;

  const cellRef = React.useRef<HTMLDivElement>(null);
  const cssClasses = clsx(GRID_SKELETON_CELL_CSS_CLASS, {
    'MuiDataGrid-withBorder': showRightBorder,
  });

  const style = {
    minWidth: width,
    maxWidth: width,
    lineHeight: `${height - 1}px`,
    minHeight: height,
    maxHeight: height,
  };

  return (
    <div
      ref={cellRef}
      className={cssClasses}
      role="cell"
      data-rowindex={rowIndex}
      aria-colindex={colIndex}
      style={style}
      tabIndex={-1}
    />
  );
});

GridSkeletonCell.displayName = 'GridSkeletonCell';
