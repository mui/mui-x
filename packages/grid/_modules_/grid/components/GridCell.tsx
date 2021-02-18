import * as React from 'react';
import { capitalize } from '@material-ui/core/utils';
import { GridAlignment, GridCellValue } from '../models';
import { GRID_CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';

export interface GridCellProps {
  field?: string;
  value?: GridCellValue;
  formattedValue?: GridCellValue;
  width: number;
  height: number;
  showRightBorder?: boolean;
  hasFocus?: boolean;
  align: GridAlignment;
  cssClass?: string;
  tabIndex?: number;
  colIndex?: number;
  rowIndex?: number;
}

export const GridCell: React.FC<GridCellProps> = React.memo((props) => {
  const {
    align,
    children,
    colIndex,
    cssClass,
    hasFocus,
    field,
    formattedValue,
    rowIndex,
    showRightBorder,
    tabIndex,
    value,
    width,
    height,
  } = props;

  const valueToRender = formattedValue || value;
  const cellRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hasFocus && cellRef.current) {
      cellRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <div
      ref={cellRef}
      className={classnames(GRID_CELL_CSS_CLASS, cssClass, `MuiDataGrid-cell${capitalize(align)}`, {
        'MuiDataGrid-withBorder': showRightBorder,
      })}
      role="cell"
      data-value={value}
      data-field={field}
      data-rowindex={rowIndex}
      aria-colindex={colIndex}
      style={{
        minWidth: width,
        maxWidth: width,
        lineHeight: `${height - 1}px`,
        minHeight: height,
        maxHeight: height,
      }}
      tabIndex={tabIndex}
    >
      {children || valueToRender?.toString()}
    </div>
  );
});

GridCell.displayName = 'GridCell';

interface EmptyCellProps {
  width?: number;
  height?: number;
}

export const GridLeftEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <GridCell width={width} height={height} align="left" />,
);
GridLeftEmptyCell.displayName = 'GridLeftEmptyCell';

export const GridRightEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <GridCell width={width} height={height} align="left" />,
);
GridRightEmptyCell.displayName = 'GridRightEmptyCell';
