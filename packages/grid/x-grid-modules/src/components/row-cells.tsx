import * as React from 'react';
import { CellClassParams, Columns, RowModel, CellClassRules, CellParams } from '../models';
import { Cell, GridCellProps } from './cell';
import { ApiContext } from './api-context';
import { classnames, isFunction } from '../utils';
import { buildCellParams } from '../utils/paramsUtils';

function applyCssClassRules(cellClassRules: CellClassRules, params: CellClassParams) {
  return Object.entries(cellClassRules).reduce((appliedCss, entry) => {
    const shouldApplyCss: boolean = isFunction(entry[1]) ? entry[1](params) : entry[1];
    appliedCss += shouldApplyCss ? `${entry[0]} ` : '';
    return appliedCss;
  }, '');
}

interface RowCellsProps {
  columns: Columns;
  domIndex: number;
  extendRowFullWidth: boolean;
  firstColIdx: number;
  hasScroll: { y: boolean; x: boolean };
  lastColIdx: number;
  row: RowModel;
  rowIndex: number;
  scrollSize: number;
  showCellRightBorder: boolean;
}

export const RowCells: React.FC<RowCellsProps> = React.memo((props) => {
  const {
    columns,
    domIndex,
    firstColIdx,
    hasScroll,
    lastColIdx,
    row,
    rowIndex,
    scrollSize,
  } = props;
  const api = React.useContext(ApiContext);

  const cellsProps = columns.slice(firstColIdx, lastColIdx + 1).map((column, colIdx) => {
    const isLastColumn = firstColIdx + colIdx === columns.length - 1;
    const removeScrollWidth = isLastColumn && hasScroll.y && hasScroll.x;
    const width = removeScrollWidth ? column.width! - scrollSize : column.width!;
    const removeLastBorderRight = isLastColumn && hasScroll.x && !hasScroll.y;
    const showRightBorder = !isLastColumn
      ? props.showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    let value = row.data[column.field!];
    const cellParams: CellParams = buildCellParams({
      rowModel: row,
      colDef: column,
      rowIndex,
      value,
      api: api!.current!,
    });

    if (column.valueGetter) {
      // Value getter override the original value
      value = column.valueGetter(cellParams);
      cellParams.value = value;
    }

    let formattedValueProp = {};
    if (column.valueFormatter) {
      formattedValueProp = { formattedValue: column.valueFormatter(cellParams) };
    }

    let cssClassProp = { cssClass: '' };
    if (column.cellClassName) {
      if (!isFunction(column.cellClassName)) {
        cssClassProp = { cssClass: classnames(column.cellClassName) };
      } else {
        cssClassProp = { cssClass: column.cellClassName(cellParams) as string };
      }
    }

    if (column.cellClassRules) {
      const cssClass = applyCssClassRules(column.cellClassRules, cellParams);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} ${cssClass}` };
    }

    let cellComponent: React.ReactElement | null = null;
    if (column.renderCell) {
      cellComponent = column.renderCell(cellParams);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} MuiDataGrid-cellWithRenderer` };
    }

    const cellProps: GridCellProps & { children: any } = {
      value,
      field: column.field,
      width,
      showRightBorder,
      ...formattedValueProp,
      align: column.align,
      ...cssClassProp,
      tabIndex: domIndex === 0 && colIdx === 0 ? 0 : -1,
      rowIndex,
      colIndex: colIdx + firstColIdx,
      children: cellComponent,
    };

    return cellProps;
  });

  return (
    <React.Fragment>
      {cellsProps.map((cellProps) => (
        <Cell key={cellProps.field} {...cellProps} />
      ))}
    </React.Fragment>
  );
});
RowCells.displayName = 'RowCells';
