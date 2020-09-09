import * as React from 'react';
import { Alignement, CellValue } from '../models';
import { CELL_CSS_CLASS } from '../constants/cssClassesConstants';
import { classnames } from '../utils';
import { OptionsContext } from './options-context';

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

const alignPropToCssClass = {
  center: 'MuiDataGrid-cellCenter',
  right: 'MuiDataGrid-cellRight',
};

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
      { 'MuiDataGrid-withBorder': showRightBorder },
      align && align !== 'left' ? alignPropToCssClass[align] : '',
    );
    const valueToRender = formattedValue || value;
    const { rowHeight } = React.useContext(OptionsContext);

    return (
      <div
        className={cssClasses}
        role="cell"
        data-value={value}
        data-field={field}
        data-colindex={colIndex}
        data-rowindex={rowIndex}
        aria-colindex={colIndex}
        style={{
          minWidth: width,
          maxWidth: width,
          lineHeight: `${rowHeight - 1}px`,
          minHeight: rowHeight,
          maxHeight: rowHeight,
        }}
        tabIndex={tabIndex}
      >
        {children || valueToRender?.toString()}
      </div>
    );
  },
);

Cell.displayName = 'GridCell';

export const LeftEmptyCell: React.FC<{ width?: number }> = React.memo(({ width }) =>
  !width ? null : <Cell key="empty-col-left" width={width} />,
);
LeftEmptyCell.displayName = 'LeftEmptyCell';

export const RightEmptyCell: React.FC<{ width?: number }> = React.memo(({ width }) =>
  !width ? null : <Cell key="empty-col-right" width={width} />,
);
RightEmptyCell.displayName = 'RightEmptyCell';
