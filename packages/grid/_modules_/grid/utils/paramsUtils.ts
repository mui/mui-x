import { CellValue } from '../models/cell';
import { RowModel } from '../models/rows';
import { ColDef } from '../models/colDef/colDef';
import { GridApi } from '../models/api/gridApi';
import { CellParams } from '../models/params/cellParams';
import { RowParams } from '../models/params/rowParams';

export function buildCellParams({
  element,
  value,
  rowIndex,
  rowModel,
  colDef,
  api,
}: {
  rowModel: RowModel;
  colDef: ColDef;
  rowIndex?: number;
  value: CellValue;
  api: GridApi;
  element?: HTMLElement;
}): CellParams {
  return {
    element,
    value,
    field: colDef?.field,
    getValue: (field: string) => {
      const col = api.getColumnFromField(field);
      if (!col.valueGetter) {
        return rowModel.data[field];
      }
      return col.valueGetter(
        buildCellParams({
          value: rowModel.data[field],
          colDef: col,
          rowIndex,
          element,
          rowModel,
          api,
        }),
      );
    },
    data: rowModel.data,
    rowModel,
    colDef,
    rowIndex,
    api,
  };
}

export function buildRowParams({
  element,
  rowIndex,
  rowModel,
  api,
}: {
  rowModel: RowModel;
  colDef: ColDef;
  rowIndex: number;
  api: GridApi;
  element?: HTMLElement;
}): RowParams {
  return {
    element,
    columns: api.getAllColumns(),
    getValue: (field: string) => rowModel.data[field],
    data: rowModel.data,
    rowModel,
    rowIndex,
    api,
  };
}
