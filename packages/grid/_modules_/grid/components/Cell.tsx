import * as React from 'react';
import { capitalize } from '@material-ui/core/utils';
import { Alignment, CellValue } from '../models';
import { CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';

export interface GridCellProps {
  field?: string;
  value?: CellValue;
  formattedValue?: CellValue;
  width: number;
  height: number;
  showRightBorder?: boolean;
  hasFocus?: boolean;
  align: Alignment;
  cssClass?: string;
  tabIndex?: number;
  colIndex?: number;
  rowIndex?: number;
}

export const Cell: React.FC<GridCellProps> = React.memo((props) => {
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
      className={classnames(CELL_CSS_CLASS, cssClass, `MuiDataGrid-cell${capitalize(align)}`, {
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

Cell.displayName = 'GridCell';

interface EmptyCellProps {
  width?: number;
  height?: number;
}

export const LeftEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <Cell width={width} height={height} align="left" />,
);
LeftEmptyCell.displayName = 'LeftEmptyCell';

export const RightEmptyCell: React.FC<EmptyCellProps> = React.memo(({ width, height }) =>
  !width || !height ? null : <Cell width={width} height={height} align="left" />,
);
RightEmptyCell.displayName = 'RightEmptyCell';
