import { CellValue } from '../models/cell';
import { RowModel } from '../models/rows';
import { ColDef } from '../models/colDef/colDef';
import { GridApi } from '../models/api/gridApi';
import { CellParams } from '../models/params/cellParams';
import { RowParams } from '../models/params/rowParams';

let warnedOnce = false;

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

      if (process.env.NODE_ENV !== 'production') {
        if (!col && !warnedOnce) {
          console.warn(
            [
              `Material-UI: You are calling getValue('${field}') but the column \`${field}\` is not defined.`,
              `Instead, you can access the data from \`params.row.${field}\`.`,
            ].join('\n'),
          );
          warnedOnce = true;
        }
      }

      if (!col || !col.valueGetter) {
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
