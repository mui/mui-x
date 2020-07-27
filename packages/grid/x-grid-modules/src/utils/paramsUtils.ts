import { RowModel, CellValue } from '../models/rows';
import { ColDef } from '../models/colDef/colDef';
import { GridApi } from '../models/api/gridApi';
import { CellParams, RowParams } from '../models/params/cellParams';

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
  rowIndex: number;
  value: CellValue;
  api: GridApi;
  element?: HTMLElement;
}): CellParams {
  return {
    element,
    value,
    field: colDef.field,
    getValue: (field: string) => rowModel.data[field],
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
  colDef,
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
    field: colDef.field,
    getValue: (field: string) => rowModel.data[field],
    data: rowModel.data,
    rowModel,
    colDef,
    rowIndex,
    api,
  };
}
