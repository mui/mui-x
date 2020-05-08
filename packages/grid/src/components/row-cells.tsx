import {
  CellClassParams,
  CellValue,
  ColDef,
  CellParams,
  Columns,
  GridApi,
  RowModel,
  ValueFormatterParams,
  ValueGetterParams, CellClassRules,
} from '../models';
import React, { useContext } from 'react';
import { Cell } from './cell';
import { ApiContext } from './api-context';
import { classnames, isFunction } from '../utils';

function getCellParams(rowModel: RowModel, col: ColDef, rowIndex: number, value: CellValue, api: GridApi): CellParams {
  return {
    value,
    getValue: (field: string) => rowModel.data[field],
    data: rowModel.data,
    rowModel: rowModel,
    colDef: col,
    rowIndex,
    api,
  };
}

function applyCssClassRules(cellClassRules: CellClassRules, params: CellClassParams) {
  return Object.entries(cellClassRules).reduce((appliedCss, entry) => {
    const shouldApplyCss: boolean = entry[1](params);
    appliedCss += shouldApplyCss ? entry[0] : '';
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
}

export const RowCells: React.FC<RowCellsProps> = React.memo(props => {
  const { scrollSize, hasScroll, lastColIdx, firstColIdx, columns, row } = props;
  const api = useContext(ApiContext);

  const cells = columns.slice(firstColIdx, lastColIdx + 1).map((c, idx) => {
    const rowIndex = firstColIdx + idx;
    const isLastColumn = rowIndex === columns.length - 1;
    const removeScrollWidth = isLastColumn && hasScroll.y && hasScroll.x;
    const width = removeScrollWidth ? c.width! - scrollSize : c.width!;
    const removeLastBorderRight = isLastColumn && hasScroll.x && !hasScroll.y;
    const showRightBorder = !isLastColumn
      ? props.showCellRightBorder
      : !removeLastBorderRight && !props.extendRowFullWidth;

    let value = row.data[c.field!];
    if (c.valueGetter) {
      const params: ValueGetterParams = getCellParams(row, c, rowIndex, value, api!.current!);
      //Value getter override the original value
      value = c.valueGetter(params);
    }

    let formattedValueProp = {};
    if (c.valueFormatter) {
      const params: ValueFormatterParams = getCellParams(row, c, rowIndex, value, api!.current!);
      formattedValueProp = { formattedValue: c.valueFormatter(params) };
    }

    let cssClassProp = { cssClass: '' };
    if (c.cellClass) {
      if (!isFunction(c.cellClass)) {
        cssClassProp = { cssClass: classnames(c.cellClass) };
      } else {
        const params: CellClassParams = getCellParams(row, c, rowIndex, value, api!.current!);
        cssClassProp = { cssClass: c.cellClass(params) as string };
      }
    }

    if (c.cellClassRules) {
      const params: CellClassParams = getCellParams(row, c, rowIndex, value, api!.current!);
      const cssClass = applyCssClassRules(c.cellClassRules, params);
      cssClassProp = { cssClass: cssClassProp.cssClass + ' ' + cssClass };
    }

    let cellComponent: React.ReactElement | null = null;
    if (c.cellRenderer) {
      const params: CellParams = getCellParams(row, c, rowIndex, value, api!.current!);
      cellComponent = c.cellRenderer(params);
      cssClassProp = { cssClass: cssClassProp.cssClass + ' with-renderer' };
    }

    return (
      <Cell
        key={c.field}
        value={value}
        field={c.field}
        width={width}
        showRightBorder={showRightBorder}
        {...formattedValueProp}
        align={c.align}
        {...cssClassProp}
      >
        {cellComponent}
      </Cell>
    );
  });
  return <>{cells}</>;
});
RowCells.displayName = 'RowCells';
