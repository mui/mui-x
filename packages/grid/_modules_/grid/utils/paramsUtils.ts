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
      // We are getting the value of another column here, field
      const col = api.getColumnFromField(field);
      if (!col.valueGetter) {
        return rowModel[field];
      }
      return col.valueGetter(
        buildCellParams({
          value: rowModel[field],
          colDef: col,
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
