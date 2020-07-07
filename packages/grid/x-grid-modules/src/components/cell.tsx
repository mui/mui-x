import * as React from 'react';
import { Alignement, CellValue } from '../models';
import { CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';

export interface GridCellProps {
  field?: string;
  value?: CellValue;
  formattedValue?: CellValue;
  width: number;
  showRightBorder?: boolean;
  align?: Alignement;
  cssClass?: string;
  tabIndex?: number;
  colIndex?: number;
  rowIndex?: number;
}

export const Cell: React.FC<GridCellProps> = React.memo(
  ({
    value,
    field,
    width,
    children,
    showRightBorder,
    align,
    formattedValue,
    cssClass,
    tabIndex,
    colIndex,
    rowIndex,
  }) => {
    const cssClasses = classnames(
      CELL_CSS_CLASS,
      cssClass,
      { 'with-border': showRightBorder },
      align !== 'left' ? align : '',
    );
    const valueToRender = formattedValue || value;

    return (
      <div
        className={cssClasses}
        role={'cell'}
        data-value={value}
        data-field={field}
        data-colindex={colIndex}
        data-rowindex={rowIndex}
        aria-colindex={colIndex}
        style={{ minWidth: width, maxWidth: width }}
        tabIndex={tabIndex}
      >
        {children ? children : valueToRender?.toString()}
      </div>
    );
  },
);

Cell.displayName = 'GridCell';

export const LeftEmptyCell: React.FC<{ width?: number }> = React.memo(({ width }) =>
  !width ? null : <Cell key={'empty-col-left'} width={width} />,
);
LeftEmptyCell.displayName = 'LeftEmptyCell';

export const RightEmptyCell: React.FC<{ width?: number }> = React.memo(({ width }) =>
  !width ? null : <Cell key={'empty-col-right'} width={width} />,
);
RightEmptyCell.displayName = 'RightEmptyCell';
