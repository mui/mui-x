import * as React from 'react';
import { GridColumns } from '../../models/index';
import { GridApiContext } from '../GridApiContext';
import { gridDensityRowHeightSelector } from '../../hooks/features/density/densitySelector';
import { useGridSelector } from '../../hooks/features/core/useGridSelector';
import { GridSkeletonCell } from './GridSkeletonCell';

interface SkeletonRowCellsProps {
  columns: GridColumns;
  extendRowFullWidth: boolean;
  firstColIdx: number;
  hasScrollX: boolean;
  hasScrollY: boolean;
  lastColIdx: number;
  rowIndex: number;
  showCellRightBorder: boolean;
}

export const GridSkeletonRowCells = React.memo((props: SkeletonRowCellsProps) => {
  const {
    columns,
    firstColIdx,
    hasScrollX,
    hasScrollY,
    lastColIdx,
    rowIndex,
    showCellRightBorder,
  } = props;
  const apiRef = React.useContext(GridApiContext);
  const rowHeight = useGridSelector(apiRef, gridDensityRowHeightSelector);

  const skeletonCellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const colIndex = firstColIdx + colIdx;
    const isLastColumn = colIndex === columns.length - 1;
    const removeLastBorderRight = isLastColumn && hasScrollX && !hasScrollY;
    const showRightBorder = !isLastColumn
      ? showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    const skeletonCellProps = {
      field: column.field,
      width: column.width!,
      height: rowHeight,
      showRightBorder,
      rowIndex,
      colIndex,
    };

    return skeletonCellProps;
  });

  return (
    <React.Fragment>
      {skeletonCellsProps.map((skeletonCellProps) => (
        <GridSkeletonCell key={skeletonCellProps.field} {...skeletonCellProps} />
      ))}
    </React.Fragment>
  );
});
GridSkeletonRowCells.displayName = 'GridSkeletonRowCells';
