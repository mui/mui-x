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
      if (!colDef.valueGetter) {
        return rowModel[field];
      }
      return colDef.valueGetter(
        buildCellParams({
          value: rowModel[field],
          colDef,
          rowIndex,
          element,
          rowModel,
          api,
        }),
      );
    },
    row: rowModel,
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
    getValue: (field: string) => rowModel[field],
    row: rowModel,
    rowIndex,
    api,
  };
}
