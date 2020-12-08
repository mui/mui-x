import * as React from 'react';
import { Alignement, CellValue } from '../models';
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
      className={classnames(
        CELL_CSS_CLASS,
        cssClass,
        { 'MuiDataGrid-withBorder': showRightBorder },
        align && align !== 'left' ? alignPropToCssClass[align] : '',
      )}
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

export const LeftEmptyCell: React.FC<{
  width?: number;
  height?: number;
}> = React.memo(({ width, height }) =>
  !width || !height ? null : <Cell width={width} height={height} />,
);
LeftEmptyCell.displayName = 'LeftEmptyCell';

export const RightEmptyCell: React.FC<{
  width?: number;
  height?: number;
}> = React.memo(({ width, height }) =>
  !width || !height ? null : <Cell width={width} height={height} />,
);
RightEmptyCell.displayName = 'RightEmptyCell';
