import * as React from 'react';
import {
  CellClassParams,
  CellValue,
  ColDef,
  CellParams,
  Columns,
  GridApi,
  RowModel,
  ValueFormatterParams,
  ValueGetterParams,
  CellClassRules,
} from '../models';
import { Cell, GridCellProps } from './cell';
import { ApiContext } from './api-context';
import { classnames, isFunction } from '../utils';

function getCellParams(
  rowModel: RowModel,
  col: ColDef,
  rowIndex: number,
  value: CellValue,
  api: GridApi,
): CellParams {
  return {
    value,
    getValue: (field: string) => rowModel.data[field],
    data: rowModel.data,
    rowModel,
    colDef: col,
    rowIndex,
    api,
  };
}

function applyCssClassRules(cellClassRules: CellClassRules, params: CellClassParams) {
  return Object.entries(cellClassRules).reduce((appliedCss, entry) => {
    const shouldApplyCss: boolean = entry[1](params);
    appliedCss += shouldApplyCss ? `${entry[0]} ` : '';
    return appliedCss;
  }, '');
}

interface RowCellsProps {
  firstColIdx: number;
  lastColIdx: number;
  hasScroll: { y: boolean; x: boolean };
  scrollSize: number;
  columns: Columns;
  row: RowModel;
  showCellRightBorder: boolean;
  extendRowFullWidth: boolean;
  rowIndex: number;
  domIndex: number;
}

export const RowCells: React.FC<RowCellsProps> = React.memo(props => {
  const {
    scrollSize,
    hasScroll,
    lastColIdx,
    firstColIdx,
    columns,
    row,
    rowIndex,
    domIndex,
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
    if (column.valueGetter) {
      const params: ValueGetterParams = getCellParams(row, column, rowIndex, value, api!.current!);
      // Value getter override the original value
      value = column.valueGetter(params);
    }

    let formattedValueProp = {};
    if (column.valueFormatter) {
      const params: ValueFormatterParams = getCellParams(
        row,
        column,
        rowIndex,
        value,
        api!.current!,
      );
      formattedValueProp = { formattedValue: column.valueFormatter(params) };
    }

    let cssClassProp = { cssClass: '' };
    if (column.cellClass) {
      if (!isFunction(column.cellClass)) {
        cssClassProp = { cssClass: classnames(column.cellClass) };
      } else {
        const params: CellClassParams = getCellParams(row, column, rowIndex, value, api!.current!);
        cssClassProp = { cssClass: column.cellClass(params) as string };
      }
    }

    if (column.cellClassRules) {
      const params: CellClassParams = getCellParams(row, column, rowIndex, value, api!.current!);
      const cssClass = applyCssClassRules(column.cellClassRules, params);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} ${cssClass}` };
    }

    let cellComponent: React.ReactElement | null = null;
    if (column.cellRenderer) {
      const params: CellParams = getCellParams(row, column, rowIndex, value, api!.current!);
      cellComponent = column.cellRenderer(params);
      cssClassProp = { cssClass: `${cssClassProp.cssClass} with-renderer` };
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
      {cellsProps.map(cellProps => (
        <Cell key={cellProps.field} {...cellProps} />
      ))}
    </React.Fragment>
  );
});
RowCells.displayName = 'RowCells';
